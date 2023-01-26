import { toArray } from "../../utils/array";
import { logDebug } from "../log";

const STORE_NAME = "unassigned";
const STORE_DEF_NAME = "unassigned_defs";
const IDX_DEFID = "definitionId";

const cache = {};

export class UnassignedStore {
    #db;

    constructor(db) {
        this.#db = db;
    }

    async build(version = 1) {
        logDebug(`Building for v${version}`);

        if (version < 6) {
            logDebug(`Creating object store ${STORE_NAME}`);
            const store = this.#db.createStore(STORE_NAME, { keyPath: "id" });
            store.createIndex(IDX_DEFID, "resourceId", { unique: false });

            logDebug(`Creating object store ${STORE_DEF_NAME}`);
            this.#db.createStore(STORE_DEF_NAME);
        }
    }

    async drop() {
        try {
            this.#db.deleteStore(STORE_NAME);
        }
        catch { }
        try {
            this.#db.deleteStore(STORE_DEF_NAME);
        }
        catch { }
    }

    getCountByDefinitionId(definitionId) {
        return this.#db.executeQuery(STORE_NAME, store => store.index(IDX_DEFID).count(IDBKeyRange.only(definitionId)));
    }

    getCount() {
        return this.#db.executeQuery(STORE_NAME, store => store.count());
    }

    getDefinitionIds() {
        return this.#db.executeQuery(STORE_DEF_NAME, store => store.getAll());
    }

    async deleteById(id) {
        const item = await this.get(id);
        if (!item) return;

        if (cache[id]) {
            delete cache[id];
        }

        try {
            await this.#db.executeNonQuery(STORE_NAME, store => store.delete(id));
        } catch {
        }
        const count = await this.getCountByDefinitionId(item.definitionId);
        if (count > 0) return;

        try {
            await this.#db.executeNonQuery(STORE_DEF_NAME, store => store.delete(item.definitionId));
        }
        catch {
        }
    }

    async getAllByDefinitionId(definitionId) {
        const requestItems = await this.#db.executeQuery(STORE_NAME, store => store.index(IDX_DEFID).getAll(IDBKeyRange.only(definitionId)));
        return requestItems.map(x => this.#convertToItem(x));
    }

    async getFirstByDefinitionId(definitionId) {
        const item = this.#convertToItem(await this.#db.executeQuery(STORE_NAME, store => store.index(IDX_DEFID).get(IDBKeyRange.only(definitionId))));

        if(!item) return null;

        cache[item.id] = item;

        return item;
    }

    async get(id) {
        if (cache[id]) return cache[id];

        const item = await this.#convertToItem(await this.#db.executeQuery(STORE_NAME, store => store.get(id)));

        if(item == null) return null;

        cache[id] = item;

        return item;
    }

    async getAll() {
        const requestItems = await this.#db.executeQuery(STORE_NAME, store => store.getAll());
        return requestItems.map(x => {
            const item = this.#convertToItem(x);
            cache[item.id] = item;
            return item;
        });
    }

    async clear() {
        await this.#db.clearStore(STORE_NAME);
        await this.#db.clearStore(STORE_DEF_NAME);
    }

    async insertItem(item) {
        if (!item.definitionId) return;
        if (cache[item.id]) return;

        const storedItem = await this.get(item.id);
        if (storedItem) return;

        await this.#db.addRecord(STORE_NAME, this.#convertToRequestItem(item));

        const definitionId = await this.#db.executeQuery(STORE_DEF_NAME, store => store.get(item.definitionId));

        if (!definitionId) {
            await this.#db.addRecord(STORE_DEF_NAME, item.definitionId, item.definitionId);
        }

        cache[item.id] = item;
    }

    #convertToItem(requestItem) {
        if(!requestItem) return null;

        return factories.Item.createItem(requestItem);
    }

    #convertToRequestItem(item) {
        return {
            id: item.id,
            resourceId: item.definitionId,
            itemType: item.type,
            cardassetid: item._assetId,
            cardsubtypeid: item.subtype,
            untradeable: item.untradeable,
            lastSalePrice: item.lastSalePrice,
            discardValue: item.discardValue,
            itemState: item.state,
            pile: item.pile,
            duplicateItemId: item.duplicateId,
            amount: item.amount,
            rating: item.rating,
            teamId: item.teamId,
            leagueId: item.leagueId,
            nation: item.nationId,
            rareflag: item.rareflag,
            groups: item.groups,
            owners: item.owners,
            timestamp: item.timestamp,
            guidAssetId: item.guidAssetId,
            rankId: item.rankId,
            startTime: item.startTime,
            endTime: item.endTime,
            discardable: item.discardable,
            bannerRestricted: item.bannerRestricted,
            tifoRestricted: item.tifoRestricted,
            authenticity: item.authenticity,
            dream: item.concept,
            contract: item.contract,
            loans: item.loans,
            injuryType: item.injuryType,
            injuryGames: item.injuryGames,
            loyaltyBonus: item.loyaltyBonus,
            attributeArray: item._attributes,
            lifetimeStatsArray: item._lifetimeStats,
            statsArray: item._stats,
            preferredPosition: PlayerPosition[item.preferredPosition],
            possiblePositions: item.possiblePositions ? toArray(item.possiblePositions).map(x => PlayerPosition[x]) : [],
            skillmoves: item._skillMoves,
            weakfootabilitytypecode: item._weakFoot,
            attackingworkrate: item._offensiveWorkRate,
            defensiveworkrate: item._defensiveWorkRate,
            preferredfoot: item._preferredFoot,
            marketDataMinPrice: item._itemPriceLimits ? item._itemPriceLimits.minimum : null,
            marketDataMaxPrice: item._itemPriceLimits ? item._itemPriceLimits.maximum : null
        };
    }
}