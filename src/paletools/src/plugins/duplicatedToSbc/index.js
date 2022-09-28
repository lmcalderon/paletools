let plugin;

/// #if process.env.DUPLICATED_TO_SBC
import { addLabelWithToggle } from "../../controls";
import localize from "../../localization";
import { getAllClubPlayers, getUnnasignedPlayers } from "../../services/club";
import getCurrentController from "../../utils/controller";
import settings from "../../settings";
import { EVENTS, on } from "../../events";
import { hide, show } from "../../utils/visibility";
import { getPlayerAlternativePositions, getPlayerSecondaryAlternativePositions } from "../../services/players";
import { navigateBack } from "../../services/ui/navigation";

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
            this._useUnnasignedPlayersButton.addTarget(this, async () => {
                try {
                    await fillSbcWithUnnasignedPlayers(count => {
                        this._useUnnasignedPlayersButton.setInteractionState(false);
                        this._useUnnasignedPlayersButton.setText(localize('plugins.duplicatedToSbc.button.textLoading').replace("{count}", count));
                    });
                }
                finally {
                    this._useUnnasignedPlayersButton.setInteractionState(true);
                    this._useUnnasignedPlayersButton.setText(localize('plugins.duplicatedToSbc.button.text'));

                    if (isPhone()) {
                        navigateBack(getCurrentController());
                    }
                }
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
                    const controller = getCurrentController();
                    let challenge = null;
                    if(controller._challengeDetailsController){
                        challenge = controller._challengeDetailsController._currentController._challenge;
                    }
                    else {
                        challenge = controller._challenge;
                    }

                    const squad = challenge.squad;
                    const positionIndexes = squad.getSBCSlots().reduce((acc, curr) => {
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
                        const squadPosition = positionIndexes[PlayerPosition[player.preferredPosition]];

                        // Position each player on its preferred position if the position is not occupied
                        if (squadPosition && squadPosition.length > 0) {
                            players[squadPosition.shift()] = player;
                            if (squadPosition.length === 0) {
                                delete positionIndexes[PlayerPosition[player.preferredPosition]];
                            }
                        }
                        // if the position is occupied, put player as out of position
                        else {
                            playersOutOfPosition.push(player);
                        }
                    }

                    function processAlternativePositions(getPositionFunc) {
                        // if there is still open positions in the starting 11, try to put players in their alternatives positions
                        for (let outOfPositionIndex = 0; outOfPositionIndex < playersOutOfPosition.length && Object.keys(positionIndexes).length > 0;) {
                            let player = playersOutOfPosition.shift();

                            let squadPosition = null;
                            for (let alternativePositionIndex of getPositionFunc(player.preferredPosition)) {
                                squadPosition = positionIndexes[PlayerPosition[alternativePositionIndex]];
                                if (!squadPosition || squadPosition.length == 0) continue;

                                players[squadPosition.shift()] = player;
                                if (squadPosition.length === 0) {
                                    delete positionIndexes[PlayerPosition[alternativePositionIndex]];
                                }
                                break;
                            }

                            if (!squadPosition) {
                                playersOutOfPosition.push(player);
                                outOfPositionIndex++;
                            }
                        }
                    }

                    processAlternativePositions(getPlayerAlternativePositions);
                    processAlternativePositions(getPlayerSecondaryAlternativePositions);

                    // position players of pending open positions in the starting 11
                    for (let position of Object.keys(positionIndexes)) {
                        if (playersOutOfPosition.length === 0) break;

                        for (let positionIndex of positionIndexes[position]) {
                            if (playersOutOfPosition.length === 0) break;

                            players[positionIndex] = playersOutOfPosition.shift();
                        }
                    }

                    // position players on the bench
                    for (let player of playersOutOfPosition) {
                        if (substituteIndex >= 23) break;

                        players[substituteIndex++] = player;
                    }


                    squad.setPlayers(players, true);
                    services.SBC.saveChallenge(challenge);
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