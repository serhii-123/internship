import { createInterface, Interface, Readline } from "readline/promises";

async function start() {
    console.clear();
    
    const rl: Interface = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const firstAnswer:string = await rl.question('Enter 10 words and numbers\n');
    const values: string[] = firstAnswer.split(' ');
    const option = await getSortingOption(rl);

    console.clear();
}

async function getSortingOption(rl: Interface): Promise<string> {
    const options = [
        'a. Sort the words alphabetically.',
        'b. Display the numbers in ascending order.',
        'c. Display the numbers in descending order.',
        'd. Display the words in ascending order based on the number of letters in each word.',
        'e. Show only unique words.',
        'f. Show only the unique values from the entire set of words and numbers entered by the user.'
    ];

    while(true) {
        console.log('Enter the option:');
        options.map(o => console.log(o));

        const answer = await rl.question('Enter one option\n');
        const findedOption = options?.find(el => el[0] === answer);

        if(findedOption) return findedOption;

        console.clear();

        console.log('Invalid input. Try again');
    }
}

start();