export function select(query) {
    return document.querySelector(query);
}

export function append(parent, ...children) {
    for (let child of children) {
        if (typeof child === "string") {
            parent.appendChild(document.createTextNode(child));
        }
        else {
            parent.appendChild(child);
        }
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
    elem.classList.add(...className);
}

export function removeClass(elem, ...className) {
    elem.classList.remove(className);
}

export function css(elem, css) {
    for (let key of Object.keys(css)) {
        elem.style[key] = css[key];
    }
}

export function insertBefore(newNode, existingNode) {
    if (!existingNode) return;
    existingNode.parentNode.insertBefore(newNode, existingNode);
}

export function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}