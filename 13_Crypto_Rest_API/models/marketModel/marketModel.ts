import { MySql2Database } from "drizzle-orm/mysql2";
import Market from "./types/market";
import { markets } from "../../db/schema";
import { eq, sql } from "drizzle-orm";

class MarketModel {
    constructor(
        private readonly db: MySql2Database
    ) {}

    async getMarketByName(name: string): Promise<Market | null> {
        const result = await this.db
            .select()
            .from(markets)
            .where(eq(sql`(lower(${markets.name}))`, name.toLowerCase()));

        return result.length ? result[0] : null;
    }
}

export default MarketModel;