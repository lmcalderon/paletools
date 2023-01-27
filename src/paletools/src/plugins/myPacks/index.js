let plugin;

// #if process.env.MY_PACKS
import styles from "./styles.css";
import { addLabelWithToggle } from "../../controls";
import localize from "../../localization";
import settings, { saveConfiguration } from "../../settings";
import { addClass, append, attr, createElem, detach, insertBefore, isHidden, parent, remove, removeClass, select, selectAll } from "../../utils/dom";
import { hide, show } from "../../utils/visibility";
import { EVENTS, on } from "../../events";
import { addStyle, removeStyle } from "../../utils/styles";
import { getObjectPropertyValueByPath, setObjectPropertyByPath } from "../../utils/object";
import { removeDiacritics } from "../../utils/diacritics";
import UTNativeDropDownControl from "../../controls/UTNativeDropDownControl";

const cfg = settings.plugins.myPacks;

function addStyles() {
    addStyle('paletools-mypacks', styles);
}

function removeStyles() {
    removeStyle('paletools-mypacks');
}

function run() {
    addStyles();

    on(EVENTS.APP_ENABLED, () => addStyles());
    on(EVENTS.APP_DISABLED, () => removeStyles());

    function setupFilterPacks(packs, view) {
        if (!cfg.filter) return;

        const packsCounter = {};

        for (let pack of packs) {
            const packName = localize(pack.packName);
            if (!packsCounter[packName]) {
                packsCounter[packName] = { id: pack.id, tradeable: pack.tradable ? 1 : 0, untradeable: pack.tradable ? 0 : 1 };
            }
            else {
                packsCounter[packName][pack.tradable ? "tradeable" : "untradeable"]++;
            }
        }

        const packNames = Object.keys(packsCounter);
        packNames.sort();

        view.__packsDropDown.addOption(`${localize("plugins.myPacks.filter.default")} (${packs.length})`, "");

        for (const packName of packNames) {
            const packData = packsCounter[packName];
            view.__packsDropDown.addOption(`${packName} (${packData.tradeable + packData.untradeable})`, `${packData.id}`);
        }
    }

    function searchPacks(text, isPackId = false) {
        cfg.filterText = text;
        saveConfiguration();
        if (!text) {
            for (const pack of selectAll(".ut-store-pack-details-view--title")) {
                if (pack) {
                    const packParent = parent(pack);
                    if (packParent.dataset.groupFirst) {
                        show(packParent);
                    }
                    else {
                        if (packParent.dataset.group === "expanded") {
                            show(packParent);
                        }
                        else {
                            hide(packParent);
                        }
                    }
                }
            }
            return;
        }

        text = removeDiacritics(text).toLowerCase();
        for (const pack of selectAll(".ut-store-pack-details-view--title")) {
            const packName = removeDiacritics(pack.textContent.toLowerCase());
            const packParent = parent(pack);
            if (isPackId) {
                if (packParent.dataset.id == text || packParent.dataset.id == `6${text}`) {
                    // EA uses the same id but with at 6 in the front for packs that are the same but do not assure a player with a certain rating
                    show(packParent);
                }
                else {
                    hide(packParent);
                }
            }
            else {
                if (packName.indexOf(text) > -1) {
                    show(packParent);
                }
                else {
                    hide(packParent);
                }
            }
        }
    }

    function setupPackCollectorLink(packEntities, view) {
        const packs = {};
        for (let pack of packEntities) {
            if (!packs[pack.id]) {
                packs[pack.id] = [pack.id, 0, 0];
            }

            if (pack.tradable) {
                packs[pack.id][2]++;
            }
            else {
                packs[pack.id][1]++;
            }
        }

        view.setPackCollectorLink(`https://freakpants.github.io/pack-collector/?packs=${Object.values(packs).map(x => x.join(",")).join("-")}`);
    }

    function setupPackGroups(packEntities) {
        if (!cfg.group || packEntities.length === 0 || !packEntities[0].isMyPack) return;

        const parent = select(".ut-store-hub-view--content");

        const packs = selectAll(".ut-store-pack-details-view");

        detach(packs);

        packs.sort((a, b) => {
            const aTitle = a.dataset.title;
            const bTitle = b.dataset.title;
            const aTradeable = a.dataset.tradeable;
            const bTradeable = b.dataset.tradeable;
            const aGroupFirst = a.dataset.groupFirst;
            const bGroupFirst = b.dataset.groupFirst;
            const aId = parseInt(a.dataset.id);
            const bId = parseInt(b.dataset.id);

            if(aTitle === bTitle) {
                if (aId === bId) {
                    if (aTradeable === bTradeable) {
                        return aGroupFirst ? -1 : bGroupFirst ? 1 : 0;
                    }
    
                    return aTradeable ? -1 : bTradeable ? 1 : 0;
                }

                return aId < bId ? -1 : aId > bId ? 1 : 0;
            }

            return aTitle.localeCompare(bTitle);

            
        });

        append(parent, ...packs);
    }

    const UTStoreViewController_setCategory = UTStoreViewController.prototype.setCategory;
    UTStoreViewController.prototype.setCategory = function (...args) {
        UTStoreViewController_setCategory.call(this, ...args);
        if (!settings.enabled || !cfg.enabled) return;
        if (!this.viewmodel.hasMyPacks) return;
        if (args[0] !== PurchaseDisplayGroup.MYPACKS) return;

        const packs = this.viewmodel.myPacks.values();

        setupPackCollectorLink(packs, this.getView());
        setupFilterPacks(packs, this.getView());
        setupPackGroups(packs);
    }


    const UTStoreView_setupPack = UTStoreView.prototype.setupPack;
    UTStoreView.prototype.setupPack = function (...args) {
        const packView = UTStoreView_setupPack.call(this, ...args);
        if (packView instanceof UTStorePackDetailsView) {
            const pack = args[0];
            attr(packView, "data-id", localize(pack.id));
            attr(packView, "data-title", localize(pack.packName));
            attr(packView, "data-tradeable", pack.tradable);
            if (cfg.group) {
                const packKey = pack.tradable ? `${pack.id}_tradeable` : `${pack.id}_untradeable`;
                if (!this._packGroups[packKey]) {
                    this._packGroups[packKey] = [packView];
                    const packCounter = createElem("div", { className: "pack-counter" }, "1");
                    append(packView, packCounter);
                    attr(packView, "data-group-first", "true");
                    on(packCounter, "click", () => {
                        for (let index = 1; index < this._packGroups[packKey].length; index++) {
                            const groupedPack = this._packGroups[packKey][index];
                            if (isHidden(groupedPack)) {
                                attr(groupedPack, "data-group", "expanded");
                                show(groupedPack);
                            }
                            else {
                                attr(groupedPack, "data-group", "collapsed");
                                hide(groupedPack);
                            }
                        };
                    });
                }
                else {
                    this._packGroups[packKey].push(packView);
                    hide(packView);
                    select(".pack-counter", this._packGroups[packKey][0]).textContent = this._packGroups[packKey].length;
                }
            }
        }
        return packView;
    }

    const UTStoreView__generate = UTStoreView.prototype._generate;
    UTStoreView.prototype._generate = function _generate() {
        UTStoreView__generate.call(this);
        if (!settings.enabled || !cfg.enabled) return;

        if (!this._myPacksGenerated) {
            if (cfg.filter || cfg.packCollector) {
                addStyles();
                const settingsContainer = createElem("div", { className: "packs-settings-container ea-filter-bar-view" });

                if (cfg.filter) {
                    this.__packsDropDown = new UTNativeDropDownControl();
                    this.__packsDropDown.init();
                    this.__packsDropDown.onChange(packName => {
                        searchPacks(packName, true);
                    });
                    this.__packsDropDown.getRootElement().id = "filter-packs";
                    append(settingsContainer, this.__packsDropDown);

                    this.__searchInput = new UTTextInputControl();
                    this.__searchInput.init();
                    this.__searchInput.setPlaceholder(localize("plugins.myPacks.filter.label"));
                    this.__searchInput.getRootElement().id = "search-packs";
                    on(this.__searchInput, "keyup", ev => {
                        this.__packsDropDown.setValue("");
                        searchPacks(ev.target.value);
                    });
                    append(settingsContainer, this.__searchInput);
                }

                if (cfg.packCollector && !isPhone()) {
                    this.__packCollectorLink = createElem("a", { target: "_blank", className: "pack-collector-btn" }, localize("plugins.myPacks.packCollector.link.text"));
                    append(settingsContainer, this.__packCollectorLink);
                }

                insertBefore(settingsContainer, this.__description);
            }


            this._myPacksGenerated = true;
        }
    }

    const UTStoreView_setPacks = UTStoreView.prototype.setPacks;
    UTStoreView.prototype.setPacks = function (...args) {
        this._packGroups = {};
        UTStoreView_setPacks.call(this, ...args);

        if (!settings.enabled || !cfg.enabled) return;

        const packs = args[0];

        if (packs.length === 0) return;

        if (packs[0].isMyPack) {
            if (cfg.packCollector) {
                show(this.__packCollectorLink);
            }

            if (cfg.filter) {
                this.__searchInput.setValue("");
                this.__packsDropDown.setValue("");
                show(this.__searchInput);
                show(this.__packsDropDown);
            }

            if (cfg.group) {
                setupPackGroups(packs);
            }
        }
        else {
            hide(this.__packCollectorLink);
            hide(this.__searchInput);
            hide(this.__packsDropDown);
        }
    }

    UTStoreView.prototype.setPackCollectorLink = function (link) {
        if (!this.__packCollectorLink) return;

        this.__packCollectorLink.href = link;
    }
}

function menu() {
    const container = document.createElement("div");

    function addSetting(settingPath, settingLabelLocale) {
        if (!settingLabelLocale) {
            settingLabelLocale = settingPath;
        }
        addLabelWithToggle(container, settingLabelLocale, getObjectPropertyValueByPath(cfg, settingPath), toggleState => {
            setObjectPropertyByPath(cfg, settingPath, toggleState);
            saveConfiguration();
        })
    }

    addSetting("enabled", "enabled");
    addSetting("packCollector", "plugins.myPacks.settings.packCollector");
    addSetting("group", "plugins.myPacks.settings.group");
    addSetting("filter", "plugins.myPacks.settings.filter");

    return container;
}

plugin = {
    run: run,
    order: 10,
    settings: {
        name: "my-packs",
        title: 'plugins.myPacks.settings.title',
        menu: menu
    }
};
// #endif

export default plugin;