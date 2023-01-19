import localize from "../localization";
import Cache from "../services/caching/Cache";
import CacheEntry from "../services/caching/cacheEntry";
import { getUnassignedPlayersCount } from "../services/club";
import getWindow from "../services/window";

let plugin;

/// #if process.env.UNASSIGNED_LIMBO
plugin = {
    run: () => {
        const cache = new Cache(1000 * 60 * 5); // 5 minutes exp

        getWindow().MAX_NEW_ITEMS = Number.MAX_VALUE;

        const UTUnassignedTileView_setNumberOfItems = UTUnassignedTileView.prototype.setNumberOfItems;
        UTUnassignedTileView.prototype.setNumberOfItems = function (...args) {
            UTUnassignedTileView_setNumberOfItems.call(this, ...args);

            let unassignedCount = args[0];

            if (unassignedCount === 50) {
                unassignedCount = cache.get("count");
                if (unassignedCount) {
                    UTUnassignedTileView_setNumberOfItems.call(this, unassignedCount);
                }
                else {
                    UTUnassignedTileView_setNumberOfItems.call(this, localize("loading"));
                    (async () => {
                        unassignedCount = await getUnassignedPlayersCount();
                        UTUnassignedTileView_setNumberOfItems.call(this, unassignedCount);
                        cache.set("count", unassignedCount);
                    })();
                }
            }
        }
    }
};
/// #endif

export default plugin;