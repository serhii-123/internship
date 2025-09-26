class Weather {
    static async getWindReply(data): Promise<string> {
        const speed: number = Math.floor(data.wind.speed);
        const reply: string = `Швидкість вітру складає ${speed} м/с`;

        return reply;
    }

    static async getReplyWithInterval(data, city: string, interval: 3 | 6): Promise<string> {
        const list = data.list;
        const timezoneOffset = data.city.timezone * 1000;
        const loopStep: number = interval / 3;
        let currentDay: string = '';
        let str: string = `Погода в місті ${city}\n\n`;

        for(let x = 0; x < list.length; x += loopStep) {
            const item = list[x];
            const dt: number = item.dt * 1000;
            const localDate: Date = new Date(dt + timezoneOffset);
            const dayName: string = localDate.toLocaleDateString('uk-UA', { weekday: 'long' });
            const time: string = localDate.toLocaleTimeString('uk-UA', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            const temp: number = Math.trunc(item.main.temp);
            const feelsLike: number = Math.trunc(item.main.feels_like);
            const description: string = item.weather[0].description;

            if(currentDay != dayName) {
                if(currentDay)
                    str += '\n';

                let formattedDay: string = localDate.toLocaleDateString('uk-UA', {
                    day: 'numeric',
                    month: 'long'
                });
                currentDay = dayName;
                str += `${dayName}, ${formattedDay}:\n`;
            }

            const timeStr: string = `  ${time}`;
            const actualTempStr: string = (temp >= 0 ? '+' : '')
                + Math.floor(temp) + ' °C'
            const feelsLikeTempStr: string = 'відчувається: '
                + (feelsLike >= 0 ? '+' : '')
                + Math.floor(feelsLike) + ' °C'
            str += timeStr
                + ', ' + actualTempStr
                + ', ' + feelsLikeTempStr
                + ', ' + description;

            str += '\n';
        }

        return str;
    }
}

export default Weather;