import { addLabelWithTextInputWithKeyPress, addLabelWithToggle } from "../../controls";
import localize from "../../localization";
import { getAllKeyboardActions, updateKeyboardAction } from "../../services/keyboard";
import settings, { saveConfiguration } from "../../settings";
import { createElem } from "../../utils/dom";
import { getObjectPropertyValueByPath, setObjectPropertyByPath } from "../../utils/object";

const cfg = settings.plugins.snipe;
export default function menu() {

    function input(container, path) {
        inputRaw(container, 
            `plugins.snipe.settings.${path.replace('buttons.', '')}`, 
            () => getObjectPropertyValueByPath(cfg, path), 
            (oldValue, newValue) => setObjectPropertyByPath(cfg, path, newValue));
    }

    function inputRaw(container, locale, getter, setter) {
        const value = getter();
        addLabelWithTextInputWithKeyPress(container, locale, value, (elem, code) => {
            setter(elem.value, code);
            elem.value = code;
            saveConfiguration();
        }, null, true);
    }

    function toggle(container, path, displayWarning, locale) {
        const value = getObjectPropertyValueByPath(cfg, path)
        addLabelWithToggle(container, locale || `plugins.snipe.settings.${path.replace('buttons.', '')}`, value, toggleState => {
            if (toggleState && displayWarning && !confirm(localize("plugins.dangerous"))) {
                return false;
            }

            setObjectPropertyByPath(cfg, path, toggleState);
            saveConfiguration();
        });
    }


    let container = document.createElement("div");

    let generalContainer = document.createElement("div");
    input(generalContainer, "buttons.enableDisable");
    toggle(generalContainer, "buttons.results.pressEnter");
    toggle(generalContainer, "oneTouch.isEnabled", true);
    toggle(generalContainer, "oneTouch.displayMinBid");
    toggle(generalContainer, "oneTouch.displayMinBuy");
    toggle(generalContainer, "oneTouch.superMode", true);
    //toggle(generalContainer, "legacyMode");

    let searchContainer = document.createElement("div");
    input(searchContainer, "buttons.back");
    input(searchContainer, "buttons.search.search");
    input(searchContainer, "buttons.results.buy");
    input(searchContainer, "buttons.search.resetBid");
    input(searchContainer, "buttons.results.bid");
    input(searchContainer, "buttons.results.transfer");
    input(searchContainer, "buttons.results.club");
    input(searchContainer, "buttons.results.sell");
    input(searchContainer, "buttons.results.compare");
    input(searchContainer, "buttons.lists.up");
    input(searchContainer, "buttons.lists.down");
    input(searchContainer, "buttons.lists.prev");
    input(searchContainer, "buttons.lists.next");
    // add autopress enter setting

    let bidContainer = document.createElement("div");
    input(bidContainer, "buttons.search.decMinBid");
    input(bidContainer, "buttons.search.incMinBid");
    input(bidContainer, "buttons.search.decMaxBid");
    input(bidContainer, "buttons.search.incMaxBid");
    input(bidContainer, "buttons.search.decMinBuy");
    input(bidContainer, "buttons.search.incMinBuy");
    input(bidContainer, "buttons.search.decMaxBuy");
    input(bidContainer, "buttons.search.incMaxBuy");
    input(bidContainer, "buttons.search.oneTouchMinBid");
    input(bidContainer, "buttons.search.oneTouchMinBuy");

    let customContainer = createElem("div");
    for (const action of getAllKeyboardActions()) {
        inputRaw(customContainer, action.locale, action.getKeyCode, (prevValue, newValue) => {
            updateKeyboardAction(prevValue, action.name, newValue);
        });
    }

    container.appendChild(generalContainer);
    container.appendChild(searchContainer);
    container.appendChild(bidContainer);
    container.appendChild(customContainer);

    return container;
}