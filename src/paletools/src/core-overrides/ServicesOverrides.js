import db from "../services/db";

export default function executeServicesOverrides() {

    const itemList = services.Item.list;

    services.Item.list = function(...args) {
        const player = args[0];

        if(player.lastSalePrice) {
            db.transactions.insertBuy(player, player.lastSalePrice);
        }

        return itemList.call(this, ...args);
    }
}