import { EVENTS, on, triggerEvent } from "../events";
import getWindow from "./window";

getWindow().logMessages = [];

export function logDebug(msg){
    msg = `${new Date().toISOString()}: ${msg}`;
    //getWindow().logMessages.push(msg);
    console.log(msg);
    triggerEvent(EVENTS.LOG, msg);
}