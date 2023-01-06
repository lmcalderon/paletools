// import localize from "../localization";

// export default function buyPack(pack, popUpValues) {
//     if (repositories.Item.numItemsInCache(ItemPile.PURCHASED) > 0) {
//         throw localize("popup.error.unassignedItemsEntitlementTitle")
//     }
        
//     if (
//         !pack.prices._collection[popUpValues.credits] ||
//         pack.prices._collection[popUpValues.credits].amount >
//         services.User.getUser()[popUpValues.credits.toLowerCase()].amount
//     ) {
//         return {
//             success: false,
//             message: t("errInsufficientCredits"),
//         };
//     }
//     return new Promise((resolve) => {
//         pack.purchase(popUpValues.credits).observe(this, function (sender, data) {
//             if (data.success) {
//                 repositories.Item.setDirty(ItemPile.PURCHASED);
//                 sendPinEvents("Unassigned Items - List View");
//                 services.Item.requestUnassignedItems().observe(
//                     this,
//                     async function (sender, { response: { items } }) {
//                         let response = "";
//                         response += await handleNonDuplicatePlayers(
//                             items,
//                             popUpValues.playersHandler
//                         );
//                         await wait(2);
//                         response += await handleNonDuplicateNonPlayers(
//                             items,
//                             popUpValues.nonPlayersHandler
//                         );
//                         await wait(2);
//                         response += await handleDuplicates(
//                             items,
//                             popUpValues.duplicateHandler
//                         );
//                         await wait(2);
//                         response += await handleMiscItems(items);
//                         await wait(1);
//                         await updateUserCredits();
//                         resolve({ success: !response.length, message: response });
//                     }
//                 );
//             } else {
//                 resolve({ success: false });
//             }
//         });
//     });