import express, { Request, Response } from 'express';
import path from 'path';
import { generateFakeProducts } from './utils/fakeProductsData';
import { IProduct } from './interfaces/IProducts';
import ProductController from './controllers/ProductController';
import ProductService from './services/ProductService';

const app = express();
const PORT = process.env.PORT || 5000;


const fakeProducts = generateFakeProducts();

/**
 * 
 * To parse a custom header
 * 
 *  */ 

// app.use(express.json({
//     type: "custom/type",
// }))

app.use(express.json());
app.set('view engine', 'pug');
app.set('views',path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const productsService = new ProductService(fakeProducts);

const productController = new ProductController(productsService)


app.get('/products', (req: Request, res: Response) => {
    res.render('products');
})


/**
 * 
 * Endpoint to Fetch fake products from Faker js
 * 
 */

// Endpoint to generate fake products
app.post('/api/fake-products',async(req: Request, res: Response) => productController.createProduct(req,res));

// Endpoint to get fake products with filter query fetaure
app.get('/api/fake-products',(req: Request, res: Response) => productController.getProducts(req,res));

// Endpoint to get fake product by ID
app.get('/api/fake-products/:id',(req: Request, res: Response) => productController.getProductById(req,res));

// Endpoint to Update a certain fake product
app.patch('/api/fake-products/:id',(req: Request, res: Response) => productController.updateProduct(req,res));

// Endpoint to Delete a certain fake product
app.delete('/api/fake-products/:id',(req: Request, res: Response) => productController.deleteProduct(req,res));

app.get('/', (req: Request, res: Response) => {
    res.render('index',{title: 'Hey', message: 'Hello there!'});
});


app.get("/{*splat}", (req: Request, res: Response) => {
    res.status(404).render('404', { 
        title: 'Page Not Found', 
        message: 'Sorry, we could not find the page you were looking for.' 
    });
});


app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
})