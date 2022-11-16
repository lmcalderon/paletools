import { EVENTS, triggerEvent } from "../events";

export default function executeItemActionControllerOverrides() {
    const UTItemActionController_bid = UTItemActionController.prototype.bid;
    UTItemActionController.prototype.bid = function (item, bid) {
        const observable = UTItemActionController_bid.call(this, item, bid);

        observable.observe(this, (sender, response) => {
            sender.unobserve(this);

            if (response.success && item.getAuctionData().isWon()) {
                triggerEvent(EVENTS.ITEM_WON, { item: item, bid: bid });
            }
        });

        return observable;
    }

    const UTItemActionController_move = UTItemActionController.prototype.move;
    UTItemActionController.prototype.move = function (item, itemPile) {
        const observable = UTItemActionController_move.call(this, item, itemPile);

        observable.observe(this, (sender, response) => {
            sender.unobserve(this);

            if(response.success){
                triggerEvent(EVENTS.ITEM_MOVED, { item: item, itemPile: itemPile });
            }
        });

        return observable;
    }
}