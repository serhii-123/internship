import http from 'k6/http';
import { check, sleep } from 'k6';
import { random } from 'lodash-es';

const FIRST_STORE_ID = 1;
const LAST_STORE_ID = 5;
const LAMBDA_URL ="https://1na9d4z679.execute-api.eu-central-1.amazonaws.com/default/handle-new-user"

export const options = {
  stages: [
    { duration: '20s', target: 30 },
    { duration: '20s', target: 60 },
    { duration: '10s', target: 75 },
    { duration: '15m', target: 75 },
    { duration: '30s', target: 0 },
  ],
};

export default async function () {
    const username = await UsernameGenerator.generate();
    const store_id = random(FIRST_STORE_ID, LAST_STORE_ID);

    const payload = JSON.stringify({
        username, store_id,
    });

  const headers = { 'Content-Type': 'application/json' };
  const res = http.post(LAMBDA_URL, payload, { headers });

  const isOk = check(res, {
    'Status is 200': (r) => r.status === 200 || r.status === 400,
  });

  if (!isOk && (typeof res.body === 'string'))
    console.error(`❌ Failed request: ${res.status} - ${res.body?.substring(0, 200)}`);

  sleep(1);
}

class UsernameGenerator {
    private static readonly charCodes = [
        48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
        65, 66, 67, 68, 69, 70, 71, 72, 73, 74,
        75, 76, 77, 78, 79, 80, 81, 82, 83, 84,
        85, 86, 87, 88, 89, 90, 97, 98, 99, 100,
        101, 102, 103, 104, 105, 106, 107, 108,
        109, 110, 111, 112, 113, 114, 115, 116,
        117, 118, 119, 120, 121, 122
    ];

    static async generate(): Promise<string> {
        const charCodesLength = this.charCodes.length;
        const randomPathLength = 10;
        let username: string = 'user_'

        for(let x = 0; x < randomPathLength; x++) {
            const charCodeIndex = random(0, charCodesLength -1);
            const charCode = this.charCodes[charCodeIndex] as number;
            const char = String.fromCharCode(charCode);
            username += char;
        }

        return username;
    }
}