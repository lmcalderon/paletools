
let plugin;

/// #if process.env.EXTERNAL_MARKET_PRICES
import { addLabelWithToggle } from "../../controls";
import { EVENTS, on } from "../../events";
import localize, { localizeNumber } from "../../localization";
import { getExternalMarketPrices } from "../../services/external/market";
import { isExternalRequestSupported } from "../../services/http";
import settings, { saveConfiguration } from "../../settings";
import { append, createElem } from "../../utils/dom";
import { addStyle, removeStyle } from "../../utils/styles";
import { hide, show } from "../../utils/visibility";
import styles from "./styles.css";
const cfg = settings.plugins.externalMarketPrices;

function run() {

    if (!isExternalRequestSupported()) return;

    const UTItemTableCellView_generate = UTItemTableCellView.prototype._generate;
    UTItemTableCellView.prototype._generate = function _generate() {
        UTItemTableCellView_generate.call(this);

        if (!settings.enabled || !cfg.enabled) return;

        this.__externalMarketPriceContainer = createElem("div", { className: "external-market-price auctionValue" });
        this.__externalMarketPriceLabelContainer = createElem("span", { className: "external-market-price-text label" }, settings.externalServices.prices.provider.toUpperCase());
        this.__externalMarketPriceValueContainer = createElem("span", { className: "external-market-price-value currency-coins value" });

        this.__externalMarketPriceContainer2 = createElem("div", { className: "external-market-price auctionValue" });
        this.__externalMarketPriceLabelContainer2 = createElem("span", { className: "external-market-price-text label" }, settings.externalServices.prices.provider.toUpperCase());
        this.__externalMarketPriceValueContainer2 = createElem("span", { className: "external-market-price-value currency-coins value" });

        append(this.__externalMarketPriceContainer, this.__externalMarketPriceLabelContainer, this.__externalMarketPriceValueContainer);
        append(this.__auction, this.__externalMarketPriceContainer);
        append(this, this.__externalMarketPriceContainer2);
        hide(this.__externalMarketPriceContainer);
    }

    const UTPaginatedItemListView__renderItems = UTPaginatedItemListView.prototype._renderItems;
    UTPaginatedItemListView.prototype._renderItems = function (r) {
        UTPaginatedItemListView__renderItems.call(this, r);

        getExternalMarketPrices(this.listRows.map(x => x.data)).then(prices => {
            for (let row of this.listRows) {
                const price = prices[row.data.definitionId];
                if (price) {
                    const priceText = localizeNumber(price);
                    row.__externalMarketPriceValueContainer.textContent = priceText;
                    row.__externalMarketPriceValueContainer2.textContent = priceText;
                    show(row.__externalMarketPriceContainer);
                }
            }
        });

    }

    const UTSectionedItemListView_render = UTSectionedItemListView.prototype.render;
    UTSectionedItemListView.prototype.render = function() {
        UTSectionedItemListView_render.call(this);

        getExternalMarketPrices(this.listRows.map(x => x.data)).then(prices => {
            for (let row of this.listRows) {
                const price = prices[row.data.definitionId];
                if (price) {
                    row.__externalMarketPriceValueContainer.textContent = localizeNumber(price)
                    show(row.__externalMarketPriceContainer);
                }
            }
        });
    }

    on(EVENTS.APP_ENABLED, () => addStyle("paletools-external-market-prices", styles));
    on(EVENTS.APP_DISABLED, () => removeStyle("paletools-external-market-prices"));
}

if (settings.enabled && cfg.enabled) {
    addStyle("paletools-external-market-prices", styles);
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
    order: 10,
    settings: {
        name: 'external-market-prices',
        title: 'plugins.externalMarketPrices.settings.title',
        menu: menu
    }
};
/// #endif

export default plugin;