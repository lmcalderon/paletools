import settings from "../../settings";
import localize from "../../localization";
import { on, triggerEvent } from "../../events";
import { notifyFailure, notifySuccess } from "../../utils/notifications";
import { findLowestMarketPrice } from "../../services/transferMarket";
import tryAndCatch from "../../try";

const cfg = settings.plugins.playerActions;

const findLowestPriceAction = {
    generate: (instance, buttonsContainerFunc) => {
        if (cfg.findLowestPrice) {
            instance._findLowestPriceButton = new UTGroupButtonControl();
            instance._findLowestPriceButton.init();
            instance._findLowestPriceButton.setText(localize("plugins.playerActions.findLowestPrice.button"));
            instance._findLowestPriceButton.addTarget(instance, () => instance.onFindLowestPrice.notify(), EventType.TAP);
            instance._findLowestPriceButton.getRootElement().classList.add("palesnipe-element");
            instance._findLowestPriceButton.displayCurrencyIcon();
            instance.onFindLowestPrice = new EAObservable();
            buttonsContainerFunc(instance).appendChild(instance._findLowestPriceButton.getRootElement());
            on("appEnabled", () => $(instance._findLowestPriceButton.getRootElement()).show());
            on("appDisabled", () => $(instance._findLowestPriceButton.getRootElement()).hide());
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