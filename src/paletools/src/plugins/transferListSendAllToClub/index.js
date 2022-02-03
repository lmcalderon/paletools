

let plugin;

/// #if process.env.TRANSFER_LIST_SEND_ALL_TO_CLUB
import { addLabelWithToggle } from "../../controls";
import { EVENTS, on } from "../../events";
import localize from "../../localization";
import settings, { saveConfiguration } from "../../settings";
import getCurrentController from "../../utils/controller";
import { hide, show } from "../../utils/visibility";
const cfg = settings.plugins.transferListSendAllToClub;

function run() {
    if (!cfg.enabled) return;

    const UTTransferListView_renderSection = UTTransferListView.prototype.renderSection;
    UTTransferListView.prototype.renderSection = function (t, e, i) {
        const output = UTTransferListView_renderSection.call(this, t, e, i);

        const nonDuplicatedNonActiveItems = t.filter(x => x.duplicateId === 0 && x._auction._tradeState !== AuctionTradeStateEnum.ACTIVE);

        if (nonDuplicatedNonActiveItems.length > 0) {
            const sendAllToClubButton = new UTStandardButtonControl();
            sendAllToClubButton.getRootElement().style.marginLeft = "8px";
            sendAllToClubButton.getRootElement().classList.add("send-all-to-club");
            sendAllToClubButton.getRootElement().classList.add("section-header-btn");
            sendAllToClubButton.getRootElement().classList.add("mini");
            sendAllToClubButton.getRootElement().classList.add("call-to-action");

            sendAllToClubButton.init();
            sendAllToClubButton.setText(localize("plugins.transferListSendAllToClub.button.text"));
            sendAllToClubButton.addTarget(this, () => {
                const controller = getCurrentController();
                services.Item.move(nonDuplicatedNonActiveItems, ItemPile.CLUB).observe(this, (t, e) => {
                    if(controller instanceof UTTransferListViewController){
                        controller.refreshList();
                    }
                    else {
                        controller._leftController.refreshList();
                    }
                    
                });

            }, EventType.TAP)

            output._header.getRootElement().appendChild(sendAllToClubButton.getRootElement());

            on(EVENTS.APP_ENABLED, () => show(sendAllToClubButton));
            on(EVENTS.APP_DISABLED, () => hide(sendAllToClubButton));
        }

        return output;
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
    order: 11,
    settings: {
        name: 'transer-list-send-all-to-club',
        title: 'plugins.transferListSendAllToClub.settings.title',
        menu: menu
    }
};
/// #endif

export default plugin;


