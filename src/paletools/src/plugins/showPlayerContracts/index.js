let plugin;

/// #if process.env.SHOW_PLAYER_CONTRACTS
import styles from "./styles.css";
import settings, { saveConfiguration } from "../../settings";
import { addLabelWithToggle } from "../../controls";
import { EVENTS, on } from "../../events";
import { addStyle, removeStyle } from "../../utils/styles";
import { select } from "../../utils/dom";

let cfg = settings.plugins.showPlayerContracts;

function run() {

    const UTItemTableCellView_render = UTItemTableCellView.prototype.render;
    UTItemTableCellView.prototype.render = function (e) {
        UTItemTableCellView_render.call(this, e);

        if (settings.enabled && cfg.enabled) {
            const loans = select(".ut-item-player-status--loan", this.__entityContainer);
            if (loans) {
                loans.textContent = this.data.contract;
            }
        }
    }

    if (settings.enabled && cfg.enabled) {
        addStyle("paletools-showPlayerContracts", styles);
    }
    on(EVENTS.APP_ENABLED, () => addStyle("paletools-showPlayerContracts", styles));
    on(EVENTS.APP_DISABLED, () => removeStyle("paletools-showPlayerContracts"));
}

function menu() {
    const container = document.createElement("div");
    addLabelWithToggle(container, "enabled", cfg.enabled, toggleState => {
        cfg.enabled = toggleState;
        saveConfiguration();
        if(toggleState){
            addStyle("paletools-showPlayerContracts", styles);
        }
        else {
            removeStyle("paletools-showPlayerContracts");
        }
    });
    return container;
}

plugin = {
    run: run,
    settings: {
        title: 'plugins.showPlayerContracts.title',
        menu: menu
    }
}
/// #endif

export default plugin;