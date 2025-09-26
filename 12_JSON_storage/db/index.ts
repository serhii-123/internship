import { MongoClient, Db } from 'mongodb';

let client: MongoClient;
let db: Db;

export async function connectDB(connectionString: string): Promise<Db> {
    if(db) return db;

    client = new MongoClient(connectionString);

    try {
        await client.connect();

        db = client.db();

        return db;
    } catch(e) {
        console.error('Failed to connect to DB: ', e);
        process.exit(1);
    }
}