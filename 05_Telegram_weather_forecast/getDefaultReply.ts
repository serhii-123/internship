async function getDefaultReply(data): Promise<string> {
    const {temp, feels_like: feelsLike} = data.main;
    const description: string = data.weather[0].description;
    const replyStr: string = 'Погода на зараз в Житомирі\n\n'
        + (temp >= 0 ? '+' : '')
        + Math.floor(temp) + ' °C, '
        + 'відчувається: '
        + (feelsLike >= 0 ? '+' : '')
        + Math.floor(feelsLike) + ' °C, '
        + description;

    return replyStr;
}

export default getDefaultReply;