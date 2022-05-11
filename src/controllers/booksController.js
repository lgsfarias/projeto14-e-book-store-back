import { ObjectId } from 'mongodb';
import db from '../config/dbConnect.js';

export async function getBookById(req, res) {
    const { id } = req.params;

    try {
        const book = await db
            .collection('books')
            .findOne({ _id: new ObjectId(id) });
        if (!book) {
            return res.sendStatus(404);
        }
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
        res.status(500).send(error);
    }
}
