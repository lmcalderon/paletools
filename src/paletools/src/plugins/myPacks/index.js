let plugin;

// #if process.env.MY_PACKS
import styles from "./styles.css";
import { addLabelWithToggle } from "../../controls";
import localize from "../../localization";
import settings, { saveConfiguration } from "../../settings";
import { addClass, append, createElem, detach, insertBefore, isHidden, parent, select, selectAll } from "../../utils/dom";
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
                packsCounter[packName] = 1;
            }
            else {
                packsCounter[packName]++;
            }
        }

        const packNames = Object.keys(packsCounter);
        packNames.sort();

        view.__packsDropDown.addOption(`${localize("plugins.myPacks.filter.default")} (${packs.length})`, "");

        for (const packName of packNames) {
            view.__packsDropDown.addOption(`${packName} (${packsCounter[packName]})`, packName);
        }
    }

    function searchPacks(text) {
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
            if (removeDiacritics(pack.textContent.toLowerCase()).indexOf(text) > -1) {
                show(parent(pack));
            }
            else {
                hide(parent(pack));
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
            const aTradeable = a.classList.contains("is-tradeable");
            const bTradeable = b.classList.contains("is-tradeable");
            const aTitle = select(".ut-store-pack-details-view--title", a).textContent;
            const bTitle = select(".ut-store-pack-details-view--title", b).textContent;

            if (aTitle === bTitle) {
                return aTradeable ? -1 : bTradeable ? 1 : 0;
            }

            return aTitle < bTitle ? -1 : aTitle > bTitle ? 1 : 0;
        });

        let prevTitle = null;
        let prevTradeable = null;

        for (let pack of packs) {
            pack.setAttribute("data-title", select(".ut-store-pack-details-view--title", pack).textContent);
            pack.setAttribute("data-tradeable", pack.classList.contains("is-tradeable"));
        }

        for (let pack of packs) {
            let title = pack.getAttribute("data-title");
            let tradeable = pack.getAttribute("data-tradeable");

            const appendCounter = () => {
                const packCounter = createElem("div", { className: "pack-counter" });
                const filteredPacks = packs
                    .filter(elem => elem.getAttribute("data-title") === title)
                    .filter(elem => elem.getAttribute("data-tradeable") === tradeable);

                let samePacksCount = filteredPacks.length;
                packCounter.textContent = samePacksCount;
                append(pack, packCounter);
                pack.setAttribute("data-group-first", "true");

                on(packCounter, "click", () => {
                    for (let pack of filteredPacks.filter(x => x.classList.contains("duplicated"))) {
                        if (isHidden(pack)) {
                            pack.setAttribute("data-group", "expanded");
                            show(pack);
                        }
                        else {
                            pack.setAttribute("data-group", "collapsed");
                            hide(pack);
                        }
                    };
                });
            }

            if (prevTitle !== title) {
                prevTitle = title;
                prevTradeable = tradeable;
                appendCounter();
            }
            else if (prevTradeable !== tradeable) {
                prevTradeable = tradeable;
                appendCounter();
            }
            else {
                addClass(pack, "duplicated");
                hide(pack);
            }
        }

        append(parent, ...packs);
    }

    const UTStoreViewController_setCategory = UTStoreViewController.prototype.setCategory;
    UTStoreViewController.prototype.setCategory = function (...args) {
        UTStoreViewController_setCategory.call(this, ...args);
        if (!settings.enabled || !cfg.enabled) return;
        if (!this.viewmodel.hasMyPacks) return;

        const packs = this.viewmodel.myPacks.values();

        setupPackCollectorLink(packs, this.getView());
        setupFilterPacks(packs, this.getView());
        setupPackGroups(packs);
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
                        searchPacks(packName);
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

            setupPackGroups(packs);
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