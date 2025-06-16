import checkIsStrLast from "./checkIsStrLast";
import getNewDotPositions from "./getNewDotPositions";
import insertDots from "./insertDots";

function points(str: string): void {
    const dotsCount: number = str.length - 1;
    const strs: string[] = [str];

    for(let x = 1; x <= dotsCount; x++) {
        let isLast: boolean = false;
        let currDotPositions: number[] = [];
        let newStr: string;
        
        while(true) {
            if(currDotPositions.length != 0) {
                isLast = checkIsStrLast(currDotPositions, str.length);

                if(isLast) break;
            }

            currDotPositions = getNewDotPositions(str.length, currDotPositions, x);
            newStr = insertDots(str, currDotPositions);

            strs.push(newStr);
        }
    }

    console.log(strs);
}

points('abc');
points('abcd');
points('abcde');