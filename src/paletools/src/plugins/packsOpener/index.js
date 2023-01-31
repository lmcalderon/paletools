/*!
This plugin is a copy of https://github.com/ckalgos/fut-trade-enhancer/blob/main/app/function-overrides/store-override.js
with some minor modification to be adapted to Paletools coding style
*/

let plugin;
/// #if process.env.PACKS_OPENER
import { addLabelWithToggle } from "../../controls";
import localize from "../../localization";
import { getUserCredits } from "../../services/credits";
import { openDialog } from "../../services/dialog";
import { getUnassignedItems, discardItems, moveItemsToClub, moveItemsToTransferList } from "../../services/item";
import settings, { saveConfiguration } from "../../settings";
import delay from "../../utils/delay";
import { displayLoader, hideLoader } from "../../utils/loader";
import { notifyFailure, notifyNeutral } from "../../utils/notifications";
import { toPromise } from "../../utils/observable";

const cfg = settings.plugins.selectCheapest;

const PURCHASE_ACTION = {
    MOVE_TO_CLUB: 'club',
    MOVE_TO_TRANSFER_LIST: 'transferList',
    QUICK_SELL: 'quickSell'
};

const BuyPackResult = {
    SUCCESS: 'success',
    UNASSIGNED_ITEMS: 'unassignedItems',
    NOT_ENOUGH_CREDITS: 'notEnoughCredits',
    ERROR: 'error'
};

const HandleItemResult = {
    SUCCESS: 'success',
    TRANSFER_LIST_FULL: 'transferListFull',
    ERROR: 'error'
};

