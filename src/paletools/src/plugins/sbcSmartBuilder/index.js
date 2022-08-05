// let plugin;

// /// #if process.env.SBC_SMART_BUILDER
// import { addLabelWithToggle } from "../../controls";
// import localize from "../../localization";
// import settings from "../../settings";
// import { EVENTS, on } from "../../events";
// import { hide, show } from "../../utils/visibility";
// import getCurrentController from "../../utils/controller";

// const cfg = settings.plugins.sbcSmartBuilder;

// function run() {
//     window.challengesCache = {};

//     const UTSBCSetEntity_setChallenges = UTSBCSetEntity.prototype.setChallenges;
//     UTSBCSetEntity.prototype.setChallenges = function (t) {
//         UTSBCSetEntity_setChallenges.call(this, t);
        
//         for (let index = 0; index < t.length; index++) {
//             let challenge = t[index];
//             window.challengesCache[challenge.id] = challenge;
//         }
//     }

//     const UTSBCSquadDetailPanelView_generate = UTSBCSquadDetailPanelView.prototype._generate;
//     UTSBCSquadDetailPanelView.prototype._generate = function _generate() {
//         UTSBCSquadDetailPanelView_generate.call(this);
//         if(!settings.enabled || !cfg.enabled) return;
//         if (!this._sbcSmartBuilder) {
//             this._smartBuilderButton = new UTStandardButtonControl();
//             this._smartBuilderButton.init();
//             this._smartBuilderButton.setText(localize('plugins.sbcSmartBuilder.button.text'));
//             this._smartBuilderButton.addTarget(this, () => {
//                 this._useUnnasignedPlayersButton.setInteractionState(false);
//                 smartBuild().then(() => {
//                     this._useUnnasignedPlayersButton.setInteractionState(true);
//                 });
//             } , EventType.TAP);
//             this.__content.appendChild(this._smartBuilderButton.getRootElement());

//             on(EVENTS.APP_ENABLED, () => show(this._smartBuilderButton));
//             on(EVENTS.APP_DISABLED, () => hide(this._smartBuilderButton));

//             this._sbcSmartBuilder = true;
//         }
//     }

//     const UTSBCSquadDetailPanelView_destroyGeneratedElements = UTSBCSquadDetailPanelView.prototype.destroyGeneratedElements;
//     UTSBCSquadDetailPanelView.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
//         UTSBCSquadDetailPanelView_destroyGeneratedElements.call(this);

//         if (this._smartBuilderButton) {
//             this._smartBuilderButton.destroy();
//         }
//     }

//     function smartBuild(){
//         let controller = getCurrentController();
//         let set;
//         if(controller instanceof UTSBCSquadSplitViewController){
//             set = controller._set;
//         }
//         else if(controller instanceof )
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
//     order: 1,
//     settings: {
//         name: 'sbc-smart-builder',
//         title: 'plugins.sbcSmartBuilder.settings.title',
//         menu: menu
//     }
// };
// /// #endif

// export default plugin;