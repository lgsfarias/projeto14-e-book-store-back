import db from '../config/dbConnect.js';

export async function getKinds(req, res) {
    try {
        const kinds = await db.collection('kinds').find().toArray();

        res.status(200).send(kinds);
    } catch (e) {
        res.status(500).send(error);
    }
}
