import { mysqlTable, primaryKey, unique, int, varchar } from "drizzle-orm/mysql-core"

export const currencies = mysqlTable("currencies", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 45 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "currencies_id"}),
	unique("id_UNIQUE").on(table.id),
	unique("name_UNIQUE").on(table.name),
]);
