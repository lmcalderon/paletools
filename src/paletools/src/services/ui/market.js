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

                tryBuyItem(orderedItems).then(success => {
                    if (success) {
                        if (onSnipeSuccess) {
                            onSnipeSuccess();
                        }
                        notifySuccess(localize("market.itemBuy.success"));
                    }
                    else {
                        if (onSnipeFailure) {
                            onSnipeFailure();
                        }
                    }
                    goBack();
                });
            }
        }, 0);

        return false;
    });
}