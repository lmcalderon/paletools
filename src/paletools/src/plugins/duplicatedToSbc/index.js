let plugin;

/// #if process.env.DUPLICATED_TO_SBC
import { addLabelWithToggle } from "../../controls";
import localize from "../../localization";
import { getAllClubPlayers, getUnnasignedPlayers } from "../../services/club";
import getCurrentController from "../../utils/controller";
import settings from "../../settings";
import { EVENTS, on } from "../../events";
import { hide, show } from "../../utils/visibility";

const cfg = settings.plugins.duplicatedToSbc;

function run() {
    const UTSBCSquadDetailPanelView_generate = UTSBCSquadDetailPanelView.prototype._generate;
    UTSBCSquadDetailPanelView.prototype._generate = function _generate() {
        UTSBCSquadDetailPanelView_generate.call(this);
        if (!settings.enabled || !cfg.enabled) return;
        if (!this._unnasignedToSbcCalled) {


            this._useUnnasignedPlayersButton = new UTStandardButtonControl();
            this._useUnnasignedPlayersButton.getRootElement().classList.add("call-to-action");
            this._useUnnasignedPlayersButton.init();
            this._useUnnasignedPlayersButton.setText(localize('plugins.duplicatedToSbc.button.text'));
            this._useUnnasignedPlayersButton.addTarget(this, () => {
                fillSbcWithUnnasignedPlayers(count => {
                    this._useUnnasignedPlayersButton.setInteractionState(false);
                    this._useUnnasignedPlayersButton.setText(localize('plugins.duplicatedToSbc.button.textLoading').replace("{count}", count));
                }).then(() => {
                    this._useUnnasignedPlayersButton.setInteractionState(true);
                    this._useUnnasignedPlayersButton.setText(localize('plugins.duplicatedToSbc.button.text'));
                });
            }, EventType.TAP);
            this.__content.appendChild(this._useUnnasignedPlayersButton.getRootElement());

            on(EVENTS.APP_ENABLED, () => show(this._useUnnasignedPlayersButton));
            on(EVENTS.APP_DISABLED, () => hide(this._useUnnasignedPlayersButton));

            this._unnasignedToSbcCalled = true;
        }
    }

    const UTSBCSquadDetailPanelView_destroyGeneratedElements = UTSBCSquadDetailPanelView.prototype.destroyGeneratedElements;
    UTSBCSquadDetailPanelView.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
        UTSBCSquadDetailPanelView_destroyGeneratedElements.call(this);

        if (this._useUnnasignedPlayersButton) {
            this._useUnnasignedPlayersButton.destroy();
        }
    }

    function fillSbcWithUnnasignedPlayers(onClubBatchLoadedCallback) {
        return new Promise(resolve => {
            getUnnasignedPlayers().then(unassignedPlayers => {
                const distinctItemIds = {};

                for (const unassignedPlayer of unassignedPlayers) {
                    if (!distinctItemIds[unassignedPlayer.duplicateId]) {
                        distinctItemIds[unassignedPlayer.duplicateId] = unassignedPlayer.id;
                    }
                }

                const playerIds = Object.keys(distinctItemIds).map(x => parseInt(x)).slice(0, 23);

                getAllClubPlayers(false, null, onClubBatchLoadedCallback).then(club => {
                    const { _squad, _challenge } = getCurrentController()._leftController;
                    const positionIndexes = _squad.getSBCSlots().reduce((acc, curr) => {
                        if (!curr.position) return acc;

                        if (!acc[curr.position.typeName]) {
                            acc[curr.position.typeName] = [];
                        }
                        acc[curr.position.typeName].push(curr.index);
                        return acc;
                    }, {});

                    club = club.filter(x => playerIds.indexOf(x.id) > -1);
                    club.sort((a, b) => {
                        return a.rating < b.rating ? -1 : a.rating > b.rating ? 1 : 0;
                    });

                    let substituteIndex = 11;
                    let playersOutOfPosition = [];

                    const players = new Array(23);
                    for (const player of club) {
                        const preferredPosition = positionIndexes[PlayerPosition[player.preferredPosition]];
                        if (preferredPosition && preferredPosition.length > 0) {
                            players[preferredPosition.shift()] = player;
                            if (preferredPosition.length === 0) {
                                delete positionIndexes[player.preferredPosition];
                            }
                        }
                        else {
                            playersOutOfPosition.push(player);
                            // if (substituteIndex < 23) {
                            //     players[substituteIndex] = player;
                            //     substituteIndex++;
                            // }
                        }
                    }

                    for(let position of Object.keys(positionIndexes)){
                        if(playersOutOfPosition.length === 0) break;

                        for(let positionIndex of positionIndexes[position]){
                            if(playersOutOfPosition.length === 0) break;
                            
                            players[positionIndex] = playersOutOfPosition.shift();
                        }
                    }


                    _squad.setPlayers(players, true);
                    services.SBC.saveChallenge(_challenge);
                    repositories.Item.unassigned.expiryTimestamp = 0;
                    repositories.Item.transfer.expiryTimestamp = 0;
                    resolve();
                });
            });
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
    order: 3,
    settings: {
        name: 'duplicated-to-sbc',
        title: 'plugins.duplicatedToSbc.settings.title',
        menu: menu
    }
};
/// #endif

export default plugin;