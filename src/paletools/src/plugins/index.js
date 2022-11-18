import minMaxPrices from "./compareMinMaxPrices";
import playerActions from "./playerActions";
import transferTargetsLimbo from "./transferTargetsLimbo";
import unassignedLimbo from "./unassignedLimbo";
import donation from "./donation";
import marketSearchFilters from "./marketSearchFilters";
import gridMode from "./gridMode";
import snipe from "./snipe";
import duplicatedToSbc from "./duplicatedToSbc";
import selectCheapest from "./selectCheapest";
import settingsMenu from "./settingsMenu";
import fillSbcFromFutbin from "./fillSbcFromFutbin";
import improvedPlayerSearch from "./improvedPlayerSearch";
import markDuplicated from "./markDuplicated";
import filterSbcs from "./filterSbcs";
import sbcTimesCompleted from "./sbcTimesCompleted";
import clubAnalyzer from "./clubAnalyzer";
import showConsoleOutput from "./showConsoleOutput";
import wideMode from "./wideMode";
import countMyPacks from "./countMyPacks";
import groupMyPacks from "./groupMyPacks";
import transferListSendAllToClub from "./transferListSendAllToClub";
import sbcBuilderEnhacer from "./sbcBuilderEnhacer";
import eaBugFixer from "./eaBugFixer";
import snipeMobile from "./snipeMobile";
import sbcSmartBuilder from "./sbcSmartBuilder";
import disablePackAnimations from "./disablePackAnimations";
import clubSearchEnhacer from "./clubSearchEnhacer";
import keepPlayerSellValues from "./keepPlayerSellValues";
import sellMultiple from "./sellMultiple";
import xmlHttpRequest from "./xmlHttpRequest";
import incrementAllowedActions from "./incrementAllowedAuctions";
import warningScreen from "./warningScreen";
import debugMode from "./debugMode";
import sellProfit from "./sellProfit";
import trackTransactions from "./trackTransactions";
import playerCardInfo from "./playerCardInfo";
import transactionsHistory from "./transactionsHistory";

const plugins = [
    minMaxPrices,
    playerActions,
    transferTargetsLimbo,
    unassignedLimbo,
    donation,
    marketSearchFilters,
    gridMode,
    wideMode,
    duplicatedToSbc,
    selectCheapest,
    snipe,
    fillSbcFromFutbin,
    improvedPlayerSearch,
    markDuplicated,
    filterSbcs,
    sbcTimesCompleted,
    clubAnalyzer,
    showConsoleOutput,
    countMyPacks,
    groupMyPacks,
    transferListSendAllToClub,
    sbcBuilderEnhacer,
    eaBugFixer,
    snipeMobile,
    sbcSmartBuilder,
    disablePackAnimations,
    clubSearchEnhacer,
    keepPlayerSellValues,
    sellMultiple,
    xmlHttpRequest,
    incrementAllowedActions,
    warningScreen,
    sellProfit,
    trackTransactions,
    debugMode,
    playerCardInfo,
    transactionsHistory
].filter(x => x);

const menus = [];

export default function runPlugins() {
    plugins.sort((a, b) => {
        return a.order - b.order;
    });
    for (let plugin of plugins) {
        if(!plugin.run) continue;
        
        plugin.run();
        if (plugin.settings) {
            menus.push(plugin.settings);
        }
    }

    if(settingsMenu){
        settingsMenu.run(menus);
    }
}