import { Router } from 'express';

import { getBookById, getBooks } from '../controllers/booksController.js';

const booksRouter = Router();

booksRouter.get('/books/:id', getBookById);
booksRouter.get('/books', getBooks);

export default booksRouter;
