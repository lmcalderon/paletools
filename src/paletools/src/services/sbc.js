import { isFastClubSearchEnabled } from "./experimental";
import { getPlayerAlternativePositions, getPlayerSecondaryAlternativePositions } from "./players";
import { findPlayersInClub } from "./ui/club";

export async function fillSbc(sbcChallenge, playersToUse, onClubBatchLoadedCallback) {
    const club = (await findPlayersInClub(playersToUse, onClubBatchLoadedCallback)).slice(0, 23);
    const squad = sbcChallenge.squad;
    const positionIndexes = squad.getSBCSlots().reduce((acc, curr) => {
        if (!curr.position) return acc;

        if (!acc[curr.position.typeName]) {
            acc[curr.position.typeName] = [];
        }
        acc[curr.position.typeName].push(curr.index);
        return acc;
    }, {});

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

    processAlternativePositions(getPlayerAlternativePositions );
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
    services.SBC.saveChallenge(sbcChallenge);
    repositories.Item.unassigned.expiryTimestamp = 0;
    repositories.Item.transfer.expiryTimestamp = 0;
}