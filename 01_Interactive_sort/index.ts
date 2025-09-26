import { createInterface, Interface } from "readline/promises";
import Op from "./Operations";

type OptionsHandlers = {
    [key: string]: (arr: string[]) => Promise<string[]>;
}

async function start() {
    const optionsHandlers: OptionsHandlers = {
        'a. Sort the words alphabetically.': Op.sortWordsAlphabetically,
        'b. Display the numbers in ascending order.': Op.sortNumbersInAscendingOrder,
        'c. Display the numbers in descending order.': Op.sortNumbersInDescendingOrder,
        'd. Display the words in ascending order based on the number of letters in each word.': Op.sortWordsBasedOnNumberOfLetters,
        'e. Show only unique words.': Op.getUniqueWords,
        'f. Show only the unique values from the entire set of words and numbers.': Op.getUniqueElements
    };
    const options = Object.keys(optionsHandlers);
    console.clear();
    
    const rl: Interface = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    while(true) {
        const answer:string = await rl.question('Enter 10 words and numbers or "exit" \n');
        
        if(answer === 'exit')
            process.exit(0);
        
        const values: string[] = answer.split(' ');

        if(values.length != 10) {
            console.log('Invalid input. You should enter 10 words and numbers');
            continue;
        }

        const option = await getSortingOption(rl, options);
        const result: string[] = await optionsHandlers[option](values);

        console.log('Result: ');
        result.map(s => console.log(s));
    }
}

async function getSortingOption(rl: Interface, options: string[]): Promise<string> {
    while(true) {
        console.log('Enter the option:');
        options.map(o => console.log(o));

        const answer = await rl.question('\n');
        const findedOption = options?.find(el => el[0] === answer);

        if(findedOption) return findedOption;
        
        console.log('Invalid input. Try again');
    }
}

start();