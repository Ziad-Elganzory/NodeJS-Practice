import {faker} from '@faker-js/faker';
import { title } from 'process';

export const generateFakeData = () => {
    return Array.from({length:25},(_,idx)=>{
        return {
            id: idx+1,
            title: faker.commerce.productName(),
            price: +faker.commerce.price({min:100, max:200}),
        }
    })
}