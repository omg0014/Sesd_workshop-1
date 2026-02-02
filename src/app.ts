import express from "express";
import { ProductRepository } from "./repositories/product.repository";
import { ProductService } from "./services/product.service";
import { ProductController } from "./controllers/product.controller";
import { ProductRoutes } from "./routes/product.routes";
import { ErrorMiddleware } from "./middleware/error.middleware";

class App {
    public app: express.Application;
    public port: number | string = 3000;

    constructor() {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

    private initializeRoutes() {
        const productRepository = new ProductRepository();
        const productService = new ProductService(productRepository);
        const productController = new ProductController(productService);
        const productRoutes = new ProductRoutes(productController);

        this.app.get('/', (req, res) => {
            res.json({ message: 'Welcome to Product CRUD API' });
        });

        this.app.use('/api/products', productRoutes.router);
    }

    private initializeErrorHandling() {
        this.app.use(ErrorMiddleware);
    }

    public start() {
        this.app.listen(this.port, () => {
            console.log(`App started on http://localhost:${this.port}`);
        });
    }
}
export default App;

