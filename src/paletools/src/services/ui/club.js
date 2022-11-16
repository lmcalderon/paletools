import { getAllClubPlayers } from "../club";
import { updateBanner } from "../../utils/banner";
import localize from "../../localization";
import { EVENTS, on } from "../../events";

let _clubCache;
let _clubLoaded = false;

function playersToDictionary(players){
    if(!players) return {};

    const playersDict = {};
    for(let player of players){
        playersDict[player.definitionId] = player;
    }
    return playersDict;
}

export function watchForPlayersMovedToClub() {
    on(EVENTS.ITEM_MOVED, ev => {
        if(ev.detail.item.type !== ItemType.PLAYER) return;

        if(ev.detail.itemPile === ItemPile.CLUB){
            if(!_clubCache[ev.detail.item.definitionId]){
                _clubCache[ev.detail.item.definitionId] = ev.detail.item;
            }
        }
        else {
            if(_clubCache[ev.detail.item.definitionId]){
                delete _clubCache[ev.detail.item.definitionId];
            }
        }
    });
}

export function loadClubPlayers(callback){
    if(_clubLoaded) return new Promise(resolve => resolve(_clubCache));

    let club = {}

    return new Promise(resolve => {
        getAllClubPlayers(true, null, (loadedPlayersCount, currentClub) => {
            club = playersToDictionary(currentClub);
            updateBanner(localize("ui.loadingPlayers").replace("{count}", loadedPlayersCount));

            if(callback){
                callback(loadedPlayersCount);
            }
        }).then(currentClub => {
            club = playersToDictionary(currentClub); 
            updateBanner("");
            const existingPlayers = _clubCache;
            _clubCache = club;

            if(existingPlayers) {
                for(let playerId of Object.keys(existingPlayers)){
                    _clubCache[playerId] = existingPlayers[playerId];
                }
            }

            _clubLoaded = true;
            resolve(_clubCache);
        });
    });
}