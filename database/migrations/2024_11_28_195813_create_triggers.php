<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        /*NOTIFICAÇÕES USER*/
        // Trigger para notificações de plantas que precisam de cuidados
        DB::unprepared('
CREATE TRIGGER after_kit_readings_insert
AFTER INSERT ON kit_readings
FOR EACH ROW
BEGIN
    DECLARE buffer_temp FLOAT;
    DECLARE buffer_humidity FLOAT;
    DECLARE buffer_light FLOAT;
    DECLARE plant_name TEXT;
    DECLARE user_id INT;

    -- Recuperar todos os valores necessários numa única consulta
    SELECT
        p.ideal_temperature - (p.ideal_temperature * p.buffer_percentage / 100) AS buffer_temp,
        p.ideal_humidity - (p.ideal_humidity * p.buffer_percentage / 100) AS buffer_humidity,
        p.ideal_light - (p.ideal_light * p.buffer_percentage / 100) AS buffer_light,
        p.name AS plant_name,
        up.users_id
    INTO
        buffer_temp, buffer_humidity, buffer_light, plant_name, user_id
    FROM
        plants p
    JOIN
        users_plants up ON up.plants_id = p.id
    JOIN
        plants_kits pk ON pk.user_plant_id = up.id
    WHERE
        pk.kits_id = NEW.kits_id
    LIMIT 1;

    -- Verifica se as condições estão fora dos limites aceitáveis e insere notificações
    IF NEW.temperatura < buffer_temp THEN
        INSERT INTO notifications (message, type, users_id, created_at, updated_at)
        VALUES (
            CONCAT("The plant ", plant_name, " associated with kit ", NEW.kits_id, " needs attention due to low temperature."),
            "plant_care",
            user_id,
            NOW(),
            NOW()
        );
    END IF;

    IF NEW.humidade < buffer_humidity THEN
        INSERT INTO notifications (message, type, users_id, created_at, updated_at)
        VALUES (
            CONCAT("The plant ", plant_name, " associated with kit ", NEW.kits_id, " needs attention due to low humidity."),
            "plant_care",
            user_id,
            NOW(),
            NOW()
        );
    END IF;

    IF NEW.luz < buffer_light THEN
        INSERT INTO notifications (message, type, users_id, created_at, updated_at)
        VALUES (
            CONCAT("The plant ", plant_name, " associated with kit ", NEW.kits_id, " needs attention due to insufficient light."),
            "plant_care",
            user_id,
            NOW(),
            NOW()
        );
    END IF;
END;

    ');

        // Trigger para notificações de novos posts no blog
        DB::unprepared('
            CREATE TRIGGER after_blog_post_insert
            AFTER INSERT ON blog_posts
            FOR EACH ROW
            BEGIN
                INSERT INTO notifications (message, type, users_id, created_at, updated_at)
                SELECT
                    CONCAT("New post: ", NEW.title) AS message,
                    "new_blog_post" AS type,
                    id AS users_id,
                    NOW() AS created_at,
                    NOW() AS updated_at
                FROM users
                WHERE newsletter = true;
            END;
        ');

        /*NOTIFICAÇÕES ADMIN*/
        // Trigger para notificações de stock baixo
        DB::unprepared('
         CREATE TRIGGER after_stock_update
         AFTER UPDATE ON stock_products
         FOR EACH ROW
         BEGIN
             IF NEW.stock < NEW.threshold THEN
                 INSERT INTO notifications (message, type, admin, created_at, updated_at)
                 VALUES (
                     CONCAT("The product ", NEW.name, " is low on stock (", NEW.stock, " units remaining)."),
                     "low_stock",
                     true,
                     NOW(),
                     NOW()
                 );
             END IF;
         END;
     ');

        // Trigger para notificações de novos tickets de suporte
        DB::unprepared('
         CREATE TRIGGER after_ticket_insert
         AFTER INSERT ON support_tickets
         FOR EACH ROW
         BEGIN
             INSERT INTO notifications (message, type, admin, created_at, updated_at)
             VALUES (
                 CONCAT("New support ticket created with the subject: ", NEW.subject, "."),
                 "new_ticket",
                 true,
                 NOW(),
                 NOW()
             );
         END;
     ');

        DB::unprepared('
        CREATE TRIGGER after_order_items_insert
        AFTER INSERT ON order_items
        FOR EACH ROW
        BEGIN
            DECLARE current_stock INT;

            -- Obter a quantidade atual do produto no stock
            SELECT stock
            INTO current_stock
            FROM stock_products
            WHERE id = NEW.stock_products_id;

            -- Verificar se o stock é suficiente antes de descontar
            IF current_stock >= NEW.quantity THEN
                -- Atualizar o stock subtraindo a quantidade do pedido
                UPDATE stock_products
                SET stock = stock - NEW.quantity
                WHERE id = NEW.stock_products_id;
            ELSE
                -- Lançar um erro caso o stock seja insuficiente
                SIGNAL SQLSTATE "45000"
                SET MESSAGE_TEXT = "Insufficient stock for the product.";
            END IF;
        END;
        ');


        DB::unprepared('
CREATE TRIGGER detect_watering
AFTER INSERT ON kit_readings
FOR EACH ROW
BEGIN
    DECLARE previous_humidity FLOAT;

    -- Obter o valor da leitura anterior
    SELECT humidade INTO previous_humidity
    FROM kit_readings
    WHERE kits_id = NEW.kits_id
    ORDER BY created_at DESC
    LIMIT 1 OFFSET 1;

    -- Verificar diferença significativa (exemplo: 50% maior)
    IF previous_humidity IS NOT NULL AND NEW.humidade > previous_humidity * 1.5 THEN
        INSERT INTO watering_history (users_plants_id, watering_type, created_at)
        VALUES (
            (SELECT user_plant_id FROM plants_kits WHERE kits_id = NEW.kits_id),
            "automatic",
            NOW()
        );
    END IF;
END;
');


        DB::unprepared('
    CREATE TRIGGER after_order_insert
    AFTER INSERT ON order_items
    FOR EACH ROW
    BEGIN
        -- Verificar se o produto é um kit
        IF (SELECT isKit FROM stock_products WHERE id = NEW.stock_products_id) = TRUE THEN
            SET @quantity_counter = NEW.quantity;

            WHILE @quantity_counter > 0 DO
                -- Gerar um código único
                SET @unique_code = NULL;
                REPEAT
                    SET @unique_code = LPAD(FLOOR(RAND() * 1000000), 6, "0");
                UNTIL NOT EXISTS (
                    SELECT 1 FROM kits WHERE codigo = @unique_code
                ) END REPEAT;

                -- Inserir um novo kit com o código gerado
                INSERT INTO kits (codigo, created_at, updated_at)
                VALUES (@unique_code, NOW(), NOW());

                -- Decrementar o contador
                SET @quantity_counter = @quantity_counter - 1;
            END WHILE;
        END IF;
    END;
');



    }


    public function down()
    {
        // Remove os triggers
        DB::unprepared('DROP TRIGGER IF EXISTS after_order_insert;');
        DB::unprepared('DROP TRIGGER IF EXISTS after_order_items_insert;');
        DB::unprepared('DROP TRIGGER IF EXISTS after_kit_readings_insert;');
        DB::unprepared('DROP TRIGGER IF EXISTS after_blog_post_insert;');
        DB::unprepared('DROP TRIGGER IF EXISTS after_stock_update;');
        DB::unprepared('DROP TRIGGER IF EXISTS after_ticket_insert;');
        DB::unprepared('DROP TRIGGER IF EXISTS detect_watering;');
    }
};
