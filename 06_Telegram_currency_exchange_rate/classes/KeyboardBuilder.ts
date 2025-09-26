import { Keyboard } from "grammy";

class KeyboardBuilder {
    static async getMainKeyboard(): Promise<Keyboard> {
        const kb = new Keyboard()
            .text('Погода')
            .row()
            .text('Курс валют');

        return kb;
    }

    static async getWeatherKeyboard(city?: string): Promise<Keyboard> {
        let kb = new Keyboard()
            .text('Кожні 3 години')
            .text('Кожні 6 годин')
            .row()
            .text('Вітер')
            .row()

        if(city)
            kb = kb.text("Змінити місто").row();

        kb = kb.text("Попереднє меню");

        return kb;
    }
    static async getCurrencyKeyboard(): Promise<Keyboard> {
        const kb = new Keyboard()
            .text('USD')
            .text('EUR')
            .row()
            .text('Попереднє меню');
        
        return kb;
    }
}

export default KeyboardBuilder;