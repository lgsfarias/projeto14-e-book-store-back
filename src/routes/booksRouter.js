import { Router } from 'express';

import { getBookById } from '../controllers/booksController.js';

const booksRouter = Router();

booksRouter.get('/books/:id', getBookById);

export default booksRouter;
