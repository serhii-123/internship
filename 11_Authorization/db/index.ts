import { MongoClient, Db } from 'mongodb'
import { DB_CONNECTION_STRING } from '../config/env.ts';

const client = new MongoClient(DB_CONNECTION_STRING);
let db: Db;

export async function connectDB(): Promise<Db> {
    if(db) return db;

    try {
        await client.connect();

        db = client.db();

        return db;
    } catch(e) {
        console.error('Failed to connect to DB: ', e);
        process.exit(1);
    }
}