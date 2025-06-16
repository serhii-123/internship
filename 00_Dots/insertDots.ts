export default function insertDots(str: string, positions: number[]): string {
    let newStr = str;
    let indent = 0;
    
    for(let x = 0; x < positions.length; x++) {
        newStr = newStr.slice(0, positions[x] + indent) + '.' + newStr.slice(positions[x] + indent);
        indent++;
    }

    return newStr;
}