import { EVENTS, on } from "../../events";
import localize from "../../localization";
import { findLowestMarketPrice, getSellBidPrice, roundOffPrice } from "../../services/market";
import settings from "../../settings";
import { addClass, append, createElem } from "../../utils/dom";
import { hide, show } from "../../utils/visibility";

const cfg = settings.plugins.playerActions;
const profits = [10, 15, 20, 25, 30];

const listForProfitAction = {
    canRun: (instance) => {
        return instance === UTQuickListPanelView;
    },

    inject: (proto) => {
        const UTQuickListPanelViewController_renderView = UTQuickListPanelViewController.prototype.renderView;
        UTQuickListPanelViewController.prototype.renderView = function () {
            UTQuickListPanelViewController_renderView.call(this);

            if (this.item) {
                this.getView()._item = this.item;
                if (this.item.lastSalePrice) {
                    show(this.getView()._listForProfitContainer);
                }
                else {
                    hide(this.getView()._listForProfitContainer);
                }
            }
            else {
                this.getView()._itemBuyNowPrice = null;
                hide(this.getView()._listForProfitContainer);
            }
        }
    },

    generate: (instance, buttonsContainerFunc) => {
        function listForValue(value) {
            if (!value) return;

            const sellBuyPrice = roundOffPrice(value);
            const sellBidPrice = getSellBidPrice(sellBuyPrice);

            if (cfg.listForProfitAutoPublish) {
                instance._triggerActions(enums.UIItemActionEvent.LIST_ON_MARKET, {
                    bidAmount: sellBidPrice,
                    buyAmount: sellBuyPrice,
                    duration: parseInt(instance._durationPicker.value, 10)
                });
            }
            else {
                instance.setBidValue(sellBidPrice);
                instance.setBuyNowValue(sellBuyPrice);
            }
        }

        function listForProfit(profit) {
            if (!instance._item || !instance._item.lastSalePrice || profit <= 5) return;
            listForValue(instance._item.lastSalePrice * ((profit / 100) + 1));
        }


        if (cfg.listForProfit) {
            const container = createElem("div", { className: "list-for-profit" });
            const buttonsContainer = createElem("div", { className: "list-for-profit-buttons" });
            const customContainer = createElem("div", { className: "list-for-profit-custom" });
            const marketContainer = createElem("div", { className: "list-for-profit-market" });
            for (let profit of profits) {
                const button = new UTStandardButtonControl();
                button.init();
                button.setText(`${profit}%`);
                button.addTarget(instance, () => listForProfit(profit), EventType.TAP);
                addClass(button, "call-to-action");
                button.onListForProfit = new EAObservable();
                instance[`_listForProfit${profit}`] = button;
                append(buttonsContainer, button.getRootElement());
            }

            const customProfit = new UTNumberInputControl();
            customProfit.init();
            customProfit.setInputPlaceholder("%");

            const customProfitButton = new UTStandardButtonControl();
            customProfitButton.init();
            customProfitButton.setText(localize("plugins.playerActions.listForProfit.button.set"));
            customProfitButton.addTarget(instance, () => listForProfit(customProfit.getValue()), EventType.TAP);
            addClass(customProfitButton, "call-to-action");

            const marketButton = new UTStandardButtonControl();
            marketButton.init();
            marketButton.setText(localize("plugins.playerActions.listForProfit.button.market"));
            marketButton.addTarget(instance, async () => {
                marketButton.setInteractionState(false);
                try {
                    const lowestPrice = await findLowestMarketPrice(instance._item.definitionId, instance._item.type, 1);
                    listForValue(lowestPrice.value);
                }
                catch{
                }
                marketButton.setInteractionState(true);
            }, EventType.TAP);
            addClass(marketButton, "call-to-action");


            append(marketContainer, marketButton);
            append(customContainer, customProfit, customProfitButton);
            append(container, buttonsContainer, customContainer);

            append(buttonsContainerFunc(instance), container, marketContainer);

            on(EVENTS.APP_ENABLED, () => show(container));
            on(EVENTS.APP_DISABLED, () => hide(container));

            instance._listForProfitContainer = container;
        }
    },
    destroyGeneratedElements: (instance) => {
        for (let profit of profits) {
            const button = instance[`_listForProfit${profit}`];
            if (button) {
                button.destroy();
            }
        }
    },
    dealloc: (instance) => {
    },
    attachEvent: (instance) => {
    },

    createEvent: (proto) => {
    }
}

export default listForProfitAction;