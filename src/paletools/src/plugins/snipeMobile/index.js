
let plugin;


/// #if process.env.SNIPE_MOBILE
import { addLabelWithToggle } from "../../controls";
import { getUnassignedPlayers } from "../../services/club";
import { addSnipeRequest, enableMarketSnipe } from "../../services/ui/market";
import { incrementPriceRow } from "../../services/ui/search";
import { append, select } from "../../utils/dom";
import settings, { saveConfiguration } from "../../settings";
import { EVENTS, on } from "../../events";

const cfg = settings.plugins.snipe;

function run() {

    enableMarketSnipe();

    const UTMarketSearchFiltersView__generate = UTMarketSearchFiltersView.prototype._generate;

    UTMarketSearchFiltersView.prototype._generate = function _generate() {
        UTMarketSearchFiltersView__generate.call(this);

        if (!cfg.enabled) return;

        this._snipeButton = new UTStandardButtonControl();
        this._snipeButton.init();
        this._snipeButton.setText("SNIPE");
        this._snipeButton.addTarget(this, () => {
            executeSnipe();
        }, EventType.TAP);
        this._snipeButton.getRootElement().classList.add("call-to-action");
        this._snipeButton.getRootElement().classList.add("snipe")

        const executeSnipe = () => {
            addSnipeRequest();

            incrementPriceRow(this._minBidPriceRow, this._maxBuyNowPriceRow);
            this._triggerActions(UTMarketSearchFiltersView.Event.SEARCH);
        }

        append(select(".button-container", this.__searchContainer), this._snipeButton.getRootElement());


        on(EVENTS.SNIPE_EXECUTE, () => executeSnipe);
    }

    const UTMarketSearchFiltersView_destroyGeneratedElements = UTMarketSearchFiltersView.prototype.destroyGeneratedElements;
    UTMarketSearchFiltersView.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
        UTMarketSearchFiltersView_destroyGeneratedElements.call(this);
        if (!cfg.enabled) return;
        this._snipeButton.destroy();
    }
}

function menu() {
    const container = document.createElement("div");
    addLabelWithToggle(container, "enabled", cfg.enabled, toggleState => {
        cfg.enabled = toggleState;
        saveConfiguration();
    });

    return container;
}

plugin = {
    run: run,
    settings: {
        name: "snipe",
        title: 'plugins.snipe.settings.title',
        menu: menu
    },
    order: 0
};
///#endif
export default plugin;