import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

import db from '../config/dbConnect.js';

dotenv.config();

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
                } else if (booksId.length == 1) {
                    return res.sendStatus(204);
                }
            } else if (booksId.length == 1) {
                return res.sendStatus(206);
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
    try {
        const user = await db
            .collection('users')
            .findOne({ _id: new ObjectId(userId) });
        if (user.cart.length == 0) {
            return res.sendStatus(412);
        }
        const books = await db.collection('books').find().toArray();
        const booksInCart = user.cart.map((bookId) =>
            books.find((book) => book._id.toString() == bookId)
        );
        let totalPrice = 0;
        for (const book of booksInCart) {
            totalPrice += book.price;
            book.totalPurchases++;
            const filter = { _id: book._id };
            const update = { $set: { totalPurchases: book.totalPurchases } };
            await db.collection('books').updateOne(filter, update);
        }

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
        await sendEmail(user.email, totalPrice);
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

export async function sendEmail(userEmail, totalPrice) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const html = '<h1>Compra finalizada com sucesso!</h1>';
    html += `<p>Total: R$ ${totalPrice.toFixed(2)}`;
    const msg = {
        to: userEmail,
        from: 'henriquehhr@gmail.com',
        subject: 'Compra concluída com sucesso',
        text: 'Deu certo!',
        html,
    };

    (async () => {
        try {
            await sgMail.send(msg);
        } catch (error) {
            console.error(error);

            if (error.response) {
                console.error(error.response.body);
            }
        }
    })();
}
