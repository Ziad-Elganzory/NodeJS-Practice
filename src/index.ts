import express, { Request, Response } from 'express';
import fs, {promises as fsPromises, stat} from 'fs';
import path from 'path';
import { generateFakeData } from './utils/fakeData';

const app = express();
const PORT = process.env.PORT || 5000;
const productsPath = path.join(__dirname,'data','products.json');

const fakeProducts = generateFakeData();


app.get('/', (req, res) => {
    res.send('Hello World');
});

// Endpoint to fetch products from JSON file
app.get('/products',async(req, res) => {
    try{
        await fsPromises.access(productsPath);
        const data = await fsPromises.readFile(productsPath,'utf8');
        const productsData : {products: {id: number, title: string, description: string}[]} = JSON.parse(data);
        if(!productsData.products || productsData.products.length === 0){
            res.status(404).send({
                status:404,
                message:'No Products Found'
            });
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.send({
            status:200,
            message:'Product Fetched Successfully',
            products: productsData.products
        });    }
    catch(err){
        console.error('File does not exist:', productsPath);
        res.status(404).send({
            status:404,
            message:'File not found'
        });
        return;
    }
});

app.get('/products/:id',async(req: Request, res: Response) => {
    const productID = +req.params.id;
    if(isNaN(productID)){
        res.status(400).send({message:'Invalid product ID'});
        return;
    }

    try{
        const data = await fsPromises.readFile(productsPath,'utf8');
        const productsData : {products:[{id:number, title: string, description: string}]} = JSON.parse(data);
        const product = productsData.products.find( product => productID == product.id);
        if(!product){
            res.status(404).send({
                status:404,
                message:`Product ID: ${productID} Not Found`
            });
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.send({
            status:200,
            message:'Product Fetched Successfully',
            product: product
        });
    } catch(err){
        res.status(500).send({
            status:500,
            message:'Internal Server Error',
            error:err
        });
        return;
    }
});

// Endpoint to generate fake products

app.get('/fake-products',(req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        status:200,
        message:'Fake Products Fetched Successfully',
        products: fakeProducts
    });
});

app.get('/fake-products/:id',(req: Request, res: Response) => {
    const productID = +req.params.id;
    if(isNaN(productID)){
        res.status(400).send({
            status:400,
            message:'Invalid product ID'
        });
        return;
    }

    try{
        const product: {id: number, title: string, price: number} | undefined = fakeProducts.find( product => productID == product.id);
        if(!product){
            res.status(404).send({
                status:404,
                message:`Product ID: ${productID} Not Found`
            });
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.send({
            status:200,
            message:'Fake Product Fetched Successfully',
            product: product
        });
    } catch(err){
        res.status(500).send({
            status:500,
            message:'Internal Server Error',
            error:err
        });
        return;
    }
});


app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
})