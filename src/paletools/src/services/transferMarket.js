import delay from "../utils/delay";
import http from "./http";

const PAGE_SIZE = 50;

export default async function findLowestMarketPrice(playerId, page = 1) {
	let url = `transfermarket?num=${PAGE_SIZE}&start=${(page - 1) * PAGE_SIZE}&type=player&definitionId=${playerId}`;
	let results = await http(url);
	let minBuyNow = 20000000;
	if(results.auctionInfo.length > 0) {
		for(let index = 0; index < results.auctionInfo.length; index++){
			if(minBuyNow > results.auctionInfo[index].buyNowPrice){
				minBuyNow = results.auctionInfo[index].buyNowPrice;
			}
		}
		
		if(results.auctionInfo.length >= PAGE_SIZE){
            await delay(100);
			let cmpMinBuyNow = await findLowestMarketPrice(playerId, page + 1);
			if(cmpMinBuyNow < minBuyNow){
				minBuyNow = cmpMinBuyNow;
			}
		}
	}

    if(minBuyNow === Number.MAX_VALUE) return;

	return minBuyNow;
}
