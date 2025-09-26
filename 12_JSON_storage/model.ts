import { Collection, Db } from "mongodb";
import Doc from "./types/doc";

class Model {
    private readonly collection: Collection<Doc>
    constructor(db: Db) {
        this.collection = db.collection('docs');
    }

    public async insertDoc(path: string, data: any): Promise<boolean> {
        await this.collection.insertOne({
            path, data
        });
        
        return true;
    }

    public async findDocByPath(path: string): Promise<Record<string, any> | null> {
        console.log(path);
        const doc = await this.collection.findOne({ path: { $eq: path } });

        return doc ? doc.data : null;
    }
}

export default Model;