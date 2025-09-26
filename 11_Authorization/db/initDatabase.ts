import { Db } from "mongodb";
import { NewUser } from "../types/user";
import { Session } from "../types/session";

async function initDatabase(db: Db) {
    const usersCollection = db.collection('users');
    const sessionsCollection = db.collection('sessions');

    await usersCollection.createIndex({ email: 1 }, { unique: true });

    const usersCount = await usersCollection.countDocuments();
    const refreshTokensCount = await sessionsCollection.countDocuments();

    if(usersCount === 0) {
        const user: NewUser = { 
            email: 'admin@example.com',
            passwordHash: 'password',
        }

        await usersCollection.insertOne(user);
    }

    if(refreshTokensCount === 0) {
        const refreshToken: Session = {
            tokenHash: 'hash',
            userId: 'userid',
            createdAt: new Date(),
            expiresIn: new Date(),
            revoked: true,
        }

        await sessionsCollection.insertOne(refreshToken);
    }
}

export default initDatabase;