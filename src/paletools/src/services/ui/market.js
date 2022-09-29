import { addMarketSearchPreRender } from "../../core-overrides/UTMarketSearchResultsViewControllerOverrides";
import localize from "../../localization";
import { selectAll } from "../../utils/dom";
import { notifySuccess } from "../../utils/notifications";
import { getUnassignedPlayers } from "../club";
import { tryBuyItem } from "../market";
import { navigateBack } from "./navigation";

const _snipeRequests = [];

export function addSnipeRequest(request = () => {}){
    _snipeRequests.push(request);
}

let scrollToBuyNow = false;

const UTMarketSearchFiltersView_generate = UTMarketSearchFiltersView.prototype._generate;
UTMarketSearchFiltersView.prototype._generate = function _generate() {
    UTMarketSearchFiltersView_generate.call(this);
    const inputs = selectAll(".ut-numeric-input-spinner-control");
    if(inputs.length > 3){
        inputs[0].scrollIntoView();
    }

    scrollToBuyNow = true;
}


export function enableMarketSnipe() {
    addMarketSearchPreRender((items, controller) => {
        
        if(_snipeRequests.length === 0) return true;
        
        let request = _snipeRequests.shift();

        function goBack() {
            navigateBack(controller);
            scrollToBuyNow = true;
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
                        request({ success: false, item: response.item });
                    }
                }).catch(err => {
                    request({ success: false, item: response.item, error: err});
                }).finally(() => {
                    goBack();
                });
            }
        }, 0);

        return false;
    });
}