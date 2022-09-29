import { addMarketSearchPreRender } from "../../core-overrides/UTMarketSearchResultsViewControllerOverrides";
import localize from "../../localization";
import delay from "../../utils/delay";
import { selectAll } from "../../utils/dom";
import { displayLoader, hideLoader } from "../../utils/loader";
import { notifySuccess } from "../../utils/notifications";
import { getUnassignedPlayers } from "../club";
import { tryBuyItem } from "../market";
import { navigateBack } from "./navigation";

const _snipeRequests = [];

export function addSnipeRequest(request = () => { }) {
    _snipeRequests.push(request);
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

        displayLoader();
        let request = _snipeRequests.shift();

        function goBack() {
            delay(50).then(() => {
                navigateBack(controller);
                hideLoader();
            });
        }

        setTimeout(() => {
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

                        notifySuccess(localize("market.itemBuy.success").replace("{COINS}", response.item._auction.buyNowPrice.toLocaleString()));
                    }
                    else {
                        try {
                            request({ success: false, item: response.item });
                        }
                        catch { }
                    }
                }).catch(err => {
                    try {
                        request({ success: false, item: response.item, error: err });
                    }
                    catch { }
                }).finally(() => {
                    goBack();
                });
            }
        }, 0);

        return false;
    });
}