import { Router } from "express";

import { signin, signup } from "../controllers/authenticationController.js";
import { validateSignIn, validateSignUp } from "../middlewares/validateAuthentication.js";

const authenticationRouter = Router();

authenticationRouter.post("/signin", validateSignIn, signin);
authenticationRouter.post("/signup", validateSignUp, signup);

export default authenticationRouter;