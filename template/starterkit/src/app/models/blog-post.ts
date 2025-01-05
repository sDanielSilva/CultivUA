export interface BlogPost {
    id?: number;
    title: string;
    content: string;
    is_highlighted: boolean;
    featuredPost: number;
    categoria_id: number;
    reading_time: number;
    image?: string | ArrayBuffer | null;
    status: string;
    admins_id: number;
    created_at: Date;
}
