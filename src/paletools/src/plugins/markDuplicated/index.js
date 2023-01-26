
let plugin;

/// #if process.env.MARK_DUPLICATED
import { addLabelWithToggle } from "../../controls";
import { addMarketSearchComplete, addMarketSearchPreRender } from "../../core-overrides/UTMarketSearchResultsViewControllerOverrides";
import { EVENTS, on } from "../../events";
import { isFastClubSearchEnabled } from "../../services/experimental";
import { findPlayersInClub, loadClubPlayers, toPlayersDictionary } from "../../services/ui/club";
import settings, { saveConfiguration } from "../../settings";
import getCurrentController from "../../utils/controller";
import { addClass } from "../../utils/dom";
import { addStyle, removeStyle } from "../../utils/styles";
import styles from "./styles.css";
const cfg = settings.plugins.markDuplicated;

function run() {

    if (settings.enabled && cfg.enabled) {
        loadClubPlayers();
    }

    addMarketSearchComplete(async (items, controller) => {
        if (!settings.enabled || !cfg.enabled) return;

        const foundPlayers = await findPlayersInClub(items, null, true);

        for (let itemCell of controller.getView()._list.listRows) {
            if (foundPlayers[itemCell.data.definitionId]) {
                addClass(itemCell.__entityContainer, "club-duplicated");
            }
        }
    });

    on(EVENTS.CONFIGURATION_SAVED, () => {
        if (!isFastClubSearchEnabled()) {
            loadClubPlayers();
        }
    });

    const UTItemTableCellView_render = UTItemTableCellView.prototype.render;
    UTItemTableCellView.prototype.render = function (e) {
        UTItemTableCellView_render.call(this, e);
        if (settings.enabled && cfg.enabled) {
            if (this.data.duplicateId) {
                addClass(this.__entityContainer, "club-duplicated");
            }
        }
    }

    const UTPlayerSearchControl_updateList = UTPlayerSearchControl.prototype.updateList;
    UTPlayerSearchControl.prototype.updateList = function (e, t) {
        UTPlayerSearchControl_updateList.call(this, e, t);

        if (settings.enabled && cfg.enabled) {
            (async () => {
                const foundPlayers = await findPlayersInClub(t, null, true);

                for (let index = 0; index < t.length; index++) {
                    const player = t[index];
                    if (foundPlayers[player.id]) {
                        this.__playerResultsList.children[index].classList.add('club-duplicated');
                        if (foundPlayers[player.id].untradeable) {
                            this.__playerResultsList.children[index].classList.add('club-untradeable');
                        }
                    }
                }
            })();
        }
    }


    on(EVENTS.APP_ENABLED, () => addStyle("paletools-markDuplicated", styles));
    on(EVENTS.APP_DISABLED, () => removeStyle("paletools-markDuplicated"));
}

if (settings.enabled && cfg.enabled) {
    addStyle("paletools-markDuplicated", styles);
}

function menu() {
    const container = document.createElement("div");
    container.classList.add("menuContainer");
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
        name: 'mark-duplicated',
        title: 'plugins.markDuplicated.settings.title',
        menu: menu
    }
};
/// #endif

export default plugin;