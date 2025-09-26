import { readFile } from "fs/promises";

class IPService {
    private readonly data: string[][] = [];
    
    constructor() {}

    async init(fileName: string) {
        const filePath: string = `${__dirname}/../public/${fileName}`;
        const fileData: string = await readFile(filePath, 'utf-8');
        const rowStrings = fileData.split('\n');

        rowStrings.forEach(item => {
            const row: string[] = item.replace(/"/g, '').split(',');
            
            this.data.push(row);
        });
    }

    async getCountryByIP(ip: string): Promise<string | undefined> {
        const ipInt: number = await this.getIntByIP(ip);

        for(let row of this.data) {
            const from: number = parseInt(row[0]);
            const to: number = parseInt(row[1]);
            const ipInRange: boolean = from <= ipInt && ipInt <= to;
            
            if(!ipInRange) continue;

            const country = row[3];

            return country
        }
    }

    private async getIntByIP(ip: string): Promise<number> {
        const octats: string[] = ip.split('.');
        let octatPower: number = 3;
        const octatInts: number[] = octats.map<number>(item => {
            const octatInt = parseInt(item) * (256 ** octatPower);
            octatPower--;

            return octatInt;
        });
        let sum = 0;

        octatInts.forEach(o => { sum += o });

        return sum;
    }
}

export default IPService;