function run() {
    async function autoOpenPacks() {
        const response = await toPromise(services.Store.getPacks());
        const pack = response.response.packs.find(x => x.id === this.articleId);

        if (!pack) {
            notifyFailure(localize("plugins.packOpener.errors.missingPack"));
            return;
        }

        openDialog(
            [
                { labelEnum: enums.UIDialogOptions.OK },
                { labelEnum: enums.UIDialogOptions.CANCEL },
            ],
            localize("Auto Open Packs"),
            `
            <select class="sbc-players-list" id="pack-opener-purchase-action">
                <option value="${PURCHASE_ACTION.MOVE_TO_CLUB}">Move To Club</option>
                <option value="${PURCHASE_ACTION.MOVE_TO_TRANSFER_LIST}">Move To Transfer List</option>
                <option value="${PURCHASE_ACTION.QUICK_SELL}">Quick Sell</option>
             </select> 
             <br />
             <br />
             ${localize("Packs #")}
             <input placeholder="3" id="pack-opener-purchase-count" type="number" class="ut-text-input-control fut-bin-buy" />
             <br /> <br />
             ${GameCurrency.COINS}/${GameCurrency.POINTS}
             <select class="sbc-players-list" id="pack-opener-currency">
                <option value="${GameCurrency.COINS}">${localize("currency.coins")}</option>
                <option value="${GameCurrency.POINTS}">${localize("currency.points")}</option>
             </select>
             <br /> <br />
             `,
            (text) => {
                if (text == enums.UIDialogOptions.OK) {
                    openPack(pack, select("#pack-opener-purchase-action").value, parseInt(select("#pack-opener-purchase-count").value), select("#pack-opener-currency").value);
                }
            }
        );
    }

    const UTStorePackDetailsView_setupBuyCoinsButton = UTStorePackDetailsView.prototype.setupBuyCoinsButton;
    UTStorePackDetailsView.prototype.setupBuyCoinsButton = function (...params) {
        UTStorePackDetailsView_setupBuyCoinsButton.call(this, ...params);

        this._btnOpenPacks && this.removeActionButton(this._btnOpenPacks);
        this._btnOpenPacks = new UTCurrencyButtonControl();
        this._btnOpenPacks.init();
        this._btnOpenPacks.setText("Open Pack");
        this._btnOpenPacks.setSubText("Automatically");
        this._btnOpenPacks.addClass("call-to-action packOpen");
        this._btnOpenPacks.addTarget(this, autoOpenPacks, EventType.TAP);
        this.appendActionButton(this._btnOpenPacks);
    }

    async function openPack(pack, purchaseAction, purchaseCount, currency) {
        displayLoader();
        while (purchaseCount > 0) {
            const buyPackResult = await buyPack(pack, purchaseAction, currency);
            if (buyPackResult !== BuyPackResult.SUCCESS) {
                hideLoader();

                let failureMessage;
                switch (BuyPackResult) {
                    case BuyPackResult.ERROR:
                        failureMessage = localize("plugins.packOpener.genericError");
                        break;
                    case BuyPackResult.UNASSIGNED_ITEMS:
                        failureMessage = localize("popup.error.unassignedItemsEntitlementTitle");
                        break;
                    case BuyPackResult.NOT_ENOUGH_CREDITS:
                        failureMessage = localize("popup.error.tradetoken.NotEnoughCredits");
                        break;
                }
                notifyFailure(failureMessage);
            }
            await delay(2800, 3200);
            purchaseCount--;
            notifyNeutral(localize("plugins.packOpener.packsRemaining").replace('#', purchaseCount));
        }
        hideLoader();
    };

    function handleNonDuplicatePlayers(items, action) {
        const nonDuplicatePlayersItems = items.filter(
            (item) => !item.isDuplicate() && item.isPlayer()
        );
        notifyNeutral(localize("plugins.packOpener.handlingNonDuplicatePlayers"));
        return handleItems(nonDuplicatePlayersItems, action);
    };

    function handleNonDuplicateNonPlayers(items, action) {
        const nonDuplicateNonPlayersItems = items.filter(
            (item) => !item.isDuplicate() && !item.isPlayer()
        );
        notifyNeutral(localize("plugins.packOpener.handlingNonDuplicateNonPlayers"));
        return handleItems(nonDuplicateNonPlayersItems, action);
    };

    function handleDuplicates(items, action) {
        const duplicateItems = items.filter((item) => item.isDuplicate());
        notifyNeutral(localize("plugins.packOpener.handlingDuplicates"));
        return handleItems(duplicateItems, action);
    };

    async function handleMiscItems(items) {
        const miscItems = items.filter((item) => item.isMiscItem());
        if(miscItems.length === 0) return;
        notifyNeutral(localize("plugins.packOpener.handlingCredits"));
        await Promise.all(
            miscItems.map(async (credit) => {
                services.Item.redeem(credit);
                await delay(1900, 2100);
            })
        );
    };


    async function handleItems(items, action) {
        if (items.length === 0) return;

        let result;
        switch (action) {
            case PURCHASE_ACTION.MOVE_TO_TRANSFER_LIST:
                if (repositories.Item.isPileFull(ItemPile.TRANSFER)) {
                    return HandleItemResult.TRANSFER_LIST_FULL;
                }
                result = await moveItemsToTransferList(items);
                break;
            case PURCHASE_ACTION.MOVE_TO_CLUB:
                result = await moveItemsToClub(items);
                break;
            case PURCHASE_ACTION.QUICK_SELL:
                result = await discardItems(items);
                break;
        }

        if (!result.success) {
            return HandleItemResult.ERROR;
        }

        return HandleItemResult.SUCCESS;
    };

    async function buyPack(pack, currency, purchaseAction) {
        if (repositories.Item.numItemsInCache(ItemPile.PURCHASED)) {
            return BuyPackResult.UNASSIGNED_ITEMS;
        }

        if (!pack.prices._collection[currency] || pack.prices._collection[currency].amount > services.User.getUser()[currency.toLowerCase()].amount) {
            return BuyPackResult.NOT_ENOUGH_CREDITS;
        }

        const purchaseResponse = await toPromise(pack.purchase(currency));

        if (!purchaseResponse.success) return BuyPackResult.ERROR;

        const displayErrorNotification = result => {
            let errorMessage;
            switch (result) {
                case HandleItemResult.ERROR:
                    errorMessage = localize("plugins.packOpener.genericError");
                    break;
                case HandleItemResult.TRANSFER_LIST_FULL:
                    errorMessage = localize("plugins.packOpener.transferListFull");
                    break;
            }

            notifyFailure(errorMessage);
        }

        const unassignedItems = await getUnassignedItems()

        const handle = async action => {
            let result = await action(unassignedItems, purchaseAction);
            if (result != HandleItemResult.SUCCESS) {
                displayErrorNotification(result);
            }
            await delay(1900, 2100);
        }

        await handle(handleNonDuplicatePlayers);
        await handle(handleNonDuplicateNonPlayers);
        await handle(handleDuplicates);
        await handle(handleMiscItems);
        await getUserCredits();
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
    order: 100,
    settings: {
        name: 'packs-opener',
        title: 'plugins.packsOpener.settings.title',
        menu: menu
    }
};
/// #endif

export default plugin;