import delay from "../utils/delay";
import { toPromise } from "../utils/observable";
import sendPinEvents from "./pinEvents";

const PAGE_SIZE = 20;
const MIN_BUY_NOW_COUNT = 3;

const itemActionController = new UTItemActionController();

export function tryBuyItem(items) {
	if (!items || items.length === 0) return false;

	return new Promise((resolve, reject) => {
		if (!items || items.length === 0) {
			resolve(false);
			return;
		}

		for (let item of items) {
			const auction = item._auction;
			if (auction._tradeState === AuctionTradeStateEnum.ACTIVE) {
				itemActionController.bid(item, auction.buyNowPrice).observe(this, function (e, t) {
					e.unobserve(this);
					if (t.success) {
						resolve({ success: true, item: item });
					}
					else {
						resolve({ success: false, item: item });
					}
				});
				break;
			}
		}
	});
}

export async function listItemOnTransferMarket(item, sellPrice, startPrice, ignoreCardIfOffLimits) {
	await getPriceLimits(item);
	if (sellPrice) {
		if (item.hasPriceLimits()) {
			if (!ignoreCardIfOffLimits) {
				sellPrice = computeSellPrice(sellPrice, item);
			} else if (sellPrice < item._itemPriceLimits.minimum || sellPrice > item._itemPriceLimits.maximum) {
				return;
			}
		}
		sellPrice = roundOffPrice(sellPrice, 200);
		services.Item.list(
			item,
			startPrice || getSellBidPrice(sellPrice),
			sellPrice,
			3600
		);
	}

	return sellPrice;
};

export async function findLowestMarketPrice(playerId) {
	const searchCriteria = new UTSearchCriteriaDTO();
	const searchModel = new UTBucketedItemSearchViewModel();
	searchCriteria.type = SearchType.PLAYER;
	searchCriteria.defId = [playerId];
	searchCriteria.category = SearchCategory.ANY;
	searchModel.searchFeature = enums.ItemSearchFeature.MARKET;
	searchModel.defaultSearchCriteria.type = searchCriteria.type;
	searchModel.defaultSearchCriteria.category = searchCriteria.category;

	let minBuyNowArr = [];
	let iteration = 0;
	while (true) {
		if(++iteration === 10){
			break;
		}

		sendPinEvents("Transfer Market Search");
		services.Item.clearTransferMarketCache();
		searchModel.updateSearchCriteria(searchCriteria);

		let items = await performMarketSearch(searchModel.searchCriteria);
		if(items.length === 0){
			break;
		}

		const minBuyNow = Math.min(...items.map(x => x._auction.buyNowPrice));
		minBuyNowArr.unshift({ value: minBuyNow, count: items.filter(x => x._auction.buyNowPrice === minBuyNow).length });
		searchCriteria.maxBuy = roundOffPrice(getSellBidPrice(minBuyNow));

		if(items.length < searchModel.searchCriteria.count){
			break;
		}

		await delay(100, 300);
	}


	return minBuyNowArr.slice(0, 3);
}

function performMarketSearch(criteria) {
	return new Promise((resolve, reject) => {
		services.Item.searchTransferMarket(criteria, 1).observe(
			this,
			(sender, response) => {
				if (response.success) {
					sendPinEvents("Transfer Market Results - List View");
					sendPinEvents("Item - Detail View");
					resolve(response.data.items);
				} else {
					resolve([]);
				}
			}
		)});
}

function computeSellPrice(sellPrice, item) {
	sellPrice = roundOffPrice(
		Math.min(
			item._itemPriceLimits.maximum,
			Math.max(item._itemPriceLimits.minimum, sellPrice)
		)
	);

	if (sellPrice === item._itemPriceLimits.minimum) {
		sellPrice = getBuyBidPrice(sellPrice);
	}

	return sellPrice;
}

async function getPriceLimits(item) {
	return new Promise((resolve) => {
		if (item.hasPriceLimits()) {
			resolve();
			return;
		}
		services.Item.requestMarketData(item).observe(
			this,
			async function () {
				resolve();
			}
		);
	});
}

export function getSellBidPrice(bin) {
	if (bin <= 1000) return bin - 50;
	if (bin > 1000 && bin <= 10000) return bin - 100;
	if (bin > 10000 && bin <= 50000) return bin - 250;
	if (bin > 50000 && bin <= 100000) return bin - 500;
	return bin - 1000;
}

export function getBuyBidPrice(bin) {
	if (bin < 1000) return bin + 50;
	if (bin >= 1000 && bin < 10000) return bin + 100;
	if (bin >= 10000 && bin < 50000) return bin + 250;
	if (bin >= 50000 && bin < 100000) return bin + 500;
	return bin + 1000;
}

export function roundOffPrice(price, minVal = 0) {
	let range = JSUtils.find(UTCurrencyInputControl.PRICE_TIERS, function (e) {
		return price >= e.min;
	});
	var nearestPrice = Math.round(price / range.inc) * range.inc;
	return Math.max(Math.min(nearestPrice, 14999000), minVal);
}