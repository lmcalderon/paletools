
let plugin;

/// #if process.env.SNIPE_MOBILE
import { getUnnasignedPlayers } from "../../services/club";
import { enableMarketSnipe } from "../../services/ui/market";
import { incrementPriceRow } from "../../services/ui/search";
import { append, select } from "../../utils/dom";

function run(){

    let _tryToSnipe = false;
    const UTMarketSearchFiltersView__generate = UTMarketSearchFiltersView.prototype._generate;
    
    UTMarketSearchFiltersView.prototype._generate = function _generate() {
        UTMarketSearchFiltersView__generate.call(this);

        this._snipeButton = new UTStandardButtonControl();
        this._snipeButton.init();
        this._snipeButton.setText("SNIPE");
        this._snipeButton.addTarget(this, () => {
            _tryToSnipe = true;

            incrementPriceRow(this._minBidPriceRow, this._maxBuyNowPriceRow);
            this._triggerActions(UTMarketSearchFiltersView.Event.SEARCH);
        }, EventType.TAP);
        this._snipeButton.getRootElement().classList.add("call-to-action");
        this._snipeButton.getRootElement().classList.add("snipe")

        append(select(".button-container", this.__searchContainer), this._snipeButton.getRootElement());
    }

    const UTMarketSearchFiltersView_destroyGeneratedElements = UTMarketSearchFiltersView.prototype.destroyGeneratedElements;
    UTMarketSearchFiltersView.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
        UTMarketSearchFiltersView_destroyGeneratedElements.call(this);

        this._snipeButton.destroy();
    }

    enableMarketSnipe(
        () => _tryToSnipe,
        () => {
            _tryToSnipe = false;
        }, ()=> {
            getUnnasignedPlayers();
        });
}

plugin = {
    run: run,
};
///#endif
export default plugin;