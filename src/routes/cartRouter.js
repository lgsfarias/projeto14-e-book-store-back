import { Router } from "express";

import {getShoppingCart, removeBookFromShoppingCart, addBooksToShoppingCart} from "../controllers/cartController.js"
import {validateToken} from "../middlewares/validateToken.js";
import { validateBook, validateBooks } from "../middlewares/validateBook.js";

const cartRouter = Router();

cartRouter.use(validateToken);

cartRouter.get("/shopping-carts", getShoppingCart);
cartRouter.post("/shopping-carts", validateBooks, addBooksToShoppingCart);
cartRouter.delete("/shopping-carts", validateBook, removeBookFromShoppingCart);

export default cartRouter;