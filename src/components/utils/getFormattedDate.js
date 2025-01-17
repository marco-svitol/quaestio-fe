const getFormattedDate = (string) => {
    const y = string[0] + string[1] + string[2] + string[3];
    const m = string[4] + string[5];
    const d = string[6] + string[7];
    return (`${y} - ${m} - ${d}`);
}

export default getFormattedDate