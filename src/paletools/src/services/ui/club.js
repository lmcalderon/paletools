import { getAllClubPlayers, getClubPlayersByDefId } from "../club";
import { updateBanner } from "../../utils/banner";
import localize from "../../localization";
import { EVENTS, on } from "../../events";
import db from "../db";
import { isFastClubSearchEnabled } from "../experimental";

let _clubCache = {};
let _playerIdsNotInClub = new Set();
let _clubLoaded = false;

export function toPlayersDictionary(players) {
    if (!players) return {};

    const playersDict = {};
    for (let player of players) {
        playersDict[player.definitionId] = player;
    }
    return playersDict;
}

export function watchForPlayersMovement() {
    on(EVENTS.ITEM_MOVED, ev => {
        if (ev.detail.item.type !== ItemType.PLAYER) return;

        if (ev.detail.itemPile === ItemPile.CLUB) {
            if (!_clubCache[ev.detail.item.definitionId]) {
                _clubCache[ev.detail.item.definitionId] = ev.detail.item;
            }

            _playerIdsNotInClub.delete(ev.detail.item.definitionId);

            db.transactions.insertBuy(ev.detail.item);
        }
        else {
            if (_clubCache[ev.detail.item.definitionId]) {
                delete _clubCache[ev.detail.item.definitionId];
            }

            _playerIdsNotInClub.add(ev.detail.item.definitionId);
        }
    });

    on(EVENTS.ITEM_DISCARDED, ev => {
        if (ev.detail.item.type !== ItemType.PLAYER) return;

        if (_clubCache[ev.detail.item.definitionId]) {
            delete _clubCache[ev.detail.item.definitionId];
        }

        _playerIdsNotInClub.add(ev.detail.item.definitionId);
    });
}

export async function findPlayersInClub(players, callback, asDictionary = false, ignoreCache = false) {
    const playerIds = players.filter(x => x instanceof UTStaticPlayerDataDTO || x.isPlayer()).map(x => x instanceof UTStaticPlayerDataDTO ? x.id : x.definitionId);

    if (isFastClubSearchEnabled()) {
        
        let foundPlayers = asDictionary ? {} : [];
        let missingPlayerIds = [];

        for (let id of playerIds) {
            const foundPlayer = ignoreCache ? null : _clubCache[id];
            if (foundPlayer) {
                if (asDictionary) {
                    foundPlayers[foundPlayer.definitionId] = foundPlayer;
                }
                else {
                    foundPlayers.push(foundPlayer);
                }
            }
            else {
                if (!_playerIdsNotInClub.has(id)) {
                    missingPlayerIds.push(id);
                }
            }
        }

        for (let player of await getClubPlayersByDefId(missingPlayerIds)) {
            if (player.loans === -1) {
                if (asDictionary) {
                    foundPlayers[player.definitionId] = player;
                }
                else {
                    foundPlayers.push(player);
                }
                _clubCache[player.definitionId] = player;
            }
        }

        for (let playerId of playerIds) {
            if (!_clubCache[playerId]) {
                _playerIdsNotInClub.add(playerId);
            }
        }

        return foundPlayers;
    }
    else {
        await loadClubPlayers(callback);
        const foundPlayers = asDictionary ? {} : [];

        for (let playerId of playerIds) {
            const foundPlayer = _clubCache[playerId];
            if (foundPlayer) {
                if (asDictionary) {
                    foundPlayers[foundPlayer.definitionId] = foundPlayer;
                }
                else {
                    foundPlayers.push(foundPlayer);
                }
            }
        }

        return foundPlayers;
    }
}

export async function loadClubPlayers(callback, avoidFastSearchCheck = false, clearCache = false) {
    if (!avoidFastSearchCheck && isFastClubSearchEnabled()) return new Promise(resolve => resolve({}));

    if (clearCache) {
        _clubLoaded = false;
        _clubCache = {};
    }

    if (_clubLoaded) return new Promise(resolve => resolve(_clubCache));

    let club = {}

    return new Promise(resolve => {
        getAllClubPlayers(true, null, (loadedPlayersCount, currentClub) => {
            club = toPlayersDictionary(currentClub);
            updateBanner(localize("ui.loadingPlayers").replace("{count}", loadedPlayersCount));

            if (callback) {
                callback(loadedPlayersCount);
            }
        }).then(currentClub => {
            club = toPlayersDictionary(currentClub);
            updateBanner("");
            const existingPlayers = _clubCache;
            _clubCache = club;

            if (existingPlayers) {
                for (let playerId of Object.keys(existingPlayers)) {
                    _clubCache[playerId] = existingPlayers[playerId];
                }
            }

            _clubLoaded = true;
            resolve(_clubCache);
        });
    });
}