import { EVENTS, on } from "../../events";
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
        UTQuickListPanelViewController.prototype.renderView = function() {
            UTQuickListPanelViewController_renderView.call(this);

            if(this.item && this.item.lastSalePrice){
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
        const container = createElem("div", { className: "list-for-profit"});
        if (cfg.listForProfit) {
            for(let profit of profits){
                const button = new UTStandardButtonControl();
                button.init();
                button.setText(`${profit}%`);
                button.addTarget(instance, () => {
                    if(!instance._itemBuyNowPrice) return;

                    const value = roundOffPrice(instance._itemBuyNowPrice * ((profit / 100) + 1));

                    instance._triggerActions(enums.UIItemActionEvent.LIST_ON_MARKET, {
                        bidAmount: getSellBidPrice(value),
                        buyAmount: value,
                        duration: parseInt(instance._durationPicker.value, 10)
                    })
                }, EventType.TAP);
                addClass(button, "call-to-action");
                button.onListForProfit = new EAObservable();
                instance[`_listForProfit${profit}`] = button;
                append(container, button.getRootElement());
                on(EVENTS.APP_ENABLED, () => show(button.getRootElement()));
                on(EVENTS.APP_DISABLED, () => hide(button.getRootElement()));
            }
            instance._listForProfitContainer = container;
            append(buttonsContainerFunc(instance), container);
        }
    },
    destroyGeneratedElements: (instance) => {
        for(let profit of profits){
            const button = instance[`_listForProfit${profit}`];
            if(button) {
                button.destroy();
            }
        }
    },
    dealloc: (instance) => {
        if (instance.onListForProfit) {
            instance.onListForProfit.dealloc();
        }
    },
    attachEvent: (instance) => {
    },
    
    createEvent: (proto) => {
    }
}

export default listForProfitAction;