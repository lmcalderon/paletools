import localize from "../../localization";
import { createElem } from "../../utils/dom";

const PalesnipeSettingsView = function (menus) {
    this._menus = menus;
    UTView.call(this);
}

JSUtils.inherits(PalesnipeSettingsView, UTView);

PalesnipeSettingsView.prototype._generate = function _generate() {
    if (!this.generated) {
        let container = document.createElement("div");
        container.classList.add("ut-market-search-filters-view");
        container.classList.add("floating");
        container.style["overflow-y"] = "scroll";
        container.style["display"] = "flex";
        container.style["align-items"] = "center";

        let contentContainer = document.createElement("div");
        //contentContainer.style["height"] = "100%";
        //contentContainer.classList.add("ut-pinned-list-container");
        container.appendChild(contentContainer);
        let content = document.createElement("div");
        content.classList.add("palesnipe-settings-wrapper");
        content.classList.add("ut-pinned-list");
        content.classList.add("grid");
        contentContainer.appendChild(content);

        for(let menu of this._menus){
            const menuContainer = createElem("div", { id: `paletools-settings-${menu.name}-container`, className: "tile"})
            const header = createElem("header", `<h3 class="tileHeader">${localize(menu.title)}</h3>`);
            menuContainer.appendChild(header);
            menuContainer.appendChild(menu.menu());
            content.appendChild(menuContainer);
        }

        this.__root = container;
        this.generated = true;
    }
}

export default PalesnipeSettingsView;