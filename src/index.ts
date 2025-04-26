import express, { Request, Response } from 'express';
import fs, {promises as fsPromises} from 'fs';
import path from 'path';
import { generateFakeProducts } from './utils/fakeProductsData';
import { IProduct } from './interfaces/IProducts';
import ProductController from './controllers/ProductController';
import ProductService from './services/ProductService';

const app = express();
const PORT = process.env.PORT || 5000;
const productsPath = path.join(__dirname,'data','products.json');

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

const productsService = new ProductService(fakeProducts);

const productController = new ProductController(productsService)

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

/**
 * 
 * Endpoint to Fetch fake products from Faker js
 * 
 */

// Endpoint to generate fake products
app.post('/fake-products',async(req: Request, res: Response) => productController.createProduct(req,res));

// Endpoint to get fake products with filter query fetaure
app.get('/fake-products',(req: Request, res: Response) => productController.getProducts(req,res));

// Endpoint to get fake product by ID
app.get('/fake-products/:id',(req: Request, res: Response) => productController.getProductById(req,res));

// Endpoint to Update a certain fake product
app.patch('/fake-products/:id',(req: Request, res: Response) => productController.updateProduct(req,res));

// Endpoint to Delete a certain fake product
app.delete('/fake-products/:id',(req: Request, res: Response) => productController.deleteProduct(req,res));




app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
})