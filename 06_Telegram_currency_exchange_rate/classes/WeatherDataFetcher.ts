import axios from "axios";

class WeatherDataFetcher {
    private weatherApiUrl: string = 'https://api.openweathermap.org/data/2.5/weather';
    private forecastApiUrl: string = 'https://api.openweathermap.org/data/2.5/forecast';
    private reqParams;

    constructor(token: string, city: string) {
        this.reqParams = {
            q: city,
            units: 'metric',
            appid: token,
            lang: 'uk'
        }
    }

    async getData(type: 'forecast' | 'weather') {
        const url = type === 'forecast' ? this.forecastApiUrl : this.weatherApiUrl;
        const res = await axios.get(url, {
            params: this.reqParams
        });
        const data = res.data;

        return data;
    }
}

export default WeatherDataFetcher;