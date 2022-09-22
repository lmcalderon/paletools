import { isIterable } from "./iterable";

export function select(query, parent = document) {
    return parent.querySelector(query);
}

export function selectAll(query, parent = document) {
    return parent.querySelectorAll(query);
}

export function append(parent, ...children) {
    for (let child of children) {
        if (typeof child === "string") {
            parent.appendChild(document.createTextNode(child));
        }
        else if(child) {
            parent.appendChild(child);
        }
    }
}

export function remove(elem){
    if(isIterable(elem)){
        for(let el in elem){
            el.parentNode.removeChild(el);
        }
    }
    else {
        elem.parentNode.removeChild(elem);
    }
}

export function createElem(tag, attrs, html) {
    let elem = document.createElement(tag);
    if (typeof attrs === "string") {
        html = attrs;
        attrs = null;
    }

    if (attrs) {
        for (let attr of Object.keys(attrs)) {
            elem.setAttribute(attr === "className" ? "class" : attr, attrs[attr]);
        }
    }

    if (html) {
        elem.innerHTML = html;
    }

    return elem;
}

export function isVisible(elem) {
    return !isHidden(elem);
}

export function isHidden(elem) {
    if (!elem) return true;
    return elem.offsetWidth === 0 && elem.offsetHeight === 0;
}

export function addClass(elem, ...className) {
    if (isIterable(elem)) {
        for (let e of elem) {
            e.classList.add(...className);
        }
    }
    else {
        elem.classList.add(...className);
    }
}

export function removeClass(elem, ...className) {
    if (isIterable(elem)) {
        for (let e of elem) {
            e.classList.remove(...className);
        }
    }
    else {
        elem.classList.remove(...className);
    }
}

export function css(elem, css) {
    if (isIterable(elem)) {
        for (let el of elem) {
            elem.style[key] = css[key];
        }
    }
    else {
        for (let key of Object.keys(css)) {
            elem.style[key] = css[key];
        }
    }
}

export function insertBefore(newNode, existingNode) {
    if (!existingNode) return;
    existingNode.parentNode.insertBefore(newNode, existingNode);
}

export function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

export function detach(...nodes) {
    for (let node of nodes) {
        node.parentElement.removeChild(node);
    }
}