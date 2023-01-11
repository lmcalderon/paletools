let plugin;

// #if process.env.REFRESH_COINS
import { addLabelWithToggle } from "../../controls";
import { on, EVENTS } from "../../events";
import { getUserCredits } from "../../services/credits";
import settings, { saveConfiguration } from "../../settings";
import getCurrentController from "../../utils/controller";
import { select } from "../../utils/dom";
import { addStyle, removeStyle } from "../../utils/styles";
import styles from "./styles.css";

const cfg = settings.plugins.refreshCoins;


function addStyles() {
    addStyle('paletools-refresh-coins', styles);
}

function removeStyles() {
    removeStyle('paletools-refresh-coins');
}


function run() {

    const UTCurrencyNavigationBarView_tapDetected = UTCurrencyNavigationBarView.prototype._tapDetected;
    UTCurrencyNavigationBarView.prototype._tapDetected = function (e) {
        const result = UTCurrencyNavigationBarView_tapDetected.call(this, e);
        if (settings.enabled && cfg.enabled && this.__currencyCoins.contains(e.target)) {
            getUserCredits().then(credits => {
                this.setCurrency(credits.coins);
            });

        }
        return result;
    };

    if (settings.enabled && cfg.enabled) {
        addStyles();
    }

    on(EVENTS.APP_ENABLED, () => addStyles());
    on(EVENTS.APP_DISABLED, () => removeStyles());
}

function menu() {
    const container = document.createElement("div");
    addLabelWithToggle(container, "enabled", cfg.enabled, toggleState => {
        cfg.enabled = toggleState;
        saveConfiguration();
    });
    return container;
}

plugin = {
    run: run,
    order: 25,
    settings: {
        name: 'refresh-coins',
        title: 'plugins.refreshCoins.settings.title',
        menu: menu
    }
}
// #endif

export default plugin;