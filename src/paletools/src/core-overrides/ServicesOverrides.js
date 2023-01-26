import { EVENTS, triggerEvent } from "../events";
import db from "../services/db";
import { toArray } from "../utils/array";

export default function executeServicesOverrides() {

    const itemList = services.Item.list;
    services.Item.list = function (...args) {
        const player = args[0];

        if (player.lastSalePrice) {
            db.transactions.insertBuy(player, player.lastSalePrice);
        }

        return itemList.call(this, ...args);
    }

    const itemDiscard = services.Item.discard;
    services.Item.discard = function (...args) {
        const observable = itemDiscard.call(this, ...args);
        observable.observe(this, (sender, response) => {
            sender.unobserve(this);
            if (response.success) {
                const items = toArray(args[0]);
                for (const item of items) {
                    triggerEvent(EVENTS.ITEM_DISCARDED, { item: item });
                }
            }
        });

        return observable;
    }

    const itemBid = services.Item.bid;
    services.Item.bid = function (...args) {
        const observable = itemBid.call(this, ...args);
        observable.observe(this, (sender, response) => {
            const [item, bid] = args;
            sender.unobserve(this);
            if (response.success && item.getAuctionData().isWon()) {
                triggerEvent(EVENTS.ITEM_WON, { item: item, bid: bid });
            }
        });

        return observable;
    }

    const itemMove = services.Item.move;
    services.Item.move = function (...args) {
        const observable = itemMove.call(this, ...args);
        observable.observe(this, (sender, response) => {
            sender.unobserve(this);
            if (response.success) {
                const items = toArray(args[0]);
                const pile = args[1];

                for (const item of items) {
                    triggerEvent(EVENTS.ITEM_MOVED, { item: item, itemPile: pile });
                }
            }
        });

        return observable;
    }

    const requestUnassignedItems = services.Item.requestUnassignedItems;
    services.Item.requestUnassignedItems = function (...args) {
        const observable = requestUnassignedItems.call(this, ...args);
        observable.observe(this, (sender, response) => {
            sender.unobserve(this);
            if (response.success) {
                triggerEvent(EVENTS.REQUEST_UNASSIGNED, response.response.items);
            }
        });

        return observable;
    }
}