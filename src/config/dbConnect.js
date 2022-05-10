import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

let db = null;
const mongoURI = process.env.MONGO_URI;
const mongoClient = new MongoClient(mongoURI);

try {
    await mongoClient.connect();
    db = mongoClient.db(process.env.MONGO_DB);
    console.log(chalk.bold.blue('MongoDB connected'));
} catch (error) {
    console.log(chalk.red(error));
}

export default db;
