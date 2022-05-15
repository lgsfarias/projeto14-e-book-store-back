import { Router } from 'express';

import {
    getShoppingCart,
    removeBookFromShoppingCart,
    addBooksToShoppingCart,
    checkout,
    getPurchaseHistory,
} from '../controllers/cartController.js';
import { validateToken } from '../middlewares/validateToken.js';
import { validateBook, validateBooks } from '../middlewares/validateBook.js';

const cartRouter = Router();

cartRouter.get('/shopping-carts', validateToken, getShoppingCart);
cartRouter.post(
    '/shopping-carts',
    validateToken,
    validateBooks,
    addBooksToShoppingCart
);
cartRouter.delete(
    '/shopping-carts',
    validateToken,
    validateBook,
    removeBookFromShoppingCart
);
cartRouter.post('/checkout', validateToken, checkout);
cartRouter.get('/purchase-history', validateToken, getPurchaseHistory);

export default cartRouter;
