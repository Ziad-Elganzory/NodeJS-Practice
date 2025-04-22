import {faker} from '@faker-js/faker';
import { IBook } from '../interfaces/IBook';

export const generateFakeBooks = (): IBook[] => {
    return Array.from({length:25},(_,idx)=>{
        return {
            id: idx+1,
            title: faker.book.title(),
            description: faker.lorem.paragraphs(3),
            author: faker.book.author()
        }
    })
}