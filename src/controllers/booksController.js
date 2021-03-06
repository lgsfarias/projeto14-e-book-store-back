import { ObjectId } from 'mongodb';
import db from '../config/dbConnect.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export async function getBookById(req, res) {
    const { id } = req.params;

    try {
        const book = await db
            .collection('books')
            .findOne({ _id: new ObjectId(id) });
        if (!book) {
            return res.sendStatus(404);
        }
        if (req.headers.authorization) {
            const token = req.headers.authorization.slice(7);
            const secretKey = process.env.JWT_SECRET;
            const { sessionId } = jwt.verify(token, secretKey);
            const { userId } = await db
                .collection('sessions')
                .findOne({ _id: new ObjectId(sessionId) });
            const user = await db
                .collection('users')
                .findOne({ _id: new ObjectId(userId) });
            if (user.booksOwned.find((bookOwned) => bookOwned == id)) {
                return res.status(207).send(book);
            }
            //console.log('verificando o carrinho');
            if (user.cart.includes(id)) {
                res.status(200).send({ ...book, alreadyInCart: true });
                //console.log('entrou no if');
                return;
            }
            //console.log('terminou de verificar');
            /*for (const bookInCart of user.cart) {
                if (bookInCart == id) {
                    return res.status(202).send(book);
                }
            }*/
            //if (user.cart.find((bookInCart) => bookInCart === '' + id)) { }
        }
        console.log('teste');
        res.status(200).send(book);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function getBooks(req, res) {
    try {
        const books = await db.collection('books').find().toArray();

        res.status(200).send(books);
    } catch (e) {
        res.status(500).send(e);
    }
}

export async function getBooksSortedByTotalPurchases(req, res) {
    try {
        const booksSorted = await db
            .collection('books')
            .find()
            .sort({ totalPurchases: -1 })
            .toArray();
        res.send(booksSorted);
    } catch (e) {
        res.status(500).send(e);
    }
}
