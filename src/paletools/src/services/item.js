import localize from "../localization";
import { toPromise } from "../utils/observable";

export function getItemAsText(item, lastNameFirst = false) {
  if (item.isPlayer()) {
    const staticData = item.getStaticData();
    return staticData.commonName ? staticData.commonName : lastNameFirst ? `${staticData.lastName} ${staticData.firstName}` : `${staticData.firstName} ${staticData.lastName}`;
  }

  if (item.isContract()) {
    return item.isPlayerContract() ? localize("card.title.playercontracts") : localize("card.title.managercontracts");
  }

  if (item.isTraining()) {
    if (item.isPlayerPositionModifier()) return localize("card.title.positionmodifier");
    if (item.isManagerLeagueModifier()) return localize("card.title.leaguechange");
    if (item.isPlayerStyleModifier()) return localize("card.title.player");
    if (item.isGKStyleModifier()) return localize("card.title.goalkeeper");
  }

  if (item.isBadge()) return localize("card.title.badge");
  if (item.isBall()) return localize("");
  if (item.isKit()) return localize("card.title.kit");
  if (item.isDraftToken()) return localize("card.title.drafttoken");
  if (item.isPlayerPickItem()) return localize("card.title.playerpicks");

}

export function getItemStaticDataByDefId(defId) {
  return repositories.Item.getStaticDataByDefId(defId & ItemIdMask.DATABASE);
}

export function getItemStaticDataId(item) {
  if (item.type !== ItemType.PLAYER) return 0;

  const staticData = item.getStaticData();
  let staticId = staticData.assetId;

  if (staticId) return staticId;

  if (getItemStaticDataByDefId(item.definitionId)) {
    return item.definitionId;
  }

  const allPlayers = repositories.Item.getStaticData();

  let staticPlayer = allPlayers.find(x => x.firstName === staticData.firstName && x.lastName === staticData.lastName && x.rating == item.rating);

  if (staticPlayer) {
    return staticPlayer.id;
  }

  staticPlayer = allPlayers.find(x => x.firstName === staticData.firstName && x.lastName === staticData.lastName);

  if (staticPlayer) {
    return staticPlayer.id;
  }

  return 0;
}

export function getUnassignedItems() {
  //return http('purchased/items');
  repositories.Item.setDirty(ItemPile.PURCHASED);
  sendPinEvents("Unassigned Items - List View");
  return new Promise((resolve) => {
      services.Item.requestUnassignedItems().observe(this, (sender, response) => {
          resolve(response.response.items);
      });
  });
}

export function moveItemsToTransferList(items) {
  return toPromise(services.Item.move(items, ItemPile.TRANSFER));
}

export function moveItemsToClub(items) {
  return toPromise(services.Item.move(items, ItemPile.CLUB));
}

export function discardItems(items) {
  return toPromise(services.Item.discard(items));
}