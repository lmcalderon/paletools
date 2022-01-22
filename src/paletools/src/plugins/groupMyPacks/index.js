let plugin;

// #if process.env.GROUP_MY_PACKS
import styles from "./styles.css";
import { addLabelWithToggle } from "../../controls";
import { EVENTS, on } from "../../events";
import settings, { saveConfiguration } from "../../settings";
import { addStyle, removeStyle } from "../../utils/styles";

const cfg = settings.plugins.groupMyPacks;

function run() {

    function addStyles() {
        $(document.body).addClass("paletools-gridmode");
        addStyle('paletools-groupmypacks', styles);
    }

    function removeStyles() {
        $(document.body).removeClass("paletools-gridmode");
        removeStyle('paletools-groupmypacks');
    }

    const UTStoreViewController_setCategory = UTStoreViewController.prototype.setCategory;
    UTStoreViewController.prototype.setCategory = function (e) {
        UTStoreViewController_setCategory.call(this, e);
        if (!cfg.enabled) return;

        if (this.packLoadObservable) return;

        if (!this.viewmodel.hasMyPacks) return;

        const parent = $(".ut-store-hub-view--content");

        const packs = $(".ut-store-pack-details-view");

        packs.detach().sort((a, b) => {
            const aTradeable = $(a).hasClass("is-tradeable");
            const bTradeable = $(b).hasClass("is-tradeable");
            const aTitle = $(".ut-store-pack-details-view--title", a).text();
            const bTitle = $(".ut-store-pack-details-view--title", b).text();

            if (aTitle === bTitle) {
                return aTradeable ? -1 : bTradeable ? 1 : 0;
            }

            return aTitle < bTitle ? -1 : aTitle > bTitle ? 1 : 0;
        });

        let prevTitle = null;
        let prevTradeable = null;

        for (let packIndex = 0; packIndex < packs.length; packIndex++) {
            const pack = $(packs[packIndex]);
            pack.attr("data-title", $(".ut-store-pack-details-view--title", pack).text());
            pack.attr("data-tradeable", $(pack).hasClass("is-tradeable"));
        }

        for (let packIndex = 0; packIndex < packs.length; packIndex++) {
            const pack = $(packs[packIndex]);
            let title = pack.attr("data-title");
            let tradeable = pack.attr("data-tradeable");

            const appendCounter = () => {
                const packCounter = $(document.createElement("div"));
                packCounter.addClass("pack-counter");
                const filteredPacks = packs.filter(`[data-title="${title}"]`).filter(`[data-tradeable="${tradeable}"]`);
                let samePacksCount = filteredPacks.length;
                packCounter.text(samePacksCount);
                pack.append(packCounter);
                $(packCounter).click(() => {
                    filteredPacks.filter(".duplicated").each((idx, elem) => {
                        if (elem.style.display === "none") {
                            $(elem).removeAttr("style");
                        }
                        else {
                            $(elem).hide();
                        }
                    });
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
                pack.addClass("duplicated");
                pack.hide();
            }
        }

        parent.append(packs);
        addStyles();

        on(EVENTS.APP_DISABLED, () => {
            packs.show();
            $(".pack-counter", parent).hide();
            removeStyles();
        });
        on(EVENTS.APP_ENABLED, () => {
            packs.filter(".duplicated").hide();
            $(".pack-counter", parent).removeAttr("style");
            addStyles();
        });
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
    order: 10,
    settings: {
        name: "groupMyPacks",
        title: 'plugins.groupMyPacks.settings.title',
        menu: menu
    }
};
// #endif

export default plugin;