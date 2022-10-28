
let plugin;


/// #if process.env.SNIPE_MOBILE
import { addLabelWithToggle } from "../../controls";
import { getUnassignedPlayers } from "../../services/club";
import { addSnipeRequest, addSnipeRequestNoBack, enableMarketSnipe } from "../../services/ui/market";
import { incrementPriceRow } from "../../services/ui/search";
import { addClass, append, createElem, select } from "../../utils/dom";
import settings, { saveConfiguration } from "../../settings";
import { EVENTS, on } from "../../events";
import { navigateBack } from "../../services/ui/navigation";
import localize from "../../localization";

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
            if (cfg.autoBack) {
                addSnipeRequest();
            }
            else {
                addSnipeRequestNoBack();
            }

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

    const UTMarketSearchView_setEmptyListMessage = UTMarketSearchView.prototype.setEmptyListMessage;
    UTMarketSearchView.prototype.setEmptyListMessage = function (e) {
        UTMarketSearchView_setEmptyListMessage.call(this, e);
    }

    const UTMarketSearchView_generate = UTMarketSearchView.prototype._generate;
    UTMarketSearchView.prototype._generate = function _generate() {
        UTMarketSearchView_generate.call(this);
        const container = createElem("div", { className: "button-container"});
        this._goBackButton = new UTStandardButtonControl();
        this._goBackButton.init();
        this._goBackButton.setText(localize("plugins.snipeMobile.button.goBack"));
        this._goBackButton.addTarget(this, () => navigateBack(), EventType.TAP);
        addClass(this._goBackButton.getRootElement(), "call-to-action");

        append(container, this._goBackButton);
        append(this.getRootElement(), container);
    }

    const UTMarketSearchView_destroyGeneratedElements = UTMarketSearchView.prototype.destroyGeneratedElements;
    UTMarketSearchView.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
        UTMarketSearchView_destroyGeneratedElements.call(this);
        this._goBackButton.dealloc();
    }
}

function menu() {
    const container = document.createElement("div");
    addLabelWithToggle(container, "enabled", cfg.enabled, toggleState => {
        cfg.enabled = toggleState;
        saveConfiguration();
    });

    addLabelWithToggle(container, "plugins.snipeMobile.settings.autoBack", cfg.autoBack, toggleState => {
        cfg.autoBack = toggleState;
        saveConfiguration();
    });

    return container;
}

plugin = {
    run: run,
    settings: {
        name: "snipeMobile",
        title: 'plugins.snipeMobile.settings.title',
        menu: menu
    },
    order: 0
};
///#endif
export default plugin;