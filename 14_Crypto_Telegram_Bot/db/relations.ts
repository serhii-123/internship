import { relations } from "drizzle-orm/relations";
import { currencies, followingCurrencies, users } from "./schema";

export const followingCurrenciesRelations = relations(followingCurrencies, ({one}) => ({
	currency: one(currencies, {
		fields: [followingCurrencies.currencyId],
		references: [currencies.id]
	}),
	user: one(users, {
		fields: [followingCurrencies.userId],
		references: [users.id]
	}),
}));

export const currenciesRelations = relations(currencies, ({many}) => ({
	followingCurrencies: many(followingCurrencies),
}));

export const usersRelations = relations(users, ({many}) => ({
	followingCurrencies: many(followingCurrencies),
}));