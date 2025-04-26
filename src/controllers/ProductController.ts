import { Request, Response } from "express";
import { IProduct } from "../interfaces/IProducts";
import ProductService from "../services/ProductService";

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
}

