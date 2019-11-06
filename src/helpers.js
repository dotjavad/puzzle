import shuffle from 'shuffle-array';

const getIndexOf = (arr, k) => {
    for (var i = 0; i < arr.length; i++) {
        var index = arr[i].indexOf(k);
        if (index > -1) {
            return [i, index];
        }
    }
}

const startItems = (items, arrD) => {

    let rndItems = shuffle(items.flat());
    let finalItems = [];

    for (let i = 0; i < rndItems.length; i += Number(arrD)) {
        finalItems.push(rndItems.slice(i, i + Number(arrD)));
    }

    return finalItems;
}

export { getIndexOf, startItems };