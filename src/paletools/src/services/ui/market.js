import { addMarketSearchPreRender } from "../../core-overrides/UTMarketSearchResultsViewControllerOverrides";
import localize from "../../localization";
import delay from "../../utils/delay";
import { notifySuccess } from "../../utils/notifications";
import { tryBuyItem } from "../market";
import { navigateBack } from "./navigation";

export function enableMarketSnipe(shouldSnipeFunc, onBack = null, onSnipeSuccess = null, onSnipeFailure = null) {
    addMarketSearchPreRender((items, controller) => {
        if (!shouldSnipeFunc()) return true;

        function goBack() {
            if (onBack) {
                onBack();
            }
            navigateBack(controller);
            delay(10).then(() => {
                document.querySelectorAll(".ut-numeric-input-spinner-control")[3].scrollIntoView()
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
                        if (onSnipeSuccess) {
                            onSnipeSuccess(response.item);
                        }
                        notifySuccess(localize("market.itemBuy.success").replace("{COINS}", response.item._auction.buyNowPrice.toLocaleString()));
                    }
                    else {
                        if (onSnipeFailure) {
                            onSnipeFailure(response.item);
                        }
                    }
                }).catch(() => {
                    onSnipeFailure(response.item);
                }).finally(() => {
                    goBack();
                });
            }
        }, 0);

        return false;
    });
}