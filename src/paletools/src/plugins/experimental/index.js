let plugin;

// #if process.env.EXPERIMENTAL

import { addLabelWithToggle } from "../../controls";
import localize from "../../localization";
import settings, { saveConfiguration } from "../../settings";

const cfg = settings.plugins.experimental;

function menu() {
    const container = document.createElement("div");

    function add(setting) {
        addLabelWithToggle(container, `plugins.experimental.settings.${setting}`, cfg[setting], toggleState => {
            if (toggleState && confirm(localize("plugins.dangerous"))) {
                cfg[setting] = true;
            }
            else if(!toggleState){
                cfg[setting] = false;
            }


            saveConfiguration();
        });
    }

    add("fastClubSearch");

    return container;
}

plugin = {
    run: () => {},
    order: Number.MAX_SAFE_INTEGER,
    settings: {
        name: "experimental",
        title: 'plugins.experimental.settings.title',
        menu: menu
    }
};
/// #endif
export default plugin;