import { EVENTS, triggerEvent } from "../events";
import guid from "../utils/guid";

let plugin;

/// #if process.env.XML_HTTP_REQUESTS

function run() {
    const XMLHttpRequest_open = window.XMLHttpRequest.prototype.open;

    window.XMLHttpRequest.prototype.open = function (method, url, async) {
        this.id = guid();
        const xhr = this;
        triggerEvent(EVENTS.REQUEST_OPEN, { xhr: xhr, method: method, url: url, async: async });
        this.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    triggerEvent(EVENTS.REQUEST_FINISHED, { xhr: xhr });
                }
            },
            false
        );
        XMLHttpRequest_open.call(this, method, url, async);
    };

    const XMLHttpRequest_send = window.XMLHttpRequest.prototype.send;

    window.XMLHttpRequest.prototype.send = function (body) {
        triggerEvent(EVENTS.REQUEST_SEND, { xhr: this, body: body });
        XMLHttpRequest_send.call(this, body);
    }
}

plugin = {
    run: run
};
/// #endif

export default plugin;