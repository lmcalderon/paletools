import { getRegisteredXmlHttpRequestInspectors } from "../services/xmlHttpRequestInspectors";

let plugin;

/// #if process.env.XML_HTTP_REQUESTS

function run() {
    const XMLHttpRequest_open = window.XMLHttpRequest.prototype.open;

    window.XMLHttpRequest.prototype.open = function (method, url, async) {
        this.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    for (let inspector of getRegisteredXmlHttpRequestInspectors()) {
                        inspector(this);
                    }
                }
            },
            false
        );
        XMLHttpRequest_open.call(this, method, url, async);
    };

}

plugin = {
    run: run
};
/// #endif

export default plugin;