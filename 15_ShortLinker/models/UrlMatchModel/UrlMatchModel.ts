import { MySql2Database } from "drizzle-orm/mysql2";
import { urlMatches } from "../../db/schema";
import { eq } from "drizzle-orm";

class UrlMatchModel {
    constructor(
        private readonly db: MySql2Database
    ) {}

    async getOriginalUrlByShortPath(shortPath: string): Promise<{ originalUrl: string }[]> {
        const result = await this.db
            .select({
                originalUrl: urlMatches.originalUrl
            }).from(urlMatches)
            .where(eq(urlMatches.shortPath, shortPath));

        return result;
    }

    async insertUrlMatch(originalUrl: string, shortPath: string): Promise<number> {
        const result = await this.db
            .insert(urlMatches)
            .values({ originalUrl, shortPath });
        const { insertId } = result[0];

        return insertId;
    }
}

export default UrlMatchModel;