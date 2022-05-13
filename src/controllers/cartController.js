import { ObjectId } from "mongodb";

import db from "../config/dbConnect.js"

export async function getShoppingCart (req, res) {
    const {userId} = res.locals;
    try {
        const user = await db.collection("users").findOne({_id: new ObjectId(userId)});
        const books = await db.collection("books").find().toArray();
        res.send(user.cart.map(bookId => books.find(book => book._id.toString() == bookId)));
    } catch (e) {
        res.send(e);
    }
}

export async function addBooksToShoppingCart (req, res) {

    const {userId} = res.locals;
    const {booksId} = req.body;
    try {
        const user = await db.collection("users").findOne({_id: new ObjectId(userId)});
        console.log(user.email);
        for(const book of booksId) {
            if(!user.cart.find(bookAlreadyInCart => book == bookAlreadyInCart)) {
                if(!user.booksOwned.find(bookAlreadyOwned => book == bookAlreadyOwned)) {
                    user.cart.push(book);
                }
            }
        }
        await db.collection("users").updateOne({_id: new ObjectId(userId)}, {
            $set: {cart: user.cart}
        });
        res.sendStatus(200);
    } catch (e) {
        res.send(e);
    }
}

export async function removeBookFromShoppingCart (req, res) {

    const {userId} = res.locals;
    const {bookId} = req.body;
    
    try {
        const user = await db.collection("users").findOne({_id: new ObjectId(userId)});
        const newCart = user.cart.filter(book => book != bookId);
        await db.collection("users").updateOne({_id: new ObjectId(userId)}, {
            $set: {cart: newCart}
        });
        res.sendStatus(200);
    } catch (e) {
        res.send(e);
    }
}