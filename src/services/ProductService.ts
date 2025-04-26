import { IProduct } from "../interfaces/IProducts";
import { generateFakeProducts } from "../utils/fakeProductsData";

type ProductBody = {
    title: string;
    price: number;
    description: string;
}

export default class ProductService {
    private readonly products: IProduct[];

    constructor(products: IProduct[]){
        this.products = products;
    }

    findAll(): IProduct[]
    {

        return this.products;
    }

    filterByQuery(filterQuery?:string)
    {
        if(filterQuery){
            const propertiesToFilter = filterQuery.split(',');
            let filteredProducts = [];

            filteredProducts = this.findAll().map(product => {
                const filteredProduct : any = {};

                propertiesToFilter.forEach(property => {
                    if(product.hasOwnProperty(property)){
                        filteredProduct[property] = product[property as keyof IProduct];
                    }
                });
                return {id: product.id ,...filteredProduct};
            })
            return filteredProducts;
        }

        return this.findAll();
    }

    getProductById(productId:number)
    {
        return this.findAll().find(product => product.id === productId)
    }

    createProduct(product: ProductBody)
    {
        return this.findAll().push({
            id: this.products.length + 1,
            ...product
        });
    }

    updateProductByIndex(index: number, product: ProductBody)
    {
        return this.findAll()[index] = { ... this.findAll()[index], ...product };
    }

    deleteProduct(id: number)
    {
        const products = this.findAll();
        const filteredProducts = products.filter(product => product.id !== id);
        products.length = 0;
        products.push(...filteredProducts);
    }
}