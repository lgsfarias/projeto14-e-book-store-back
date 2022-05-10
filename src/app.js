import express, { json } from 'express';
import cors from 'cors';

import db from './config/dbConnect.js';

const app = express();
app.use(json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Online');
});

export default app;
