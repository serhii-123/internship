export default function getNewDotPositions(
    strLength: number,
    dotPositions: number[],
    dotQuantity: number,
): number[] {
    let newDotPositions: number[] = [...dotPositions];
    let lastItem: number = dotPositions[dotPositions.length - 1];
    
    if(dotPositions.length === 0) {
        for(let x = 1; x <= dotQuantity; x++) {
            newDotPositions.push(x);
        }

        return newDotPositions;
    }

    if(lastItem < strLength - 1) {
        lastItem += 1;
        newDotPositions[dotPositions.length - 1] = lastItem;

        return newDotPositions;
    }
    
    let currDotIndex = newDotPositions.length - 1;

    while(currDotIndex != -1) {
        let dotPos: number = newDotPositions[currDotIndex];

        if(dotPos === ( strLength - newDotPositions.length + currDotIndex )) {
            currDotIndex--;
            continue;
        }

        newDotPositions[currDotIndex] = ++dotPos;

        for(let x = currDotIndex + 1; x < newDotPositions.length; x++) {
            newDotPositions[x] = ++dotPos;
        }
        
        break;
    }

    return newDotPositions;
}