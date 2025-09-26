import axios from 'axios';
import { config } from 'dotenv';
import { describe, it, expect } from 'vitest';
import ips from '../public/ips.json';
import path from 'path';

config({ path: path.resolve(__dirname, '../.env') });

const URL: string = process.env.TEST_URL as string;

async function start(url: string, ips: { [key: string]: string } | undefined) {
    if(!url)
        throw new Error('Failed to get URL. Please, check your .env file');

    if(!ips)
        throw new Error('Failed to get IPs data');

    describe('Check IP addresses', async () => {
        for(let country in ips) {
            it(`Should return the "${country}" country`, async () => {
                const ip = ips[country];
                const req = await axios.get(`${url}/country`, {
                    headers: { 'x-forwarded-for': ip }
                });
                const body = req.data;
                const expectedObj = {
                    country, ip
                };

                if(country === 'UK') {
                    const fullUKName = 'United Kingdom of Great Britain and Northern Ireland';
                    expect(body.country).toEqual(fullUKName);
                } else
                    expect(body).toEqual(expectedObj);
            });
        }
    });
}

start(URL, ips);