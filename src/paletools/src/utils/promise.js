export function isPromise(value) {
    return !!(
        value &&
        value.then &&
        typeof value.then === 'function' &&
        value?.constructor?.name === 'Promise'
    );
}