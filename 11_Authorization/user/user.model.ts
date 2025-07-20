import { Db } from "mongodb";
import { NewUser } from "../types/user";

class UserModel {
    private db: Db;

    constructor(db: Db) {
        this.db = db;
    }
    async createUser(email: string, passwordHash: string): Promise<string> {
        const insertObj: NewUser = { email, passwordHash };
        const userCollection = this.db.collection('users');
        const result = await userCollection.insertOne(insertObj);
        const id = result.insertedId.toString();

        return id;
    }
}

export default UserModel;