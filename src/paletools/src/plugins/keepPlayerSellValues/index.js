let plugin;

// #if process.env.KEEP_PLAYER_SELL_VALUES
import { addLabelWithToggle } from "../../controls";
import settings, { saveConfiguration } from "../../settings";

const cfg = settings.plugins.keepPlayerSellValues;

function run() {
    const playerSellValues = {};


    const UTQuickListPanelViewController__onList = UTQuickListPanelViewController.prototype._onList;
    UTQuickListPanelViewController.prototype._onList = function (t, e, i) {
        if (cfg.enabled) {
            playerSellValues[this.item.definitionId] = i;
        }
        UTQuickListPanelViewController__onList.call(this, t, e, i);
    }

    const UTQuickListPanelViewController_renderView = UTQuickListPanelViewController.prototype.renderView;
    UTQuickListPanelViewController.prototype.renderView = function () {
        UTQuickListPanelViewController_renderView.call(this);

        if (cfg.enabled && playerSellValues[this.item.definitionId]) {
            const { bidAmount, buyAmount, duration } = playerSellValues[this.item.definitionId];
            this.getView().setBuyNowValue(buyAmount);
            this.getView().setBidValue(bidAmount);
        }
    }
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
    order: 6,
    menu: menu,
    settings: {
        name: 'keep-player-sell-values',
        title: 'plugins.keepPlayerSellValues.settings.title',
        menu: menu
    }
}
// #endif

export default plugin;
