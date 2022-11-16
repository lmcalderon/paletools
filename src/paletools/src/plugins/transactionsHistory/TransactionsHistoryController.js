
/// #if process.env.TRANSACTIONS_HISTORY
import localize from "../../localization";
import { dateToInt, getBeginOfDay, getEndOfDay, getFirstDayOfMonth, getFirstDayOfWeek, getLastDayOfMonth, getLastDayOfWeek } from "../../services/date";
import db from "../../services/db";
import { getTransferListItems, getWatchedItems } from "../../services/market";
import getWindow from "../../services/window";
import { TransactionsHistoryView } from "./TransactionsHistoryView";
import TransactionsHistoryViewModel from "./TransactionsHistoryViewModel";

export const SearchRange = {
    TODAY: "today",
    WEEK: "week",
    MONTH: "month"
};

export function TransactionsHistoryController(t) {
    UTViewController.call(this);
    this._viewmodel = new TransactionsHistoryViewModel();
};

JSUtils.inherits(TransactionsHistoryController, UTViewController);

TransactionsHistoryController.prototype._getViewInstanceFromData = function () {
    return new TransactionsHistoryView();
}

TransactionsHistoryController.prototype.init = function () {
    if (!this.initialized) {
        this.getView().onExportCsvClicked.observe(this, this._exportCsv);
        this.getView().onDateChanged.observe(this, (sender, filter) => this.loadTransactions(filter.range, filter.value));
        this.loadTransactions();
        this.initialized = true;
    }
}

TransactionsHistoryController.prototype.viewDidAppear = function () {
    this.getNavigationController().setNavigationVisibility(true, true);
}

TransactionsHistoryController.prototype.getNavigationTitle = function () {
    return localize("plugins.transactionsHistory.settings.title");
}

TransactionsHistoryController.prototype.loadTransactions = async function (searchRange = SearchRange.MONTH, value) {
    const soldItems = (await getTransferListItems()).filter(x => x.getAuctionData().isSold());
    const wonItems = (await getWatchedItems()).filter(x => x.getAuctionData().isWon());

    await db.transactions.insertMultipleBuy(wonItems);
    await db.transactions.insertMultipleSell(soldItems);

    this._viewmodel.counts.buy = await db.transactions.getBuyCount();
    this._viewmodel.counts.sell = await db.transactions.getSellCount();

    const historyFrom = new Date();
    historyFrom.setFullYear(getWindow().APP_YEAR - 1);
    historyFrom.setMonth(8);
    historyFrom.setDate(1);
    const historyTo = getLastDayOfMonth(new Date());

    let date = historyFrom;
    while (date < historyTo) {
        this._viewmodel.counts.month[date] = {
            buy: await db.transactions.getBuyCountByDateRange(getFirstDayOfMonth(date), getLastDayOfMonth(date)),
            sell:  await db.transactions.getSellCountByDateRange(getFirstDayOfMonth(date), getLastDayOfMonth(date))
        };
        date.setMonth(date.getMonth() + 1);
    }

    let from, to;
    switch (searchRange) {
        case SearchRange.TODAY:
            from = getBeginOfDay();
            to = getEndOfDay();
            break;
        case SearchRange.WEEK:
            from = getFirstDayOfWeek();
            to = getLastDayOfWeek();
            break;
        case SearchRange.MONTH:
            if (value) {
                from = getFirstDayOfMonth(value);
                to = getLastDayOfMonth(value);
            }
            else {
                from = getFirstDayOfMonth();
                to = getLastDayOfMonth();
            }
            break;
    }


    this._viewmodel.transactions.range.from = from;
    this._viewmodel.transactions.range.to = to;
    this._viewmodel.transactions.buy = await db.transactions.getBuyByDateRange(from, to);
    this._viewmodel.transactions.sell = await db.transactions.getSellByDateRange(from, to);

    this.getView().update(this._viewmodel);
}

/// #endiff