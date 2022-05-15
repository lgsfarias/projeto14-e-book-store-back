import { Router } from 'express';

import {
    getBookById,
    getBooks,
    getBooksSortedByTotalPurchases,
} from '../controllers/booksController.js';

const booksRouter = Router();

booksRouter.get('/books/:id', getBookById);
booksRouter.get('/books', getBooks);
booksRouter.get('/best-selling', getBooksSortedByTotalPurchases);

export default booksRouter;
