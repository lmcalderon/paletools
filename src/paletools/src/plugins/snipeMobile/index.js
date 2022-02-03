

let plugin;

/// #if process.env.SNIPE_MOBILE
import localize from "../../localization";
import getCurrentController from "../../utils/controller";

function run(){

    let _isBuyNow = false;

    const UTTabBarView__generate = UTTabBarView.prototype._generate;
    UTTabBarView.prototype._generate = function () {
        UTTabBarView__generate.call(this);
        if (!this.snipeMobile) {

            const html = `<nav class="ut-tab-bar" id="snipeMobile-buttons" style="height:100px; border-top:1px solid #ababab">
                            <select id="snipeMobile-choice" style="background-color:#33353c;color:#cbdae5;border-right:1px solid #ababab">
                                <option value="inc-buy-now">${localize("plugins.snipeMobile.options.incbuy")}</option>
                                <option value="inc-bid">${localize("plugins.snipeMobile.options.incbid")}</option>
                            </select>
                            <button id="snipeMobile-snipe" class="ut-tab-bar-item" ontouchstart="javascript: window.palesnipe.botMode()"><span>${localize("plugins.snipeMobile.buttons.snipe")}</span></button>
                        </nav>`;

            $(this.getRootElement()).append(html);

            $("#snipeMobile-snipe", this.getRootElement()).bind("touchstart", () => {
                snipe($("#snipeMobile-choice", this.getRootElement()).val());
            });

            this.snipeMobile = true;
        }
    }


    const ItemDetails__renderPanel = controllers.items.ItemDetails.prototype._renderPanel;
    controllers.items.ItemDetails.prototype._renderPanel = function _renderPanel(e) {
        ItemDetails__renderPanel.call(this, e);

        if (_isBuyNow) {
            const controller = getCurrentController();
            controller._requestedBid = controller._currentAuction.buyNowPrice;
            controller._eBidConfirmed();
            _isBuyNow = false;
            back();
        }
    }

    const
        snipe = action => {
            const controller = getCurrentController();
            if (controller instanceof UTMarketSearchFiltersViewController) {
                if (action === "inc-bid") {
                    incrementMinBid();
                    search();
                }
                else {
                    incrementMinBuyNow();
                    search();
                }
            }
            else if (controller instanceof UTMarketSearchResultsSplitViewController ||
                controller instanceof UTMarketSearchResultsViewController) {
                buyNow();
            }
        },

        incrementMinBid = () => {
            const controller = getCurrentController();
            if (!(controller instanceof UTMarketSearchFiltersViewController)) return;

            controller.getView()._minBidPriceRow._currencyInput.beginIncrease();
            controller.getView()._minBidPriceRow._currencyInput.endIncrease();
        },
        incrementMinBuyNow = () => {
            const controller = getCurrentController();
            if (!(controller instanceof UTMarketSearchFiltersViewController)) return;

            controller.getView()._minBuyNowPriceRow._currencyInput.beginIncrease();
            controller.getView()._minBuyNowPriceRow._currencyInput.endIncrease();
        },
        search = () => {
            const controller = getCurrentController();
            if (!(controller instanceof UTMarketSearchFiltersViewController)) return;
            controller.getView().eSearchButtonSelected();
        },
        back = () => {
            getCurrentController().getNavigationController()._eBackButtonTapped();
        },
        buyNow = () => {
            let controller = getCurrentController();
            if (controller instanceof UTMarketSearchResultsViewController) {
                if (controller.getView()._list.listRows.length > 0) {
                    controller.getView()._list.listRows[0]._tapDetected();
                    _isBuyNow = true;
                }
                else {
                    back();
                }
            }

        };

}

let plugin = {
    run: run,
};
///#endif
export default plugin;