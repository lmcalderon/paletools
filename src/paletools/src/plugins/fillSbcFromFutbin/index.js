let plugin;
/// #if process.env.FILL_SBC_FROM_FUTBIN
import { addLabelWithLink, addLabelWithToggle } from "../../controls";
import localize from "../../localization";
import { getAllClubPlayers } from "../../services/club";
import getCurrentController from "../../utils/controller";
import settings from "../../settings";
import { EVENTS, on } from "../../events";
import styles from "./styles.css";
import { addStyle } from "../../utils/styles";
import { getConceptPlayers } from "../../services/players";
import { notifyFailure } from "../../utils/notifications";
import { hide, show } from "../../utils/visibility";
import { findPlayersInClub } from "../../services/ui/club";

const cfg = settings.plugins.fillSbcFromFutbin;

function run() {
    const UTSBCSquadDetailPanelView_generate = UTSBCSquadDetailPanelView.prototype._generate;
    UTSBCSquadDetailPanelView.prototype._generate = function _generate() {
        UTSBCSquadDetailPanelView_generate.call(this);
        if (!settings.enabled || !cfg.enabled) return;
        if (!this._fillSbcFromFutbinCalled) {


            this._fillSbcFromFutbinButton = new UTStandardButtonControl();
            this._fillSbcFromFutbinButton.getRootElement().classList.add("call-to-action");
            this._fillSbcFromFutbinButton.init();
            this._fillSbcFromFutbinButton.setText(localize('plugins.fillSbcFromFutbin.button.text'));
            this._fillSbcFromFutbinButton.addTarget(this, () => {
                this._fillSbcFromFutbinButton.setInteractionState(false);
                this._fillSbcFromFutbinButton.setText(localize('plugins.fillSbcFromFutbin.button.textLoading').replace("{count}", ""));
                fillSbcFromFutbin(count => {
                    this._fillSbcFromFutbinButton.setText(localize('plugins.fillSbcFromFutbin.button.textLoading').replace("{count}", count));
                }).then(() => {
                    this._fillSbcFromFutbinButton.setInteractionState(true);
                    this._fillSbcFromFutbinButton.setText(localize('plugins.fillSbcFromFutbin.button.text'));
                });
            }, EventType.TAP);
            this.__content.appendChild(this._fillSbcFromFutbinButton.getRootElement());


            on(EVENTS.APP_ENABLED, () => show(this._fillSbcFromFutbinButton));
            on(EVENTS.APP_DISABLED, () => hide(this._fillSbcFromFutbinButton));

            this._fillSbcFromFutbinCalled = true;
        }
    }

    const UTSBCSquadDetailPanelView_destroyGeneratedElements = UTSBCSquadDetailPanelView.prototype.destroyGeneratedElements;
    UTSBCSquadDetailPanelView.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
        UTSBCSquadDetailPanelView_destroyGeneratedElements.call(this);

        if (this._fillSbcFromFutbinButton) {
            this._fillSbcFromFutbinButton.destroy();
        }
    }

    function getExportedSbcFromClipboard() {
        return new Promise((resolve, reject) => {
            navigator.permissions.query({ name: "clipboard-read" }).then(result => {
                if (result.state === "granted" || result.state === "prompt") {
                    navigator.clipboard.readText().then(text => {
                        try {
                            let sbcData = JSON.parse(text);
                            resolve(sbcData.reverse());
                        }
                        catch
                        {
                            notifyFailure(localize("plugins.fillSbcFromFutbin.copyError"));
                            reject();
                        }
                    });
                }
            });
        });
    }

    async function fillSbcFromFutbin(onClubBatchLoadedCallback) {
        const sbcData = await getExportedSbcFromClipboard();
        const sbcPlayers = sbcData.map(x => factories.Item.createItem({ resourceId: parseInt(x[1]) }));

        const { _squad, _challenge } = getCurrentController()._leftController;

        const foundPlayers = await findPlayersInClub(sbcPlayers, onClubBatchLoadedCallback, true, true);

        let conceptPlayerIds = sbcPlayers.filter(x => !foundPlayers[x.definitionId]).map(x => x.definitionId);

        const conceptPlayers = await getConceptPlayers(conceptPlayerIds);
        for (let conceptPlayer of conceptPlayers) {
            foundPlayers[conceptPlayer.definitionId] = conceptPlayer;
        }

        const players = new Array(11);
        for (let sbcIndex = 0; sbcIndex < sbcData.length; sbcIndex++) {
            players[sbcIndex] = foundPlayers[sbcData[sbcIndex][1]];
        }

        _squad.setPlayers(players, true);
        services.SBC.saveChallenge(_challenge);
        repositories.Item.unassigned.expiryTimestamp = 0;
        repositories.Item.transfer.expiryTimestamp = 0;
    }

    addStyle("paletools-fill-sbc-from-futbin", styles);
}

function menu() {
    const container = document.createElement("div");
    container.classList.add("menuContainer");
    addLabelWithToggle(container, "enabled", cfg.enabled, toggleState => {
        cfg.enabled = toggleState;
        saveConfiguration();
    });

    const exportSbcCode = `
(function() {
	function copyToClipboard(str) {
		const el = document.createElement('textarea');
		el.value = str;
		el.setAttribute('readonly', '');
		el.style.position = 'absolute';
		el.style.left = '-9999px';
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
	}

	function copySbcToClipboard() {
		let isSbcUrl = /https\\:\\/\\/www.futbin.com\\/\\d+\\/squad\\/\\d+\\/sbc/.test(location.href);
		if (!isSbcUrl) {
			alert("========== PALETOOLS ALERT ==========\\n\\nYou need to be in an SBC solution for this tool to work!\\n\\n========================================\\n\\n¡Usted necesita estar en una solución de SBC para que funcione esta herramienta!");
			return;
		}
		let data = [];
		$("[data-cardid]").each(function() {
			let resourceIdDiv = $("[data-resourceid-id]", this);
			if (resourceIdDiv.length > 0) {
				data.push([this.dataset.formpos, resourceIdDiv[0].dataset.resourceidId]);
			}
		});
		copyToClipboard(JSON.stringify(data));
		alert("========== PALETOOLS ==========\\n\\nSBC succesfully exported, now go to Paletools and hit import SBC from FUTBIN button\\n\\n========================================\\n\\nSBC exportado correctamente, ahora ve a Paletools y presiona el boton importar SBC de FUTBIN");
	}
	copySbcToClipboard();
})()
`;

    addLabelWithLink(container,
        "plugins.fillSbcFromFutbin.settings.importToolLabel",
        "plugins.fillSbcFromFutbin.settings.importToolLinkText",
        `javascript:eval(atob('${btoa(exportSbcCode)}'))`);

    const labelMessage = document.createElement("label");
    labelMessage.innerHTML = localize('plugins.fillSbcFromFutbin.settings.installInstructions');

    const linkMessage = document.createElement("div");
    linkMessage.appendChild(labelMessage);

    container.appendChild(linkMessage);

    return container;
}

plugin = {
    run: run,
    order: 3,
    settings: {
        name: 'fill-sbc-from-futbin',
        title: 'plugins.fillSbcFromFutbin.settings.title',
        menu: menu
    }
};
/// #endif

export default plugin;