import axios from "axios";

async function shortenLink(url: string) {
    const reqBody = { url };
    const reqUrl: string = 'https://tinyurl.com/create';
    const res = await axios.post(reqUrl, reqBody);
    const shortUrl = res.data.data.tiny_url;

    return shortUrl;
}

export default shortenLink;