import { addClass, removeClass } from "./dom";
import { isIterable } from "./iterable";

export function show(elem) {
    if (!elem) return;

    if (isIterable(elem)) {
        removeClass(elem, "hide");
        for(let el of elem){
            if(el.style.display === "none"){
                el.style.display = "";
            }
        }
    }
    else {
        removeClass(elem, "hide");
        if(elem.style.display === "none"){
            elem.style.display = "";
        }
    }
    
    return elem;
}

export function hide(elem) {
    if (!elem) return;

    if (isIterable(elem)) {
        addClass(elem, "hide");
    }
    else {
        addClass(elem, "hide");
    }

    return elem;
}