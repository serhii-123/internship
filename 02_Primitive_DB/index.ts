import { input, select, confirm } from "@inquirer/prompts";
import { User } from "./User";
import { Gender } from "./Gender";

async function start() {
    const users: User[] = [];
    const genderСonfig = {
        message: 'Select a gender',
        choices: [
        {
            name: 'Male',
            value: 'Male',
        },
        {
            name: 'Female',
            value: 'Female',
        }
    ]};
    let currentOperation: string = 'create'
    while(true) {
        if(currentOperation === 'create') {
            console.log('Creating a new user');

            const name: string = await input({ message: 'Enter a name' });

            if(!name) {
                currentOperation = 'find';
                continue;
            }

            const gender: Gender = await select(genderСonfig) as Gender;
            const age: number = parseInt(await input({
                message: 'Enter an age',
                validate: validateAge,
            }));

            users.push({ name, gender, age});

            console.log('User was created');
        } else {
            const continueOrNot: boolean = await confirm({
                message: 'Do you want to find a user by name?' }
            );

            if(!continueOrNot)
                return;

            const name: string = await input({ message: 'Enter a name'});
            const user: User | undefined = users.find(u => u.name === name);

            if(!user) {
                console.log('There\'s no user with entered name');
            } else {
                console.log(`Name: ${user.name}\nGender: ${user.gender}\nAge: ${user.age}`);
            }
        }
    }
}

async function validateAge(age: string): Promise<boolean> {
    return !!/^\d+$/.test(age)
        && parseInt(age) <= 100
        && parseInt(age) >= 0;
}

start();