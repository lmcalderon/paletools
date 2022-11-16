import { EVENTS, triggerEvent } from "../events";

const watchedItemsCache = {};

export default function executeWatchListViewControllerOverrides() {
    const UTWatchListViewController_requestItems = UTWatchListViewController.prototype._requestItems;
    UTWatchListViewController.prototype._requestItems = function () {
        UTWatchListViewController_requestItems.call(this);

        this.onDataChange.observe(this, (sender, data) => {
            let itemsToSend = [];

            for(let item of data.items.filter(x => x.getAuctionData().isWon())) {
                if(!watchedItemsCache[item.id]){
                    watchedItemsCache[item.id] = item;
                    itemsToSend.push(item);
                }
            }

            triggerEvent(EVENTS.ITEMS_WON, { items: itemsToSend });
        });
    }
}