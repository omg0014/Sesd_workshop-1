export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateProductDto {
    name: string;
    description: string;
    price: number;
    category: string;
}

export interface UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
}

export interface ProductQueryOptions {
    search?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
