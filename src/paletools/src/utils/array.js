export function toArray(enumerable) {
    return Array.prototype.slice.call(enumerable);
}

export function flattenArray(arrayOfArrays) {
    return [].concat(...arrayOfArrays);
}