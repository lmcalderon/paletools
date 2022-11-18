import { EVENTS, triggerEvent } from "../events";

export default function executeUnassignedItemsViewControllerOverrides() {
    const UTUnassignedItemsViewController__onMoveToClubComplete = UTUnassignedItemsViewController.prototype._onMoveToClubComplete;
    UTUnassignedItemsViewController.prototype._onMoveToClubComplete = function _onMoveToClubComplete(e, t) {
        UTUnassignedItemsViewController__onMoveToClubComplete.call(this, e, t);

        const movableItems = this._viewmodel.getMovableItems();
        const movedItemIds = t.data.itemIds;

        for(let item of movableItems){
            if(movedItemIds.indexOf(item.id) === -1) continue;

            triggerEvent(EVENTS.ITEM_MOVED, {
                item: item,
                itemPile: ItemPile.CLUB
            });
        }
    }
}