import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import db from "../config/dbConnect.js"

export async function signup(req, res) {
    const user = req.body;
    const password = req.body.password;

    const passwordHash = bcrypt.hashSync(password, 10);

    try {
        const emailAlreadyTaken = await db.collection("users").findOne({ email: user.email });
        if(emailAlreadyTaken) {
            return res.sendStatus(409);
        }
        await db.collection("users").insertOne({ ...user, password: passwordHash });
        res.sendStatus(201);
    } catch (e) {
        res.send(e);
    }
}

export async function signin(req, res) {
    const { email, password } = req.body;
    try {
        const user = await db.collection("users").findOne({ email });
        if (user && bcrypt.compareSync(password, user.password)) {
            const secretKey = process.env.JWT_SECRET;
            const { insertedId } = await db.collection("sessions").insertOne({ userId: user._id });
            const token = jwt.sign({sessionId: insertedId}, secretKey);
            res.send(token);
        } else {
            res.sendStatus(401);
        }
    } catch (e) {
        res.send(e);
    }
}