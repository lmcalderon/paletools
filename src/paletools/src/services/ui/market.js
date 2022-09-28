import { addMarketSearchPreRender } from "../../core-overrides/UTMarketSearchResultsViewControllerOverrides";
import { tryBuyItem } from "../market";

export function enableMarketSnipe(shouldSnipeFunc, onBack = null, onSnipeSuccess = null, onSnipeFailure = null) {
    addMarketSearchPreRender((items, controller) => {
        if (!shouldSnipeFunc()) return true;

        function goBack() {
            if (onBack) {
                onBack();
            }
            controller.getNavigationController()._eBackButtonTapped();
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
                        notifySuccess("SUCCESS!");
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