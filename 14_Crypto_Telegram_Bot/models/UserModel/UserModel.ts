import { MySql2Database } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { users } from "../../db/schema";
import User from "./types/user";

class UserModel {
    constructor(
        private readonly db: MySql2Database
    ) {}

    async getUserByTgUserId(userId: number): Promise<User | null> {
        const result = await this.db
            .select({
                id: users.id,
                tgUserId: users.tgUserId
            }).from(users)
            .where(eq(users.tgUserId, userId));

        return result.length ? result[0] : null;
    }

    async insertUser(tgUserId: number): Promise<number> {
        const result = await this.db
            .insert(users)
            .values({ tgUserId });
        const { insertId } = result[0];

        return insertId;
    }
}

export default UserModel;