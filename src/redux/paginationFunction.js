export const dataPagination = (dataObject, pageSize) => {
    console.log('dataObject: ', dataObject);
    /* const pageSize = 8; */
    const totalPages = Math.ceil(dataObject.length / pageSize); //
    const pagedData = []
    for (let page = 0; page < totalPages; page++) {
        const startIndex = page * 8;
        const endIndex = startIndex + pageSize;
        const pagedArray = dataObject.slice(startIndex, endIndex);
        pagedData.push(pagedArray)
    }
    return pagedData;
}