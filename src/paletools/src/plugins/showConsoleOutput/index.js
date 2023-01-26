let plugin;

/// #if process.env.SHOW_CONSOLE_OUTPUT
import { addLabelWithToggle } from "../../controls";
import getWindow from "../../services/window";
import settings from "../../settings";

const cfg = settings.plugins.showConsoleOutput;

function run() {
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    getWindow().console = iframe.contentWindow.console;
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
        name: 'show-console-output',
        title: 'plugins.showConsoleOutput.settings.title',
        menu: menu
    }
}
/// #endif

export default plugin;