import express, { json } from 'express';
import cors from 'cors';

import authenticationRouter from './routes/authenticationRouter.js';

const app = express();
app.use(json());
app.use(cors());

app.use(authenticationRouter);

export default app;
