import { Db } from "mongodb";

class RefreshTokenModel {
    private readonly db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    async createRefreshToken(
        tokenHash: string,
        createdAt: Date,
        expiresIn: Date,
        userId: string
    ) {
        const collection = this.db.collection('refresh_tokens');
        const insertObj = { tokenHash, createdAt, expiresIn, userId };

        const { insertedId: id } = await collection.insertOne(insertObj);

        return id;
    }
}

export default RefreshTokenModel;