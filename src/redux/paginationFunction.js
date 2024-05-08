export const dataPagination = (dataObject, pageSize) => {
    const totalPages = Math.ceil(dataObject.length / pageSize);
    const pagedData = []
    for (let page = 0; page < totalPages; page++) {
        const startIndex = page * pageSize;
        const endIndex = startIndex + pageSize;
        const pagedArray = dataObject.slice(startIndex, endIndex);
        pagedData.push(pagedArray)
    }
    return pagedData;
}

// objectKey è la voce secondo cui applicare il sort
// reverse è un booleano
export const sortArray = (dataArray, objectKey, reverse) => {
    return dataArray.sort((a, b) => {
        const compareResult = reverse ? -1 : 1;
        if (a[objectKey] < b[objectKey]) {
            return -1 * compareResult
        }
        if (a[objectKey] > b[objectKey]) {
            return 1 * compareResult
        }
        return 0
    })
}

export const booleanSortArray = (dataArray, objectKey, reverse) => {
    function comparison(a, b) {
        if(reverse) {
            return b[objectKey] - a[objectKey]
        } else {
            return a[objectKey] - b[objectKey]
        }
    }
    return dataArray.sort(comparison);
}

export const emptyStringSortArray = (dataArray, objectKey, reverse) => {
    function comparison(a, b) {
        let firstValue = a[objectKey] !== "";
        let secondValue = b[objectKey] !== "";
        if(reverse) {
            return secondValue - firstValue
        } else {
            return firstValue - secondValue
        }
    }
    return dataArray.sort(comparison);
}