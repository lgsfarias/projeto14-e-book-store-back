import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

import db from "../config/dbConnect.js";

export async function validateToken(req, res, next) {

    const validateTokenFormat = req.headers.authorization.slice(0, 7);
    if (validateTokenFormat != "Bearer ") {
        return res.sendStatus(422);
    }
    const token = req.headers.authorization.slice(7);
    try {
        const secretKey = process.env.JWT_SECRET;
        const {sessionId} = jwt.verify(token, secretKey);
        const {userId} = await db.collection("sessions").findOne({ _id: new ObjectId(sessionId) });
        if (!userId) {
            return res.sendStatus(401);
        }
        res.locals.userId = userId;
        next();
    } catch (e) {
        return res.send(e);
    }
}