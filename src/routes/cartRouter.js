import { Router } from "express";

import {getShoppingCart, removeBookFromShoppingCart, addBooksToShoppingCart} from "../controllers/cartController.js"
import {validateToken} from "../middlewares/validateToken.js";
import { validateBook, validateBooks } from "../middlewares/validateBook.js";

const cartRouter = Router();

//cartRouter.use(validateToken);

cartRouter.get("/shopping-carts", validateToken, getShoppingCart);
cartRouter.post("/shopping-carts", validateToken, validateBooks, addBooksToShoppingCart);
cartRouter.delete("/shopping-carts", validateToken, validateBook, removeBookFromShoppingCart);

export default cartRouter;