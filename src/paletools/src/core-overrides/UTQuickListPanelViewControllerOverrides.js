import { getPlayerSellValue, getSellBidPrice } from "../services/market";

export default function executeQuickListPanelViewControllerOverrides() {
    const UTQuickListPanelViewController_renderView = UTQuickListPanelViewController.prototype.renderView;
    UTQuickListPanelViewController.prototype.renderView = function () {
        UTQuickListPanelViewController_renderView.call(this);

        const playerSellValue = getPlayerSellValue(this.item.definitionId);
        if (playerSellValue) {
            let buyAmount = playerSellValue;
            let bidAmount = getSellBidPrice(buyAmount);
            this.getView().setBuyNowValue(buyAmount);
            this.getView().setBidValue(bidAmount);
        }
    }
}