let plugin;
/// #if process.env.TRACK_TRANSACTIONS
import { addLabelWithToggle } from "../../controls";
import { EVENTS, on } from "../../events";
import db from "../../services/db";
import settings, { saveConfiguration } from "../../settings";

const cfg = settings.plugins.trackTransactions;

function run() {

    on(EVENTS.ITEM_WON, ev => {
        if (!settings.enabled || !cfg.enabled || !ev.detail.item) return;

        if (ev.detail.item.getAuctionData().isWon()) {
            db.transactions.insertBuy(ev.detail.item, ev.detail.bid);
        }
    });

    on(EVENTS.ITEMS_SOLD, ev => {
        if (!settings.enabled || !cfg.enabled) return;

        for (let item of ev.detail.items.filter(x => x.getAuctionData().isSold())) {
            db.transactions.insertSell(item);
        }
    });

    on(EVENTS.ITEMS_WON, ev => {
        if (!settings.enabled || !cfg.enabled) return;

        for (let item of ev.detail.items.filter(x => x.getAuctionData().isWon())) {
            db.transactions.insertBuy(item);
        }
    })
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
    order: 100,
    settings: {
        name: 'track-transactions',
        title: 'plugins.trackTransactions.settings.title',
        menu: menu
    }
};
/// #endif

export default plugin;