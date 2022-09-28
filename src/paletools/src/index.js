import runPlugins from "./plugins";
import { EVENTS, triggerEvent } from "./events";
import { addStyle } from "./utils/styles";
import styles from "./styles.css";
import getCurrentController from "./utils/controller";
import VERSION from "./version";
import playAudio from "./utils/fx";
import runOverrides from "./core-overrides";
import { addClass, removeClass, select } from "./utils/dom";
import localize from "./localization";


function setupPhoneView() {
    if (isPhone()) {
        const body = select("body");
        addClass(removeClass(body, "landscape"), "phone");
    }
}

function removeOrientationWarning() {
    // Remove orientation warning
    select(".ui-orientation-warning").style.display = "none";
}

function resetConsole() {
    //reset console
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    window.console = iframe.contentWindow.console;
}

let initialized = false;
let isHomePageLoaded = false;
function init() {
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

    setupPhoneView();
    removeOrientationWarning();
    resetConsole();
    runOverrides();
    initHomePage();
    triggerEvent(EVENTS.APP_STARTED);
    initialized = true;
}

function initHomePage() {
    if (services.Localization) {
        const title = select("h1.title");
        if (title && title.textContent === localize("navbar.label.home")) {
            isHomePageLoaded = true;
        }
    }

    if (isHomePageLoaded) {
        addStyle("paletools", styles);
        runPlugins();
        getAppMain().getRootViewController().showGameView();
        triggerEvent(EVENTS.HOME_PAGE_LOADED);
    } else {
        setTimeout(initHomePage, 1000);
    }
}

init();