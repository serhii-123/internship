function dots(str: string) {
    let arr: string[] = [];

    arr.push(str);

    for(let x = 0; x < str.length - 1; x++) {
        let char = str[x];
        const currentArrLength = arr.length;
        
        for(let y = 0; y < currentArrLength; y++) {
            let arrEl = arr[y];
            let charIndex = arrEl.indexOf(char)
            let newStr = arrEl.slice(0, charIndex + 1) + '.' + arrEl.slice(charIndex + 1);

            arr.push(newStr);
        }
    }

    console.log(arr);
}

dots('ab');
dots('abc');
dots('abcd');
dots('abcde');