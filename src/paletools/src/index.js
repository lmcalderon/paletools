import runPlugins from "./plugins";
import { EVENTS, triggerEvent } from "./events";
import { addStyle } from "./utils/styles";
import styles from "./styles.css";
import getCurrentController from "./utils/controller";
import VERSION from "./version";
import playAudio from "./utils/fx";
import runOverrides from "./core-overrides";
import { addClass, hasClass, removeClass, select } from "./utils/dom";
import localize from "./localization";

function setupPhoneView() {
    if (isPhone && isPhone()) {
        const body = select("body");
        if (!hasClass("phone")) {
            addClass(removeClass(body, "landscape"), "phone");
        }
    }
}

function removeOrientationWarning() {
    // Remove orientation warning
    const orientationWarning = select(".ui-orientation-warning");
    if (orientationWarning) {
        orientationWarning.style.display = "none";
    }
}

function resetConsole() {
    //reset console
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    window.console = iframe.contentWindow.console;
}

let initialized = false;
let isAppLoaded = false;
function init() {
    setupPhoneView();
    removeOrientationWarning();
    const login = select(".ut-login");
    if (login || (!services
        && !services.Localization
        && !services.Authentication.sessionUtas
        && !services.Authentication.sessionUtas.url)) {
        setTimeout(init, 1000);
        return;
    }

    // detect if the script was already run
    const app = getAppMain();
    if (!app._ptVersion) {
        app._ptVersion = VERSION;
    }
    else {
        return;
    }

    resetConsole();
    runOverrides();
    initApp();
    triggerEvent(EVENTS.APP_STARTED);
    initialized = true;
}

function initApp() {
    if (services.Localization) {
        const tabBar = select(".ut-tab-bar");
        if (tabBar) {
            isAppLoaded = true;
        }
    }

    if (isAppLoaded) {
        addStyle("paletools", styles);
        runPlugins();
        getAppMain().getRootViewController().showGameView();
        triggerEvent(EVENTS.APP_LOADED);
    } else {
        setTimeout(initApp, 1000);
    }
}

init();