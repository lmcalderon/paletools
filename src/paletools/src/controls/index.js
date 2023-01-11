import UTLabelWithTextInputWithKeyPressControl from "./UTLabelWithTextInputWithKeyPressControl";
import UTLabelWithToggleControl from "./UTLabelWithToggleControl";
import localize from "../localization";
import UTLabelWithLinkControl from "./UTLabelWithLinkControl";
import UTLabelWithTextInputControl from "./UTLabelWithTextInputControl";
import { append } from "../utils/dom";


function loc(key) {
    const value = localize(key);
    return value.charAt(0) === "*" ? value.substring(1) : value;
}

export function addLabelWithTextInputWithKeyPress(container, labelLocaleKey, defaultValue, onInputChange, inputId, addClearButton) {
    const labelWithInput = new UTLabelWithTextInputWithKeyPressControl();
    if(addClearButton){
        labelWithInput.addClearButton(addClearButton);
    }
    labelWithInput.setLabel(loc(labelLocaleKey));
    if(inputId){
        labelWithInput.setInputId(inputId);
    }

    labelWithInput.setInputValue(defaultValue);
    labelWithInput.onInputChange(onInputChange);
    append(container, labelWithInput);
}

export function addLabelWithTextInput(container, lableLocaleKey, onKeyDown){
    const labelWithInput = new UTLabelWithTextInputControl();
    labelWithInput.setLabel(loc(lableLocaleKey));
    labelWithInput.onKeyDown(onKeyDown);

    append(container, labelWithInput);
}

export function addLabelWithLink(container, labelLocaleKey, linkLocaleKey, linkUrl) {
    const labelWithLink = new UTLabelWithLinkControl();
    labelWithLink.setLabel(loc(labelLocaleKey));
    labelWithLink.setLinkText(loc(linkLocaleKey));
    labelWithLink.setLinkUrl(linkUrl);

    append(container, labelWithLink);
}

export function addLabelWithToggle(container, labelLocaleKey, toggled, onToggleChange, toggleId) {
    const labelWithToggle = new UTLabelWithToggleControl();
    labelWithToggle.setLabel(loc(labelLocaleKey));
    if(toggleId){
        labelWithToggle.setToggleId(toggleId);
    }

    if (toggled) {
        labelWithToggle.toggle();
    }

    labelWithToggle.onToggle = (elem, eventType, value) => {
        if(onToggleChange){
            const returnValue = (onToggleChange)(value.toggleState);
            if(returnValue === false){
                labelWithToggle.toggle(false);
            }
        }
    };

    append(container, labelWithToggle);

    return labelWithToggle;
}