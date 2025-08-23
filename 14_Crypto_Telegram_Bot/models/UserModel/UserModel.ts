import { MySql2Database } from "drizzle-orm/mysql2";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

class UserModel {
    constructor(
        private readonly db: MySql2Database
    ) {}

    async getUserByUserId(userId: number) {
        const result = await this.db.select({
            id: users.id,
            userId: users.userId
        }).from(users)
        .where(eq(users.userId, userId));

        return result.length ? result[0] : null;
    }
}

export default UserModel;