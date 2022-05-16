import { ObjectId } from 'mongodb';

import db from '../config/dbConnect.js';

export async function getShoppingCart(req, res) {
    const { userId } = res.locals;
    try {
        const user = await db
            .collection('users')
            .findOne({ _id: new ObjectId(userId) });
        const books = await db.collection('books').find().toArray();
        res.send(
            user.cart.map((bookId) =>
                books.find((book) => book._id.toString() == bookId)
            )
        );
    } catch (e) {
        res.status(500).send(e);
    }
}

export async function addBooksToShoppingCart(req, res) {
    const { userId } = res.locals;
    const { booksId } = req.body;
    try {
        const user = await db
            .collection('users')
            .findOne({ _id: new ObjectId(userId) });
        console.log(user.email);
        for (const book of booksId) {
            if (
                !user.cart.find(
                    (bookAlreadyInCart) => book == bookAlreadyInCart
                )
            ) {
                if (
                    !user.booksOwned.find(
                        (bookAlreadyOwned) => book == bookAlreadyOwned
                    )
                ) {
                    user.cart.push(book);
                }
            }
        }
        await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            {
                $set: { cart: user.cart },
            }
        );
        res.sendStatus(200);
    } catch (e) {
        res.status(500).send(e);
    }
}

export async function removeBookFromShoppingCart(req, res) {
    const { userId } = res.locals;
    const { bookId } = req.body;

    try {
        const user = await db
            .collection('users')
            .findOne({ _id: new ObjectId(userId) });
        const newCart = user.cart.filter((book) => book != bookId);
        await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            {
                $set: { cart: newCart },
            }
        );
        res.sendStatus(200);
    } catch (e) {
        res.status(500).send(e);
    }
}

export async function checkout(req, res) {
    const { userId } = res.locals;
    const { payment } = req.body;
    console.log('entrou');
    try {
        const user = await db
            .collection('users')
            .findOne({ _id: new ObjectId(userId) });
        console.log('achou usuário');
        if (user.cart.length == 0) {
            return res.sendStatus(412);
        }
        const books = await db.collection('books').find().toArray();
        console.log('achou livros');
        console.log(user.cart);
        const booksInCart = user.cart.map((bookId) =>
            books.find((book) => book._id.toString() == bookId)
        );
        console.log(booksInCart);
        console.log('achou livros que estão no carrinho');
        let totalPrice = 0;
        for (const book of booksInCart) {
            totalPrice += book.price;
            book.totalPurchases++;
            const filter = { _id: book._id };
            const update = { $set: { totalPurchases: book.totalPurchases } };
            await db.collection('books').updateOne(filter, update);
        }
        console.log('passou pelo for');

        const purchase = {
            payment,
            totalPrice,
            books: user.cart,
            date: new Date(),
        };
        const newBooksOwned = user.booksOwned.concat(user.cart);
        const newPurchaseHistory = user.purchaseHistory.concat([purchase]);
        await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            {
                $set: {
                    booksOwned: newBooksOwned,
                    cart: [],
                    purchaseHistory: newPurchaseHistory,
                },
            }
        );
        console.log('fez update do usuário');
        res.sendStatus(200);
    } catch (e) {
        res.status(500).send(e);
    }
}

export async function getPurchaseHistory(req, res) {
    const { userId } = res.locals;

    try {
        const user = await db
            .collection('users')
            .findOne({ _id: new ObjectId(userId) });
        res.send(user.purchaseHistory);
    } catch (e) {
        res.status(500).send(e);
    }
}
