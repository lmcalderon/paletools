import { nodeListToArray } from "./array";
import { isIterable } from "./iterable";

export function select(query, parent = document) {
    if (!query) return;

    return parent.querySelector(query);
}

export function selectAll(query, parent = document) {
    if (!query) return;

    return nodeListToArray(parent.querySelectorAll(query));
}

export function append(parent, ...children) {
    if (!parent) return;

    for (let child of children) {
        if (!child) continue;

        parent.append(child);
    }

    return children;
}

export function prepend(parent, ...children) {
    if (!parent) return;

    for (let child of children) {
        if (!child) continue;

        parent.prepend(child);
    }

    return children;
}

export function remove(elem) {
    if (!elem) return;

    if (isIterable(elem)) {
        for (let el in elem) {
            if (!el) continue;

            el.parentNode.removeChild(el);
        }
    }
    else {
        elem.parentNode.removeChild(elem);
    }

    return elem;
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
    if (!elem) return;

    if (isIterable(elem)) {
        for (let e of elem) {
            if (!e) continue;
            e.classList.add(...className);
        }
    }
    else {
        elem.classList.add(...className);
    }

    return elem;
}

export function hasClass(elem, className) {
    if (!elem) return false;

    if (elem.classList) {
        return elem.classList.contains(className);
    }

    return false;
}

export function removeClass(elem, ...className) {
    if (!elem) return;

    if (isIterable(elem)) {
        for (let e of elem) {
            if (!e) continue;
            e.classList.remove(...className);
        }
    }
    else {
        elem.classList.remove(...className);
    }

    return elem;
}

export function css(elem, css) {
    if (!elem) return;

    if (isIterable(elem)) {
        for (let el of elem) {
            if (!el) continue;

            el.style[key] = css[key];
        }
    }
    else {
        for (let key of Object.keys(css)) {
            elem.style[key] = css[key];
        }
    }

    return elem;
}

export function insertBefore(newNode, existingNode) {
    if (!newNode) return;
    if (!existingNode) return;

    existingNode.parentNode.insertBefore(newNode, existingNode);

    return newNode;
}

export function insertAfter(newNode, existingNode) {
    if (!newNode) return;
    if (!existingNode) return;

    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);

    return newNode;
}

export function detach(nodes) {
    if (!nodes) return;

    if (isIterable(nodes)) {
        for (let node of nodes) {
            if (!node) continue;

            node.parentElement.removeChild(node);
        }
    }
    else {
        nodes.parentElement.removeChild(nodes);
    }

    return nodes;
}