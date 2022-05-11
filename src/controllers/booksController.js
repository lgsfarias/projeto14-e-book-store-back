import { ObjectId } from 'mongodb';
import db from '../config/dbConnect.js';

export async function getBookById(req, res) {
    const { id } = req.params;

    try {
        const book = await db
            .collection('books')
            .findOne({ _id: new ObjectId(id) });
        if(!book) {
            return res.sendStatus(404);
        }
        res.send(book);
    } catch (e) {
        res.send(e);
    }
}
