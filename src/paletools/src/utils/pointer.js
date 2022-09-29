export function dispatchPointerEvent(target, eventName) {
    if(!target) return false;

    const pointerEvent = new PointerEvent(eventName, {
        bubbles: true,
        cancelable: true,
        view: window
    });
    target.dispatchEvent(pointerEvent);
    return true;
}

export function pointerDown(target){
    return dispatchPointerEvent(target, 'pointerdown');
}

export function pointerUp(target){
    return dispatchPointerEvent(target, 'pointerup');
}

export default function pointerClick(target, delay){
    if (delay) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(pointerClick(target));
            }, delay);
        });
    }
    else {
        return pointerDown(target) && pointerUp(target);
    }
}