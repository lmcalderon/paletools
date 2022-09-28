const itemActionController = new UTItemActionController();

export function tryBuyItem(items) {
    if(!items || items.length === 0) return false;

    return new Promise((resolve, reject) => {
        if(!items || items.length === 0){
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