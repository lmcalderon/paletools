import { EVENTS, triggerEvent } from "../events";

export function executeItemDetailsOverrides() {

    const onClearSold = controllers.items.ItemDetails.prototype._onClearSold;

    controllers.items.ItemDetails.prototype._onClearSold = function _onClearSold() {
        onClearSold.call(this);
        
        const item = this._viewmodel.current();
        const auctionData = item.getAuctionData();

        if (!auctionData.isSold()) return;

        triggerEvent(EVENTS.ITEMS_SOLD, { items: [item] });
    }

    const UTTransferListViewController_clearSold = UTTransferListViewController.prototype._clearSold;
    UTTransferListViewController.prototype._clearSold = function _clearSold() {
        UTTransferListViewController_clearSold.call(this);
        
        const items = this.getView().getSection(UTTransferSectionListViewModel.SECTION.SOLD).listRows.map(x => x.data).filter(x => x.getAuctionData().isSold());
        triggerEvent(EVENTS.ITEMS_SOLD, { items: items });
    }
}