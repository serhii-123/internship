import { MySql2Database } from "drizzle-orm/mysql2";
import { currencies, followingCurrencies, users } from "../../db/schema";
import { and, eq } from "drizzle-orm";

class FollowingCurrencyModel {
    constructor(
        private readonly db: MySql2Database
    ) {}

    async insertFollowingCurrency(currencyId: number, userId: number): Promise<number> {
        const result = await this.db
            .insert(followingCurrencies)
            .values({
                currencyId,
                userId
            });
        const { insertId } = result[0];

        return insertId;
    }

    async deleteFollowingCurrencyByCurrencyUserIds(
        currencyId: number,
        userId: number
    ): Promise<number> {
        const result = await this.db
            .delete(followingCurrencies)
            .where(
                and(
                    eq(followingCurrencies.currencyId, currencyId),
                    eq(followingCurrencies.userId, userId)
                )
            );
        const { affectedRows } = result[0];

        return affectedRows;
    }

    async getCurrencyNamesByUserId(userId: number) {
        const result = await this.db
            .select({
                name: currencies.name
            }).from(followingCurrencies)
            .innerJoin(currencies, eq(followingCurrencies.currencyId, currencies.id))
            .innerJoin(users, eq(followingCurrencies.userId, users.id))
            .where(eq(users.tgUserId, userId));
        
        return result;
    }
}

export default FollowingCurrencyModel;