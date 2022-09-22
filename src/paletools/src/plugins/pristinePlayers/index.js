let plugin;

/// #if process.env.PRISTINE_PLAYERS
import styles from "./styles.css";
import settings, { saveConfiguration } from "../../settings";
import { addClass } from "../../utils/dom";
import { addLabelWithToggle } from "../../controls";
import { EVENTS, on } from "../../events";
import { addStyle, removeStyle } from "../../utils/styles";

let cfg = settings.plugins.pristinePlayers;

function run() {

    const UTItemTableCellView_renderName = UTItemTableCellView.prototype.renderName;
    UTItemTableCellView.prototype.renderName = function () {
        UTItemTableCellView_renderName.call(this);
        if(!settings.enabled) return;
        if(!cfg.enabled) return;
        
        
        if (!this.data.isPlayer()) return;

        if(this.data.contract === 7 && this.data.owners === 1 && this.data.loans === -1){
            addClass(this.__name, "pristine-player");
        }
    }

    if (settings.enabled && cfg.enabled) {
        addStyle("paletools-pristinePlayers", styles);
    }

    on(EVENTS.APP_ENABLED, () => addStyle("paletools-pristinePlayers", styles));
    on(EVENTS.APP_DISABLED, () => removeStyle("paletools-pristinePlayers"));
}

function menu() {
    const container = document.createElement("div");
    addLabelWithToggle(container, "enabled", cfg.enabled, toggleState => {
        cfg.enabled = toggleState;
        saveConfiguration();

        if(toggleState){
            addStyle("paletools-pristinePlayers", styles);
        }
        else {
            removeStyle("paletools-pristinePlayers");
        }
        
    });
    return container;
}

plugin = {
    run: run,
    settings: {
        title: 'plugins.pristinePlayers.title',
        menu: menu
    }
}
/// #endif

export default plugin;