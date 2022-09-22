let plugin;

// #if process.env.FILTER_SBCS
import styles from "./styles.css";
import { addLabelWithToggle } from "../../controls";
import UTNativeDropDownControl from "../../controls/UTNativeDropDownControl";
import { EVENTS, on } from "../../events";
import localize from "../../localization";
import settings, { saveConfiguration } from "../../settings";
import { addStyle, removeStyle } from "../../utils/styles";
import { hide, show } from "../../utils/visibility";
import { append, detach, insertBefore, select, selectAll } from "../../utils/dom";

const cfg = settings.plugins.filterSbcs;

function run() {

    function searchSbcs(text) {
        for (let sbcTile of selectAll(".ut-sbc-set-tile-view")) {
            show(sbcTile);
            if (text.length > 0 && select(".tileHeader", this).textContent.toLowerCase().indexOf(text.toLowerCase()) === -1) {
                hide(sbcTile);
            }
        };
    }

    function sortSbcs(sortBy) {
        if (sortBy === "") return;

        const parent = select(".SBCHub .layout-hub");
        let sbcs = selectAll(".ut-sbc-set-tile-view", parent);

        detach(sbcs);

        sbcs = sbcs.sort((a, b) => {
            const valueA = parseInt(a.getAttribute(sortBy));
            const valueB = parseInt(b.getAttribute(sortBy));
            return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
        });

        append(parent, sbcs);

        const completedSbcs = selectAll(".complete", parent);
        detach(completedSbcs);
        append(parent, completedSbcs);
    }

    const UTSBCHubView_generate = UTSBCHubView.prototype._generate;
    UTSBCHubView.prototype._generate = function _generate() {
        const self = this;

        function enable() {
            show(self._filterContainer);
            addStyle("paletools-fillSbcs", styles);
        }

        function disable() {
            hide(self._filterContainer);
            removeStyle("paletools-fillSbcs");
        }

        UTSBCHubView_generate.call(this);
        if (cfg.enabled && !this._filterSbcsGenerated) {
            this._filterContainer = document.createElement("div");
            this._filterContainer.id = "filter-sbcs";

            this._searchInput = new UTTextInputControl();
            this._searchInput.init();
            this._searchInput.setPlaceholder(localize("plugins.filterSbcs.label"));
            this._searchInput.getRootElement().id = "search-sbcs";
            on(this._searchInput.getRootElement(), "keyup", ev => {
                searchSbcs(ev.target.value);
            });

            this._sortDropDown = new UTNativeDropDownControl();
            this._sortDropDown.getRootElement().id = "sort-sbcs";
            this._sortDropDown.init();
            this._sortDropDown.setOptions([
                { label: localize("plugins.filterSbcs.sort.label"), value: "" },
                { label: localize("plugins.filterSbcs.sort.byId"), value: "data-id" },
                { label: localize("plugins.filterSbcs.sort.byEndTime"), value: "data-end-time" },
                { label: localize("plugins.filterSbcs.sort.byTimesCompleted"), value: "data-times-completed" },
                { label: localize("plugins.filterSbcs.sort.byChallengesCompletedCount"), value: "data-challenges-completed-count" }
            ]);
            this._sortDropDown.onChange(sortBy => {
                sortSbcs(sortBy);
            });

            this._filterContainer.append(this._searchInput.getRootElement());
            this._filterContainer.append(this._sortDropDown.getRootElement());

            const menuContainer = select(".menu-container", this._SBCCategoriesTM.getRootElement());

            insertBefore(this._filterContainer, menuContainer);

            on(EVENTS.APP_DISABLED, () => disable());
            on(EVENTS.APP_ENABLED, () => enable());

            enable();

            this._filterSbcsGenerated = true;
        }
    }

    const UTSBCHubView_populateTiles = UTSBCHubView.prototype.populateTiles;
    UTSBCHubView.prototype.populateTiles = function (e, t) {
        UTSBCHubView_populateTiles.call(this, e, t);

        if (this._searchInput && this._searchInput.getValue()) {
            searchSbcs(this._searchInput.getValue());
        }

        if (this._sortDropDown && this._sortDropDown.getValue()) {
            sortSbcs(this._sortDropDown.getValue());
        }
    }

    const UTSBCHubView_dealloc = UTSBCHubView.prototype.dealloc;
    UTSBCHubView.prototype.dealloc = function () {
        try {
            if (this._sortDropDown) {
                this._sortDropDown.dealloc();
            }

            if (this._searchInput) {
                this._searchInput.dealloc();
            }
        } catch {

        }
    }

    const UTSBCSetTileView_render = UTSBCSetTileView.prototype.render;
    UTSBCSetTileView.prototype.render = function () {
        UTSBCSetTileView_render.call(this);
        if (cfg.enabled) {
            this.getRootElement().setAttribute("data-id", this.data.id);
            this.getRootElement().setAttribute("data-challenges-completed-count", this.data.challengesCompletedCount);
            this.getRootElement().setAttribute("data-end-time", this.data.endTime === 0 ? Number.MIN_SAFE_INTEGER : this.data.endTime * -1);
            this.getRootElement().setAttribute("data-times-completed", this.data.timesCompleted);
        }
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
    settings: {
        name: "filterSbcs",
        title: 'plugins.filterSbcs.settings.title',
        menu: menu
    }
};
// #endif

export default plugin;