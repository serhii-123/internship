class Operations {
    static async sortWordsAlphabetically(arr: string[]): Promise<string[]> {
        return arr
            .filter(s => !/^\d+(\.\d+)?$/.test(s))
            .sort((a, b) => a.localeCompare(b));
    }

    static async sortNumbersInAscendingOrder(arr: string[]): Promise<string[]> {
        return arr
            .filter(s => /^\d+(\.\d+)?$/.test(s))
            .sort((a, b) => parseFloat(a) - parseFloat(b));
    }

    static async sortNumbersInDescendingOrder(arr: string[]): Promise<string[]> {
        return arr
            .filter(s => /^\d+(\.\d+)?$/.test(s))
            .sort((a, b) => parseFloat(b) - parseFloat(a));
    }

    static async sortWordsBasedOnNumberOfLetters(arr: string[]): Promise<string[]> {
        return arr
            .filter(s => !/^\d+(\.\d+)?$/.test(s))
            .sort((a, b) => a.length - b.length);
    }

    static async getUniqueWords(arr: string[]): Promise<string[]> {
        return arr
            .filter(s => !/^\d+(\.\d+)?$/.test(s))
            .filter((s, i) => (
                arr.filter((str, ind) => str == s && ind != i).length == 0
            ));
    }

    static async getUniqueElements(arr: string[]): Promise<string[]> {
        return arr.filter((s, i) => (
            arr.filter((str, ind) => str == s && ind != i).length == 0
        ));
    }
}

export default Operations;