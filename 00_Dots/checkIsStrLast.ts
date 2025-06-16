export default function checkIsStrLast(
    dotIndexes: number[],
    strLength: number
): boolean {
    return ( strLength - dotIndexes.length ) === dotIndexes[0];
}