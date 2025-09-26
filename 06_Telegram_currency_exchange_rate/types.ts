import { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { Context, SessionFlavor } from "grammy";
import SessionData from "./interfaces/SessionData";

type MyContext = ConversationFlavor<Context> & SessionFlavor<SessionData>;
type MyConversation = Conversation<MyContext, Context>;

type Bank = 'privatbank' | 'monobank'
type CurrencyResponse = {
    response: any,
    bank: Bank
}
type CurrencyData = {
    currency: 'USD' | 'EUR',
    rateBuy: string,
    rateSell: string,
    bank: Bank
};

export {
    MyContext,
    MyConversation,
    CurrencyResponse,
    CurrencyData
};