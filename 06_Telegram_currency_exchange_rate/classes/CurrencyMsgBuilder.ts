class CurrencyMsgBuilder {
    static async getMessage(data, currency: string): Promise<string> {
        const reply = `Курс купівлі ${currency}: ${data.rateBuy} UAH\n`
            + `Курс продажу ${currency}: ${data.rateSell} UAH`;

        return reply;
    }
}

export default CurrencyMsgBuilder;