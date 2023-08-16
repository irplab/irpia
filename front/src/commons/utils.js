export const capitalizeFirstLetter = string => string ? string.charAt(0).toUpperCase() + string.slice(1) : '';

export const removeDuplicates = (array) => {
    return array.filter((a, b) => array.indexOf(a) === b)
}