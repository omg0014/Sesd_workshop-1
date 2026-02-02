import * as fs from 'fs/promises';
import * as path from 'path';
import { Product, CreateProductDto, UpdateProductDto, ProductQueryOptions } from '../models/product.model';

export class ProductRepository {
    private products: Product[] = [];
    private filePath = path.join(process.cwd(), 'data', 'products.json');

    constructor() {
        this.initializeData();
    }

    private async initializeData() {
        try {
            await fs.mkdir(path.dirname(this.filePath), { recursive: true });
            const data = await fs.readFile(this.filePath, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [
                {
                    id: 'seed-1',
                    name: 'Premium Headphones',
                    description: 'Noise-cancelling over-ear headphones with high-fidelity sound.',
                    price: 299.99,
                    category: 'Electronics',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 'seed-2',
                    name: 'Leather Weekend Bag',
                    description: 'Handcrafted genuine leather bag for your short journeys.',
                    price: 150.00,
                    category: 'Accessories',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];
            await this.saveToFile();
        }
    }

    private async saveToFile() {
        await fs.writeFile(this.filePath, JSON.stringify(this.products, null, 2));
    }

    async findAll(options: ProductQueryOptions): Promise<{ data: Product[]; total: number }> {
        let result = [...this.products];


        if (options.search) {
            const search = options.search.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(search) ||
                p.description.toLowerCase().includes(search)
            );
        }


        if (options.category) {
            result = result.filter(p => p.category === options.category);
        }


        if (options.sortBy) {
            const sortBy = options.sortBy as keyof Product;
            const order = options.sortOrder === 'desc' ? -1 : 1;
            result.sort((a, b) => {
                if (a[sortBy] < b[sortBy]) return -1 * order;
                if (a[sortBy] > b[sortBy]) return 1 * order;
                return 0;
            });
        }

        const total = result.length;


        if (options.page && options.limit) {
            const start = (options.page - 1) * options.limit;
            result = result.slice(start, start + options.limit);
        }

        return { data: result, total };
    }

    async findById(id: string): Promise<Product | undefined> {
        return this.products.find(p => p.id === id);
    }

    async create(data: CreateProductDto): Promise<Product> {
        const newProduct: Product = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.products.push(newProduct);
        await this.saveToFile();
        return newProduct;
    }

    async update(id: string, data: UpdateProductDto): Promise<Product | undefined> {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) return undefined;

        this.products[index] = {
            ...this.products[index],
            ...data,
            updatedAt: new Date()
        };
        await this.saveToFile();
        return this.products[index];
    }

    async delete(id: string): Promise<boolean> {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) return false;

        this.products.splice(index, 1);
        await this.saveToFile();
        return true;
    }
}
