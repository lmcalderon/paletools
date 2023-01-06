// let plugin;
// /// #if process.env.PACKS_OPENER
// import { addLabelWithToggle } from "../../controls";
// import localize, { localizeNumber } from "../../localization";
// import settings, { saveConfiguration } from "../../settings";
// import { toPromise } from "../../utils/observable";

// const cfg = settings.plugins.selectCheapest;

// function run() {
//     async function autoOpenPacks() {
//         const response = await toPromise(services.Store.getPacks());
//         const pack = response.response.packs.find(x => x.id === this.articleId);

//         if (!pack) {
//             sendUINotification("Missing pack", UINotificationType.NEGATIVE);
//             return;
//         }

//         showPopUp(
//             [
//                 { labelEnum: enums.UIDialogOptions.OK },
//                 { labelEnum: enums.UIDialogOptions.CANCEL },
//             ],
//             "Auto Open Packs",
//             "Open Pack Detail",
//             (text) => {
//                 text === 2 && validateFormAndOpenPack(pack);
//             }
//         );
//     }

//     const UTStorePackDetailsView_setupBuyCoinsButton = UTStorePackDetailsView.prototype.setupBuyCoinsButton;
//     UTStorePackDetailsView.prototype.setupBuyCoinsButton = function (...params) {
//         UTStorePackDetailsView_setupBuyCoinsButton.call(this, ...params);

//         this._btnOpenPacks && this.removeActionButton(this._btnOpenPacks);
//         this._btnOpenPacks = new UTCurrencyButtonControl();
//         this._btnOpenPacks.init();
//         this._btnOpenPacks.setText("Open Pack");
//         this._btnOpenPacks.setSubText("Automatically");
//         this._btnOpenPacks.addClass("call-to-action packOpen");
//         this._btnOpenPacks.addTarget(this, autoOpenPacks, EventType.TAP);
//         this.appendActionButton(this._btnOpenPacks);
//     }
// }

// function menu() {
//     const container = document.createElement("div");
//     addLabelWithToggle(container, "enabled", cfg.enabled, toggleState => {
//         cfg.enabled = toggleState;
//         saveConfiguration();
//     });
//     return container;
// }

// plugin = {
//     run: run,
//     order: 100,
//     settings: {
//         name: 'packs-opener',
//         title: 'plugins.packsOpener.settings.title',
//         menu: menu
//     }
// };
// /// #endif

// export default plugin;