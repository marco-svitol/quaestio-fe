export const dataPagination = (dataObject, pageSize) => {
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