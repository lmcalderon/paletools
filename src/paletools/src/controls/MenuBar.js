import { on } from "../events";
import { addClass, append, createElem, removeClass } from "../utils/dom";

export class MenuBar {
    #menu;

    constructor(opts) {
        this.#menu = createElem("div", { className: "ea-filter-bar-view" });
        const menuContainer = createElem("div", { className: "menu-container" });

        const buttons = [];
        for (let menuItem of opts.menuItems) {
            const button = createElem("button", { id: menuItem.id, className: `ea-filter-bar-item-view ${menuItem.selected ? "selected" : ""}` }, menuItem.text);
            append(menuContainer, button);

            on(button, "mouseover", ev => {
                removeClass(buttons, "hover");
                addClass(ev.target, "hover");
            });

            on(button, "click", ev => {
                removeClass(buttons, "selected");
                addClass(ev.target, "selected");
                if (opts.onItemSelected) {
                    opts.onItemSelected(menuItem);
                }
            });

            buttons.push(button);
        }

        append(this.#menu, menuContainer);
    }

    getRootElement() {
        return this.#menu;
    }
}