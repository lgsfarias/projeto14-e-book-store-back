import express, { json } from 'express';
import cors from 'cors';

import authenticationRouter from './routes/authenticationRouter.js';
import booksRouter from './routes/booksRouter.js';
import cartRouter from './routes/cartRouter.js';

const app = express();
app.use(json());
app.use(cors());

app.use(authenticationRouter);
app.use(booksRouter);
app.use(cartRouter);

export default app;
