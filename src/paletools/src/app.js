import settings from "./settings";
import { triggerEvent } from "./events";
import { notifyNeutral, notifySuccess } from "./utils/notifications";

export default function enableDisableApp() {
    if (settings.enabled) {
        disableApp();
    }
    else {
        enableApp();
    }
}

function enableApp() {
    settings.enabled = true;
    notifySuccess("Paletools Enabled");
    triggerEvent("appEnabled");
}

function disableApp() {
    settings.enabled = false;
    notifyNeutral("Paletools Disabled");
    triggerEvent("appDisabled");
}