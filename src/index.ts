import express, { Request, Response } from 'express';
import fs, {promises as fsPromises} from 'fs';
import path from 'path';
import { generateFakeData } from './utils/fakeData';
import { IProduct } from './interfaces/IProducts';

const app = express();
const PORT = process.env.PORT || 5000;
const productsPath = path.join(__dirname,'data','products.json');

const fakeProducts = generateFakeData();

/**
 * 
 * To parse a custom header
 * 
 *  */ 

// app.use(express.json({
//     type: "custom/type",
// }))

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

/**
 * 
 * Endpoint to fetch products from JSON file
 *  
 * */

// Create Product
app.post('/products',async(req: Request, res: Response) => {
    try{
        const requestBody = req.body;
        const {title, description} = requestBody;
        try {
            await fsPromises.access(productsPath);
        } catch {
            // Create the file if it doesn't exist
            await fsPromises.writeFile(productsPath, JSON.stringify({ products: [] }, null, 2));
        }
        const productsData = await fsPromises.readFile(productsPath,'utf8');
        const productsJSON : {products: {id: number, title: string, description: string}[]} = JSON.parse(productsData);

        if(!title || !description){
            res.status(400).send({
                status:400,
                message:'Product ID, Title and Description are required'
            });
            return;
        }
        if(typeof title !== 'string' || typeof description !== 'string'){
            res.status(400).send({
                status:400,
                message:'Product ID should be a number and Title and Description should be strings'
            });
            return;
        }
        const newProduct = {
            id: productsJSON.products.length + 1,
            title: title,
            description: description
        };
        productsJSON.products.push(newProduct);
        const updatedData = JSON.stringify(productsJSON, null, 2);
        await fsPromises.writeFile(productsPath,updatedData,{flag:"w"});
        res.status(201).send({
            status:201,
            message:'Product Created Successfully',
            body: requestBody
        })
    } catch(err){
        console.error('File does not exist:', productsPath);
        res.status(404).send({
            status:404,
            message:'File not found'
        });
        return;
    }
});

// Get Products
app.get('/products',async(req: Request, res: Response) => {
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
            status:201,
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

// Get Product by ID
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
        res.status(200).send({
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



/**
 * 
 * Endpoint to Fetch fake products from Faker js
 * 
 */

// Endpoint to generate fake products
app.post('/fake-products',async(req: Request, res: Response) => {
    try{
        const requestBody = req.body;
        const {title, price, description} = requestBody;
        const newProduct = {
            id: fakeProducts.length + 1,
            title: title,
            price: price,
            description: description
        };
        fakeProducts.push(newProduct);
        res.status(201).send({
            status:201,
            message:'Fake Product Created Successfully',
            body: requestBody
        });
    } catch(err){
        res.status(500).send({
            status:500,
            message:'Internal Server Error',
            error:err
        });
        return;
    }
})

// Endpoint to get fake products with filter query fetaure
app.get('/fake-products',(req: Request, res: Response) => {
    // Filter By Query, keyof IProduct
    const filterQuery = req.query.filter as string;

    if(filterQuery){
        const propertiesToFilter = filterQuery.split(',');
        let filteredProducts = [];

        filteredProducts = fakeProducts.map(product => {
            const filteredProduct : any = {};

            propertiesToFilter.forEach(property => {
                if(product.hasOwnProperty(property)){
                    filteredProduct[property] = product[property as keyof IProduct];
                }
            });
            return {id: product.id ,...filteredProduct};
        })
        res.send({
            status:201,
            message:'Fake Products Fetched Successfully',
            products: filteredProducts
        });
        return;
    }

    res.send({
        status:200,
        message:'Fake Products Fetched Successfully',
        products: fakeProducts
    });

});

// Endpoint to get fake product by ID
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
        const product: IProduct | undefined = fakeProducts.find( product => productID == product.id);
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

// Endpoint to Update a certain fake product
app.patch('/fake-products/:id',(req: Request, res: Response) => {
    const productID = +req.params.id;
    if(isNaN(productID)){
        res.status(400).send({
            status:400,
            message:'Invalid product ID'
        });
        return;
    }

    try{
        const productIndex: number | undefined = fakeProducts.findIndex(product => product.id === productID);
        if(productIndex === -1){
            res.status(404).send({
                status:404,
                message:`Product ID: ${productID} Not Found`
            });
            return;
        }
        const productBody = req.body;
        fakeProducts[productIndex] = { ...fakeProducts[productIndex], ...productBody };
        res.status(200).send({
            status:200,
            message:'Fake Product Updated Successfully',
            product: fakeProducts[productIndex]
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