import { getAllClubPlayers } from "../club";
import { updateBanner } from "../../utils/banner";
import localize from "../../localization";

export function loadClubPlayers(){
    let club = {}
    function playersToDictionary(players){
        console.log(players);
        if(!players) return {};

        const playersDict = {};
        for(let player of players){
            playersDict[player.definitionId] = player;
        }
        return playersDict;
    }

    return new Promise(resolve => {
        getAllClubPlayers(true, null, (loadedPlayersCount, currentClub) => {
            club = playersToDictionary(currentClub);
            updateBanner(localize("ui.loadingPlayers").replace("{count}", loadedPlayersCount));
        }).then(currentClub => {
            club = playersToDictionary(currentClub); 
            updateBanner("");
            resolve(club);
        });
    });
}