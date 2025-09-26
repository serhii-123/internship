import { readFile, writeFile } from "fs/promises";
import NewVacation from "./NewVacation";
import OldVacation from "./OldVacation";

const fileName: string = 'vacations.json';

async function start(fileName: string) {
    const filePath: string = `${__dirname}/${fileName}`;
    const fileContent: string = await readFile(filePath, 'utf-8');
    const vacations: OldVacation[] = JSON.parse(fileContent);
    const newVacations: NewVacation[] = [];

    for(let obj of vacations) {
        const userId: string = obj.user._id;
        const name: string = obj.user.name;
        const vacDates = {
            startDate: obj.startDate,
            endDate: obj.endDate
        };
        const existedVacation = newVacations.find(o => o.userId === userId);

        if(existedVacation) {
            existedVacation.weekendDates.push(vacDates);

            continue;
        }

        const newVacation: NewVacation = {
            userId,
            name,
            weekendDates: [vacDates]
        };

        newVacations.push(newVacation);
    }

    const newVacationsStr: string = JSON.stringify(newVacations);

    await writeFile('result.json', newVacationsStr);

    console.log(newVacations);
}

start(fileName);