import { Collection, Db, ObjectId } from "mongodb";
import { NewSessionDb, SessionDb, SessionOutput } from "./session.type";

class Session {
    private readonly db: Db;
    private readonly collection: Collection<SessionDb>;

    constructor(db: Db) {
        this.db = db;
        this.collection = db.collection('sessions');
    }

    async createSession(
        tokenHash: string,
        userId: string,
        createdAt: Date,
        expiresIn: Date,
    ) {
        const insertObj: NewSessionDb = {
            tokenHash,
            createdAt,
            expiresIn,
            userId,
            revoked: true
        };
        const insertedId = await this.collection.insertOne(insertObj as SessionDb);
        const id = insertedId.insertedId.toString();
        
        return id;
    }

    async getSessionById(id: string): Promise<SessionOutput | undefined> {
        const doc = await this.collection.findOne({ _id: new ObjectId(id) });

        if(!doc) return;

        const session = await this.convertSession(doc);

        return session;
    }

    async convertSession(doc: SessionDb): Promise<SessionOutput> {
        const session: SessionOutput = {
            id: doc._id.toString(),
            tokenHash: doc.tokenHash,
            userId: doc.userId,
            createdAt: doc.createdAt,
            expiresIn: doc.expiresIn,
            revoked: doc.revoked
        }

        return session;
    }
}

export default Session;