import { Request, Response } from "express";
import { IProduct } from "../interfaces/IProducts";
import ProductService from "../services/ProductService";
import { th } from "@faker-js/faker/.";

export default class ProductController {
    constructor(private productsService: ProductService) {}

    getProducts(req: Request, res: Response)
    {
        const filterQuery = req.query.filter as string;
        if(filterQuery){
            res.send(this.productsService.filterByQuery(filterQuery));
        }
        res.send(this.productsService.findAll());
    }

    getProductById(req: Request, res: Response)
    {
        const productID = +req.params.id;
        if(isNaN(productID)){
            res.status(400).send({
                status:400,
                message:'Invalid product ID'
            });
            return;
        }

        try{
            const product: IProduct | undefined = this.productsService.getProductById(productID);
            if(!product){
                res.status(404).send({
                    status:404,
                    message:`Product ID: ${productID} Not Found`
                });
                return;
            }
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
    }

    createProduct(req: Request, res: Response)
    {
        try{
            const newProduct = req.body;
            this.productsService.createProduct(newProduct);
            res.status(201).send({
                status:201,
                message:'Fake Product Created Successfully',
                body: {
                    id: this.productsService.findAll().length ,
                    ...newProduct
                }
            });
        } catch(err){
            res.status(500).send({
                status:500,
                message:'Internal Server Error',
                error:err
            });
            return;
        }
    }

    updateProduct(req: Request, res: Response)
    {
        const productID = +req.params.id;
        if(isNaN(productID)){
            res.status(400).send({
                status:400,
                message:'Invalid product ID'
            });
            return;
        }

        try{
            const productIndex: number | undefined = this.productsService.findAll().findIndex(product => product.id === productID);
            if(productIndex === -1){
                res.status(404).send({
                    status:404,
                    message:`Product ID: ${productID} Not Found`
                });
                return;
            }
            const productBody = req.body;
            this.productsService.updateProductByIndex(productIndex, productBody);
            res.status(200).send({
                status:200,
                message:'Fake Product Updated Successfully',
                product: this.productsService.findAll()[productIndex]
            });
            
        } catch(err){
            res.status(500).send({
                status:500,
                message:'Internal Server Error',
                error:err
            });
            return;
        }
    }

    deleteProduct(req: Request, res: Response)
    {
        const productID = +req.params.id;
        if(isNaN(productID)){
            res.status(400).send({
                status:400,
                message:'Invalid product ID'
            });
            return;
        }
    
        try{
            const productData: IProduct | undefined = this.productsService.findAll().find(product => product.id === productID);
            if(!productData){
                res.status(404).send({
                    status:404,
                    message:`Product ID: ${productID} Not Found`
                });
                return;
            }
            this.productsService.deleteProduct(productID);
            res.status(200).send({
                status:200,
                message:'Fake Product Deleted Successfully',
                products: productData
            });
            
        } catch(err){
            res.status(500).send({
                status:500,
                message:'Internal Server Error',
                error:err
            });
            return;
        }    
    }
}

