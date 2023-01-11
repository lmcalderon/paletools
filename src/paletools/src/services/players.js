import settings from "../settings";
import { flattenArray } from "../utils/array";
import delay from "../utils/delay";
import { isFastConceptSearchEnabled } from "./experimental";
import { toPromise } from "../utils/observable";

export function getPlayerAlternativePositions(preferredPosition) {
  switch (preferredPosition) {
    case PlayerPosition.ST: return [PlayerPosition.CF];
    case PlayerPosition.CF: return [PlayerPosition.ST, PlayerPosition.CAM];
    case PlayerPosition.CAM: return [PlayerPosition.CM, PlayerPosition.CF];
    case PlayerPosition.CM: return [PlayerPosition.CAM, PlayerPosition.CDM];
    case PlayerPosition.CDM: return [PlayerPosition.CM];
    case PlayerPosition.LM: return [PlayerPosition.LW, PlayerPosition.LF];
    case PlayerPosition.LF: return [PlayerPosition.LW, PlayerPosition.LM];
    case PlayerPosition.LW: return [PlayerPosition.LF, PlayerPosition.LM];
    case PlayerPosition.RM: return [PlayerPosition.RW, PlayerPosition.RF];
    case PlayerPosition.RF: return [PlayerPosition.RW, PlayerPosition.RM];
    case PlayerPosition.RW: return [PlayerPosition.RF, PlayerPosition.RM];
    case PlayerPosition.LB: return [PlayerPosition.LWB];
    case PlayerPosition.LWB: return [PlayerPosition.LB];
    case PlayerPosition.RB: return [PlayerPosition.RWB];
    case PlayerPosition.RWB: return [PlayerPosition.RB];
  }

  return [];
}

export function getPlayerSecondaryAlternativePositions(preferredPosition) {
  switch (preferredPosition) {
    case PlayerPosition.CB: return [PlayerPosition.LB, PlayerPosition.RB]
    case PlayerPosition.CDM: return [PlayerPosition.CB];
    case PlayerPosition.LM: return [PlayerPosition.LB, PlayerPosition.LWB];
    case PlayerPosition.LF: return [PlayerPosition.ST];
    case PlayerPosition.LW: return [PlayerPosition.LWB, PlayerPosition.LB];
    case PlayerPosition.RM: return [PlayerPosition.RB, PlayerPosition.RWB];
    case PlayerPosition.RF: return [PlayerPosition.ST];
    case PlayerPosition.RW: return [PlayerPosition.RWB, PlayerPosition.RB];
    case PlayerPosition.LB: return [PlayerPosition.LM, PlayerPosition.LW, PlayerPosition.RB];
    case PlayerPosition.LWB: return [PlayerPosition.LW, PlayerPosition.LWB, PlayerPosition.RWB];
    case PlayerPosition.RB: return [PlayerPosition.RM, PlayerPosition.RW, PlayerPosition.LB];
    case PlayerPosition.RWB: return [PlayerPosition.RW, PlayerPosition.RM, PlayerPosition.LWB];
  }

  return [];
}

export function getConceptPlayers(playerIds) {
  // if (isFastConceptSearchEnabled()) {
  //   return new Promise((resolve, reject) => {
  //     const searchCriteria = new UTItemSearchViewModel().searchCriteria;
  //     searchCriteria.defId = playerIds;
  //     searchCriteria.count = settings.requests.maxItemsCount;
  //     services.Item.searchConceptItems(searchCriteria).observe(
  //       this,
  //       (sender, response) => {
  //         if (response.success) {
  //           resolve(response.response.items);
  //         }
  //         else {
  //           reject();
  //         }
  //       }
  //     );
  //   });
  // }
  // else {
    let promises = [];
    for (let playerId of playerIds) {
      promises.push(getConceptPlayer(playerId));
    }

    return Promise.all(promises);
  // }
}

export function getConceptPlayer(playerId) {
  return new Promise(resolve => {
    playerId = parseInt(playerId);

    getConceptPlayersByDefinitionId(playerId).then(players => {
      let player = players.find(x => x.definitionId === playerId)
      resolve(player);
    });
  });
}

function getConceptPlayersByDefinitionId(playerId) {
  return new Promise((resolve, reject) => {
    const searchCriteria = new UTItemSearchViewModel().searchCriteria;
    if (playerId) {
      searchCriteria.defId = [playerId];
    }
    const gatheredPlayers = [];

    const getAllConceptPlayers = () => {
      services.Item.searchConceptItems(searchCriteria).observe(
        this,
        async function (sender, response) {
          gatheredPlayers.push(...response.response.items);
          if (response.status !== 400 && !response.response.endOfList) {
            searchCriteria.offset += searchCriteria.count;
            delay(100).then(() => getAllConceptPlayers());
          } else {
            resolve(gatheredPlayers);
          }
        }
      );
    };
    getAllConceptPlayers();
  });
};