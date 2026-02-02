import { ProductRepository } from '../repositories/product.repository';
import { CreateProductDto, UpdateProductDto, ProductQueryOptions, Product } from '../models/product.model';
import { AppError } from '../middleware/error.middleware';

export class ProductService {
    constructor(private productRepository: ProductRepository) { }

    async getAllProducts(options: ProductQueryOptions) {
        return await this.productRepository.findAll(options);
    }

    async getProductById(id: string): Promise<Product> {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new AppError(`Product with ID ${id} not found`, 404);
        }
        return product;
    }

    async createProduct(data: CreateProductDto): Promise<Product> {
        if (!data.name || !data.price) {
            throw new AppError('Name and Price are required fields');
        }
        if (data.price <= 0) {
            throw new AppError('Price must be a positive number');
        }
        return await this.productRepository.create(data);
    }

    async updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
        const updatedProduct = await this.productRepository.update(id, data);
        if (!updatedProduct) {
            throw new AppError(`Product with ID ${id} not found`, 404);
        }
        return updatedProduct;
    }

    async deleteProduct(id: string): Promise<void> {
        const deleted = await this.productRepository.delete(id);
        if (!deleted) {
            throw new AppError(`Product with ID ${id} not found`, 404);
        }
    }
}
