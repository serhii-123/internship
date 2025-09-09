import { Collection, Db } from "mongodb";
import Doc from "./types/doc";

class Model {
    private readonly collection: Collection<Doc>
    constructor(db: Db) {
        this.collection = db.collection('docs');
    }

    public async insertDoc(doc: Doc): Promise<boolean> {
        await this.collection.insertOne(doc);
        
        return true;
    }

    public async findDocByPath(path: string): Promise<Record<string, any> | null> {
        const doc = await this.collection.findOne({ path: { $eq: path } });

        return doc ? doc.data : null;
    }
}

export default Model;