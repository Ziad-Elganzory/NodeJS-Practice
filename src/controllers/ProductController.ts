import { IProduct } from "../interfaces/IProducts";
import ProductService from "../services/ProductService";

export default class ProductController {
    constructor(private productsService: ProductService) {}

    getProducts(): IProduct[]
    {
        return this.productsService.findAll();
    }
}

