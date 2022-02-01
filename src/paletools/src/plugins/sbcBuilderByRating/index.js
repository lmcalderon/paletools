let plugin;

// #if process.env.SBC_BUILDER_BY_RATING
import styles from "./styles.css";
import UTLabelWithTextInputControl from "../../controls/UTLabelWithTextInputControl";
import localize from "../../localization";
import settings, { saveConfiguration } from "../../settings";
import { addLabelWithToggle } from "../../controls";
import { EVENTS, on } from "../../events";
import { hide, show } from "../../utils/visibility";
import { addStyle, removeStyle } from "../../utils/styles";


const cfg = settings.plugins.sbcBuilderByRating;

function addStyles() {
    addStyle('paletools-sbc-builder-by-rating', styles);
}

function removeStyles() {
    removeStyle('paletools-sbc-builder-by-rating');
}

function run() {

    const UTSquadBuilderView_generate = UTSquadBuilderView.prototype._generate;
    UTSquadBuilderView.prototype._generate = function _generate() {
        UTSquadBuilderView_generate.call(this);

        if (!cfg.enabled) return;

        if (!this._paletoolsGenerated) {
            this._ratingTitle = document.createElement("h4");
            this._ratingTitle.textContent = localize("plugins.sbcBuilderByRating.filter.title");
            this.__sortContainer.appendChild(this._ratingTitle);

            this._minRating = new UTLabelWithTextInputControl();
            this._minRating.setLabel(localize("plugins.sbcBuilderByRating.filter.min.label"));

            this._maxRating = new UTLabelWithTextInputControl();
            this._maxRating.setLabel(localize("plugins.sbcBuilderByRating.filter.max.label"));

            const ratingContainer = document.createElement("div");
            ratingContainer.classList.add("sbc-ratings-container");
            ratingContainer.appendChild(this._minRating.getRootElement());
            ratingContainer.appendChild(this._maxRating.getRootElement());

            this.__sortContainer.appendChild(ratingContainer);

            on(EVENTS.APP_ENABLED, () => { addStyles(); show(ratingContainer); });
            on(EVENTS.APP_DISABLED, () => { removeStyles(); hide(ratingContainer); });

            addStyles();

            this._paletoolsGenerated = true;
        }
    }

    const UTSquadBuilderViewController_onClubSearchComplete = UTSquadBuilderViewController.prototype._onClubSearchComplete;
    UTSquadBuilderViewController.prototype._onClubSearchComplete = function _onClubSearchComplete(t, e) {
        if (cfg.enabled) {
            const minRating = this.getView()._minRating.getInputValue();
            const maxRating = this.getView()._maxRating.getInputValue();

            e.data.items = e.data.items.filter(x => {
                if (minRating && x.rating < minRating) {
                    return false;
                }

                if (maxRating && x.rating > maxRating) {
                    return false;
                }

                return true;
            });
        }

        UTSquadBuilderViewController_onClubSearchComplete.call(this, t, e);
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
    order: 6,
    menu: menu,
    settings: {
        name: 'sbc-builder-by-rating',
        title: 'plugins.sbcBuilderByRating.settings.title',
        menu: menu
    }
}
// #endif

export default plugin;
