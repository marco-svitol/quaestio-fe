export const dataPagination = (dataObject, pageSize) => {
    console.log('inFunction dataObject doc_num: ', dataObject)
    const totalPages = Math.ceil(dataObject.length / pageSize);
    const pagedData = []
    for (let page = 0; page < totalPages; page++) {
        const startIndex = page * pageSize;
        const endIndex = startIndex + pageSize;
        const pagedArray = dataObject.slice(startIndex, endIndex);
        pagedData.push(pagedArray)
    }
    console.log('inFunction pageData: ', pagedData)
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