import { EVENTS, triggerEvent } from "../events";

const soldItemsCache = {};

export default function executeTransferListViewControllerOverrides() {
    const UTTransferListViewController_requestItems = UTTransferListViewController.prototype._requestItems;
    UTTransferListViewController.prototype._requestItems = function () {
        UTTransferListViewController_requestItems.call(this);

        this.onDataChange.observe(this, (sender, data) => {
            let itemsToSend = [];

            for(let item of data.items) {
                if(!soldItemsCache[item.id]){
                    soldItemsCache[item.id] = item;
                    itemsToSend.push(item);
                }
            }

            triggerEvent(EVENTS.ITEMS_SOLD, { items: itemsToSend });
        });
    }
}