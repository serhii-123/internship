import fs from 'fs/promises';

class Analyser {
    static async countUniqueUsernames(dir: string): Promise<number> {
        const usernamesSet: Set<string> = new Set();
        const fileNames: string[] = await fs.readdir(__dirname + '/' + dir);
        let uniqueUsernamesCount: number = 0;
        
        for(let fileName of fileNames) {
            const filePath: string = `${__dirname}/${dir}/${fileName}`;
            const fileContent: string = await fs.readFile(filePath, 'utf-8');
            const usernamesArr: string[] = fileContent.split('\n');
    
            for(let username of usernamesArr) {
                if(!usernamesSet.has(username)) {
                    uniqueUsernamesCount++;
                    usernamesSet.add(username);
                }
            }
        }

        return uniqueUsernamesCount;
    }

    static async countUsernamesAtleast10Times(dir: string): Promise<number> {
        const usernameSets: Set<string>[] = [];
        const fileNames: string[] = await fs.readdir(__dirname + '/' + dir);
        let usernamesCount: number = 0;

        for(let fileName of fileNames) {
            const filePath: string = `${__dirname}/${dir}/${fileName}`;
            const fileContent: string = await fs.readFile(filePath, 'utf-8');
            const usernamesArr: string[] = fileContent.split('\n');
            const newSet: Set<string> = new Set(usernamesArr);

            usernameSets.push(newSet);
        }

        let firstSet: Set<string> = usernameSets[0];
        
        outerLoop: for(let item of firstSet) {
            let foundedCopies: number = 0;

            for(let x = 1; x < usernameSets.length; x++) {
                if(foundedCopies === 10) {
                    usernamesCount++;
                    
                    continue outerLoop;
                };

                if(usernameSets[x].has(item))
                    foundedCopies++;
            }
        }

        return usernamesCount;
    }

    static async countCommonUsernames(dir: string): Promise<number> {
        const usernameSets: Set<string>[] = [];
        const fileNames: string[] = await fs.readdir(__dirname + '/' + dir);
        let usernamesCount: number = 0;

        for(let fileName of fileNames) {
            const filePath: string = `${__dirname}/${dir}/${fileName}`;
            const fileContent: string = await fs.readFile(filePath, 'utf-8');
            const usernamesArr: string[] = fileContent.split('\n');
            const newSet: Set<string> = new Set(usernamesArr);

            usernameSets.push(newSet);
        }

        let firstSet: Set<string> = usernameSets[0];
        
        outerLoop: for(let item of firstSet) {
            for(let x = 1; x < usernameSets.length; x++) {
                if(!usernameSets[x].has(item))
                    continue outerLoop;
            }

            usernamesCount++;
        }

        return usernamesCount;
    }
}

export default Analyser;