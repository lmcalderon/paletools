import VERSION from "./version";
import { EVENTS, triggerEvent } from "./events";
import extend from "./utils/extend";

const buttons = {
    back: 'Digit1',
    enableDisable: 'Comma',
    lists: {
        up: 'ArrowUp',
        down: 'ArrowDown',
        prev: 'ArrowLeft',
        next: 'ArrowRight',
    },
    search: {
        resetBid: 'Backquote',
        decMinBid: 'ArrowLeft',
        incMinBid: 'ArrowRight',
        decMaxBid: 'End',
        incMaxBid: 'Home',
        decMinBuy: 'Delete',
        incMinBuy: 'PageDown',
        decMaxBuy: 'ArrowDown',
        incMaxBuy: 'ArrowUp',
        search: 'Digit2',
        botModeMinBid: 'BracketRight',
        botModeMinBuy: 'BracketLeft',
        enableBotMode: false,
        displayBotModeMinBid: false,
        displayBotModeMinBuy: false,
        botModeFullAuto: false,
    },
    results: {
        bid: 'Digit4',
        buy: 'Digit3',
        transfer: 'KeyR',
        club: 'KeyC',
        pressEnter: true,
        autoBuy: false,
        preventBack: false,
        sell: 'KeyQ',
        decBid: 'Delete',
        incBid: 'PageDown',
        compare: 'KeyM'
    }
};

let settings = {
    enabled: true,
    appVersion: VERSION,
    plugins: {
        gridMode: {
            enabled: false
        },
        wideMode: {
            enabled: false
        },
        compareMinMaxPrices: {
            enabled: true
        },
        marketSearchFilters: {
            playerId: false,
            playerRating: true,
            savedFilters: true,
            hideDuplicates: false
        },
        donation: {
            enabled: true
        },
        playerActions: {
            copyPlayerId: true,
            futbinSearch: true,
            findLowestPrice: true
        },
        snipe: {
            buttons: buttons,
            legacyMode: false,
            enabled: true
        },
        duplicatedToSbc: {
            enabled: true
        },
        selectCheapest: {
            enabled: false
        },
        pristinePlayers: {
            enabled: true
        },
        fillSbcFromFutbin: {
            enabled: true
        },
        improvedPlayerSearch: {
            enabled: true
        },
        markDuplicated: {
            enabled: true
        },
        sbcSelectMultiplePlayers: {
            enabled: true
        },
        filterSbcs: {
            enabled: true
        },
        clubAnalyzer: {
            enabled: true
        },
        sbcTimesCompleted: {
            enabled: true
        },
        showConsoleOutput: {
            enabled: true
        },
        countMyPacks: {
            enabled: true
        },
        groupMyPacks: {
            enabled: true
        },
        transferListSendAllToClub: {
            enabled: true
        },
        sbcBuilderEnhacer: {
            enabled: true
        },
        sbcSmartBuilder: {
            enabled: true
        },
        clubSearchEnhacer: {
            enabled: true
        },
        keepPlayerSellValues: {
            enabled: true
        },
        sellMultiple: {
            enabled: false
        },
        eaBugFixer: {
            enabled: true
        },
        disablePackAnimations: {
            enabled: false
        },
        increaseAllowedAuctions: {
            enabled: false
        },
        pristinePlayers: {
            enabled: false
        },
        showPlayerContracts: {
            enabled: false
        }
    }
};

if (localStorage.getItem("paletools:settings")) {
    const savedSettings = JSON.parse(atob(localStorage.getItem("paletools:settings")));
    extend(true, settings, savedSettings);
    triggerEvent(EVENTS.CONFIGURATION_LOADED, settings);
}

export function saveConfiguration() {
    localStorage.setItem("paletools:settings", btoa(JSON.stringify(settings)));
    triggerEvent(EVENTS.CONFIGURATION_SAVED, settings);
}

export default settings;