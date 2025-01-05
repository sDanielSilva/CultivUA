<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Checkout\Session as StripeCheckoutSession;

use Illuminate\Support\Facades\Session as LaravelSession;


class PaymentController extends Controller
{
    public function createPaymentIntent(Request $request)
    {
        try {
            // Configure the secret key
            Stripe::setApiKey(env('STRIPE_SECRET'));

            // Create a PaymentIntent
            $paymentIntent = PaymentIntent::create([
                'amount' => $request->amount * 100, // value in cents
                'currency' => 'usd',
                'payment_method_types' => ['card'],
            ]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function createCheckoutSession(Request $request)
    {
        $amount = $request->input('amount');  // Total com impostos
        $cartItems = $request->input('cartItems');  // Lista de produtos
        $customerCountry = $request->input('customerCountry'); // País do cliente
    
        // Defina a chave da API Stripe
        Stripe::setApiKey(env('STRIPE_SECRET'));  // Use a variável de ambiente para segurança
    
        // Defina as taxas de imposto com base no país
        $taxRate = $this->getTaxRateForCountry($customerCountry);  // Função personalizada para obter a taxa do país
    
        // Criação de checkout session com Stripe
        try {
            $session = \Stripe\Checkout\Session::create([
                'payment_method_types' => ['card'],
                'line_items' => array_map(function ($item) use ($taxRate) {
                    $unitAmountWithTax = $item['price'] * (1 + $taxRate); // Calcula o preço com imposto
                    return [
                        'price_data' => [
                            'currency' => 'eur',
                            'product_data' => [
                                'name' => $item['name'],
                                // Outros dados do produto conforme necessário
                            ],
                            'unit_amount' => $unitAmountWithTax * 100, // Valor em centavos
                        ],
                        'quantity' => $item['quantity'],
                    ];
                }, $cartItems),
                'mode' => 'payment',
                'success_url' => 'http://localhost:4200/loja-online/agradecimento?clearLocalStorage=true',  // URL de sucesso
                'cancel_url' => 'http://localhost:4200/loja-online/checkout',  // URL de cancelamento
                'shipping_address_collection' => [
    'allowed_countries' => [
        'AC', 'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA', 
        'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BV', 
        'BW', 'BY', 'BZ', 'CA', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CV', 'CW', 
        'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 
        'FK', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 
        'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 
        'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KR', 'KW', 'KY', 'KZ', 'LA', 
        'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MK', 
        'ML', 'MM', 'MN', 'MO', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 
        'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 
        'PN', 'PR', 'PS', 'PT', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SE', 'SG', 'SH', 
        'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SZ', 'TA', 'TC', 'TD', 'TF', 
        'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'US', 'UY', 
        'UZ', 'VA', 'VC', 'VE', 'VG', 'VN', 'VU', 'WF', 'WS', 'XK', 'YE', 'YT', 'ZA', 'ZM', 'ZW', 'ZZ'
    ],  // Todos os países permitidos com os códigos ISO 3166-1 alfa-2
],

                'phone_number_collection' => [
                    'enabled' => true, // Ativa a coleta do número de telefone
                ],
            ]);
    
            return response()->json(['id' => $session->id]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    

// Função para obter a taxa de imposto com base no país
private function getTaxRateForCountry($country)
{
    // Defina as taxas de imposto para os países aqui
    $taxRates = [
        'PT' => 0.23, // Exemplo de 23% de IVA para Portugal
        'ES' => 0.21, // Exemplo de 21% de IVA para Espanha
        'FR' => 0.20, // Exemplo de 20% de IVA para França
        // Adicione outras taxas de imposto conforme necessário
    ];

    // Retorna a taxa de imposto para o país, ou 0 caso não tenha sido encontrado
    return $taxRates[$country] ?? 0;
}

}