import { CurrencyData } from "../types";

class CurrencyMsgBuilder {
    static async getMessage(data: CurrencyData): Promise<string> {
        const bankStr = `Дані взяті з банку "${(data.bank === 'monobank') ? 'Монобанк' : 'Приватбанк'}"`;
        const rateBuyStr = `Курс купівлі ${data.currency}: ${data.rateBuy} UAH`;
        const rateSellStr = `Курс продажу ${data.currency}: ${data.rateSell} UAH`;
        const reply: string = `${bankStr}\n${rateBuyStr}\n${rateSellStr}`;

        return reply;
    }
}

export default CurrencyMsgBuilder;