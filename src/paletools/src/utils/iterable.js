export function isIterable(target){
    if(!target) return false;

    return typeof target[Symbol.iterator] === "function";
}

