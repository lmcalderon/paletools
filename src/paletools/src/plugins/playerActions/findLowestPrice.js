import settings from "../../settings";
import localize from "../../localization";
import { on, triggerEvent } from "../../events";
import { notifyFailure, notifySuccess } from "../../utils/notifications";
import { findLowestMarketPrice } from "../../services/market";
import tryAndCatch from "../../try";
import { append } from "../../utils/dom";
import { hide, show } from "../../utils/visibility";

const cfg = settings.plugins.playerActions;

const findLowestPriceAction = {
    canRun: (instance) => {
        return instance === UTDefaultActionPanelView || instance === UTAuctionActionPanelView;
    },

    generate: (instance, buttonsContainerFunc) => {
        if (cfg.findLowestPrice) {
            instance._findLowestPriceButton = new UTGroupButtonControl();
            instance._findLowestPriceButton.init();
            instance._findLowestPriceButton.setText(localize("plugins.playerActions.findLowestPrice.button"));
            instance._findLowestPriceButton.addTarget(instance, () => instance.onFindLowestPrice.notify(), EventType.TAP);
            instance._findLowestPriceButton.getRootElement().classList.add("paletools-element");
            instance._findLowestPriceButton.displayCurrencyIcon();
            instance.onFindLowestPrice = new EAObservable();
            append(buttonsContainerFunc(instance), instance._findLowestPriceButton.getRootElement());
            on("appEnabled", () => show(instance._findLowestPriceButton.getRootElement()));
            on("appDisabled", () => hide(instance._findLowestPriceButton.getRootElement()));
            on("findLowestPriceAction:searchstart", () => {
                tryAndCatch(() => {
                    instance._findLowestPriceButton.setText(localize("plugins.playerActions.findLowestPrice.searching"));
                    instance._findLowestPriceButton.setSubtext('');
                });
            });
            on("findLowestPriceAction:searchend", (ev) => {
                tryAndCatch(() => {
                    instance._findLowestPriceButton.setText(localize("plugins.playerActions.findLowestPrice.button"));
                    if(ev.detail === "ERROR"){
                        instance._findLowestPriceButton.setSubtext("ERROR");    
                    }
                    else {
                        let html = "<ol>";
                        for(let value of ev.detail){
                            html += `<li>${value.value} x${value.count}</li>`;
                        }
                        html += "</ol>";

                        instance._findLowestPriceButton.__subtext.innerHTML = html;
                    }
                });
            });
        }
    },
    destroyGeneratedElements: (instance) => {
        if (instance._findLowestPriceButton) {
            instance._findLowestPriceButton.destroy();
        }
    },
    dealloc: (instance) => {
        if (instance.onFindLowestPrice) {
            instance.onFindLowestPrice.dealloc();
        }
    },
    attachEvent: (instance) => {
        if (instance._panel.onFindLowestPrice) {
            instance._panel.onFindLowestPrice.observe(instance, instance._onFindLowestPrice);
        }
    },

    createEvent: (proto) => {
        let searching = false;

        proto._onFindLowestPrice = async function () {
            if (searching) return;

            searching = true;

            triggerEvent("findLowestPriceAction:searchstart");

            try {
                const minPrice = await findLowestMarketPrice(this._viewmodel.current().definitionId);
                triggerEvent("findLowestPriceAction:searchend", minPrice || localize("plugins.playerActions.findLowestPrice.notFound"));
            }
            catch {
                triggerEvent("findLowestPriceAction:searchend", "ERROR");
            }

            searching = false;
        }
    }
}

export default findLowestPriceAction;