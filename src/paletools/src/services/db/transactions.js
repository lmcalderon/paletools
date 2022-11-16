import { EVENTS, on } from "../../events";
import { getUnassignedPlayers } from "../club";
import { dateToInt } from "../date";
import { logDebug } from "../log";
import { getTransferListItems, getWatchedItems } from "../market";
import { loadClubPlayers } from "../ui/club";

const TX_BUY_NAME = "transactions_bought";
const TX_SELL_NAME = "transactions_sold";
const EPOCH_THRESHOLD = 1577836800000;

export class TransactionsStore {
    #db;

    constructor(db) {
        this.#db = db;
    }

    async #insertRecord(store, item, price, getFunc) {
        if (!this.#db) return;

        const storedItem = await getFunc(item.id);

        if (storedItem) return;

        let timestamp = item.timestamp;

        if (timestamp < EPOCH_THRESHOLD) {
            timestamp *= 1000;
        }

        const auctionData = item.getAuctionData();

        price = price || item.lastSalePrice || auctionData.currentBid;

        if(price < 200) return;

        try {
            this.#db.addRecord(store, {
                itemId: item.id,
                definitionId: item.definitionId,
                staticDataId: item.getMetaData().id,
                rating: item.rating,
                price: price || auctionData.currentBid,
                auctionId: auctionData.tradeId,
                itemType: item.type,
                timestamp: dateToInt(new Date(timestamp))
            });
        }
        catch (ex) {
            logDebug(ex);
        }
    }

    async build(version = 1) {
        logDebug(`Building for v${version}`);
        if (version < 2) {
            this.drop();
        }

        if (!version || version === 1) {
            logDebug(`Creating object store ${TX_BUY_NAME}`);
            const buyStore = this.#db.createStore(TX_BUY_NAME, { keyPath: "itemId" });
            buyStore.createIndex("definitionId", "definitionId", { unique: false })
            buyStore.createIndex("timestamp", "timestamp", { unique: false });


            logDebug(`Creating object store ${TX_SELL_NAME}`);
            const sellStore = this.#db.createStore(TX_SELL_NAME, { keyPath: "itemId" });
            sellStore.createIndex("definitionId", "definitionId", { unique: false })
            sellStore.createIndex("timestamp", "timestamp", { unique: false });
        }

        on(EVENTS.APP_LOADED, () => {
            // scan club for bought players
            this.scan();
        });
    }

    async drop() {
        try {
            this.#db.deleteStore(TX_BUY_NAME);
        }
        catch { }
        try {
            this.#db.deleteStore(TX_SELL_NAME);
        }
        catch { }
    }

    async scan() {
        const club = await loadClubPlayers();
        for (let playerId of Object.keys(club).filter(x => club[x].lastSalePrice > 0)) {
            const player = club[playerId];
            logDebug(player);
            this.insertBuy(player, player.lastSalePrice, player.timestamp);
        }

        try {
            let items = await getTransferListItems();
            for (let item of items.filter(x => x.lastSalePrice > 0)) {
                this.insertBuy(item, item.lastSalePrice, item.timestamp);
            }

            for (let item of item.filter(x => x.getAuctionData().isSold())) {
                this.insertSell(item);
            }
        }
        catch {
        }

        try {
            let items = await getUnassignedPlayers();
            for (let item of items.filter(x => x.lastSalePrice > 0)) {
                this.insertBuy(item, item.lastSalePrice, item.timestamp);
            }
        }
        catch {

        }

        try {
            let items = await getWatchedItems();
            for (let item of items.filter(x => x.getAuctionData().isWon())) {
                this.insertBuy(item);
            }
        }
        catch {

        }
    }

    getBuyCount() {
        return this.#db.executeQuery(TX_BUY_NAME, store => store.count());
    }

    getSellCount() {
        return this.#db.executeQuery(TX_SELL_NAME, store => store.count());
    }

    getBuyCountByDateRange(from, to) {
        const keyRange = IDBKeyRange.bound(dateToInt(from), dateToInt(to));
        return this.#db.executeQuery(TX_BUY_NAME, store => store.index("timestamp").count(keyRange));
    }

    getBuyByDateRange(from, to) {
        const keyRange = IDBKeyRange.bound(dateToInt(from), dateToInt(to));
        return this.#db.executeQuery(TX_BUY_NAME, store => store.index("timestamp").getAll(keyRange));
    }

    getSellCountByDateRange(from, to) {
        const keyRange = IDBKeyRange.bound(dateToInt(from), dateToInt(to));
        return this.#db.executeQuery(TX_SELL_NAME, store => store.index("timestamp").count(keyRange));
    }

    getSellByDateRange(from, to) {
        const keyRange = IDBKeyRange.bound(dateToInt(from), dateToInt(to));
        return this.#db.executeQuery(TX_SELL_NAME, store => store.index("timestamp").getAll(keyRange));
    }

    getAllBuy() {
        return this.#db.executeQuery(TX_BUY_NAME, store => store.getAll());
    }

    getAllSell() {
        return this.#db.executeQuery(TX_SELL_NAME, store => store.getAll());
    }

    getBuyByItemId(itemId) {
        return this.#db.executeQuery(TX_BUY_NAME, store => store.get(itemId));
    }

    getSellByItemId(itemId) {
        return this.#db.executeQuery(TX_SELL_NAME, store => store.get(itemId));
    }

    async insertMultipleBuy(items) {
        for (let item of items) {
            this.insertBuy(item);
        }
    }

    insertBuy(item, buyPrice) {
        if (!this.#db) return;
        if (buyPrice < 200) return;

        this.#insertRecord(TX_BUY_NAME, item, buyPrice, id => this.getBuyByItemId(id));
    }

    async insertMultipleSell(items) {
        for (let item of items) {
            this.insertSell(item);
        }
    }

    async insertSell(item, sellPrice) {
        if (!this.#db) return;
        if (sellPrice < 200) return;

        this.#insertRecord(TX_SELL_NAME, item, sellPrice, id => this.getSellByItemId(id));
    }
}