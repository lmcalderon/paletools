import delay from "../utils/delay";
import sendPinEvents from "./pinEvents";

const PAGE_SIZE = 20;
const MIN_BUY_NOW_COUNT = 3;

export function findLowestMarketPrice(playerId, page = 1) {
	services.Item.clearTransferMarketCache();
	return findLowestMarketPriceInternal(playerId, page);
}

async function findLowestMarketPriceInternal(playerId, page = 1) {
	let result = await findLowestMarketPriceForPage(playerId, page, MIN_BUY_NOW_COUNT);

	let minBuyNow = result.minBuyNow;
	if (result.hasNextPage) {
		await delay(100, 300);
		let cmpResult = await findLowestMarketPriceInternal(playerId, page + 1);

		for (let result of cmpResult) {
			let minBuyNowIndex = minBuyNow.findIndex(x => x.value === result.value);
			if (minBuyNowIndex > -1) {
				minBuyNow[minBuyNowIndex].count++;
			}
			else {
				minBuyNow.push(result);
			}
		}

		minBuyNow.sort((a, b) => a.value - b.value);
		minBuyNow = minBuyNow.slice(0, MIN_BUY_NOW_COUNT);
	}

	return minBuyNow;
}

function findLowestMarketPriceForPage(playerId, page, minBuyCount) {
	return new Promise((resolve, reject) => {
		const criteria = new UTSearchCriteriaDTO();
		criteria.defId = [playerId];
		let minBuyNow = [];

		function sortMinBuyNow() {
			if (minBuyNow.length <= 1) return;

			minBuyNow.sort((a, b) => {
				return a.value - b.value;
			});
		}

		function updateMinBuyNow(buyNowPrice) {
			if (minBuyNow.length < minBuyCount) {
				const minBuyNowIndex = minBuyNow.findIndex(x => x.value === buyNowPrice);
				if (minBuyNowIndex === -1) {
					minBuyNow.push({ value: buyNowPrice, count: 1 });
					sortMinBuyNow();
				}
				else {
					minBuyNow[minBuyNowIndex].count++;
				}
			}
			else {
				if (buyNowPrice < minBuyNow[minBuyCount - 1].value) {
					minBuyNow[minBuyCount - 1] = { value: buyNowPrice, count: 1 };
					sortMinBuyNow();
				}
				else {
					const minBuyNowIndex = minBuyNow.findIndex(x => x.value === buyNowPrice);
					if (minBuyNowIndex > -1) {
						minBuyNow[minBuyNowIndex].count++;
					}
				}
			}
		}

		services.Item.searchTransferMarket(criteria, page).observe(this, (sender, response) => {
			if (response.success) {
				if (response.data.items.length > 0) {
					if (page === 1) {
						sendPinEvents("Transfer Market Results - List View");
					}

					for (let playerIndex = 0; playerIndex < response.data.items.length; playerIndex++) {
						const buyNowPrice = response.data.items[playerIndex]._auction.buyNowPrice;
						updateMinBuyNow(buyNowPrice);
					}

					resolve({ minBuyNow: minBuyNow, hasNextPage: response.data.items.length === PAGE_SIZE + 1 });
				}
			}
			else {
				reject(response.error);
			}
		});
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

function getBuyBidPrice(bin) {
	if (bin < 1000) return bin + 50;
	if (bin >= 1000 && bin < 10000) return bin + 100;
	if (bin >= 10000 && bin < 50000) return bin + 250;
	if (bin >= 50000 && bin < 100000) return bin + 500;
	return bin + 1000;
}

function roundOffPrice(price, minVal = 0) {
	let range = JSUtils.find(UTCurrencyInputControl.PRICE_TIERS, function (e) {
		return price >= e.min;
	});
	var nearestPrice = Math.round(price / range.inc) * range.inc;
	return Math.max(Math.min(nearestPrice, 14999000), minVal);
}