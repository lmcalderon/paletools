import runPlugins from "./plugins";
import { EVENTS, triggerEvent } from "./events";
import { addStyle } from "./utils/styles";
import styles from "./styles.css";
import getCurrentController from "./utils/controller";
import VERSION from "./version";
import playAudio from "./utils/fx";

let initialized = false;
function init() {
    const app = getAppMain();
    if (!app._ptVersion) {
        app._ptVersion = VERSION;
    }
    else {
        return;
    }

    //reset console
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    window.console = iframe.contentWindow.console;

    if (!services.Localization) {
        setTimeout(init, 1000);
        return;
    }

    runPlugins();
    //let currentController = getCurrentController();
    getAppMain().getRootViewController().showGameView();
    // setTimeout(() => {
    //     getCurrentController().getNavigationController()._showController(currentController);
    // }, 1000);
    addStyle("paletools", styles);
    triggerEvent(EVENTS.APP_STARTED);
    initialized = true;

/// #if process.env.FX
    app._ptVersion += "fx";

    playAudio("castigo");

    document.addEventListener("click", ev => {
        playAudio("tuki");
    });
/// #endif
}

init();