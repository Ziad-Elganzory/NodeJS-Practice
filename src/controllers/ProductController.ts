import { Request, Response } from "express";
import { IProduct } from "../interfaces/IProducts";
import ProductService from "../services/ProductService";

export default class ProductController {
    constructor(private productsService: ProductService) {}

    getProducts(req: Request, res: Response): IProduct[]
    {
        const filterQuery = req.query.filter as string;
        if(filterQuery){
            return this.productsService.filterByQuery(filterQuery);
        }
        return this.productsService.findAll();
    }
}

