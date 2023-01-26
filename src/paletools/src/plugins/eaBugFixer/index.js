let plugin;

// #if process.env.EA_BUG_FIXER

import { addLabelWithToggle } from "../../controls";
import settings, { saveConfiguration } from "../../settings";
import fixLeagueUpdates from "./fixLeagueUpdates";

const cfg = settings.plugins.eaBugFixer;

function run(){
    if(!cfg.enabled) return;

    fixLeagueUpdates();
}

function menu() {
    const container = document.createElement("div");
    container.classList.add("menuContainer");
    addLabelWithToggle(container, "enabled", cfg.enabled, toggleState => {
        cfg.enabled = toggleState;
        saveConfiguration();
    });
    return container;
}

plugin = {
    run: run,
    order: 1000,
    settings: {
        name: "eaBugFixer",
        title: 'plugins.eaBugFixer.settings.title',
        menu: menu
    }
};
/// #endif
export default plugin;