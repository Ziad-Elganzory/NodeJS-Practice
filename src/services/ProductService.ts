import { IProduct } from "../interfaces/IProducts";
import { generateFakeProducts } from "../utils/fakeProductsData";

export default class ProductService {
    private readonly products: IProduct[];

    constructor(products: IProduct[]){
        this.products = products;
    }

    findAll(): IProduct[]
    {
            // // Filter By Query, keyof IProduct
    // const filterQuery = req.query.filter as string;

    // if(filterQuery){
    //     const propertiesToFilter = filterQuery.split(',');
    //     let filteredProducts = [];

    //     filteredProducts = fakeProducts.map(product => {
    //         const filteredProduct : any = {};

    //         propertiesToFilter.forEach(property => {
    //             if(product.hasOwnProperty(property)){
    //                 filteredProduct[property] = product[property as keyof IProduct];
    //             }
    //         });
    //         return {id: product.id ,...filteredProduct};
    //     })
    //     res.send({
    //         status:201,
    //         message:'Fake Products Fetched Successfully',
    //         products: filteredProducts
    //     });
    //     return;
    // }

    // res.send({
    //     status:200,
    //     message:'Fake Products Fetched Successfully',
    //     products: fakeProducts
    // });
        return this.products;
    }


}