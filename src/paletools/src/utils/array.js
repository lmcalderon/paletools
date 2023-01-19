export function toArray(enumerable) {
    return Array.prototype.slice.call(enumerable);
}

export function flattenArray(arrayOfArrays) {
    return [].concat(...arrayOfArrays);
}

export function groupBy(input, groupFunc, selector) {
    return input.reduce((acc, currentValue) => {
        let groupKey = groupFunc(currentValue);
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }
        acc[groupKey].push(selector(currentValue));
        return acc;
    }, {});
};