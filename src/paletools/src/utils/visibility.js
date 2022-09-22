import { addClass, removeClass } from "./dom";
import { isIterable } from "./iterable";

export function show(elem) {
    if (!elem) return;

    if (isIterable(elem)) {
        removeClass(elem, "hide");
    }
    else {
        if (elem.getRootElement) {
            elem = elem.getRootElement();
        }

        removeClass(elem, "hide");
    }
}

export function hide(elem) {
    if (!elem) return;

    if (isIterable(elem)) {
        addClass(elem, "hide");
    }
    else {
        if (elem.getRootElement) {
            elem = elem.getRootElement();
        }

        addClass(elem, "hide");
    }
}