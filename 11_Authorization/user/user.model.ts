import { Collection, Db } from "mongodb";
import { NewUserDb, UserDb, UserOutput } from "./user.type";

class UserModel {
    private collection: Collection<UserDb>;

    constructor(db: Db) {
        this.collection = db.collection('users');
    }

    async createUser(email: string, passwordHash: string): Promise<string> {
        const insertObj: NewUserDb = { email, passwordHash };
        const result = await this.collection.insertOne(insertObj as UserDb);
        const id = result.insertedId.toString();

        return id;
    }

    async getUserByEmail(email: string): Promise<UserOutput | null> {
        const doc = await this.collection.findOne({ email });
        
        if(!doc) return null;

        const user = await this.convertUser(doc);

        return user;
    }

    private async convertUser(doc: UserDb): Promise<UserOutput> {
        const user = {
            id: doc._id.toString(),
            email: doc.email,
            passwordHash: doc.passwordHash
        };

        return user;
    }
}

export default UserModel;