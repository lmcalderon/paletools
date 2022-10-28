import { EVENTS, on } from "../../events";
import localize from "../../localization";
import { getSellBidPrice, roundOffPrice } from "../../services/market";
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

            if (this.item && this.item.lastSalePrice) {
                this.getView()._itemBuyNowPrice = this.item.lastSalePrice;
                show(this.getView()._listForProfitContainer);
            }
            else {
                this.getView()._itemBuyNowPrice = null;
                hide(this.getView()._listForProfitContainer);
            }
        }
    },

    generate: (instance, buttonsContainerFunc) => {
        function listForProfit(profit) {
            if (!instance._itemBuyNowPrice || profit <= 5) return;

            const sellBuyPrice = roundOffPrice(instance._itemBuyNowPrice * ((profit / 100) + 1));
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


        if (cfg.listForProfit) {
            const container = createElem("div", { className: "list-for-profit" });
            const buttonsContainer = createElem("div", { className: "list-for-profit-buttons" });
            const customContainer = createElem("div", { className: "list-for-profit-custom" });
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

            append(customContainer, customProfit.getRootElement());
            append(customContainer, customProfitButton.getRootElement());


            append(container, buttonsContainer);
            append(container, customContainer);
            append(buttonsContainerFunc(instance), container);

            on(EVENTS.APP_ENABLED, () => show(container.getRootElement()));
            on(EVENTS.APP_DISABLED, () => hide(container.getRootElement()));

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