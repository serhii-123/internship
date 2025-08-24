import { MySql2Database } from "drizzle-orm/mysql2";
import { followingCurrencies } from "../../db/schema";
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
}

export default FollowingCurrencyModel;