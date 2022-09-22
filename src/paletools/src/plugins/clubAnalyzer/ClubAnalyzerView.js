/// #if process.env.CLUB_ANALYZER

import localize from "../../localization";
import { addClass, append, createElem, isVisible, removeClass, select, selectAll } from "../../utils/dom";
import { hide, show } from "../../utils/visibility";
import { on } from "../../events";

export function ClubAnalyzerView(t) {
    UTView.call(this);
    this.onReloadClicked = new EAObservable();
    this.onExportCsvClicked = new EAObservable();
    this.onExportHtmlClicked = new EAObservable();
}

JSUtils.inherits(ClubAnalyzerView, UTView);

ClubAnalyzerView.prototype.dealloc = function dealloc() {
    this.onReloadClicked.dealloc();
    this.onReloadClicked = null;
    this.onExportCsvClicked.dealloc();
    this.onExportCsvClicked = null;
    this.onExportHtmlClicked.dealloc();
    this.onExportHtmlClicked = null;
}

ClubAnalyzerView.prototype._appendMainMenu = function (container) {
    append(container, createElem("div", { className: "ea-filter-bar-view"}, `
    <div class="menu-container">
            <button id="clubanalyzer-players-dashboard" class="ea-filter-bar-item-view selected">Dashboard</button>
            <button id="clubanalyzer-players-by-rating" class="ea-filter-bar-item-view">Rating</button>
            <button id="clubanalyzer-players-by-rarity" class="ea-filter-bar-item-view">${localize("extendedPlayerInfo.general.rarity")}</button>
            <button id="clubanalyzer-players-by-league" class="ea-filter-bar-item-view">${localize("search.details.itemLeague")}</button>
            <button id="clubanalyzer-players-by-nation" class="ea-filter-bar-item-view">${localize("extendedPlayerInfo.general.nation")}</button>
            <button id="clubanalyzer-players-by-unnasigned" class="ea-filter-bar-item-view">${localize("navbar.label.newitems")} <span id="clubanalyzer-counter-unnasigned"></span></button>
            <button id="clubanalyzer-players-by-transferlist" class="ea-filter-bar-item-view">${localize("panel.label.transferlist")} <span id="clubanalyzer-counter-tradepile"></span></button>
            <button id="clubanalyzer-players-by-transfertargets" class="ea-filter-bar-item-view">${localize("panel.label.transfertargets")}  <span id="clubanalyzer-counter-watchlist"></span></button>
        </div>`));

    const allButtons = selectAll(".menu-container > button", container);

    on(allButtons, "mouseover", ev => {
        removeClass(allButtons, "hover");
        addClass(ev.currentTarget, "hover"); 
    });

    on(allButtons, "click", ev => {
        hide(selectAll(".club-analyzer-report"));
        removeClass(allButtons, "selected");
        addClass(ev.currentTarget, "selected");

        let targetId = ev.currentTarget.id.replace("players-", "report-");
        show(select(`#${targetId}`));
        show(selectAll(`.${targetId}`));
    });
}

ClubAnalyzerView.prototype._appendBody = function (container) {
    const contentContainer = createElem("div", { className: "ut-pinned-list-container ut-content-container" });
    const content = createElem("div", { className: "ut-content" });
    const pinnedList = createElem("div", { className: "ut-pinned-list club-analyzer" });

    append(content, pinnedList);
    append(contentContainer, content);

    append(container, 
            contentContainer,
            createElem("div", { className: "button-container"}, `
            <button id="reload-club-analyzer" class="btn-standard call-to-action" data-loading="Reloading...">${localize("plugins.clubAnalyzer.view.buttons.reload")}</button>
            <button id="export-csv-club-analyzer" class="btn-standard call-to-action" data-loading="Exporting...">${localize("plugins.clubAnalyzer.view.buttons.exportCsv")}</button>
            <button id="export-html-club-analyzer" class="btn-standard call-to-action" data-loading="Exporting...">${localize("plugins.clubAnalyzer.view.buttons.exportHtml")}</button>
            `));

    on(select("#reload-club-analyzer", container), "click", () => {
        this.onReloadClicked.notify();
    });

    on(select("#export-csv-club-analyzer", container), "click", () => {
        this.onExportCsvClicked.notify();
    });

    on(select("#export-html-club-analyzer", container), "click", () => {
        this.onExportHtmlClicked.notify();
    });


    return pinnedList;
}

