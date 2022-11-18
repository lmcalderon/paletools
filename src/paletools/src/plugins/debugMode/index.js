let plugin;

/// #if process.env.DEBUG_MODE
import { addLabelWithToggle } from "../../controls";
import { on, EVENTS } from "../../events";
import { openDialog } from "../../services/dialog";
import settings, { saveConfiguration } from "../../settings";
import { addClass, append, css, removeClass, select } from "../../utils/dom";
import { hide, show } from "../../utils/visibility";

let logMessages = [];
const cfg = settings.plugins.debugMode;

const header = select(".ut-fifa-header-view");
const debugModeBtn = new UTStandardButtonControl();
debugModeBtn.init();
debugModeBtn.setText("DEBUG");
debugModeBtn.addTarget(this, () => {
    openDialog([
        { labelEnum: enums.UIDialogOptions.OK }
    ], "DEBUG",
        `<textarea rows="20" cols="${(isPhone() ? "40" : "60")}">${logMessages.join("\n\r")}</textarea>`);
},
    EventType.TAP);

function enableDebugMode() {
    if (cfg.enabled) {
        show(debugModeBtn.getRootElement());
        if(isPhone()){
            show(header);
            addClass(select("body"), "with-fifa-header");
        }
    }
}

function disableDebugMode() {
    hide(debugModeBtn.getRootElement());
    if(isPhone()){
        hide(header);
        removeClass(select("body"), "with-fifa-header");
    }
}

function log(msg){
    logMessages.push(`${new Date().toISOString()}: ${msg}`);
    if(logMessages.length > 1000){
        logMessages = logMessages.slice(500);
    }
}

function run() {
    on(EVENTS.LOG, ({ detail }) => {
        if (cfg.enabled) {
            logMessages.push(detail)
        }
    });

    const requests = {};

    on(EVENTS.REQUEST_OPEN, ({ detail }) => {
        if (cfg.enabled) {
            requests[detail.xhr.id] = detail;
            log(`REQUEST OPEN: ${detail.method} ${detail.url}, is async: ${detail.async}`);
        }
    });

    on(EVENTS.REQUEST_SEND, ({ detail }) => {
        if (cfg.enabled) {
            const savedXhr = requests[detail.xhr.id];
            savedXhr.body = detail.body;
            log(`REQUEST SEND: ${savedXhr.method} ${savedXhr.url} -- ${detail.body}`);
        }
    });

    on(EVENTS.REQUEST_FINISHED, ({ detail }) => {
        if (cfg.enabled) {
            delete requests[detail.xhr.id];
            log(`REQUEST FINISHED: ${detail.xhr.responseURL} - ${detail.xhr.status} - ${detail.xhr.responseText}`);
        }
    });



    append(header, css(hide(debugModeBtn), { float: "left", lineHeight: "50px" }));

    enableDebugMode();

    on(EVENTS.APP_ENABLED, enableDebugMode);
    on(EVENTS.APP_DISABLED, disableDebugMode);
}

function menu() {
    const container = document.createElement("div");
    addLabelWithToggle(container, "enabled", cfg.enabled, toggleState => {
        cfg.enabled = toggleState;
        saveConfiguration();
        if (toggleState) {
            enableDebugMode();
        }
        else {
            disableDebugMode();
        }
    });
    return container;
}

plugin = {
    run: run,
    settings: {
        title: 'DEBUG',
        menu: menu
    }
}
/// #endif

export default plugin;