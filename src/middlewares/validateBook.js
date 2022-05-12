import { ObjectId } from "mongodb";

import db from "../config/dbConnect.js";

export async function validateBook (req, res, next) {

    const {bookId} = req.body;
    try {
        const book = await db.collection("books").findOne({_id: new ObjectId(bookId)});
        if(!book) {
            return res.sendStatus(404);
        }
    } catch (e) {
        return res.send(e);
    }
    next();
}

export async function validateBooks (req, res, next) {
    const {booksId} = req.body;
    try {
        for(const element of booksId) {
            const book = await db.collection("books").findOne({_id: new ObjectId(element)});
            if(!book) {
                return res.sendStatus(404);
            }
        }
    } catch (e) {
        return res.send(e);
    }
    next(); 
}