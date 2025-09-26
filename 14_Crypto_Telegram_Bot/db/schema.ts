import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, unique, int, varchar, index, foreignKey, bigint } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const currencies = mysqlTable("currencies", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 45 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "currencies_id"}),
	unique("id_UNIQUE").on(table.id),
	unique("name_UNIQUE").on(table.name),
]);

export const followingCurrencies = mysqlTable("following_currencies", {
	id: int().autoincrement().notNull(),
	currencyId: int("currency_id").notNull().references(() => currencies.id),
	userId: int("user_id").notNull().references(() => users.id),
},
(table) => [
	index("fk_following_currencies_currencies_currency_id_idx").on(table.currencyId),
	index("fk_following_currencies_users_user_id_idx").on(table.userId),
	primaryKey({ columns: [table.id], name: "following_currencies_id"}),
	unique("id_UNIQUE").on(table.id),
	unique("unique_currency_user").on(table.currencyId, table.userId),
]);

export const users = mysqlTable("users", {
	id: int().autoincrement().notNull(),
	tgUserId: bigint("tg_user_id", { mode: "number", unsigned: true }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "users_id"}),
	unique("id_UNIQUE").on(table.id),
	unique("user_id_UNIQUE").on(table.tgUserId),
]);
