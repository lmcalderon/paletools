import { append, createElem } from "../utils/dom";

export default class TableLayout {
    #container;

    constructor(parentElement, attrs) {
        this.#container = createElem("div", attrs);
        append(parentElement, this.#container);
    }

    addRow() {
        return new RowBuilder(this.#container);
    }

    getRootElement() {
        return this.#container;
    }
}

class RowBuilder {
    #rowDiv
    constructor(container) {
        this.#rowDiv = createElem("div", { className: "row" });
        append(container, this.#rowDiv);
    }

    addColumn(colSpan = 1) {
        return new ColumnBuilder(this.#rowDiv, colSpan);
    }

    getRootElement() {
        return this.#rowDiv;
    }
}

class ColumnBuilder {
    #columnDiv;
    constructor(container, colSpan) {
        this.#columnDiv = createElem("div", { className: colSpan > 1 ? "double-column" : "column" });
        append(container, this.#columnDiv);
    }

    getRootElement() {
        return this.#columnDiv;
    }
}