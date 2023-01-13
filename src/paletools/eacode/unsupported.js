var preloadStrings = {};
function includeHTML(e, t) {
    var n, r, o, i, d;
    for (n = t ? [document.getElementById(t)] : document.getElementsByTagName("*"),
    r = 0; r < n.length; r++)
        if (i = (o = n[r]).getAttribute("include-html"))
            return (d = createXMLHttpRequest()).onreadystatechange = function() {
                4 == this.readyState && (200 == this.status && (o.innerHTML = this.responseText),
                404 == this.status && (o.innerHTML = "Page not found."),
                o.removeAttribute("include-html"),
                includeHTML(e, t))
            }
            ,
            d.open("GET", i, !0),
            void d.send();
    e && e()
}
function isAndroidStockBrowser() {
    var e = navigator.userAgent
      , t = -1 < e.indexOf("Android") && -1 < e.indexOf("Mozilla/5.0") && -1 < e.indexOf("AppleWebKit")
      , n = new RegExp(/AppleWebKit\/([\d.]+)/)
      , r = null === n.exec(e) ? null : parseFloat(n.exec(e)[1]);
    return t && null !== r && r < 537
}
function isSupportedBrowser() {
    if (isAndroidStockBrowser())
        return !1;
    return function testWebGl() {
        var e = document.createElement("canvas");
        try {
            return !(!window.WebGLRenderingContext || !e.getContext("webgl") && !e.getContext("experimental-webgl"))
        } catch (e) {
            return !1
        }
    }() && function supportsWasm() {
        return "object" == typeof WebAssembly
    }()
}
function initUnsupported() {
    document.getElementById("futweb-loader").style.display = "none",
    document.getElementById("unsupported-browser-shield").style.display = "block",
    preloadStrings["preload.unsupportedbrowser.title"] && (document.getElementById("unsupportedTitle").innerText = preloadStrings["preload.unsupportedbrowser.title"]),
    preloadStrings["preload.unsupportedbrowser.body"] && (document.getElementById("unsupportedBody").innerText = preloadStrings["preload.unsupportedbrowser.body"])
}
function getParameterByName(e) {
    var t = window.location.href;
    e = e.replace(/[\[\]]/g, "\\$&");
    var n = new RegExp("[?&]" + e + "(=([^&#]*)|&|#|$)").exec(t);
    return n ? n[2] ? decodeURIComponent(n[2].replace(/\+/g, " ")) : "" : null
}
function createXMLHttpRequest() {
    var t = null;
    if ("undefined" != typeof XMLHttpRequest)
        t = new XMLHttpRequest;
    else if (void 0 !== window.ActiveXObject)
        try {
            t = new ActiveXObject("Msxml2.XMLHTTP.4.0")
        } catch (e) {
            try {
                t = new ActiveXObject("MSXML2.XMLHTTP")
            } catch (e) {
                try {
                    t = new ActiveXObject("Microsoft.XMLHTTP")
                } catch (e) {
                    t = null
                }
            }
        }
    return t
}
if (isSupportedBrowser() ? window.onload = function() {
    document.getElementById("futweb-loader").style.display = "none",
    onDeviceReady()
}
: window.onload = function() {
    includeHTML(initUnsupported, "unsupported-html")
}
,
JSON) {
    var xhr = createXMLHttpRequest();
    if (xhr) {
        var url = window.fut_resourceRoot + window.fut_resourceBase + window.fut_guid + "/" + window.fut_year + "/fut/loc/companion/futweb/preload/";
        xhr.open("GET", url + (window.localStorage && window.localStorage.UT_LOCALE || getParameterByName("locale") || "en-US") + ".json"),
        xhr.setRequestHeader("Content-Type", "application/json"),
        xhr.onreadystatechange = function() {
            if (4 === xhr.readyState && 200 === xhr.status) {
                var e, t = JSON.parse(xhr.responseText);
                for (e in t)
                    t.hasOwnProperty(e) && (preloadStrings[e] = t[e]);
                isSupportedBrowser() || (window.onload = function() {
                    includeHTML(initUnsupported, "unsupported-html")
                }
                ),
                xhr = null,
                delete xhr
            }
        }
        ,
        xhr.send()
    }
}
