import { EVENTS, on, triggerEvent } from "../events";

export function logDebug(msg){
    msg = `${new Date().toISOString()}: ${msg}`;
    console.log(msg);
    triggerEvent(EVENTS.LOG, msg);
}