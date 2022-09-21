import { addClass, removeClass } from "./dom";

export function show(elem){
    if(!elem) return;

    if(elem.getRootElement){
        elem = elem.getRootElement();
    }

    removeClass(elem, "hide");
}

export function hide(elem){
    if(!elem) return;

    if(elem.getRootElement){
        elem = elem.getRootElement();
    }

    addClass(elem, "hide");
}