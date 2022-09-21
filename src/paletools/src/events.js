export function on(target, eventName, callback) {
    if(typeof target === "string"){
        callback = eventName;
        eventName = target;
        target = window;
    }

    target.addEventListener(eventName, callback);
}

export function triggerEvent(eventName, data) {
    window.dispatchEvent(new CustomEvent(eventName, { bubbles: true, detail: data }));
}

export const EVENTS = {
    APP_ENABLED: "appEnabled",
    APP_DISABLED: "appDisabled",
    APP_STARTED: "appStarted",
    CONFIGURATION_SAVED: "configurationSaved",
    CONFIGURATION_LOADED: "configurationLoaded"
}