ClubAnalyzerView.prototype._createDashboard = function (viewmodel) {
    const counters = viewmodel.counters;
    return createElem("div", { id: "clubanalyzer-report-dashboard", className: "club-analyzer-report" },
                `<h3 class="tile">
                ${localize("plugins.clubAnalyzer.view.dashboard.description")}
                </h3>
                <div>
                <table class="rarities tile">
                    <tr><th></th><th>${localize("item.raretype1")}</th><th>${localize("item.raretype0")}</th></tr>
                    <tr><td><img src="https://www.ea.com/fifa/ultimate-team/web-app/images/SearchFilters/level/gold.png" /></td><td>${counters.rare.gold}</td><td>${counters.common.gold}</td></tr>
                    <tr><td><img src="https://www.ea.com/fifa/ultimate-team/web-app/images/SearchFilters/level/silver.png" /></td><td>${counters.rare.silver}</td><td>${counters.common.silver}</td></tr>
                    <tr><td><img src="https://www.ea.com/fifa/ultimate-team/web-app/images/SearchFilters/level/bronze.png" /></td><td>${counters.rare.bronze}</td><td>${counters.common.bronze}</td></tr>
                    <tr><td><img src="https://www.ea.com/fifa/ultimate-team/web-app/images/SearchFilters/level/SP.png" /></td><td>${counters.special}</td><td></td></tr>
                </table>
                </div>
                <div>
                    <table class="latam tile">
                        <tr><th></th><th>${localize("search.cardLevels.cardLevel3")}</th><th>${localize("search.cardLevels.cardLevel2")}</th><th>${localize("search.cardLevels.cardLevel1")}</th></tr>
                        <tr><td><img src="https://www.ea.com/fifa/ultimate-team/web-app/content/21D4F1AC-91A3-458D-A64E-895AA6D871D1/2021/fut/items/images/backgrounds/itemCompanionBGs/8f60cc02-051a-4f95-bdcb-a2bc454e1f47/cards_bg_s_1_53_0.png" /></td><td>${counters.libertadores.gold}</td><td>${counters.libertadores.silver}</td><td>${counters.libertadores.bronze}</td></tr>
                        <tr><td><img src="https://www.ea.com/fifa/ultimate-team/web-app/content/21D4F1AC-91A3-458D-A64E-895AA6D871D1/2021/fut/items/images/backgrounds/itemCompanionBGs/ab719e69-0d3e-430c-8e67-80a106de93c1/cards_bg_s_1_52_0.png" /></td><td>${counters.sudamericana.gold}</td><td>${counters.sudamericana.silver}</td><td>${counters.sudamericana.bronze}</td></tr>
                    </table>
                    <table class="limbo tile">
                        <tr><th>${localize("navbar.label.newitems")}</th><th>${localize("panel.label.transferlist")}</th><th>${localize("panel.label.transfertargets")}</th></tr>
                        <tr><td>${counters.unnasignedTotal}</td><td>${counters.tradepileTotal}</td><td>${counters.watchlistTotal}</td></tr>
                    </table>
                </div>
            </div>`);
}

ClubAnalyzerView.prototype._renderPlayer = function (player, addAuctionInfo) {
    return `<li class="player ${addAuctionInfo ? "inline-list" : ""}">
                <a class="fullname" href="https://www.futbin.com/players?page=1&search=${player.data.f}%20${player.data.l}" target="_blank">
                    <span class="firstname">${player.data.f}</span> 
                    <span class="lastname">${player.data.l}</span>
                </a>
                <span class="rating">${player.rating}</span>
                ${player.untradeable ? '<span class="fut_icon icon_untradeable untradeable"></span>' : ''}
                ${player.loans > -1 ? `<span class="loans">${player.loans}</span>` : ''}
                ${addAuctionInfo ? `<span class="count">${player.count}</span>` : ""}
                ${addAuctionInfo ? `<span class="avg">${Math.round(player.sumPrices / player.count)}</span>` : ""}
                ${addAuctionInfo ? `<span class="rarity">${localize(player.rarity)}</span>` : ""}
            </li>`;
}

ClubAnalyzerView.prototype._createCountReport = function (id, data) {
    return createElem("div", { id: id, className: "club-analyzer-report"}, this._createCountReportTree(data, 0));
}

ClubAnalyzerView.prototype._createCountReportTree = function (data, level) {
    let html = "<div>";
    if (data instanceof Array) {
        html += '<ul class="players hide">';
        for (let player of data) {
            html += this._renderPlayer(player);
        }
        html += '</ul>';
    }
    else {
        html += level === 0 ? "<ul>" : '<ul class="hide">';
        for (let value of Object.keys(data).sort()) {
            html += level === 0 ? '<li class="inline-list">' : "<li>";
            html += `<span class="value">${value}</span>`;
            html += `<span class="count">${data[value].players ? data[value].players.length : data[value].length}</span>`;
            html += this._createCountReportTree(data[value].by ? data[value].by : data[value], level + 1);
            html += "</li>";
        }
        html += "</ul>";
    }

    html += "</div>";
    return html;
}

