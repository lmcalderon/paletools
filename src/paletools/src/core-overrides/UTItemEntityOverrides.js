import db from "../services/db";
import { logDebug } from "../services/log";
import { getPriceAfterTax } from "../services/market";

export default function executeItemEntityOverrides() {

    function calculateProfit(buyPrice, sellPrice) {
        const profit = Math.round((getPriceAfterTax(sellPrice) - buyPrice) * 100) / 100;
        const profitPerc = Math.round((profit / sellPrice) * 10000) / 100;

        return [profit, profitPerc];
    }

    UTItemEntity.prototype.getStaticDataId = function() {
        if(this.type !== ItemType.PLAYER) return 0;

        const staticData = this.getStaticData();
        let staticId = staticData.assetId;

        if(staticId) return staticId;

        if(repositories.Item.getStaticDataByDefId(this.definitionId)){
            return this.definitionId;
        }

        const allPlayers = repositories.Item.getStaticData();

        let staticPlayer = allPlayers.find(x => x.firstName === staticData.firstName && x.lastName === staticData.lastName && x.rating == this.rating);

        if(staticPlayer) {
            return staticPlayer.id;
        } 

        staticPlayer = allPlayers.find(x => x.firstName === staticData.firstName && x.lastName === staticData.lastName);

        if(staticPlayer) {
            return staticPlayer.id;
        } 

        return 0;
    }

    UTItemEntity.prototype.getAuctionProfit = function (sellPrice) {
        return new Promise(resolve => {
            const calc = buyPrice => {

                if (!sellPrice) {
                    const auctionData = this.getAuctionData();
                    sellPrice = auctionData.isSold()
                        ? auctionData.currentBid
                        : auctionData.currentBid > 0
                            ? auctionData.currentBid
                            : auctionData.buyNowPrice;
                }

                resolve(calculateProfit(buyPrice, sellPrice));
            }

            if (this.lastSalePrice > 0 || this.hasOwnProperty("hasBuyInfo")) {
                calc(this.lastSalePrice);
            }
            else {
                db.transactions.getBuyByItemId(this.id).then(tx => {
                    if (tx && tx.price) {
                        this.hasBuyInfo = true;
                        this.lastSalePrice = tx.price;
                        calc(tx.price);
                    }
                    else {
                        this.hasBuyInfo = false;
                        calc(0);
                    }
                });
            }
        });
    }
}