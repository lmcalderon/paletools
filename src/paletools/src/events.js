import getWindow from "./services/window";
import { isIterable } from "./utils/iterable";

export function on(target, eventName, callback) {
    if(typeof target === "string"){
        callback = eventName;
        eventName = target;
        target = getWindow();
    }

    eventName = getEventName(eventName);

    if(isIterable(target)){
        for(let t of target){
            t.addEventListener(eventName, callback);
        }
    }
    else {
        target.addEventListener(eventName, callback);
    }
}

export function triggerEvent(eventName, data) {
    eventName = getEventName(eventName);
    getWindow().dispatchEvent(new CustomEvent(eventName, { bubbles: true, detail: data }));
}

function getEventName(eventName){
    return EVENTS.hasOwnProperty(eventName) 
        ? `paletools:${eventName}`
        : eventName;
}

export const EVENTS = {
    APP_ENABLED: "appEnabled",
    APP_DISABLED: "appDisabled",
    APP_STARTED: "appStarted",
    CONFIGURATION_SAVED: "configurationSaved",
    CONFIGURATION_LOADED: "configurationLoaded",
    APP_LOADED: "appLoaded",
    SNIPE_SUCCESS: "snipeSuccess",
    SNIPE_FAILED: "snipeFailed",
    SNIPE_GOBACK: "snipeGoBack",
    SNIPE_EXECUTE: "snipeExecute",
    REQUEST_OPEN: "requestOpen",
    REQUEST_SEND: "requestSend",
    REQUEST_FINISHED: "requestFinished",
    LOG: "logMessage",
    ITEM_WON: "itemWon",
    ITEMS_WON: "itemsWon",
    ITEMS_SOLD: "itemsSold",
    ITEM_MOVED: "itemMoved",
    ITEM_DISCARDED: "itemDiscarded",
    TRANSACTIONS_RELOADED: "transactionsReindex"
}