ClubAnalyzerView.prototype._createAuctionReport = function (id, data, caption, className) {
    const keys = Object.keys(data);

    if (keys.length === 0) {
        return;
    }

    className = className || "";
    
    let html = caption ? `<h2>${caption}</h2>` : "";
    html += `<ul>`;
    for (let player of keys.map(x => data[x]).sort((p1, p2) => {
        const n1 = p1.data.f + p1.data.l;
        const n2 = p2.data.f + p2.data.l;
        return n1 < n2 ? -1 : n1 > n2 ? 1 : 0;
    })) {
        html += this._renderPlayer(player, true);
    }

    html += "</ul></div>";

    return createElem("div", { id: id, className: `club-analyzer-report club-analyzer-auctionreport ${className}` }, html);
}

ClubAnalyzerView.prototype._generate = function _generate() {
    if (!this.generated) {
        const container = document.createElement("div");
        this._appendMainMenu(container);
        this._loadingMessage = createElem("div", { id: "clubanalyzer-loading-message" });
        hide(this._loadingMessage);
        append(container, this._loadingMessage);
        this._body = this._appendBody(container);
        this.__root = container;
        this.generated = true;
    }
}

ClubAnalyzerView.prototype.showLoading = function(msg){
    this._loadingMessage.textContent = msg;
    show(this._loadingMessage);
}

ClubAnalyzerView.prototype.hideLoading = function(){
    this._loadingMessage.textContent = "";
    hide(this._loadingMessage);
}

ClubAnalyzerView.prototype.prepareForUpdate = function(){
    this._body.innerHTML = "";
    const buttons = selectAll(".menu-container > button", this.__root);
    removeClass(buttons, "selected");
    addClass(buttons[0], "selected");
}

ClubAnalyzerView.prototype.update = function (viewmodel) {
    select("#clubanalyzer-counter-unnasigned").textContent = viewmodel.counters.unnasignedTotal;
    select("#clubanalyzer-counter-tradepile").textContent = viewmodel.counters.tradepileTotal;
    select("#clubanalyzer-counter-watchlist").textContent = viewmodel.counters.watchlistTotal;

    this._body.innerHTML = "";

    append(this._body,
    this._createDashboard(viewmodel),
    this._createCountReport("clubanalyzer-report-by-rating", viewmodel.players.byRating),
    this._createCountReport("clubanalyzer-report-by-rarity", viewmodel.players.byRarity),
    this._createCountReport("clubanalyzer-report-by-league", viewmodel.players.byLeague),
    this._createCountReport("clubanalyzer-report-by-nation", viewmodel.players.byNation),
    this._createAuctionReport("clubanalyzer-report-by-unnasigned", viewmodel.players.unnasigned.tradeable, "Tradeable", "clubanalyzer-report-by-unnasigned"),
    this._createAuctionReport("clubanalyzer-report-by-unnasigned2", viewmodel.players.unnasigned.untradeable, "Untradeable", "clubanalyzer-report-by-unnasigned"),
    this._createAuctionReport("clubanalyzer-report-by-transferlist", viewmodel.players.tradepile),
    this._createAuctionReport("clubanalyzer-report-by-transfertargets", viewmodel.players.watchlistWon, localize("watchlist.dock.categories.won")),
    this._createAuctionReport("clubanalyzer-report-by-transfertargets2", viewmodel.players.watchlistWinning, localize("wdock.label.winning"), "clubanalyzer-report-by-transfertargets"),
    this._createAuctionReport("clubanalyzer-report-by-transfertargets3", viewmodel.players.watchlistLoosing, localize("dock.label.outbid"), "clubanalyzer-report-by-transfertargets"),
    this._createAuctionReport("clubanalyzer-report-by-transfertargets4", viewmodel.players.watchlistLost, localize("watchlist.dock.categories.expired"), "clubanalyzer-report-by-transfertargets"));

    const reports = selectAll(".club-analyzer-report");
    hide(reports);
    show(reports[0]);

    on(selectAll("li", this._body), "click", ev => {
        const elem = ev.currentTarget;
        const childUl = select("ul", elem);
        
        if(isVisible(childUl)){
            hide(childUl);
            addClass(elem, "expanded");
        }
        else {
            show(childUl);
            removeClass(elem, "expanded");
        }

        ev.stopPropagation();
    });
}
/// #endif