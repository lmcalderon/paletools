/// #if process.env.TRANSACTIONS_HISTORY

import { ButtonGroup } from "../../controls/ButtonGroup";
import { MenuBar } from "../../controls/MenuBar";
import { Table } from "../../controls/Table";
import UTNativeDropDownControl from "../../controls/UTNativeDropDownControl";
import { on } from "../../events";
import localize, { localizeDate, localizeMonthAbbr, localizeNumber } from "../../localization";
import { dateToInt, getLastDayOfMonth, intToDate } from "../../services/date";
import getWindow from "../../services/window";
import { addClass, append, createElem, select, selectAll } from "../../utils/dom";
import { addStyle } from "../../utils/styles";
import { hide, show } from "../../utils/visibility";
import styles from "./styles.css";
import { SearchRange } from "./TransactionsHistoryController";



function loc(key) {
    let value = localize(`plugins.transactionsHistory.${key}`);
    if (!value || value.indexOf(key) > -1) return localize(key);

    return value;
}

export function TransactionsHistoryView(t) {
    UTView.call(this);
    this.onReIndexClicked = new EAObservable();
    this.onDropDatabaseClicked = new EAObservable();
    this.onDateChanged = new EAObservable();
    this.onExportCsvClicked = new EAObservable();
    this.onDataSorted = new EAObservable();
}

JSUtils.inherits(TransactionsHistoryView, UTView);

TransactionsHistoryView.prototype._appendMainMenu = function (container) {
    const self = this;
    const menuBar = new MenuBar({
        menuItems: [
            { id: "tx-dashboard", text: loc("view.menu.dashboard"), selected: true },
            { id: "tx-bought", text: loc("panel.bought") },
            { id: "tx-sold", text: loc("panel.sold") }
        ],
        onItemSelected: item => {
            if (item.id === "tx-dashboard") {
                hide(select("#tx-date-commands"));
                hide(self._rangeContainer);
                show(self._dashboardActions);
            }
            else {
                show(select("#tx-date-commands"));
                show(self._rangeContainer);
                hide(self._dashboardActions);
            }
            hide(selectAll(".tx-report"));
            show(select(`#${item.id}-report`));
            if(item.id === "tx-dashboard"){
                show(selectAll(".tx-report", self._dashboardContainer));
            }
        }
    });

    append(container, menuBar);
}

TransactionsHistoryView.prototype._createdDashboardActionsMenu = function (container) {
    const self = this;
    const menu = new ButtonGroup({
        id: "tx-dashboard-commands",
        buttons: [
            { label: loc("view.buttons.reindex"), onClick: () => self.onReIndexClicked.notify() },
            { label: loc("view.buttons.exportCsv"), onClick: () => self.onExportCsvClicked.notify() },
            { label: loc("view.buttons.clear"), onClick: () => confirm(localize("confirm")) ? self.onDropDatabaseClicked.notify() : null }
        ]
    });

    return menu;
}


TransactionsHistoryView.prototype._createFilterMenu = function (container) {
    const menu = createElem("div", { id: "tx-date-commands", className: "button-container" }, `
    <button class="btn-standard call-to-action" data-filter="${SearchRange.TODAY}">${loc("view.buttons.filterToday")}</button>
    <button class="btn-standard call-to-action" data-filter="${SearchRange.WEEK}">${loc("view.buttons.filterWeek")}</button>
    <button class="btn-standard call-to-action" data-filter="${SearchRange.MONTH}">${loc("view.buttons.filterMonth")}</button>
    `);

    const dropdown = new UTNativeDropDownControl();
    dropdown.onChange(value => {
        if (value.length === 0) return;

        this.onDateChanged.notify({ range: SearchRange.MONTH, value: new Date(value) });
    });
    addClass(dropdown, "tx-filter-months");

    const historyFrom = new Date();
    historyFrom.setFullYear(getWindow().APP_YEAR - 1);
    historyFrom.setMonth(8);
    historyFrom.setDate(1);
    const historyTo = getLastDayOfMonth(new Date());

    let date = historyFrom;

    const options = [];
    options.push({ label: loc("view.buttons.filterAnyMonth"), value: "" });
    while (date < historyTo) {
        options.push({ label: `${localizeMonthAbbr(date)} ${date.getFullYear()}`, value: date.toString() });
        date.setMonth(date.getMonth() + 1);
    }

    dropdown.setOptions(options)

    append(menu, dropdown);

    hide(menu);
    append(container, menu);

    on(selectAll("button", menu), "click", ev => {
        this.onDateChanged.notify({ range: ev.target.dataset.filter });
    });

    return menu;
}

