import { addMarketSearchPreRender } from "../../core-overrides/UTMarketSearchResultsViewControllerOverrides";
import { EVENTS, triggerEvent } from "../../events";
import localize from "../../localization";
import delay from "../../utils/delay";
import { selectAll } from "../../utils/dom";
import { displayLoader, hideLoader } from "../../utils/loader";
import { notifySuccess } from "../../utils/notifications";
import { getUnassignedPlayers } from "../club";
import getDebugSettings from "../debug";
import { logDebug } from "../log";
import { tryBuyItem } from "../market";
import { navigateBack } from "./navigation";

const _snipeRequests = [];
const _goBackDelay = getDebugSettings().goBackDelay || 50;


export function addSnipeRequest(request = () => { }) {
    _snipeRequests.push(request);
    logDebug("Snipe requested");
}

export function clearSnipeRequests() {
    _snipeRequests.length = 0;
    logDebug("Snipe requests cleared");
}

const UTMarketSearchFiltersView_generate = UTMarketSearchFiltersView.prototype._generate;
UTMarketSearchFiltersView.prototype._generate = function _generate() {
    UTMarketSearchFiltersView_generate.call(this);
    const inputs = selectAll(".ut-numeric-input-spinner-control");
    if (inputs.length > 3) {
        inputs[0].scrollIntoView();
    }
}


export function enableMarketSnipe() {
    addMarketSearchPreRender((items, controller) => {

        if (_snipeRequests.length === 0) return true;
        logDebug(`Snipe Requests: ${_snipeRequests.length}`);

        displayLoader();
        let request = _snipeRequests.shift();
        clearSnipeRequests();

        function goBack() {
            navigateBack(controller);
            hideLoader();
            triggerEvent(EVENTS.SNIPE_GOBACK);
        }

        if (items.length === 0) {
            goBack();
        }
        else {
            let orderedItems = items.slice().sort((a, b) => {
                const auctionA = a._auction.buyNowPrice;
                const auctionB = b._auction.buyNowPrice;
                return auctionA - auctionB;
            });

            tryBuyItem(orderedItems).then(response => {
                if (response.success) {
                    request({ success: true, item: response.item });

                    // this refreshes the unassigned players at the home page
                    getUnassignedPlayers();

                    triggerEvent(EVENTS.SNIPE_SUCCESS, response.item);
                    notifySuccess(localize("market.itemBuy.success").replace("{COINS}", response.item._auction.buyNowPrice.toLocaleString()));
                }
                else {
                    try {
                        request({ success: false, item: response.item });
                        triggerEvent(EVENTS.SNIPE_FAILED, response);
                    }
                    catch { }
                }
            }).catch(err => {
                try {
                    request({ success: false, item: response.item, error: err });
                    triggerEvent(EVENTS.SNIPE_FAILED, { response: response, err: err });
                }
                catch { }
            }).finally(() => {
                goBack();
            });
        }

        return false;
    });
}