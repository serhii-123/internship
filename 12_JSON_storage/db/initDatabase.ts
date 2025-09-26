import { Db } from "mongodb";
import Doc from "../types/doc";

async function initDatabase(db: Db) {
    const docsCollection = db.collection('docs');

    await docsCollection.createIndex({ path: 1 }, { unique: true });

    const docsCount = await docsCollection.countDocuments();

    if(docsCount === 0) {
        const user: Doc = { 
            path: '/',
            data: { text: 'Wsp'},
        }

        await docsCollection.insertOne(user);
    }
}

export default initDatabase;