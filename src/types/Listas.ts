export interface ListaFilters {
    search?: string;
    tags?: number[];    // Array de IDs enviado como query param
    recentes?: boolean;
    idioma?: string;       // Sigla do idioma (ex: 'en', 'es')
    popular?: boolean;
    page?: number;         // Para o controle da paginação
    perfil?: boolean;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    slug: string;
    google_id: string | null;
    avatar: string | null;
    created_at: string;
    updated_at: string;
}

export interface Tag {
    id: number;
    nome: string;
    pivot: {
        list_id: number;
        tag_id: number;
    };
}

export interface Movie {
    id: number;
    tmdb_id: number;
    titulo_original: string;
    titulo_br: string;
    titulo_en: string;
    rating: number;
    poster_thumb_br: string;
    poster_thumb_us: string;
    slug_pt: string;
    slug_en: string;
    pivot: {
        list_id: number;
        movie_id: number;
        ordem: number;
    };
}

export interface Lista {
    id: number;
    titulo: string;
    comentario: string;
    slug: string;
    user_id: number;
    likes_count: number;
    is_liked: boolean;
    user: User;
    tags: Tag[];
    movies: Movie[];
}

export interface MovieListItem {
    id: number;
    poster_thumb_br: string;
    poster_thumb_us: string;
    pivot: {
        list_id: number;
        movie_id: number;
        ordem: number;
    };
}

export interface ListaSummary {
    id: number;
    titulo: string;
    comentario: string;
    user_id: number;
    likes_count: number;
    slug: string;
    tags: Tag[];
    movies: MovieListItem[];
}

export interface ListaPaginada {
    current_page: number;
    data: ListaSummary[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface MovieCreateInput {
    id: number;
    tmdb_id: number;
}

export interface CreateLista {
    titulo: string;
    comentario: string;
    tags: string[]; // No seu exemplo, você envia os nomes das tags
    idioma: 'pt' | 'en'; // Tipagem estrita para os idiomas suportados
    slug: string;
    movies: MovieCreateInput[];
}

export interface ApiResponse<T = any> {
    message: string;
    data?: T;
}

export interface LikeResponse {
    message: string;
    is_liked: boolean;
    likes_count: number;
}