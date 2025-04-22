import express, {Request,Response} from 'express';
import path from 'path';
import { IBook } from './interfaces/IBook';
import { generateFakeBooks } from './utils/fakeBooksData';
import { getData,addItem,getItem,deleteItem,updateItem } from './utils/fileHandler';

const app = express();
const PORT = process.env.PORT || 5000;
const booksPath = path.join(__dirname,'data','books.json');

const fakeBooksData = generateFakeBooks();

app.use(express.json());

app.get('/',(req:Request,res:Response)=>{
    res.send('Hello World');
})

/**
 * Endpoints to handle books from JSON file
 */

app.get('/books', async (req: Request, res: Response) => {
    try{
        const books: IBook[] = await getData(booksPath);
        if(!books || books.length === 0){
            res.status(404).send({
                status:404,
                message:'No Products Found'
            });
            return;
        }
        res.status(200).send({
            status:200,
            message:'Books fetched successfully',
            data: books
        })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

app.get('/books/:id', async (req: Request, res: Response) => {
    try {
        const bookId = +req.params.id;
        const book: IBook = await getItem(booksPath, bookId);
        res.status(200).send({
            status: 200,
            message: 'Book fetched successfully',
            data: book
        });
    } catch (error: any) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            error: 'Failed to fetch book',
            message: error.message
        });
    }
});

app.post('/books', async (req: Request, res: Response) => {
    try {
        const newBook: IBook = req.body;
        // TODO: Add validation for the book object
        const addedBook = await addItem(booksPath, newBook);
        res.status(201).json({
            status: 201,
            message: 'Book added successfully',
            data: addedBook
        });
    } catch (error: any) {
        res.status(500).json({
            error: 'Failed to add book',
            message: error.message
        });
    }
});

app.patch('/books/:id', async (req: Request, res: Response) => {
    try {
        const bookId = +req.params.id;
        const updatedFields: Partial<IBook> = req.body;
        // TODO: Add validation for the updated fields
        const updatedBook = await updateItem(booksPath, bookId, updatedFields);
        res.status(200).send({
            status: 200,
            message: 'Book updated successfully',
            data: updatedBook
        });
    } catch (error: any) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            error: 'Failed to update book',
            message: error.message
        });
    }
});

app.delete('/books/:id', async (req: Request, res: Response) => {
    try {
        const bookId = +req.params.id;
        const deletedBook = await deleteItem(booksPath, bookId);
        res.status(200).send({
            status: 200,
            message: 'Book deleted successfully',
            data: deletedBook
        });
    } catch (error: any) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            error: 'Failed to delete book',
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});