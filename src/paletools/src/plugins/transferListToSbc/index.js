let plugin;

/// #if process.env.TRANSFER_LIST_TO_SBC
import { addLabelWithToggle } from "../../controls";
import { EVENTS, on } from "../../events";
import localize from "../../localization";
import { getTransferListAvailableItems } from "../../services/market";
import { fillSbc } from "../../services/sbc";
import { navigateBack } from "../../services/ui/navigation";
import { getSbcChallengeFromController } from "../../services/ui/sbc";
import settings from "../../settings";
import getCurrentController from "../../utils/controller";
import { hide, show } from "../../utils/visibility";

const cfg = settings.plugins.transferListToSbc;

function run() {
    const UTSBCSquadDetailPanelView_generate = UTSBCSquadDetailPanelView.prototype._generate;
    UTSBCSquadDetailPanelView.prototype._generate = function _generate() {
        UTSBCSquadDetailPanelView_generate.call(this);
        if (!settings.enabled || !cfg.enabled) return;
        if (!this._availableToSbcCalled) {
            this._useTransferListPlayersButton = new UTStandardButtonControl();
            this._useTransferListPlayersButton.getRootElement().classList.add("call-to-action");
            this._useTransferListPlayersButton.init();
            this._useTransferListPlayersButton.setText(localize('plugins.transferListToSbc.button.text'));
            this._useTransferListPlayersButton.addTarget(this, async () => {
                try {
                    await fillSbc(getSbcChallengeFromController(), await getTransferListAvailableItems(), count => {
                        this._useTransferListPlayersButton.setInteractionState(false);
                        this._useTransferListPlayersButton.setText(localize('plugins.transferListToSbc.button.textLoading').replace("{count}", count));
                    });
                }
                finally {
                    this._useTransferListPlayersButton.setInteractionState(true);
                    this._useTransferListPlayersButton.setText(localize('plugins.transferListToSbc.button.text'));

                    if (isPhone()) {
                        navigateBack(getCurrentController());
                    }
                }
            }, EventType.TAP);
            this.__content.appendChild(this._useTransferListPlayersButton.getRootElement());

            on(EVENTS.APP_ENABLED, () => show(this._useTransferListPlayersButton));
            on(EVENTS.APP_DISABLED, () => hide(this._useTransferListPlayersButton));

            this._availableToSbcCalled = true;
        }
    }

    const UTSBCSquadDetailPanelView_destroyGeneratedElements = UTSBCSquadDetailPanelView.prototype.destroyGeneratedElements;
    UTSBCSquadDetailPanelView.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
        UTSBCSquadDetailPanelView_destroyGeneratedElements.call(this);

        if (this._useTransferListPlayersButton) {
            this._useTransferListPlayersButton.destroy();
        }
    }
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
    order: 127,
    settings: {
        name: 'transfer-list-to-sbc',
        title: 'plugins.transferListToSbc.settings.title',
        menu: menu
    }
};
/// #endif

export default plugin;