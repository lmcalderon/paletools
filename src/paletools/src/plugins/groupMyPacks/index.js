let plugin;

// #if process.env.GROUP_MY_PACKS
import styles from "./styles.css";
import { addLabelWithToggle } from "../../controls";
import { EVENTS, on } from "../../events";
import settings, { saveConfiguration } from "../../settings";
import { addStyle, removeStyle } from "../../utils/styles";
import { addClass, append, createElem, detach, isHidden, isVisible, select, selectAll } from "../../utils/dom";
import { hide, show } from "../../utils/visibility";

const cfg = settings.plugins.groupMyPacks;

function run() {

    function addStyles() {
        addStyle('paletools-groupmypacks', styles);
    }

    function removeStyles() {
        removeStyle('paletools-groupmypacks');
    }

    const UTStoreView_setPacks = UTStoreView.prototype.setPacks;
    UTStoreView.prototype.setPacks = function(...args) {
        UTStoreView_setPacks.call(this, ...args);

        if(!settings.enabled || !cfg.enabled) return;

        const packEntities = args[0];

        if(packEntities.length === 0 || !packEntities[0].isMyPack) return;

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

                on(packCounter, "click", () => {
                    for(let pack of filteredPacks.filter(x => x.classList.contains("duplicated"))) {
                        if (isHidden(pack)) {
                            show(pack);
                        }
                        else {
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
        addStyles();

        on(EVENTS.APP_DISABLED, () => {
            show(packs);
            hide(select(".pack-counter", parent));
            removeStyles();
        });

        on(EVENTS.APP_ENABLED, () => {
            hide(packs.filter(x => x.classList.contains("duplicated")));
            select(".pack-counter", parent).removeAttribute("style");
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