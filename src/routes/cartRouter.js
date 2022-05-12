import { Router } from "express";

import {getShoppingCart, removeBookFromShoppingCart, addBooksToShoppingCart} from "../controllers/cartController.js"
import {validateToken} from "../middlewares/validateToken.js";

const cartRouter = Router();

cartRouter.use(validateToken);

cartRouter.get("/shopping-carts", getShoppingCart);
cartRouter.post("/shopping-carts", addBooksToShoppingCart);
cartRouter.delete("/shopping-carts", removeBookFromShoppingCart);

export default cartRouter;