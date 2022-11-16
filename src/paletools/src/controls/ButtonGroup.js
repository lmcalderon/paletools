import { addClass, append, createElem } from "../utils/dom";

export class ButtonGroup {
    #buttonGroup;

    constructor(opts) {
        this.#buttonGroup = createElem("div", { id: opts.id, className: `button-container ${opts.className ? opts.className : ""}` });

        for(let button of opts.buttons) {
            const buttonEl = createElem("button", button.attrs, button.label);
            addClass(buttonEl, "btn-standard", "call-to-action");
            buttonEl.addEventListener("click", button.onClick);
            append(this.#buttonGroup, buttonEl);
        }
    }

    getRootElement() {
        return this.#buttonGroup;
    }
}