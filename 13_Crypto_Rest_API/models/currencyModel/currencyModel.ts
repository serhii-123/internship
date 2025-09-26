import { MySql2Database } from "drizzle-orm/mysql2";
import Currency from "./types/currency";
import { currencies } from "../../db/schema";
import { eq, sql } from "drizzle-orm";

class CurrencyModel {
    constructor(
        private readonly db: MySql2Database,
    ) {}

    async getCurrencies(): Promise<Currency[]> {
        const result = await this.db
            .select()
            .from(currencies);

        return result;
    }

    async getCurrencyByName(name: string): Promise<Currency | null> {
        const result = await this.db
            .select()
            .from(currencies)
            .where(eq(sql`(lower(${currencies.name}))`, name.toLowerCase()));

        return result.length ? result[0] : null;
    }
}

export default CurrencyModel;