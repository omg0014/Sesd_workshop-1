import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

export class ProductRoutes {
    public router = Router();

    constructor(private productController: ProductController) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', this.productController.getAll);
        this.router.get('/:id', this.productController.getById);


        this.router.post('/', AuthMiddleware, this.productController.create);
        this.router.put('/:id', AuthMiddleware, this.productController.update);
        this.router.delete('/:id', AuthMiddleware, this.productController.delete);
    }
}
