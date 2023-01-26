let plugin;
/// #if process.env.TRANSACTIONS_HISTORY
import { addLabelWithToggle } from "../../controls";
import { EVENTS, on } from "../../events";
import localize from "../../localization";
import db from "../../services/db";
import settings, { saveConfiguration } from "../../settings";
import getCurrentController from "../../utils/controller";
import { addClass, append, select } from "../../utils/dom";
import { hide, show } from "../../utils/visibility";
import { TransactionsHistoryController } from "./TransactionsHistoryController";

const cfg = settings.plugins.transactionsHistory;

function loc(key) {
    return localize(`plugins.transactionsHistory.${key}`);
}

function run() {
    const UTTransfersHubView_generate = UTTransfersHubView.prototype._generate;
    UTTransfersHubView.prototype._generate = function _generate() {
        UTTransfersHubView_generate.call(this);

        if (!settings.enabled || !cfg.enabled) return;

        if (!this._paletoolsGenerated) {
            const container = select("div", this.getRootElement());

            this._transferHistoryTile = new UTTransfersTileView();
            this._transferHistoryTile.init();
            this._transferHistoryTile.addTarget(this, () => {
                const navController = getCurrentController().getNavigationController();
                if (navController) {
                    const controller = new TransactionsHistoryController();
                    controller.init();
                    navController.pushViewController(controller);
                }
            }, EventType.TAP)
            this._transferHistoryTile.setTitle(loc("panel.title"));
            this._transferHistoryTile.setTotalTransferLabel(loc("panel.label"));
            this._transferHistoryTile.setActiveTransferLabel(`${loc("panel.bought")}: `);
            this._transferHistoryTile.setFinishedTransferLabel(`${loc("panel.sold")}: `);
            addClass(this._transferHistoryTile, "col-1-1", "ut-tile-transfer-history");

            append(container, this._transferHistoryTile);

            this._paletoolsGenerated = !0

            let buyCount = 0;
            let sellCount = 0;

            const setupCounts = async () => {
                buyCount = await db.transactions.getBuyCount();
                sellCount = await db.transactions.getSellCount();

                displayCounts();
            };

            const displayCounts = () => {
                buyCount = buyCount || 0;
                sellCount = sellCount || 0;
                this._transferHistoryTile.setTotalTransferCount(buyCount + sellCount);
                this._transferHistoryTile.setActiveTransferCount(buyCount);
                this._transferHistoryTile.setFinishedTransferCount(sellCount);
            }

            setupCounts();

            on(EVENTS.ITEM_WON, ev => {
                setupCounts();
            });

            on(EVENTS.ITEMS_SOLD, ev => {
                setupCounts();
            });

            on(EVENTS.TRANSACTIONS_RELOADED, ev => {
                setupCounts();
            });

            on(EVENTS.APP_DISABLED, () => hide(_transferHistoryTile));
            on(EVENTS.APP_ENABLED, () => show(_transferHistoryTile));
        }
    }

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
        name: 'transactions-history',
        title: 'plugins.transactionsHistory.settings.title',
        menu: menu
    }
};
/// #endif

export default plugin;
