
let plugin;

/// #if process.env.MARK_DUPLICATED
import styles from "./styles.css";
import settings, { saveConfiguration } from "../../settings";
import { addStyle, removeStyle } from "../../utils/styles";
import { EVENTS, on } from "../../events";
import { addLabelWithToggle } from "../../controls";
import getCurrentController from "../../utils/controller";
import { loadClubPlayers } from "../../services/ui/club";
import { addClass } from "../../utils/dom";
const cfg = settings.plugins.markDuplicated;

function run() {

    let club = null;


    if (settings.enabled && cfg.enabled) {
        loadClubPlayers().then(currentClub => {club = currentClub});
    }

    const UTTransfersHubViewController_requestTransferTargetData = UTTransfersHubViewController.prototype._requestTransferTargetData;

    UTTransfersHubViewController.prototype._requestTransferTargetData = function () {
        if (settings.enabled && cfg.enabled) {
            loadClubPlayers();
        }

        UTTransfersHubViewController_requestTransferTargetData.call(this);
    };

    const UTItemTableCellView_render = UTItemTableCellView.prototype.render;
    UTItemTableCellView.prototype.render = function (e) {
        UTItemTableCellView_render.call(this, e);

        if (settings.enabled && cfg.enabled) {
            if (this.data.duplicateId) {
                addClass(this.__entityContainer, "club-duplicated");
            } else {
                const controller = getCurrentController();
                if (controller instanceof UTMarketSearchResultsSplitViewController) {
                    if (club && club[this.data.definitionId]) {
                        addClass(this.__entityContainer, "club-duplicated");
                    }
                }
            }
        }
    }

    const UTPlayerSearchControl_updateList = UTPlayerSearchControl.prototype.updateList;
    UTPlayerSearchControl.prototype.updateList = function (e, t) {
        UTPlayerSearchControl_updateList.call(this, e, t);

        if (settings.enabled && cfg.enabled) {
            loadClubPlayers().then(club => {
                for (let index = 0; index < e.length; index++) {
                    if (!t[index]) continue;
                    const player = t[index];
                    if (club[player.id]) {
                        this.__playerResultsList.children[index].classList.add('club-duplicated');
                        if(club[player.id].untradeable){
                            this.__playerResultsList.children[index].classList.add('club-untradeable');
                        }
                    }
                }
            });
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