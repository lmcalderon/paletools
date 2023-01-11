import { getRealElement } from "./dom";
import { isIterable } from "./iterable";

export function show(elem) {
    if (!elem) return;

    function removeDisplayNone(el) {
        el = getRealElement(el); 
        if(el.style.display.indexOf("none") > -1){
            el.style.removeProperty("display");
        }
        if(el.dataset.originalDisplay) {
            el.style.display = el.dataset.originalDisplay;
            delete el.dataset.originalDisplay;
        }
    }

    if (isIterable(elem)) {
        for(let el of elem){
            removeDisplayNone(el);
        }
    }
    else {
        removeDisplayNone(elem);
    }
    
    return elem;
}

export function hide(elem) {
    if (!elem) return;

    function addDisplayNone(el) {
        el = getRealElement(el); 
        const originalDisplay = el.style.getPropertyValue("display");
        if(originalDisplay){
            el.dataset.originalDisplay = originalDisplay;
        }
        el.style.setProperty("display", "none", "important");
    }

    if (isIterable(elem)) {
        for(let el of elem){
            addDisplayNone(el);
        }
    }
    else {
        addDisplayNone(elem);
    }

    return elem;
}