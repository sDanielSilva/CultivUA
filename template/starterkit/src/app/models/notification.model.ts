export interface Notification {
    id: number;
    message: string;
    type: string;
    created_at: string;
    is_read: boolean;
    hover?: boolean; // Propriedade opcional para o estado de hover
}
