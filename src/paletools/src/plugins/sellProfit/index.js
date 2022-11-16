let plugin;
/// #if process.env.SELL_PROFIT
import styles from "./styles.css";
import { addLabelWithToggle } from "../../controls";
import { EVENTS, on } from "../../events";
import localize, { localizeNumber } from "../../localization";
import db from "../../services/db";
import settings, { saveConfiguration } from "../../settings";
import { addClass, append, createElem, insertAfter, removeClass, selectAll } from "../../utils/dom";
import { addStyle, removeStyle } from "../../utils/styles";
import { hide, show } from "../../utils/visibility";
import { getPriceAfterTax, listItemOnTransferMarket } from "../../services/market";
import { logDebug } from "../../services/log";

const cfg = settings.plugins.sellProfit;

function addStyles() {
    addStyle('paletools-sell-profit', styles);
}

function removeStyles() {
    removeStyle('paletools-sell-profit');
}

function run() {

    async function setProfitValue(container, item, sellPrice) {
        const [profit, profitPerc] = await item.getAuctionProfit(sellPrice);
        container.textContent = `${localizeNumber(profit)} (${localizeNumber(profitPerc)}%)`;
        if (profit < 0) {
            addClass(container, "profit-loss");
        }
        else {
            removeClass(container, "profit-loss");
        }

        return profit;
    }

    const UTQuickListPanelViewController_setItem = UTQuickListPanelViewController.prototype.setItem;
    UTQuickListPanelViewController.prototype.setItem = function (e) {
        this.getView().item = e;
        UTQuickListPanelViewController_setItem.call(this, e);
    }

    UTQuickListPanelView.prototype._setExpectedProfit = function () {
        if(!this.item) return;
        let sellValue = parseInt(this._buyNowNumericStepper.getValue());
        setProfitValue(this.__profitPriceValue, this.item, sellValue);
        show(this.__profitPrice);
    }

    const UTQuickListPanelView_setBuyNowValue = UTQuickListPanelView.prototype.setBuyNowValue;
    UTQuickListPanelView.prototype.setBuyNowValue = function (e) {
        UTQuickListPanelView_setBuyNowValue.call(this, e);
        this._setExpectedProfit();
    }

    const UTQuickListPanelView_generate = UTQuickListPanelView.prototype._generate;
    UTQuickListPanelView.prototype._generate = function _generate() {
        UTQuickListPanelView_generate.call(this);

        if (!settings.enabled || !cfg.enabled) return;

        if (this._paletoolsGenerated) return;

        this.__profitPrice = createElem("div", { className: "boughtPrice panelActionRow sell-profit" });
        append(this.__profitPrice, createElem("span", { className: "boughtPriceLabel" }, localize("plugins.sellProfit.expectedProfit.text")));
        this.__profitPriceValue = createElem("span", { className: "boughtPriceValue currency-coins sell-profit-value" });
        append(this.__profitPrice, this.__profitPriceValue);

        insertAfter(this.__profitPrice, this.__boughtPrice);

        this._btnToggle.addTarget(this, () => this._setExpectedProfit(), EventType.TAP);
        this._buyNowNumericStepper.getInput().addTarget(this, () => this._setExpectedProfit(), EventType.CHANGE);

        show(this.__profitPrice);

        this._paletoolsGenerated = true;
    }

    const UTItemTableCellView_generate = UTItemTableCellView.prototype._generate;
    UTItemTableCellView.prototype._generate = function _generate() {
        UTItemTableCellView_generate.call(this);

        if (!settings.enabled || !cfg.enabled) return;

        this.__profitContainer = createElem("div", { className: "sell-profit auctionValue" });
        this.__profitLabelContainer = createElem("span", { className: "sell-profit-text label" })
        this.__profitValueContainer = createElem("span", { className: "sell-profit-value currency-coins value" });

        this.profit = 0;

        append(this.__profitContainer, this.__profitLabelContainer, this.__profitValueContainer);
        append(this.__auction, this.__profitContainer);
        hide(this.__profitContainer);
    }

    const UTItemTableCellView_renderAuctionState = UTItemTableCellView.prototype._renderAuctionState;
    UTItemTableCellView.prototype._renderAuctionState = function () {
        UTItemTableCellView_renderAuctionState.call(this);

        if (!settings.enabled || !cfg.enabled) return;

        const auctionData = this.data.getAuctionData();

        if (auctionData && (auctionData.isSold() || auctionData.isSelling())) {
            show(this.__profitContainer);
            this.__profitLabelContainer.textContent = auctionData.isSold() ? localize("plugins.sellProfit.realProfit.text") : localize("plugins.sellProfit.expectedProfit.text");
            setProfitValue(this.__profitValueContainer, this.data);
        }
        else {
            hide(this.__profitContainer);
        }
    }

    on(EVENTS.APP_DISABLED, () => { hide(selectAll(".sell-profit")); removeStyles(); });
    on(EVENTS.APP_ENABLED, () => { show(selectAll(".sell-profit")); addStyles(); })

    addStyles();
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
    order: 100,
    settings: {
        name: 'sell-profit',
        title: 'plugins.sellProfit.settings.title',
        menu: menu
    }
};
/// #endif

export default plugin;