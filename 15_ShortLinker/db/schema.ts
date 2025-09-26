import { mysqlTable, primaryKey, unique, int, varchar } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const urlMatches = mysqlTable("url_matches", {
	id: int().autoincrement().notNull(),
	originalUrl: varchar("original_url", { length: 2048 }).notNull(),
	shortPath: varchar("short_path", { length: 6 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "url_matches_id"}),
	unique("id_UNIQUE").on(table.id),
	unique("short_path_UNIQUE").on(table.shortPath),
]);
