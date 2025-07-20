import { Db } from "mongodb";
import { NewUser } from "../types/user";
import { RefreshToken } from "../types/refreshToken";

async function initDatabase(db: Db) {
    const usersCollection = db.collection('users');
    const refreshTokensCollection = db.collection('refresh_tokens');

    await usersCollection.createIndex({ email: 1 }, { unique: true });

    const usersCount = await usersCollection.countDocuments();
    const refreshTokensCount = await refreshTokensCollection.countDocuments();

    if(usersCount === 0) {
        const user: NewUser = { 
            email: 'admin@example.com',
            passwordHash: 'password',
        }

        await usersCollection.insertOne(user);
    }

    if(refreshTokensCount === 0) {
        const refreshToken: RefreshToken = {
            tokenHash: 'hash',
            userId: 'userid',
            createdAt: new Date(),
            expiresAt: new Date(),
            revoked: true,
        }

        await refreshTokensCollection.insertOne(refreshToken);
    }
}

export default initDatabase;