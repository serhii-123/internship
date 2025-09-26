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
        const wordsArr: string[] = arr.filter(s => !/^\d+(\.\d+)?$/.test(s));
        const result: string[] = [];
        
        wordsArr.map(s => {
            if(!result.includes(s))
                result.push(s);
        });

        return result;
    }

    static async getUniqueElements(arr: string[]): Promise<string[]> {
        const result: string[] = [];
        
        arr.map(s => {
            if(!result.includes(s))
                result.push(s);
        });

        return result;
    }
}

export default Operations;