let plugin;

import { addLabelWithToggle } from "../controls";
import localize from "../localization";
/// #if process.env.INCREASE_ALLOWED_AUCTIONS
import settings, { saveConfiguration } from "../settings";
import { notifySuccess } from "../utils/notifications";

const cfg = settings.plugins.incrementAllowedAuctions;

function run() {
    if (cfg.enabled) {
        services.User.maxAllowedAuctions = 100;
    }
}

function menu() {
    const container = document.createElement("div");
    addLabelWithToggle(container, "enabled", cfg.enabled, toggleState => {
        if (toggleState) {
            if (confirm(localize("plugins.dangerous"))) {
                cfg.enabled = toggleState;
                saveConfiguration();
                notifySuccess(localize("page.restart"));
            }
        }
        else {
            cfg.enabled = false;
            saveConfiguration();
            notifySuccess(localize("page.restart"));
        }
    });
    return container;
}

plugin = {
    run: run,
    order: 12,
    settings: {
        name: 'increase-allowed-auctions',
        title: 'plugins.increaseAllowedAuctions.settings.title',
        menu: menu
    }
};
/// #endif

export default plugin;