TransactionsHistoryView.prototype._createTable = function (id) {
    const table = new Table({
        id: id,
        className: "tx-report",
        headers: [
            { text: loc("view.table.date"), sort: { key: "date", direction: "asc", default: true } },
            { text: loc("view.table.item"), sort: { key: "item", direction: "asc" } },
            { text: loc("view.table.price"), sort: { key: "price", direction: "asc" } }
        ],
        mapper: record => {
            const date = intToDate(record.timestamp);
            let dateStr = localizeDate(date);
            dateStr += ` ${date.toLocaleTimeString()}`;

            return [dateStr, getItem(record), localizeNumber(record.price)]
        },
        sortFunc: (recordSet, sortBy, sortByDirection) => {
            recordSet.sort((x, y) => {
                switch (sortBy) {
                    case "date":
                        return sortByDirection === "asc" ? x.timestamp - y.timestamp : y.timestamp - x.timestamp;
                    case "item":
                        const itemX = getItem(x).toString();
                        const itemY = getItem(y).toString();

                        return sortByDirection === "asc" ? itemX.localeCompare(itemY) : itemY.localeCompare(itemX);
                    case "price":
                        return sortByDirection === "asc" ? x.price - y.price : y.price - x.price;
                }
            });

            return recordSet;
        }
    });

    function getItem(record) {
        if (record.itemType === ItemType.PLAYER) {
            var staticData = repositories.Item.getStaticDataByDefId(record.staticDataId);
            return `${staticData.firstName} ${staticData.lastName} (${record.rating})`;
        }

        return record.itemType;
    }

    return table;
}

TransactionsHistoryView.prototype._createDashboard = function () {
    const container = createElem("div", { id: "tx-dashboard-report" });

    const overallTable = new Table({
        id: "tx-dashboard-overall-report",
        className: "tx-report",
        headers: [loc("panel.label"), loc("panel.bought"), loc("panel.sold")]
    });


    const monthTable = new Table({
        id: "tx-dashboard-month-report",
        className: "tx-report",
        headers: [loc("view.dashboard.month"), loc("panel.bought"), loc("panel.sold")]
    })

    const actions = this._createdDashboardActionsMenu();

    append(container, actions, overallTable, monthTable);

    return [container, actions, overallTable, monthTable];
}

TransactionsHistoryView.prototype._generate = function _generate() {
    if (!this.generated) {
        addStyle("paletools-transactionhistory", styles);

        const container = createElem("div");
        this._appendMainMenu(container);
        const contentContainer = createElem("div", { className: "ut-pinned-list-container ut-content-container" });
        const content = createElem("div", { className: "ut-content" });
        const pinnedList = createElem("div", { className: "ut-pinned-list club-analyzer" });

        append(container, contentContainer);
        append(contentContainer, content);
        append(content, pinnedList);

        [this._dashboardContainer, this._dashboardActions, this._dashboardOverall, this._dashboardMonth] = this._createDashboard();
        this._buyTable = this._createTable("tx-bought-report");
        this._sellTable = this._createTable("tx-sold-report");
        this._rangeContainer = createElem("div", { className: "tx-date-range" });


        append(pinnedList, this._createFilterMenu(), hide(this._rangeContainer), this._dashboardContainer, hide(this._buyTable), hide(this._sellTable));


        this.__root = container;
        this.generated = true;
    }
}

TransactionsHistoryView.prototype.update = function (viewModel) {
    this._rangeContainer.textContent = `${viewModel.transactions.range.from.toLocaleDateString()} - ${viewModel.transactions.range.to.toLocaleDateString()}`;

    this._dashboardOverall.updateData([[viewModel.counts.buy + viewModel.counts.sell, viewModel.counts.buy, viewModel.counts.sell]]);

    const dashboardDataByMonth = Object.keys(viewModel.counts.month).map(x => {
        const date = new Date(x);
        return [`${localizeMonthAbbr(date)} ${date.getFullYear()}`, viewModel.counts.month[x].buy, viewModel.counts.month[x].sell]
    });

    this._dashboardMonth.updateData(dashboardDataByMonth);

    this._buyTable.updateData(viewModel.transactions.buy);
    this._sellTable.updateData(viewModel.transactions.sell);
}

TransactionsHistoryView.prototype.dealloc = function dealloc() {
    this.onExportCsvClicked.dealloc();
    this.onExportCsvClicked = null;
    this.onDropDatabaseClicked.dealloc();
    this.onDropDatabaseClicked = null;
}