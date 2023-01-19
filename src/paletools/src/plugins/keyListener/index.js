import { EVENTS, on } from "../../events";
import { getAllKeyboardActions } from "../../services/keyboard";
import { addStyle, removeStyle } from "../../utils/styles";

let plugin;

/// #if process.env.KEY_LISTENER
function run() {
    function addStyles() {

        let css = "";
        for (const action of getAllKeyboardActions()) {
            if (action.cssSelector) {
                css += `${action.cssSelector}:after { content: ' [ ${action.getKeyCode()} ]'  }`
            }
        }

        addStyle("paletools-key-listener", css);
    }

    function removeStyles() {
        removeStyle("paletools-key-listener")
    }

    addStyles();

    on(EVENTS.APP_ENABLED, () => addStyles());
    on(EVENTS.APP_DISABLED, () => removeStyles());
    on(EVENTS.CONFIGURATION_SAVED, () => {
        removeStyles();
        addStyles();
    });
}

plugin = {
    run: run,
    order: -100
};
/// #endif

export default plugin;