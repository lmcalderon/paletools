function isAndroidStockBrowser() {
    var t = navigator.userAgent,
    e = -1 < t.indexOf("Android") && -1 < t.indexOf("Mozilla/5.0") && -1 < t.indexOf("AppleWebKit"),
    n = new RegExp(/AppleWebKit\/([\d.]+)/),
    i = null === n.exec(t) ? null : parseFloat(n.exec(t)[1]);
    return e && null !== i && i < 537
}
function isSupportedBrowser() {
    if (isAndroidStockBrowser())
        return !1;
    return function testWebGl(t) {
        try {
            return !(!window.WebGLRenderingContext || !t.getContext("webgl") && !t.getContext("experimental-webgl"))
        } catch (t) {
            return !1
        }
    }
    (document.createElement("canvas"))
}
if (!isSupportedBrowser())
    throw new Error("Browser not supported");
!function () {
    var n = /^\s*function\s+([^\(\s]*)\s*/;
    function _name() {
        var t,
        e;
        return this === Function || this === Function.prototype.constructor ? e = "Function" : this !== Function.prototype && (e = (t = ("" + this).match(n)) && t[1]),
        e || ""
    }
    var t = !("name" in Function.prototype && "name" in function x() {}),
    e = "function" == typeof Object.defineProperty && function () {
        var e;
        try {
            Object.defineProperty(Function.prototype, "_xyz", {
                get: function () {
                    return "blah"
                },
                configurable: !0
            }),
            e = "blah" === Function.prototype._xyz,
            delete Function.prototype._xyz
        } catch (t) {
            e = !1
        }
        return e
    }
    (),
    i = "function" == typeof Object.prototype.__defineGetter__ && function () {
        var e;
        try {
            Function.prototype.__defineGetter__("_abc", function () {
                return "foo"
            }),
            e = "foo" === Function.prototype._abc,
            delete Function.prototype._abc
        } catch (t) {
            e = !1
        }
        return e
    }
    ();
    Function.prototype._name = _name,
    t && (e ? Object.defineProperty(Function.prototype, "name", {
            get: function () {
                var t = _name.call(this);
                return this !== Function.prototype && Object.defineProperty(this, "name", {
                    value: t,
                    configurable: !0
                }),
                t
            },
            configurable: !0
        }) : i && Function.prototype.__defineGetter__("name", function () {
            var t = _name.call(this);
            return this !== Function.prototype && this.__defineGetter__("name", function () {
                return t
            }),
            t
        }))
}
(), Array.prototype.findIndex || Object.defineProperty(Array.prototype, "findIndex", {
    value: function (t) {
        if (null == this)
            throw new TypeError('"this" is null or not defined');
        var e = Object(this),
        n = e.length >>> 0;
        if ("function" != typeof t)
            throw new TypeError("predicate must be a function");
        for (var i = arguments[1], r = 0; r < n; ) {
            var a = e[r];
            if (t.call(i, a, r, e))
                return r;
            r++
        }
        return -1
    },
    configurable: !0,
    writable: !0
});
var DOMKit = function () {
    function DOMKit() {}
    return DOMKit.addClass = function (i, t) {
        "" !== t && t.trim().split(" ").forEach(function (t) {
            if (i instanceof HTMLCollection)
                for (var e = i.length; 0 < e--; ) {
                    var n = i.item(e);
                    n && n.classList.add(t)
                }
            else
                i.classList.add(t)
        }, this)
    },
    DOMKit.removeClass = function (i, t) {
        "" !== t && t.trim().split(" ").forEach(function (t) {
            if (i instanceof HTMLCollection)
                for (var e = i.length; 0 < e--; ) {
                    var n = i.item(e);
                    n && n.classList.remove(t)
                }
            else
                i.classList.remove(t)
        }, this)
    },
    DOMKit.toggleClass = function (t, e, n) {
        "boolean" != typeof n && (n = !this.hasClass(t, e)),
        n ? this.addClass(t, e) : this.removeClass(t, e)
    },
    DOMKit.hasClass = function (t, e) {
        return "" !== e && t.classList.contains(e)
    },
    DOMKit.remove = function (t) {
        function Y(t) {
            t.parentElement && t.parentElement.removeChild(t)
        }
        if (t instanceof HTMLCollection)
            for (var e = t.length; 0 < e--; ) {
                var n = t.item(e);
                n && Y(n)
            }
        else
            Y(t)
    },
    DOMKit.empty = function (t) {
        for (; t.hasChildNodes(); )
            t.lastChild && t.removeChild(t.lastChild)
    },
    DOMKit.insertBefore = function (t, e) {
        e.parentNode && e.parentNode.insertBefore(t, e)
    },
    DOMKit.insertAfter = function (t, e) {
        e.parentNode && e.parentNode.insertBefore(t, e.nextSibling)
    },
    DOMKit.toggleDisplayStyle = function (t, e) {
        t.style.display = e ? "" : "none"
    },
    DOMKit.findElements = function (t, e) {
        return Array.prototype.slice.call(t.querySelectorAll(e))
    },
    DOMKit.HTMLCollectionToArray = function (t) {
        return Array.prototype.slice.call(t)
    },
    DOMKit.tokenListSupports = function (t, e) {
        if (!t || !t.supports)
            return !1;
        try {
            return t.supports(e)
        } catch (t) {
            return t instanceof TypeError && console.log("The DOMTokenList doesn't have a supported tokens list"),
            !1
        }
    },
    DOMKit
}
();
!function () {
    function na(t) {
        this.w = t || []
    }
    na.prototype.set = function (t) {
        this.w[t] = !0
    },
    na.prototype.encode = function () {
        for (var t = [], e = 0; e < this.w.length; e++)
            this.w[e] && (t[Math.floor(e / 6)] ^= 1 << e % 6);
        for (e = 0; e < t.length; e++)
            t[e] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(t[e] || 0);
        return t.join("") + "~"
    };
    var i = new na;
    function J(t) {
        i.set(t)
    }
    function pa(t, e) {
        var n = new na(r(t));
        n.set(e),
        t.set(Ct, n.w)
    }
    function qa(t) {
        t = r(t),
        t = new na(t);
        for (var e = i.w.slice(), n = 0; n < t.w.length; n++)
            e[n] = e[n] || t.w[n];
        return new na(e).encode()
    }
    function sa(t) {
        return "function" == typeof t
    }
    function ua(t) {
        return null != t && -1 < (t.constructor + "").indexOf("String")
    }
    function wa(t) {
        return t ? t.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "") : ""
    }
    function xa(t) {
        var e = u.createElement("img");
        return e.width = 1,
        e.height = 1,
        e.src = t,
        e
    }
    function ya() {}
    function za(t) {
        return encodeURIComponent instanceof Function ? encodeURIComponent(t) : (J(28), t)
    }
    function Aa(t, e, n, i) {
        try {
            t.addEventListener ? t.addEventListener(e, n, !!i) : t.attachEvent && t.attachEvent("on" + e, n)
        } catch (t) {
            J(27)
        }
    }
    function Ca(t, e, n) {
        t && (n ? (n = "", e && o.test(e) && (n = ' id="' + e + '"'), o.test(t) && u.write("<script" + n + ' src="' + t + '"><\/script>')) : ((n = u.createElement("script")).type = "text/javascript", n.async = !0, n.src = t, e && (n.id = e), (t = u.getElementsByTagName("script")[0]).parentNode.insertBefore(n, t)))
    }
    function Da() {
        return "https:" == u.location.protocol
    }
    function Ea(t, e) {
        var n = t.match("(?:&|#|\\?)" + za(e).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1") + "=([^&#]*)");
        return n && 2 == n.length ? n[1] : ""
    }
    function Fa() {
        var t = "" + u.location.hostname;
        return 0 == t.indexOf("www.") ? t.substring(4) : t
    }
    function Ha(t, e) {
        if (1 == e.length && null != e[0] && "object" == typeof e[0])
            return e[0];
        for (var n = {}, i = Math.min(t.length + 1, e.length), r = 0; r < i; r++) {
            if ("object" == typeof e[r]) {
                for (var a in e[r])
                    e[r].hasOwnProperty(a) && (n[a] = e[r][a]);
                break
            }
            r < t.length && (n[t[r]] = e[r])
        }
        return n
    }
    function Ia() {
        this.keys = [],
        this.values = {},
        this.m = {}
    }
    var r = function (t) {
        return t = t.get(Ct),
        a(t) || (t = []),
        t
    },
    a = function (t) {
        return "[object Array]" == Object.prototype.toString.call(Object(t))
    },
    s = function (t, e) {
        return 0 == t.indexOf(e)
    },
    o = /^[\w\-:/.?=&%!]+$/;
    Ia.prototype.set = function (t, e, n) {
        this.keys.push(t),
        n ? this.m[":" + t] = e : this.values[":" + t] = e
    },
    Ia.prototype.get = function (t) {
        return this.m.hasOwnProperty(":" + t) ? this.m[":" + t] : this.values[":" + t]
    },
    Ia.prototype.map = function (t) {
        for (var e = 0; e < this.keys.length; e++) {
            var n = this.keys[e],
            i = this.get(n);
            i && t(n, i)
        }
    };
    function Ra(t) {
        var e = f._gaUserPrefs;
        if (e && e.ioo && e.ioo() || t && !0 === f["ga-disable-" + t])
            return !0;
        try {
            var n = f.external;
            if (n && n._gaUserPrefs && "oo" == n._gaUserPrefs)
                return !0
        } catch (t) {}
        return !1
    }
    function Ua(t) {
        var e = [],
        n = u.cookie.split(";");
        t = new RegExp("^\\s*" + t + "=\\s*(.*?)\\s*$");
        for (var i = 0; i < n.length; i++) {
            var r = n[i].match(t);
            r && e.push(r[1])
        }
        return e
    }
    function Va(t, e, n, i, r, a) {
        if (!(r = !Ra(r) && !(h.test(u.location.hostname) || "/" == n && g.test(i))))
            return !1;
        if (e && 1200 < e.length && (e = e.substring(0, 1200), J(24)), n = t + "=" + e + "; path=" + n + "; ", a && (n += "expires=" + new Date((new Date).getTime() + a).toGMTString() + "; "), i && "none" != i && (n += "domain=" + i + ";"), i = u.cookie, u.cookie = n, !(i = i != u.cookie))
            t: {
                for (t = Ua(t), i = 0; i < t.length; i++)
                    if (e == t[i]) {
                        i = !0;
                        break t
                    }
                i = !1
            }
        return i
    }
    function Wa(t) {
        return za(t).replace(/\(/g, "%28").replace(/\)/g, "%29")
    }
    function Za() {
        return (O || Da() ? "https:" : "http:") + "//www.google-analytics.com"
    }
    function $a(t) {
        this.name = "len",
        this.message = t + "-8192"
    }
    function _a(t, e, n) {
        if (n = n || ya, e.length <= 2036)
            p(t, e, n);
        else {
            if (!(e.length <= 8192))
                throw y("len", e.length), new $a(e.length);
            m(t, e, n) || v(t, e, n) || p(t, e, n)
        }
    }
    function eb(t) {
        var e = l.gaData = l.gaData || {};
        return e[t] = e[t] || {}
    }
    function fb() {
        this.M = []
    }
    var l = window,
    u = document,
    f = window,
    g = /^(www\.)?google(\.com?)?(\.[a-z]{2})?$/,
    h = /(^|\.)doubleclick\.net$/i,
    p = function (t, e, n) {
        var i = xa(t + "?" + e);
        i.onload = i.onerror = function () {
            i.onload = null,
            i.onerror = null,
            n()
        }
    },
    v = function (t, e, n) {
        var i = l.XMLHttpRequest;
        if (!i)
            return !1;
        var r = new i;
        return "withCredentials" in r && (r.open("POST", t, !0), r.withCredentials = !0, r.setRequestHeader("Content-Type", "text/plain"), r.onreadystatechange = function () {
            4 == r.readyState && (n(), r = null)
        }, r.send(e), !0)
    },
    m = function (t, e, n) {
        return !!l.navigator.sendBeacon && (!!l.navigator.sendBeacon(t, e) && (n(), !0))
    },
    y = function (t, e, n) {
        1 <= 100 * Math.random() || Ra("?") || (t = ["t=error", "_e=" + t, "_v=j47", "sr=1"], e && t.push("_f=" + e), n && t.push("_m=" + za(n.substring(0, 100))), t.push("aip=1"), t.push("z=" + w()), p(Za() + "/collect", t.join("&"), ya))
    };
    function Ja(t) {
        if (100 != t.get(Zt) && La(lb(t, Wt)) % 1e4 >= 100 * mb(t, Zt))
            throw "abort"
    }
    function Ma(t) {
        if (Ra(lb(t, Ft)))
            throw "abort"
    }
    function Oa() {
        var t = u.location.protocol;
        if ("http:" != t && "https:" != t)
            throw "abort"
    }
    function Pa(i) {
        try {
            l.navigator.sendBeacon ? J(42) : l.XMLHttpRequest && "withCredentials" in new l.XMLHttpRequest && J(40)
        } catch (t) {}
        i.set(wt, qa(i), !0),
        i.set(t, mb(i, t) + 1);
        var r = [];
        C.map(function (t, e) {
            if (e.F) {
                var n = i.get(t);
                null != n && n != e.defaultValue && ("boolean" == typeof n && (n *= 1), r.push(e.F + "=" + za("" + n)))
            }
        }),
        r.push("z=" + hb()),
        i.set(I, r.join("&"), !0)
    }
    function Sa(t) {
        var e = lb(t, te) || Za() + "/collect",
        n = lb(t, P);
        if (!n && t.get(_) && (n = "beacon"), n) {
            var i = lb(t, I),
            r = (r = t.get(D)) || ya;
            "image" == n ? p(e, i, r) : "xhr" == n && v(e, i, r) || "beacon" == n && m(e, i, r) || _a(e, i, r)
        } else
            _a(e, lb(t, I), t.get(D));
        e = t.get(Ft),
        n = (e = eb(e)).hitcount,
        e.hitcount = n ? n + 1 : 1,
        e = t.get(Ft),
        delete eb(e).pending_experiments,
        t.set(D, ya, !0)
    }
    function Hc(t) {
        var e;
        (l.gaData = l.gaData || {}).expId && t.set(dt, (l.gaData = l.gaData || {}).expId),
        (l.gaData = l.gaData || {}).expVar && t.set(ft, (l.gaData = l.gaData || {}).expVar);
        var n = t.get(Ft);
        if (n = eb(n).pending_experiments) {
            var i = [];
            for (e in n)
                n.hasOwnProperty(e) && n[e] && i.push(encodeURIComponent(e) + "." + encodeURIComponent(n[e]));
            e = i.join("!")
        } else
            e = void 0;
        e && t.set(gt, e, !0)
    }
    function cd() {
        if (l.navigator && "preview" == l.navigator.loadPurpose)
            throw "abort"
    }
    function yd(t) {
        var e = l.gaDevIds;
        a(e) && 0 != e.length && t.set("&did", e.join(","), !0)
    }
    function vb(t) {
        if (!t.get(Ft))
            throw "abort"
    }
    fb.prototype.add = function (t) {
        this.M.push(t)
    },
    fb.prototype.D = function (t) {
        try {
            for (var e = 0; e < this.M.length; e++) {
                var n = t.get(this.M[e]);
                n && sa(n) && n.call(l, t)
            }
        } catch (t) {}
        (e = t.get(D)) != ya && sa(e) && (t.set(D, ya, !0), setTimeout(e, 10))
    };
    function hb() {
        try {
            var t = new Uint32Array(1);
            return l.crypto.getRandomValues(t),
            2147483647 & t[0]
        } catch (t) {
            return w()
        }
    }
    var w = function () {
        return Math.round(2147483647 * Math.random())
    };
    function Ta(t) {
        var e = mb(t, mt);
        if (500 <= e && J(15), "transaction" != (n = lb(t, M)) && "item" != n) {
            var n = mb(t, yt),
            i = (new Date).getTime(),
            r = mb(t, bt);
            if (0 == r && t.set(bt, i), 0 < (r = Math.round(2 * (i - r) / 1e3)) && (n = Math.min(n + r, 20), t.set(bt, i)), n <= 0)
                throw "abort";
            t.set(yt, --n)
        }
        t.set(mt, ++e)
    }
    function ib() {
        this.data = new Ia
    }
    var C = new Ia,
    S = [];
    ib.prototype.get = function (t) {
        var e = x(t),
        n = this.data.get(t);
        return e && null == n && (n = sa(e.defaultValue) ? e.defaultValue() : e.defaultValue),
        e && e.Z ? e.Z(this, t, n) : n
    };
    function lb(t, e) {
        var n = t.get(e);
        return null == n ? "" : "" + n
    }
    function mb(t, e) {
        var n = t.get(e);
        return null == n || "" === n ? 0 : 1 * n
    }
    ib.prototype.set = function (t, e, n) {
        if (t)
            if ("object" == typeof t)
                for (var i in t)
                    t.hasOwnProperty(i) && E(this, i, t[i], n);
            else
                E(this, t, e, n)
    };
    function ob(t, e, n, i, r) {
        this.name = t,
        this.F = e,
        this.Z = i,
        this.o = r,
        this.defaultValue = n
    }
    function rb(t, e, n, i, r) {
        return t = new ob(t, e, n, i, r),
        C.set(t.name, t),
        t.name
    }
    function sb(t, e) {
        S.push([new RegExp("^" + t + "$"), e])
    }
    function tb(t, e, n) {
        return rb(t, e, n, void 0, T)
    }
    var E = function (t, e, n, i) {
        if (null != n)
            switch (e) {
            case Ft:
                Te.test(n)
            }
        var r = x(e);
        r && r.o ? r.o(t, e, n, i) : t.data.set(e, n, i)
    },
    x = function (t) {
        var e = C.get(t);
        if (!e)
            for (var n = 0; n < S.length; n++) {
                var i = S[n],
                r = i[0].exec(t);
                if (r) {
                    e = i[1](r),
                    C.set(e.name, e);
                    break
                }
            }
        return e
    },
    T = function () {},
    A = ua(window.GoogleAnalyticsObject) && wa(window.GoogleAnalyticsObject) || "ga",
    O = !1,
    k = tb("apiVersion", "v"),
    L = tb("clientVersion", "_v");
    rb("anonymizeIp", "aip");
    var e = rb("adSenseId", "a"),
    M = rb("hitType", "t"),
    D = rb("hitCallback"),
    I = rb("hitPayload");
    rb("nonInteraction", "ni"),
    rb("currencyCode", "cu"),
    rb("dataSource", "ds");
    var _ = rb("useBeacon", void 0, !1),
    P = rb("transport");
    rb("sessionControl", "sc", ""),
    rb("sessionGroup", "sg"),
    rb("queueTime", "qt");
    var t = rb("_s", "_s");
    rb("screenName", "cd");
    var R = rb("location", "dl", ""),
    N = rb("referrer", "dr"),
    n = rb("page", "dp", "");
    rb("hostname", "dh");
    var B = rb("language", "ul"),
    W = rb("encoding", "de");
    rb("title", "dt", function () {
        return u.title || void 0
    }),
    sb("contentGroup([0-9]+)", function (t) {
        return new ob(t[0], "cg" + t[1])
    });
    var H = rb("screenColors", "sd"),
    V = rb("screenResolution", "sr"),
    F = rb("viewportSize", "vp"),
    j = rb("javaEnabled", "je"),
    z = rb("flashVersion", "fl");
    rb("campaignId", "ci"),
    rb("campaignName", "cn"),
    rb("campaignSource", "cs"),
    rb("campaignMedium", "cm"),
    rb("campaignKeyword", "ck"),
    rb("campaignContent", "cc");
    var G = rb("eventCategory", "ec"),
    U = rb("eventAction", "ea"),
    q = rb("eventLabel", "el"),
    K = rb("eventValue", "ev"),
    $ = rb("socialNetwork", "sn"),
    Z = rb("socialAction", "sa"),
    Y = rb("socialTarget", "st"),
    Q = rb("l1", "plt"),
    tt = rb("l2", "pdt"),
    et = rb("l3", "dns"),
    nt = rb("l4", "rrt"),
    it = rb("l5", "srt"),
    rt = rb("l6", "tcp"),
    at = rb("l7", "dit"),
    ot = rb("l8", "clt"),
    st = rb("timingCategory", "utc"),
    lt = rb("timingVar", "utv"),
    ut = rb("timingLabel", "utl"),
    ct = rb("timingValue", "utt");
    rb("appName", "an"),
    rb("appVersion", "av", ""),
    rb("appId", "aid", ""),
    rb("appInstallerId", "aiid", ""),
    rb("exDescription", "exd"),
    rb("exFatal", "exf");
    var dt = rb("expId", "xid"),
    ft = rb("expVar", "xvar"),
    gt = rb("exp", "exp"),
    ht = rb("_utma", "_utma"),
    pt = rb("_utmz", "_utmz"),
    vt = rb("_utmht", "_utmht"),
    mt = rb("_hc", void 0, 0),
    bt = rb("_ti", void 0, 0),
    yt = rb("_to", void 0, 20);
    sb("dimension([0-9]+)", function (t) {
        return new ob(t[0], "cd" + t[1])
    }),
    sb("metric([0-9]+)", function (t) {
        return new ob(t[0], "cm" + t[1])
    }),
    rb("linkerParam", void 0, void 0, function Bc(t) {
        var e = Ic(t = t.get(Wt), 0);
        return "_ga=1." + za(e + "." + t)
    }, T);
    var wt = rb("usage", "_u"),
    Ct = rb("_um");
    rb("forceSSL", void 0, void 0, function () {
        return O
    }, function (t, e, n) {
        J(34),
        O = !!n
    });
    var St = rb("_j1", "jid");
    sb("\\&(.*)", function (t) {
        var e = new ob(t[0], t[1]),
        r = function (n) {
            var i;
            return C.map(function (t, e) {
                e.F == n && (i = e)
            }),
            i && i.name
        }
        (t[0].substring(1));
        return r && (e.Z = function (t) {
            return t.get(r)
        }, e.o = function (t, e, n, i) {
            t.set(r, n, i)
        }, e.F = void 0),
        e
    });
    var Et = tb("_oot"),
    xt = rb("previewTask"),
    Tt = rb("checkProtocolTask"),
    At = rb("validationTask"),
    Ot = rb("checkStorageTask"),
    kt = rb("historyImportTask"),
    Lt = rb("samplerTask"),
    Mt = rb("_rlt"),
    Dt = rb("buildHitTask"),
    It = rb("sendHitTask"),
    _t = rb("ceTask"),
    Pt = rb("devIdTask"),
    Rt = rb("timingTask"),
    Nt = rb("displayFeaturesTask"),
    Bt = tb("name"),
    Wt = tb("clientId", "cid"),
    Ht = tb("clientIdTime"),
    Vt = rb("userId", "uid"),
    Ft = tb("trackingId", "tid"),
    jt = tb("cookieName", void 0, "_ga"),
    zt = tb("cookieDomain"),
    Jt = tb("cookiePath", void 0, "/"),
    Gt = tb("cookieExpires", void 0, 63072e3),
    Ut = tb("legacyCookieDomain"),
    Xt = tb("legacyHistoryImport", void 0, !0),
    qt = tb("storage", void 0, "cookie"),
    Kt = tb("allowLinker", void 0, !1),
    $t = tb("allowAnchor", void 0, !0),
    Zt = tb("sampleRate", "sf", 100),
    Yt = tb("siteSpeedSampleRate", void 0, 1),
    Qt = tb("alwaysSendReferrer", void 0, !1),
    te = rb("transportUrl"),
    ee = rb("_r", "_r");
    function X(e, t, n, i) {
        t[e] = function () {
            try {
                return i && J(i),
                n.apply(this, arguments)
            } catch (t) {
                throw y("exc", e, t && t.name),
                t
            }
        }
    }
    function gd(t) {
        this.V = t,
        this.fa = void 0,
        this.$ = !1,
        this.oa = void 0,
        this.ea = 1
    }
    function hd(t, e) {
        var n;
        if (t.fa && t.$)
            return 0;
        if (t.$ = !0, e) {
            if (t.oa && mb(e, t.oa))
                return mb(e, t.oa);
            if (0 == e.get(Yt))
                return 0
        }
        return 0 == t.V ? 0 : (void 0 === n && (n = hb()), 0 == n % t.V ? Math.floor(n / t.V) % t.ea + 1 : 0)
    }
    function nd(n) {
        return function (t) {
            if ("pageview" == t.get(M) && !n.I) {
                n.I = !0;
                var e = function (t) {
                    var e = Math.min(mb(t, Yt), 100);
                    return !(La(lb(t, Wt)) % 100 >= e)
                }
                (t);
                t = 0 < Ea(t.get(R), "gclid").length,
                (e || t) && ne(function (t) {
                    n.send(e ? "timing" : "adtiming", t)
                })
            }
        }
    }
    function pd(t) {
        if ("cookie" == lb(t, qt)) {
            var e = lb(t, jt),
            n = ue(t),
            i = de(lb(t, Jt)),
            r = ce(lb(t, zt)),
            a = 1e3 * mb(t, Gt),
            o = lb(t, Ft);
            if ("auto" != r)
                Va(e, n, i, r, o, a) && (le = !0);
            else {
                var s;
                if (J(32), n = [], 4 != (r = Fa().split(".")).length || (s = r[r.length - 1], parseInt(s, 10) != s)) {
                    for (s = r.length - 2; 0 <= s; s--)
                        n.push(r.slice(s).join("."));
                    n.push("none"),
                    s = n
                } else
                    s = ["none"];
                for (var l = 0; l < s.length; l++)
                    if (r = s[l], t.data.set(zt, r), n = ue(t), Va(e, n, i, r, o, a))
                        return void(le = !0);
                t.data.set(zt, "auto")
            }
        }
    }
    function qd(t) {
        if ("cookie" == lb(t, qt) && !le && (pd(t), !le))
            throw "abort"
    }
    function rd(t) {
        if (t.get(Xt)) {
            var e = lb(t, zt),
            n = lb(t, Ut) || Fa(),
            i = Xc("__utma", n, e);
            i && (J(19), t.set(vt, (new Date).getTime(), !0), t.set(ht, i.R), (e = Xc("__utmz", n, e)) && i.hash == e.hash && t.set(pt, e.R))
        }
    }
    function vd(t, e, n) {
        for (var i, r = [], a = [], o = 0; o < t.length; o++) {
            var s = t[o];
            s.H[n] == e ? r.push(s) : null == i || s.H[n] < i ? (a = [s], i = s.H[n]) : s.H[n] == i && a.push(s)
        }
        return 0 < r.length ? r : a
    }
    var ne = function (t) {
        var e = {};
        if (re(e) || oe(e)) {
            var n = e[Q];
            null == n || 1 / 0 == n || isNaN(n) || (0 < n ? (se(e, et), se(e, rt), se(e, it), se(e, tt), se(e, nt), se(e, at), se(e, ot), t(e)) : Aa(l, "load", function () {
                    ne(t)
                }, !1))
        }
    },
    re = function (t) {
        var e;
        if (!(e = (e = l.performance || l.webkitPerformance) && e.timing))
            return !1;
        var n = e.navigationStart;
        return 0 != n && (t[Q] = e.loadEventStart - n, t[et] = e.domainLookupEnd - e.domainLookupStart, t[rt] = e.connectEnd - e.connectStart, t[it] = e.responseStart - e.requestStart, t[tt] = e.responseEnd - e.responseStart, t[nt] = e.fetchStart - n, t[at] = e.domInteractive - n, t[ot] = e.domContentLoadedEventStart - n, !0)
    },
    oe = function (t) {
        if (l.top != l)
            return !1;
        var e = l.external,
        n = e && e.onloadT;
        return e && !e.isValidLoadTime && (n = void 0),
        2147483648 < n && (n = void 0),
        0 < n && e.setPageReadyTime(),
        null != n && (t[Q] = n, !0)
    },
    se = function (t, e) {
        var n = t[e];
        (isNaN(n) || 1 / 0 == n || n < 0) && (t[e] = void 0)
    },
    le = !1,
    ue = function (t) {
        var e = Wa(lb(t, Wt)),
        n = ce(lb(t, zt)).split(".").length;
        return 1 < (t = fe(lb(t, Jt))) && (n += "-" + t),
        ["GA1", n, e].join(".")
    },
    ce = function (t) {
        return 0 == t.indexOf(".") ? t.substr(1) : t
    },
    de = function (t) {
        return t ? (1 < t.length && t.lastIndexOf("/") == t.length - 1 && (t = t.substr(0, t.length - 1)), 0 != t.indexOf("/") && (t = "/" + t), t) : "/"
    },
    fe = function (t) {
        return "/" == (t = de(t)) ? 1 : t.split("/").length
    };
    function Xc(t, e, n) {
        "none" == e && (e = "");
        var i = [],
        r = Ua(t);
        t = "__utma" == t ? 6 : 2;
        for (var a = 0; a < r.length; a++) {
            var o = ("" + r[a]).split(".");
            o.length >= t && i.push({
                hash: o[0],
                R: r[a],
                O: o
            })
        }
        if (0 != i.length)
            return 1 == i.length ? i[0] : Zc(e, i) || Zc(n, i) || Zc(null, i) || i[0]
    }
    function Zc(t, e) {
        var n,
        i;
        null == t ? n = i = 1 : (n = La(t), i = La(s(t, ".") ? t.substring(1) : "." + t));
        for (var r = 0; r < e.length; r++)
            if (e[r].hash == n || e[r].hash == i)
                return e[r]
    }
    var ge = new RegExp(/^https?:\/\/([^\/:]+)/),
    he = /(.*)([?&#])(?:_ga=[^&#]*)(?:&?)(.*)/;
    function Ic(t, e) {
        for (var n = new Date, i = (r = l.navigator).plugins || [], r = (n = [t, r.userAgent, n.getTimezoneOffset(), n.getYear(), n.getDate(), n.getHours(), n.getMinutes() + e], 0); r < i.length; ++r)
            n.push(i[r].description);
        return La(n.join("."))
    }
    function Cd(t) {
        J(48),
        this.target = t,
        this.T = !1
    }
    Cd.prototype.ca = function (t, e) {
        if (t.tagName) {
            if ("a" == t.tagName.toLowerCase())
                return void(t.href && (t.href = pe(this, t.href, e)));
            if ("form" == t.tagName.toLowerCase())
                return ve(this, t)
        }
        if ("string" == typeof t)
            return pe(this, t, e)
    };
    var pe = function (t, e, n) {
        (r = he.exec(e)) && 3 <= r.length && (e = r[1] + (r[3] ? r[2] + r[3] : "")),
        t = t.target.get("linkerParam");
        var i = e.indexOf("?"),
        r = e.indexOf("#");
        return n ? e += (-1 == r ? "#" : "&") + t : (n = -1 == i ? "?" : "&", e = -1 == r ? e + (n + t) : e.substring(0, r) + n + t + e.substring(r)),
        e.replace(/&+_ga=/, "&_ga=")
    },
    ve = function (t, e) {
        if (e && e.action) {
            var n = t.target.get("linkerParam").split("=")[1];
            if ("get" == e.method.toLowerCase()) {
                for (var i = e.childNodes || [], r = 0; r < i.length; r++)
                    if ("_ga" == i[r].name)
                        return void i[r].setAttribute("value", n);
                (i = u.createElement("input")).setAttribute("type", "hidden"),
                i.setAttribute("name", "_ga"),
                i.setAttribute("value", n),
                e.appendChild(i)
            } else
                "post" == e.method.toLowerCase() && (e.action = pe(t, e.action))
        }
    };
    function sd(t, e) {
        if (e == u.location.hostname)
            return !1;
        for (var n = 0; n < t.length; n++)
            if (t[n]instanceof RegExp) {
                if (t[n].test(e))
                    return !0
            } else if (0 <= e.indexOf(t[n]))
                return !0;
        return !1
    }
    Cd.prototype.S = function (i, r, t) {
        function d(t) {
            try {
                var e;
                t = t || l.event;
                t: {
                    var n = t.target || t.srcElement;
                    for (t = 100; n && 0 < t; ) {
                        if (n.href && n.nodeName.match(/^a(?:rea)?$/i)) {
                            e = n;
                            break t
                        }
                        n = n.parentNode,
                        t--
                    }
                    e = {}
                }
                ("http:" == e.protocol || "https:" == e.protocol) && sd(i, e.hostname || "") && e.href && (e.href = pe(a, e.href, r))
            } catch (t) {
                J(26)
            }
        }
        var a = this;
        this.T || (this.T = !0, Aa(u, "mousedown", d, !1), Aa(u, "keyup", d, !1)),
        t && Aa(u, "submit", function (t) {
            if ((t = (t = t || l.event).target || t.srcElement) && t.action) {
                var e = t.action.match(ge);
                e && sd(i, e[1]) && ve(a, t)
            }
        })
    };
    function Jd(t, e, n) {
        this.U = St,
        this.aa = e,
        (e = n) || (e = (e = lb(t, Bt)) && "t0" != e ? xe.test(e) ? "_gat_" + Wa(lb(t, Ft)) : "_gat_" + Wa(e) : "_gat"),
        this.Y = e,
        hd(new gd(100), t) && (J(30), this.pa = !0)
    }
    function Pd(t, e) {
        var n,
        i = t.b;
        i.get("dcLoaded") || (pa(i, 29), (e = e || {})[jt] && (n = Wa(e[jt])), function (n, t) {
            var i = t.get(Dt);
            t.set(Dt, function (t) {
                Ce(n, t);
                var e = i(t);
                return Se(n, t),
                e
            });
            var r = t.get(It);
            t.set(It, function (t) {
                var e = r(t);
                return Ee(n, t),
                e
            })
        }
            (n = new Jd(i, "https://stats.g.doubleclick.net/r/collect?t=dc&aip=1&_r=3&", n), i), i.set("dcLoaded", !0))
    }
    function Qd(t) {
        if (!t.get("dcLoaded") && "cookie" == t.get(qt)) {
            pa(t, 51);
            var e = new Jd(t);
            Ce(e, t),
            Se(e, t),
            t.get(e.U) && (t.set(ee, 1, !0), t.set(te, Za() + "/r/collect", !0))
        }
    }
    function Vd(t) {
        function b(t, e) {
            n.b.data.set(t, e)
        }
        function c(t, e) {
            b(t, e),
            n.filters.add(t)
        }
        var n = this;
        this.b = new ib,
        this.filters = new fb,
        b(Bt, t[Bt]),
        b(Ft, wa(t[Ft])),
        b(jt, t[jt]),
        b(zt, t[zt] || Fa()),
        b(Jt, t[Jt]),
        b(Gt, t[Gt]),
        b(Ut, t[Ut]),
        b(Xt, t[Xt]),
        b(Kt, t[Kt]),
        b($t, t[$t]),
        b(Zt, t[Zt]),
        b(Yt, t[Yt]),
        b(Qt, t[Qt]),
        b(qt, t[qt]),
        b(Vt, t[Vt]),
        b(Ht, t[Ht]),
        b(k, 1),
        b(L, "j47"),
        c(Et, Ma),
        c(xt, cd),
        c(Tt, Oa),
        c(At, vb),
        c(Ot, qd),
        c(kt, rd),
        c(Lt, Ja),
        c(Mt, Ta),
        c(_t, Hc),
        c(Pt, yd),
        c(Nt, Qd),
        c(Dt, Pa),
        c(It, Sa),
        c(Rt, nd(this)),
        Ae(this.b, t[Wt]),
        Oe(this.b),
        this.b.set(e, function () {
            var t = l.gaGlobal = l.gaGlobal || {};
            return t.hid = t.hid || w()
        }
            ()),
        function (t, e, n) {
            if (!me) {
                var i;
                i = u.location.hash;
                var r = l.name,
                a = /^#?gaso=([^&]*)/;
                (r = (i = (i = i && i.match(a) || r && r.match(a)) ? i[1] : Ua("GASO")[0] || "") && i.match(/^(?:!([-0-9a-z.]{1,40})!)?([-.\w]{10,1200})$/i)) && (Va("GASO", "" + i, n, e, t, 0), window._udo || (window._udo = e), window._utcp || (window._utcp = n), t = r[1], Ca("https://www.google.com/analytics/web/inpage/pub/inpage.js?" + (t ? "prefix=" + t + "&" : "") + w(), "_gasojs")),
                me = !0
            }
        }
        (this.b.get(Ft), this.b.get(zt), this.b.get(Jt))
    }
    var me,
    be = /^(GTM|OPT)-[A-Z0-9]+$/,
    ye = /;_gaexp=[^;]*/g,
    we = /;((__utma=)|([^;=]+=GAX?\d+\.))[^;]*/g,
    Ce = function (t, e) {
        e.get(t.U) || ("1" == Ua(t.Y)[0] ? e.set(t.U, "", !0) : e.set(t.U, "" + w(), !0))
    },
    Se = function (t, e) {
        if (e.get(t.U)) {
            var n = 6e5;
            t.pa && (n /= 10),
            Va(t.Y, "1", e.get(Jt), e.get(zt), e.get(Ft), n)
        }
    },
    Ee = function (t, e) {
        if (e.get(t.U)) {
            function ak(t) {
                x(t).F && n.set(x(t).F, e.get(t))
            }
            var n = new Ia;
            ak(k),
            ak(L),
            ak(Ft),
            ak(Wt),
            ak(Vt),
            ak(t.U),
            n.set(x(wt).F, qa(e));
            var i = t.aa;
            n.map(function (t, e) {
                i += za(t) + "=",
                i += za("" + e) + "&"
            }),
            i += "z=" + w(),
            xa(i),
            e.set(t.U, "", !0)
        }
    },
    xe = /^gtm\d+$/,
    Te = /^(UA|YT|MO|GP)-(\d+)-(\d+)$/,
    Ae = function (t, e) {
        if ("cookie" == lb(t, qt)) {
            var n;
            le = !1;
            t: {
                var i = Ua(lb(t, jt));
                if (i && !(i.length < 1)) {
                    n = [];
                    for (var r = 0; r < i.length; r++) {
                        var a,
                        o = (a = i[r].split(".")).shift();
                        (a = ("GA1" == o || "1" == o) && 1 < a.length ? (1 == (o = a.shift().split("-")).length && (o[1] = "1"), o[0] *= 1, o[1] *= 1, {
                                H: o,
                                s: a.join(".")
                            }) : void 0) && n.push(a)
                    }
                    if (1 == n.length) {
                        J(13),
                        n = n[0].s;
                        break t
                    }
                    if (0 != n.length) {
                        if (J(14), i = ce(lb(t, zt)).split(".").length, 1 == (n = vd(n, i, 0)).length) {
                            n = n[0].s;
                            break t
                        }
                        i = fe(lb(t, Jt)),
                        n = (n = vd(n, i, 1))[0] && n[0].s;
                        break t
                    }
                    J(12)
                }
                n = void 0
            }
            n || (n = lb(t, zt), n = null != (n = Xc("__utma", i = lb(t, Ut) || Fa(), n)) ? (J(10), n.O[1] + "." + n.O[2]) : void 0),
            n && (t.data.set(Wt, n), le = !0)
        }
        if (n = t.get($t), (r = Ea(u.location[n ? "href" : "search"], "_ga")) && (t.get(Kt) ? -1 == (n = r.indexOf(".")) ? J(22) : (i = r.substring(n + 1), "1" != r.substring(0, n) ? J(22) : -1 == (n = i.indexOf(".")) ? J(22) : (r = i.substring(0, n)) != Ic(n = i.substring(n + 1), 0) && r != Ic(n, -1) && r != Ic(n, -2) ? J(23) : (J(11), t.data.set(Wt, n))) : J(21)), e && (J(9), t.data.set(Wt, za(e))), !t.get(Wt))
            if (n = (n = l.gaGlobal && l.gaGlobal.vid) && -1 != n.search(/^(?:utma\.)?\d+\.\d+$/) ? n : void 0)
                J(17), t.data.set(Wt, n);
            else {
                for (J(8), i = (n = l.navigator.userAgent + (u.cookie ? u.cookie : "") + (u.referrer ? u.referrer : "")).length, r = l.history.length; 0 < r; )
                    n += r-- ^ i++;
                t.data.set(Wt, [w() ^ 2147483647 & La(n), Math.round((new Date).getTime() / 1e3)].join("."))
            }
        pd(t)
    },
    Oe = function (t) {
        var e = l.navigator,
        n = l.screen,
        i = u.location;
        if (t.set(N, function (t) {
                var e = u.referrer;
                if (/^https?:\/\//i.test(e)) {
                    if (t)
                        return e;
                    t = "//" + u.location.hostname;
                    var n = e.indexOf(t);
                    if ((5 == n || 6 == n) && ("/" == (t = e.charAt(n + t.length)) || "?" == t || "" == t || ":" == t))
                        return;
                    return e
                }
            }
                (t.get(Qt))), i) {
            var r = i.pathname || "";
            "/" != r.charAt(0) && (J(31), r = "/" + r),
            t.set(R, i.protocol + "//" + i.hostname + r + i.search)
        }
        n && t.set(V, n.width + "x" + n.height),
        n && t.set(H, n.colorDepth + "-bit");
        n = u.documentElement;
        var a = (r = u.body) && r.clientWidth && r.clientHeight,
        o = [];
        if (n && n.clientWidth && n.clientHeight && ("CSS1Compat" === u.compatMode || !a) ? o = [n.clientWidth, n.clientHeight] : a && (o = [r.clientWidth, r.clientHeight]), n = o[0] <= 0 || o[1] <= 0 ? "" : o.join("x"), t.set(F, n), t.set(z, function fc() {
                var t,
                e,
                n;
                if ((n = (n = l.navigator) ? n.plugins : null) && n.length)
                    for (var i = 0; i < n.length && !e; i++) {
                        var r = n[i];
                        -1 < r.name.indexOf("Shockwave Flash") && (e = r.description)
                    }
                if (!e)
                    try {
                        e = (t = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7")).GetVariable("$version")
                    } catch (t) {}
                if (!e)
                    try {
                        t = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"),
                        e = "WIN 6,0,21,0",
                        t.AllowScriptAccess = "always",
                        e = t.GetVariable("$version")
                    } catch (t) {}
                if (!e)
                    try {
                        e = (t = new ActiveXObject("ShockwaveFlash.ShockwaveFlash")).GetVariable("$version")
                    } catch (t) {}
                return e && (t = e.match(/[\d]+/g)) && 3 <= t.length && (e = t[0] + "." + t[1] + " r" + t[2]),
                e || void 0
            }
                ()), t.set(W, u.characterSet || u.charset), t.set(j, e && "function" == typeof e.javaEnabled && e.javaEnabled() || !1), t.set(B, (e && (e.language || e.browserLanguage) || "").toLowerCase()), i && t.get($t) && (e = u.location.hash)) {
            for (e = e.split(/[?&#]+/), i = [], n = 0; n < e.length; ++n)
                (s(e[n], "utm_id") || s(e[n], "utm_campaign") || s(e[n], "utm_source") || s(e[n], "utm_medium") || s(e[n], "utm_term") || s(e[n], "utm_content") || s(e[n], "gclid") || s(e[n], "dclid") || s(e[n], "gclsrc")) && i.push(e[n]);
            0 < i.length && (e = "#" + i.join("&"), t.set(R, t.get(R) + e))
        }
    };
    Vd.prototype.get = function (t) {
        return this.b.get(t)
    },
    Vd.prototype.set = function (t, e) {
        this.b.set(t, e)
    };
    var ke = {
        pageview: [n],
        event: [G, U, q, K],
        social: [$, Z, Y],
        timing: [st, lt, ct, ut]
    };
    Vd.prototype.send = function (t) {
        var e,
        n;
        arguments.length < 1 || (n = "string" == typeof t ? (e = t, [].slice.call(arguments, 1)) : (e = t && t[M], arguments), e && ((n = Ha(ke[e] || [], n))[M] = e, this.b.set(n, void 0, !0), this.filters.D(this.b), this.b.data.m = {}))
    },
    Vd.prototype.ma = function (t, e) {
        var n = this;
        Pe(t, n, e) || (Ne(t, function () {
                Pe(t, n, e)
            }), Re(String(n.get(Bt)), t, void 0, e, !0))
    };
    function Zd(t) {
        return "prerender" != u.visibilityState && (t(), !0)
    }
    function $d(n) {
        if (!Zd(n)) {
            J(16);
            var i = !1,
            r = function () {
                if (!i && Zd(n)) {
                    i = !0;
                    var t = r,
                    e = u;
                    e.removeEventListener ? e.removeEventListener("visibilitychange", t, !1) : e.detachEvent && e.detachEvent("onvisibilitychange", t)
                }
            };
            Aa(u, "visibilitychange", r)
        }
    }
    function ae(t) {
        if (sa(t[0]))
            this.u = t[0];
        else {
            var e = _e.exec(t[0]);
            if (null != e && 4 == e.length && (this.c = e[1] || "t0", this.K = e[2] || "", this.C = e[3], this.a = [].slice.call(t, 1), this.K || (this.A = "create" == this.C, this.i = "require" == this.C, this.g = "provide" == this.C, this.ba = "remove" == this.C), this.i && (3 <= this.a.length ? (this.X = this.a[1], this.W = this.a[2]) : this.a[1] && (ua(this.a[1]) ? this.X = this.a[1] : this.W = this.a[1]))), e = t[1], t = t[2], !this.C)
                throw "abort";
            if (this.i && (!ua(e) || "" == e))
                throw "abort";
            if (this.g && (!ua(e) || "" == e || !sa(t)))
                throw "abort";
            if (ud(this.c) || ud(this.K))
                throw "abort";
            if (this.g && "t0" != this.c)
                throw "abort"
        }
    }
    var Le,
    Me,
    De,
    Ie,
    _e = /^(?:(\w+)\.)?(?:(\w+):)?(\w+)$/;
    function ud(t) {
        return 0 <= t.indexOf(".") || 0 <= t.indexOf(":")
    }
    Le = new Ia,
    De = new Ia,
    Ie = new Ia,
    Me = {
        ec: 45,
        ecommerce: 46,
        linkid: 47
    };
    function ie(t, e) {
        Le.set(t, e);
        for (var n = Ie.get(t) || [], i = 0; i < n.length; i++)
            n[i]();
        Ie.set(t, [])
    }
    var Pe = function (t, e, n) {
        e == Ve || e.get(Bt);
        var i = Le.get(t);
        return !!sa(i) && (e.plugins_ = e.plugins_ || new Ia, e.plugins_.get(t) || e.plugins_.set(t, new i(e, n || {})), !0)
    },
    Re = function (t, e, n, i, r) {
        if (!sa(Le.get(e)) && !De.get(e)) {
            if (Me.hasOwnProperty(e) && J(Me[e]), be.test(e)) {
                if (J(52), !(t = Ve.j(t)))
                    return !0;
                i = {
                    id: e,
                    B: (n = i || {}).dataLayer || "dataLayer",
                    ia: !!t.get("anonymizeIp"),
                    na: r,
                    G: !1
                },
                t.get("&gtm") == e && (i.G = !0);
                var a = String(t.get("name"));
                "t0" != a && (i.target = a),
                Ra(String(t.get("trackingId"))) || (i.ja = String(t.get(Wt)), i.ka = Number(t.get(Ht)), t = n.palindrome ? we : ye, t = (t = u.cookie.replace(/^|(; +)/g, ";").match(t)) ? t.sort().join("").substring(1) : void 0, i.la = t),
                t = i.B,
                n = (new Date).getTime(),
                l[t] = l[t] || [],
                n = {
                    "gtm.start": n
                },
                r || (n.event = "gtm.js"),
                l[t].push(n),
                n = function (t) {
                    function b(t, e) {
                        e && (n += "&" + t + "=" + za(e))
                    }
                    var n = "https://www.google-analytics.com/gtm/js?id=" + za(t.id);
                    return "dataLayer" != t.B && b("l", t.B),
                    b("t", t.target),
                    b("cid", t.ja),
                    b("cidt", t.ka),
                    b("gac", t.la),
                    b("aip", t.ia),
                    t.na && b("m", "sync"),
                    b("cycle", t.G),
                    n
                }
                (i)
            }
            !n && Me.hasOwnProperty(e) ? (J(39), n = e + ".js") : J(43),
            n && (n && 0 <= n.indexOf("/") || (n = (O || Da() ? "https:" : "http:") + "//www.google-analytics.com/plugins/ua/" + n), t = (i = We(n)).protocol, n = u.location.protocol, ("https:" == t || t == n || "http:" == t && "http:" == n) && Be(i) && (Ca(i.url, void 0, r), De.set(e, !0)))
        }
    },
    Ne = function (t, e) {
        var n = Ie.get(t) || [];
        n.push(e),
        Ie.set(t, n)
    },
    Be = function (t) {
        var e = We(u.location.href);
        return !!s(t.url, "https://www.google-analytics.com/gtm/js?id=") || !(t.query || 0 <= t.url.indexOf("?") || 0 <= t.path.indexOf("://")) && (t.host == e.host && t.port == e.port || (e = "http:" == t.protocol ? 80 : 443, !("www.google-analytics.com" != t.host || (t.port || e) != e || !s(t.path, "/plugins/"))))
    },
    We = function (t) {
        function b(t) {
            var e = (t.hostname || "").split(":")[0].toLowerCase(),
            n = (t.protocol || "").toLowerCase();
            n = 1 * t.port || ("http:" == n ? 80 : "https:" == n ? 443 : "");
            return t = t.pathname || "",
            s(t, "/") || (t = "/" + t),
            [e, "" + n, t]
        }
        var e = u.createElement("a");
        e.href = u.location.href;
        var n = (e.protocol || "").toLowerCase(),
        i = b(e),
        r = e.search || "",
        a = n + "//" + i[0] + (i[1] ? ":" + i[1] : "");
        return s(t, "//") ? t = n + t : s(t, "/") ? t = a + t : !t || s(t, "?") ? t = a + i[2] + (t || r) : t.split("/")[0].indexOf(":") < 0 && (t = a + i[2].substring(0, i[2].lastIndexOf("/")) + "/" + t),
        e.href = t,
        n = b(e), {
            protocol: (e.protocol || "").toLowerCase(),
            host: n[0],
            port: n[1],
            path: n[2],
            query: e.search || "",
            url: t || ""
        }
    },
    He = {
        ga: function () {
            He.f = []
        }
    };
    He.ga(),
    He.D = function (t) {
        var e = He.J.apply(He, arguments);
        e = He.f.concat(e);
        for (He.f = []; 0 < e.length && !He.v(e[0]) && (e.shift(), !(0 < He.f.length)); );
        He.f = He.f.concat(e)
    },
    He.J = function (t) {
        for (var e = [], n = 0; n < arguments.length; n++)
            try {
                var i = new ae(arguments[n]);
                i.g ? ie(i.a[0], i.a[1]) : (i.i && (i.ha = Re(i.c, i.a[0], i.X, i.W)), e.push(i))
            } catch (t) {}
        return e
    },
    He.v = function (t) {
        try {
            if (t.u)
                t.u.call(l, Ve.j("t0"));
            else {
                var e = t.c == A ? Ve : Ve.j(t.c);
                if (t.A)
                    "t0" != t.c || Ve.create.apply(Ve, t.a);
                else if (t.ba)
                    Ve.remove(t.c);
                else if (e)
                    if (t.i) {
                        if (t.ha && (t.ha = Re(t.c, t.a[0], t.X, t.W)), !Pe(t.a[0], e, t.W))
                            return !0
                    } else if (t.K) {
                        var n = t.C,
                        i = t.a,
                        r = e.plugins_.get(t.K);
                        r[n].apply(r, i)
                    } else
                        e[t.C].apply(e, t.a)
            }
        } catch (t) {}
    };
    var Ve = function (t) {
        J(1),
        He.D.apply(He, [arguments])
    };
    Ve.h = {},
    Ve.P = [],
    Ve.L = 0,
    Ve.answer = 42;
    var Fe = [Ft, zt, Bt];
    Ve.create = function (t) {
        var e = Ha(Fe, [].slice.call(arguments));
        e[Bt] || (e[Bt] = "t0");
        var n = "" + e[Bt];
        return Ve.h[n] ? Ve.h[n] : (e = new Vd(e), Ve.h[n] = e, Ve.P.push(e), e)
    },
    Ve.remove = function (t) {
        for (var e = 0; e < Ve.P.length; e++)
            if (Ve.P[e].get(Bt) == t) {
                Ve.P.splice(e, 1),
                Ve.h[t] = null;
                break
            }
    },
    Ve.j = function (t) {
        return Ve.h[t]
    },
    Ve.getAll = function () {
        return Ve.P.slice(0)
    },
    Ve.N = function () {
        "ga" != A && J(49);
        var t = l[A];
        if (!t || 42 != t.answer) {
            if (Ve.L = t && t.l, Ve.loaded = !0, X("create", e = l[A] = Ve, e.create), X("remove", e, e.remove), X("getByName", e, e.j, 5), X("getAll", e, e.getAll, 6), X("get", e = Vd.prototype, e.get, 7), X("set", e, e.set, 4), X("send", e, e.send), X("requireSync", e, e.ma), X("get", e = ib.prototype, e.get), X("set", e, e.set), !Da() && !O) {
                t: {
                    for (var e = u.getElementsByTagName("script"), n = 0; n < e.length && n < 100; n++) {
                        var i = e[n].src;
                        if (i && 0 == i.indexOf("https://www.google-analytics.com/analytics")) {
                            J(33),
                            e = !0;
                            break t
                        }
                    }
                    e = !1
                }
                e && (O = !0)
            }
            Da() || O || !hd(new gd(1e4)) || (J(36), O = !0),
            e = ((l.gaplugins = l.gaplugins || {}).Linker = Cd).prototype,
            ie("linker", Cd),
            X("decorate", e, e.ca, 20),
            X("autoLink", e, e.S, 25),
            ie("displayfeatures", Pd),
            ie("adfeatures", Pd),
            t = t && t.q,
            a(t) ? He.D.apply(Ve, t) : J(50)
        }
    },
    Ve.da = function () {
        for (var t = Ve.getAll(), e = 0; e < t.length; e++)
            t[e].get(Bt)
    };
    var je = Ve.N,
    ze = l[A];
    function La(t) {
        var e,
        n,
        i = 1;
        if (t)
            for (i = 0, n = t.length - 1; 0 <= n; n--)
                i = 0 != (e = 266338304 & (i = (i << 6 & 268435455) + (e = t.charCodeAt(n)) + (e << 14))) ? i ^ e >> 21 : i;
        return i
    }
    ze && ze.r ? je() : $d(je),
    $d(function () {
        He.D(["provide", "render", ya])
    })
}
(window);
var tns = function () {
    var t = window,
    Ke = t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || t.msRequestAnimationFrame || function (t) {
        return setTimeout(t, 16)
    },
    e = window,
    $e = e.cancelAnimationFrame || e.mozCancelAnimationFrame || function (t) {
        clearTimeout(t)
    };
    function extend(t) {
        for (var e, n, i, r = t || {}, a = 1, o = arguments.length; a < o; a++)
            if (null !== (e = arguments[a]))
                for (n in e)
                    r !== (i = e[n]) && void 0 !== i && (r[n] = i);
        return r
    }
    function checkStorageValue(t) {
        return 0 <= ["true", "false"].indexOf(t) ? JSON.parse(t) : t
    }
    function setLocalStorage(t, e, n, i) {
        if (i)
            try {
                t.setItem(e, n)
            } catch (t) {}
        return n
    }
    function getBody() {
        var t = document,
        e = t.body;
        return e || ((e = t.createElement("body")).fake = !0),
        e
    }
    var n = document.documentElement;
    function setFakeBody(t) {
        var e = "";
        return t.fake && (e = n.style.overflow, t.style.background = "", t.style.overflow = n.style.overflow = "hidden", n.appendChild(t)),
        e
    }
    function resetFakeBody(t, e) {
        t.fake && (t.remove(), n.style.overflow = e, n.offsetHeight)
    }
    function addCSSRule(t, e, n, i) {
        "insertRule" in t ? t.insertRule(e + "{" + n + "}", i) : t.addRule(e, n, i)
    }
    function getCssRulesLength(t) {
        return ("insertRule" in t ? t.cssRules : t.rules).length
    }
    function forEach(t, e, n) {
        for (var i = 0, r = t.length; i < r; i++)
            e.call(n, t[i], i)
    }
    var i = "classList" in document.createElement("_"),
    Ze = i ? function (t, e) {
        return t.classList.contains(e)
    }
     : function (t, e) {
        return 0 <= t.className.indexOf(e)
    },
    Ye = i ? function (t, e) {
        Ze(t, e) || t.classList.add(e)
    }
     : function (t, e) {
        Ze(t, e) || (t.className += " " + e)
    },
    Qe = i ? function (t, e) {
        Ze(t, e) && t.classList.remove(e)
    }
     : function (t, e) {
        Ze(t, e) && (t.className = t.className.replace(e, ""))
    };
    function hasAttr(t, e) {
        return t.hasAttribute(e)
    }
    function getAttr(t, e) {
        return t.getAttribute(e)
    }
    function isNodeList(t) {
        return void 0 !== t.item
    }
    function setAttrs(t, e) {
        if (t = isNodeList(t) || t instanceof Array ? t : [t], "[object Object]" === Object.prototype.toString.call(e))
            for (var n = t.length; n--; )
                for (var i in e)
                    t[n].setAttribute(i, e[i])
    }
    function removeAttrs(t, e) {
        t = isNodeList(t) || t instanceof Array ? t : [t];
        for (var n = (e = e instanceof Array ? e : [e]).length, i = t.length; i--; )
            for (var r = n; r--; )
                t[i].removeAttribute(e[r])
    }
    function arrayFromNodeList(t) {
        for (var e = [], n = 0, i = t.length; n < i; n++)
            e.push(t[n]);
        return e
    }
    function hideElement(t, e) {
        "none" !== t.style.display && (t.style.display = "none")
    }
    function showElement(t, e) {
        "none" === t.style.display && (t.style.display = "")
    }
    function isVisible(t) {
        return "none" !== window.getComputedStyle(t).display
    }
    function whichProperty(e) {
        if ("string" == typeof e) {
            var n = [e],
            i = e.charAt(0).toUpperCase() + e.substr(1);
            ["Webkit", "Moz", "ms", "O"].forEach(function (t) {
                "ms" === t && "transform" !== e || n.push(t + i)
            }),
            e = n
        }
        for (var t = document.createElement("fakeelement"), r = (e.length, 0); r < e.length; r++) {
            var a = e[r];
            if (void 0 !== t.style[a])
                return a
        }
        return !1
    }
    function getEndProperty(t, e) {
        var n = !1;
        return /^Webkit/.test(t) ? n = "webkit" + e + "End" : /^O/.test(t) ? n = "o" + e + "End" : t && (n = e.toLowerCase() + "end"),
        n
    }
    var r = !1;
    try {
        var a = Object.defineProperty({}, "passive", {
            get: function () {
                r = !0
            }
        });
        window.addEventListener("test", null, a)
    } catch (t) {}
    var o = !!r && {
        passive: !0
    };
    function addEvents(t, e, n) {
        for (var i in e) {
            var r = 0 <= ["touchstart", "touchmove"].indexOf(i) && !n && o;
            t.addEventListener(i, e[i], r)
        }
    }
    function removeEvents(t, e) {
        for (var n in e) {
            var i = 0 <= ["touchstart", "touchmove"].indexOf(n) && o;
            t.removeEventListener(n, e[n], i)
        }
    }
    function Events() {
        return {
            topics: {},
            on: function (t, e) {
                this.topics[t] = this.topics[t] || [],
                this.topics[t].push(e)
            },
            off: function (t, e) {
                if (this.topics[t])
                    for (var n = 0; n < this.topics[t].length; n++)
                        if (this.topics[t][n] === e) {
                            this.topics[t].splice(n, 1);
                            break
                        }
            },
            emit: function (e, n) {
                n.type = e,
                this.topics[e] && this.topics[e].forEach(function (t) {
                    t(n, e)
                })
            }
        }
    }
    Object.keys || (Object.keys = function (t) {
        var e = [];
        for (var n in t)
            Object.prototype.hasOwnProperty.call(t, n) && e.push(n);
        return e
    }),
    "remove" in Element.prototype || (Element.prototype.remove = function () {
        this.parentNode && this.parentNode.removeChild(this)
    });
    var tn = function (L) {
        L = extend({
            container: ".slider",
            mode: "carousel",
            axis: "horizontal",
            items: 1,
            gutter: 0,
            edgePadding: 0,
            fixedWidth: !1,
            autoWidth: !1,
            viewportMax: !1,
            slideBy: 1,
            center: !1,
            controls: !0,
            controlsPosition: "top",
            controlsText: ["prev", "next"],
            controlsContainer: !1,
            prevButton: !1,
            nextButton: !1,
            nav: !0,
            navPosition: "top",
            navContainer: !1,
            navAsThumbnails: !1,
            arrowKeys: !1,
            speed: 300,
            autoplay: !1,
            autoplayPosition: "top",
            autoplayTimeout: 5e3,
            autoplayDirection: "forward",
            autoplayText: ["start", "stop"],
            autoplayHoverPause: !1,
            autoplayButton: !1,
            autoplayButtonOutput: !0,
            autoplayResetOnVisibility: !0,
            animateIn: "tns-fadeIn",
            animateOut: "tns-fadeOut",
            animateNormal: "tns-normal",
            animateDelay: !1,
            loop: !0,
            rewind: !1,
            autoHeight: !1,
            responsive: !1,
            lazyload: !1,
            lazyloadSelector: ".tns-lazy-img",
            touch: !0,
            mouseDrag: !1,
            swipeAngle: 15,
            nested: !1,
            preventActionWhenRunning: !1,
            preventScrollOnTouch: !1,
            freezable: !0,
            onInit: !1,
            useLocalStorage: !0,
            textDirection: "ltr"
        }, L || {});
        var M = document,
        v = window,
        r = {
            ENTER: 13,
            SPACE: 32,
            LEFT: 37,
            RIGHT: 39
        },
        e = {},
        n = L.useLocalStorage;
        if (n) {
            var t = navigator.userAgent,
            i = new Date;
            try {
                (e = v.localStorage) ? (e.setItem(i, i), n = e.getItem(i) == i, e.removeItem(i)) : n = !1,
                n || (e = {})
            } catch (t) {
                n = !1
            }
            n && (e.tnsApp && e.tnsApp !== t && ["tC", "tPL", "tMQ", "tTf", "t3D", "tTDu", "tTDe", "tADu", "tADe", "tTE", "tAE"].forEach(function (t) {
                    e.removeItem(t)
                }), localStorage.tnsApp = t)
        }
        var m = e.tC ? checkStorageValue(e.tC) : setLocalStorage(e, "tC", function calc() {
            var t = document,
            e = getBody(),
            n = setFakeBody(e),
            i = t.createElement("div"),
            r = !1;
            e.appendChild(i);
            try {
                for (var a, o = "(10px * 10)", s = ["calc" + o, "-moz-calc" + o, "-webkit-calc" + o], l = 0; l < 3; l++)
                    if (a = s[l], i.style.width = a, 100 === i.offsetWidth) {
                        r = a.replace(o, "");
                        break
                    }
            } catch (t) {}
            return e.fake ? resetFakeBody(e, n) : i.remove(),
            r
        }
                (), n),
        b = e.tPL ? checkStorageValue(e.tPL) : setLocalStorage(e, "tPL", function percentageLayout() {
            var t,
            e = document,
            n = getBody(),
            i = setFakeBody(n),
            r = e.createElement("div"),
            a = e.createElement("div"),
            o = "";
            r.className = "tns-t-subp2",
            a.className = "tns-t-ct";
            for (var s = 0; s < 70; s++)
                o += "<div></div>";
            return a.innerHTML = o,
            r.appendChild(a),
            n.appendChild(r),
            t = Math.abs(r.getBoundingClientRect().left - a.children[67].getBoundingClientRect().left) < 2,
            n.fake ? resetFakeBody(n, i) : r.remove(),
            t
        }
                (), n),
        D = e.tMQ ? checkStorageValue(e.tMQ) : setLocalStorage(e, "tMQ", !0, n),
        a = e.tTf ? checkStorageValue(e.tTf) : setLocalStorage(e, "tTf", whichProperty("transform"), n),
        o = e.t3D ? checkStorageValue(e.t3D) : setLocalStorage(e, "t3D", function has3DTransforms(t) {
            if (!t)
                return !1;
            if (!window.getComputedStyle)
                return !1;
            var e,
            n = document,
            i = getBody(),
            r = setFakeBody(i),
            a = n.createElement("p"),
            o = 9 < t.length ? "-" + t.slice(0, -9).toLowerCase() + "-" : "";
            return o += "transform",
            i.insertBefore(a, null),
            a.style[t] = "translate3d(1px,1px,1px)",
            e = window.getComputedStyle(a).getPropertyValue(o),
            i.fake ? resetFakeBody(i, r) : a.remove(),
            void 0 !== e && 0 < e.length && "none" !== e
        }
                (a), n),
        y = e.tTDu ? checkStorageValue(e.tTDu) : setLocalStorage(e, "tTDu", whichProperty("transitionDuration"), n),
        s = e.tTDe ? checkStorageValue(e.tTDe) : setLocalStorage(e, "tTDe", whichProperty("transitionDelay"), n),
        w = e.tADu ? checkStorageValue(e.tADu) : setLocalStorage(e, "tADu", whichProperty("animationDuration"), n),
        l = e.tADe ? checkStorageValue(e.tADe) : setLocalStorage(e, "tADe", whichProperty("animationDelay"), n),
        u = e.tTE ? checkStorageValue(e.tTE) : setLocalStorage(e, "tTE", getEndProperty(y, "Transition"), n),
        c = e.tAE ? checkStorageValue(e.tAE) : setLocalStorage(e, "tAE", getEndProperty(w, "Animation"), n),
        d = v.console && "function" == typeof v.console.warn,
        f = ["container", "controlsContainer", "prevButton", "nextButton", "navContainer", "autoplayButton"],
        g = {};
        if (f.forEach(function (t) {
                if ("string" == typeof L[t]) {
                    var e = L[t],
                    n = M.querySelector(e);
                    if (g[t] = e, !n || !n.nodeName)
                        return void(d && console.warn("Can't find", L[t]));
                        L[t] = n
                    }
                }), !(L.container.children.length < 1)) {
                var I = L.responsive,
                _ = L.nested,
                P = "carousel" === L.mode;
                if (I) {
                    0 in I && (L = extend(L, I[0]), delete I[0]);
                    var h = {};
                    for (var p in I) {
                        var C = I[p];
                        C = "number" == typeof C ? {
                            items: C
                        }
                         : C,
                        h[p] = C
                    }
                    I = h,
                    h = null
                }
                if (P || !function updateOptions(t) {
                    for (var e in t)
                        P || ("slideBy" === e && (t[e] = "page"), "edgePadding" === e && (t[e] = !1), "autoHeight" === e && (t[e] = !1)) , "responsive" === e && updateOptions(t[e])
                    }
                        (L), !P) {
                        L.axis = "horizontal",
                        L.slideBy = "page",
                        L.edgePadding = !1;
                        var R = L.animateIn,
                        N = L.animateOut,
                        S = L.animateDelay,
                        B = L.animateNormal
                    }
                var E,
                W,
                H = "horizontal" === L.axis,
                x = M.createElement("div"),
                V = M.createElement("div"),
                F = L.container,
                T = F.parentNode,
                A = F.outerHTML,
                j = F.children,
                z = j.length,
                J = getWindowWidth(),
                G = !1;
                I && setBreakpointZone(),
                P && (F.className += " tns-vpfix");
                var O,
                k,
                U,
                X = L.autoWidth,
                q = getOption("fixedWidth"),
                K = getOption("edgePadding"),
                $ = getOption("gutter"),
                Z = getViewportWidth(),
                Y = getOption("center"),
                Q = X ? 1 : Math.floor(getOption("items")),
                tt = getOption("slideBy"),
                et = L.viewportMax || L.fixedWidthViewportWidth,
                nt = getOption("arrowKeys"),
                it = getOption("speed"),
                rt = L.rewind,
                at = !rt && L.loop,
                ot = getOption("autoHeight"),
                st = getOption("controls"),
                lt = getOption("controlsText"),
                ut = getOption("textDirection"),
                ct = getOption("nav"),
                dt = getOption("touch"),
                ft = getOption("mouseDrag"),
                gt = getOption("autoplay"),
                ht = getOption("autoplayTimeout"),
                pt = getOption("autoplayText"),
                vt = getOption("autoplayHoverPause"),
                mt = getOption("autoplayResetOnVisibility"),
                bt = function createStyleSheet(t) {
                    var e = document.createElement("style");
                    return t && e.setAttribute("media", t),
                    document.querySelector("head").appendChild(e),
                    e.sheet ? e.sheet : e.styleSheet
                }
                (),
                yt = L.lazyload,
                wt = (L.lazyloadSelector, []),
                Ct = at ? function getCloneCountForLoop() {
                    var t = function getItemsMax() { {
                            if (X || q && !et)
                                return z - 1;
                            var t = q ? "fixedWidth" : "items",
                            e = [];
                            if ((q || L[t] < z) && e.push(L[t]), I)
                                for (var n in I) {
                                    var i = I[n][t];
                                    i && (q || i < z) && e.push(i)
                                }
                            return e.length || e.push(0),
                            Math.ceil(q ? et / Math.min.apply(null, e) : Math.max.apply(null, e))
                        }
                    }
                    (),
                    e = P ? Math.ceil((5 * t - z) / 2) : 4 * t - z;
                    return e = Math.max(t, e),
                    hasOption("edgePadding") ? e + 1 : e
                }
                () : 0,
                St = P ? z + 2 * Ct : z + Ct,
                Et = !(!q && !X || at),
                xt = q ? getRightBoundary() : null,
                Tt = !P || !at,
                At = H ? "left" : "top",
                Ot = "",
                kt = "",
                Lt = q ? function () {
                    return Y && !at ? z - 1 : Math.ceil(-xt / (q + $))
                }
                 : X ? function () {
                    for (var t = St; t--; )
                        if (O[t] > -xt)
                            return t
                }
                 : function () {
                    return Y && P && !at ? z - 1 : at || P ? Math.max(0, St - Math.ceil(Q)) : St - 1
                },
                Mt = getStartIndex(getOption("startIndex")),
                Dt = Mt,
                It = (getCurrentSlide(), 0),
                _t = X ? null : Lt(),
                Pt = L.preventActionWhenRunning,
                Rt = L.swipeAngle,
                Nt = !Rt || "?",
                Bt = !1,
                Wt = L.onInit,
                Ht = new Events,
                Vt = " tns-slider tns-" + L.mode,
                Ft = F.id || function getSlideId() {
                    var t = window.tnsId;
                    return window.tnsId = t ? t + 1 : 1,
                    "tns" + window.tnsId
                }
                (),
                jt = getOption("disable"),
                zt = !1,
                Jt = L.freezable,
                Gt = !(!Jt || X) && getFreeze(),
                Ut = !1,
                Xt = {
                    touchstart: onControlsClick,
                    click: onControlsClick,
                    keydown: function onControlsKeydown(t) {
                        t = getEvent(t);
                        var e = [r.LEFT, r.RIGHT].indexOf(t.keyCode);
                        if (Bt && Pt)
                            return;
                        0 <= e && (0 === e ? pe.disabled || onControlsClick(t, -1) : ve.disabled || onControlsClick(t, 1))
                    }
                },
                qt = {
                    touchstart: onNavClick,
                    click: onNavClick,
                    keydown: function onNavKeydown(t) {
                        t = getEvent(t);
                        var e = M.activeElement;
                        if (!hasAttr(e, "data-nav"))
                            return;
                        var n = [r.LEFT, r.RIGHT, r.ENTER, r.SPACE].indexOf(t.keyCode),
                        i = Number(getAttr(e, "data-nav"));
                        0 <= n && (0 === n ? 0 < i && setFocus(ye[i - 1]) : 1 === n ? i < Se - 1 && setFocus(ye[i + 1]) : goTo(xe = i, t))
                    }
                },
                Kt = {
                    mouseover: function mouseoverPause() {
                        De && (stopAutoplayTimer(), Ie = !0)
                    },
                    mouseout: function mouseoutRestart() {
                        Ie && (setAutoplayTimer(), Ie = !1)
                    }
                },
                $t = {
                    visibilitychange: function onVisibilityChange() {
                        M.hidden ? De && (stopAutoplayTimer(), Pe = !0) : Pe && (setAutoplayTimer(), Pe = !1)
                    }
                },
                Zt = {
                    keydown: function onDocumentKeydown(t) {
                        t = getEvent(t);
                        var e = [r.LEFT, r.RIGHT].indexOf(t.keyCode);
                        0 <= e && onControlsClick(t, 0 === e ? -1 : 1)
                    }
                },
                Yt = {
                    touchstart: onPanStart,
                    touchmove: onPanMove,
                    touchend: onPanEnd,
                    touchcancel: onPanEnd
                },
                Qt = {
                    mousedown: onPanStart,
                    mousemove: onPanMove,
                    mouseup: onPanEnd,
                    mouseleave: onPanEnd
                },
                te = null,
                ee = hasOption("controls"),
                ne = hasOption("nav"),
                ie = !!X || L.navAsThumbnails,
                re = hasOption("autoplay"),
                ae = hasOption("touch"),
                oe = hasOption("mouseDrag"),
                se = "tns-slide-active",
                le = "tns-complete",
                ue = {
                    load: function onImgLoaded(t) {
                        imgLoaded(getTarget(t))
                    },
                    error: function onImgFailed(t) {
                        !function imgFailed(t) {
                            Ye(t, "failed"),
                            imgCompleted(t)
                        }
                        (getTarget(t))
                    }
                },
                ce = "force" === L.preventScrollOnTouch;
                if (ee)
                    var de, fe, ge = L.controlsContainer, he = L.controlsContainer ? L.controlsContainer.outerHTML : "", pe = L.prevButton, ve = L.nextButton, me = L.prevButton ? L.prevButton.outerHTML : "", be = L.nextButton ? L.nextButton.outerHTML : "";
                if (ne)
                    var ye, we = L.navContainer, Ce = L.navContainer ? L.navContainer.outerHTML : "", Se = X ? z : getPages(), Ee = 0, xe = -1, Te = getCurrentNavIndex(), Ae = Te, Oe = "tns-nav-active", ke = "Carousel Page ", Le = " (Current Slide)";
                if (re)
                    var Me, De, Ie, _e, Pe, Re = "forward" === L.autoplayDirection ? 1 : -1, Ne = L.autoplayButton, Be = L.autoplayButton ? L.autoplayButton.outerHTML : "", We = ["<span class='tns-visually-hidden'>", " animation</span>"];
                if (ae || oe)
                    var He, Ve, Fe = {},
                je = {},
                ze = !1,
                Je = H ? function (t, e) {
                    return t.x - e.x
                }
                 : function (t, e) {
                    return t.y - e.y
                };
                X || resetVariblesWhenDisable(jt || Gt),
                a && (At = a, Ot = "translate", kt = o ? (Ot += H ? "3d(" : "3d(0px, ", H ? ", 0px, 0px)" : ", 0px)") : (Ot += H ? "X(" : "Y(", ")")),
                P && (F.className = F.className.replace("tns-vpfix", "")),
                function initStructure() {
                    hasOption("gutter");
                    x.className = "tns-outer",
                    V.className = "tns-inner",
                    x.id = Ft + "-ow",
                    V.id = Ft + "-iw",
                    "" === F.id && (F.id = Ft);
                    Vt += b || X ? " tns-subpixel" : " tns-no-subpixel",
                    Vt += m ? " tns-calc" : " tns-no-calc",
                    X && (Vt += " tns-autowidth");
                    Vt += " tns-" + L.axis,
                    F.className += Vt,
                    P ? ((E = M.createElement("div")).id = Ft + "-mw", E.className = "tns-ovh", x.appendChild(E), E.appendChild(V)) : x.appendChild(V);
                    if (ot) {
                        (E || V).className += " tns-ah"
                    }
                    if (T.insertBefore(x, F), V.appendChild(F), forEach(j, function (t, e) {
                            Ye(t, "tns-item"),
                            t.id || (t.id = Ft + "-item" + e),
                            !P && B && Ye(t, B),
                            setAttrs(t, {
                                "aria-hidden": "true",
                                tabindex: "-1"
                            })
                        }), Ct) {
                        for (var t = M.createDocumentFragment(), e = M.createDocumentFragment(), n = Ct; n--; ) {
                            var i = n % z,
                            r = j[i].cloneNode(!0);
                            if (removeAttrs(r, "id"), e.insertBefore(r, e.firstChild), P) {
                                var a = j[z - 1 - i].cloneNode(!0);
                                removeAttrs(a, "id"),
                                t.appendChild(a)
                            }
                        }
                        F.insertBefore(t, F.firstChild),
                        F.appendChild(e),
                        j = F.children
                    }
                }
                (),
                function initSheet() {
                    if (!P)
                        for (var t = Mt, e = Mt + Math.min(z, Q); t < e; t++) {
                            var n = j[t];
                            n.style.left = 100 * (t - Mt) / Q + "%",
                            Ye(n, R),
                            Qe(n, B)
                        }
                    H && (b || X ? (addCSSRule(bt, "#" + Ft + " > .tns-item", "font-size:" + v.getComputedStyle(j[0]).fontSize + ";", getCssRulesLength(bt)), addCSSRule(bt, "#" + Ft, "font-size:0;", getCssRulesLength(bt))) : P && forEach(j, function (t, e) {
                            t.style.marginLeft = function getSlideMarginLeft(t) {
                                return m ? m + "(" + 100 * t + "% / " + St + ")" : 100 * t / St + "%"
                            }
                            (e)
                        }));
                    if (D) {
                        if (y) {
                            var i = E && L.autoHeight ? getTransitionDurationStyle(L.speed) : "";
                            addCSSRule(bt, "#" + Ft + "-mw", i, getCssRulesLength(bt))
                        }
                        i = getInnerWrapperStyles(L.edgePadding, L.gutter, L.fixedWidth, L.speed, L.autoHeight),
                        addCSSRule(bt, "#" + Ft + "-iw", i, getCssRulesLength(bt)),
                        P && (i = H && !X ? "width:" + getContainerWidth(L.fixedWidth, L.gutter, L.items) + ";" : "", y && (i += getTransitionDurationStyle(it)), addCSSRule(bt, "#" + Ft, i, getCssRulesLength(bt))),
                        i = H && !X ? getSlideWidthStyle(L.fixedWidth, L.gutter, L.items) : "",
                        L.gutter && (i += getSlideGutterStyle(L.gutter)),
                        P || (y && (i += getTransitionDurationStyle(it)), w && (i += getAnimationDurationStyle(it))),
                        i && addCSSRule(bt, "#" + Ft + " > .tns-item", i, getCssRulesLength(bt))
                    } else {
                        update_carousel_transition_duration(),
                        V.style.cssText = getInnerWrapperStyles(K, $, q, ot),
                        P && H && !X && (F.style.width = getContainerWidth(q, $, Q));
                        i = H && !X ? getSlideWidthStyle(q, $, Q) : "";
                        $ && (i += getSlideGutterStyle($)),
                        i && addCSSRule(bt, "#" + Ft + " > .tns-item", i, getCssRulesLength(bt))
                    }
                    if (I && D)
                        for (var r in I) {
                            r = parseInt(r);
                            var a = I[r],
                            o = (i = "", ""),
                            s = "",
                            l = "",
                            u = "",
                            c = X ? null : getOption("items", r),
                            d = getOption("fixedWidth", r),
                            f = getOption("speed", r),
                            g = getOption("edgePadding", r),
                            h = getOption("autoHeight", r),
                            p = getOption("gutter", r);
                            y && E && getOption("autoHeight", r) && "speed" in a && (o = "#" + Ft + "-mw{" + getTransitionDurationStyle(f) + "}"),
                            ("edgePadding" in a || "gutter" in a) && (s = "#" + Ft + "-iw{" + getInnerWrapperStyles(g, p, d, f, h) + "}"),
                            P && H && !X && ("fixedWidth" in a || "items" in a || q && "gutter" in a) && (l = "width:" + getContainerWidth(d, p, c) + ";"),
                            y && "speed" in a && (l += getTransitionDurationStyle(f)),
                            l = l && "#" + Ft + "{" + l + "}",
                            ("fixedWidth" in a || q && "gutter" in a || !P && "items" in a) && (u += getSlideWidthStyle(d, p, c)),
                            "gutter" in a && (u += getSlideGutterStyle(p)),
                            !P && "speed" in a && (y && (u += getTransitionDurationStyle(f)), w && (u += getAnimationDurationStyle(f))),
                            (i = o + s + l + (u = u && "#" + Ft + " > .tns-item{" + u + "}")) && bt.insertRule("@media (min-width: " + r / 16 + "em) {" + i + "}", bt.cssRules.length)
                        }
                }
                (),
                initSliderTransform();
                var Ge = at ? P ? function () {
                    var t = It,
                    e = _t;
                    t += tt,
                    e -= tt,
                    K ? (t += 1, e -= 1) : q && (Z + $) % (q + $) && (e -= 1),
                    Ct && (e < Mt ? Mt -= z : Mt < t && (Mt += z))
                }
                 : function () {
                    if (_t < Mt)
                        for (; It + z <= Mt; )
                            Mt -= z;
                    else if (Mt < It)
                        for (; Mt <= _t - z; )
                            Mt += z
                }
                 : function () {
                    Mt = Math.max(It, Math.min(_t, Mt))
                },
                Ue = P ? function () {
                    resetDuration(F, ""),
                    y || !it ? (doContainerTransform(), it && isVisible(F) ? (clearTimeout(te), te = setTimeout(onTransitionEnd, it + 100)) : onTransitionEnd()) : function jsTransform(t, e, n, i, r, a, o) {
                        var s = Math.min(a, 10),
                        l = 0 <= r.indexOf("%") ? "%" : "px",
                        u = (r = r.replace(l, ""), Number(t.style[e].replace(n, "").replace(i, "").replace(l, ""))),
                        c = (r - u) / a * s;
                        setTimeout(function moveElement() {
                            a -= s,
                            u += c,
                            t.style[e] = n + u + l + i,
                            0 < a ? setTimeout(moveElement, s) : o()
                        }, s)
                    }
                    (F, At, Ot, kt, getContainerTransformValue(), it, onTransitionEnd),
                    H || updateContentWrapperHeight()
                }
                 : function () {
                    wt = [];
                    var t = {};
                    t[u] = t[c] = onTransitionEnd,
                    removeEvents(j[Dt], t),
                    addEvents(j[Mt], t),
                    animateSlide(Dt, R, N, !0),
                    animateSlide(Mt, B, R),
                    u && c && it && isVisible(F) || onTransitionEnd()
                },
                Xe = "rtl" === ut ? -100 / St : -100,
                qe = "rtl" === ut ? 100 : 100 / St;
                return {
                    version: "2.9.1",
                    getInfo: info,
                    events: Ht,
                    goTo: goTo,
                    play: function play() {
                        gt && !De && (startAutoplay(), _e = !1)
                    },
                    pause: function pause() {
                        De && (stopAutoplay(), _e = !0)
                    },
                    isOn: G,
                    updateSliderHeight: updateInnerWrapperHeight,
                    refresh: initSliderTransform,
                    destroy: function destroy() {
                        if (bt.disabled = !0, bt.ownerNode && bt.ownerNode.remove(), removeEvents(v, {
                                resize: onResize
                            }), nt && removeEvents(M, Zt), ge && removeEvents(ge, Xt), we && removeEvents(we, qt), removeEvents(F, Kt), removeEvents(F, $t), Ne && removeEvents(Ne, {
                                click: toggleAutoplay
                            }), gt && clearInterval(Me), P && u) {
                            var t = {};
                            t[u] = onTransitionEnd,
                            removeEvents(F, t)
                        }
                        dt && removeEvents(F, Yt),
                        ft && removeEvents(F, Qt);
                        var a = [A, he, me, be, Ce, Be];
                        for (var e in f.forEach(function (t, e) {
                                var n = "container" === t ? x : L[t];
                                if ("object" == typeof n) {
                                    var i = !!n.previousElementSibling && n.previousElementSibling,
                                    r = n.parentNode;
                                    n.outerHTML = a[e],
                                    L[t] = i ? i.nextElementSibling : r.firstElementChild
                                }
                            }), f = R = N = S = B = H = x = V = F = T = A = j = z = W = J = X = q = K = $ = Z = Q = tt = et = nt = it = rt = at = ot = bt = yt = O = wt = Ct = St = Et = xt = Tt = At = Ot = kt = Lt = Mt = Dt = It = _t = Rt = Nt = Bt = Wt = Ht = Vt = Ft = jt = zt = Jt = Gt = Ut = Xt = qt = Kt = $t = Zt = Yt = Qt = ee = ne = ie = re = ae = oe = se = le = ue = k = st = lt = ge = he = pe = ve = de = fe = ct = we = Ce = ye = Se = Ee = xe = Te = Ae = Oe = ke = Le = gt = ht = Re = pt = vt = Ne = Be = mt = We = Me = De = Ie = _e = Pe = Fe = je = He = ze = Ve = Je = dt = ft = null, this)
                            "rebuild" !== e && (this[e] = null);
                        G = !1
                    },
                    rebuild: function () {
                        return tn(extend(L, g))
                    }
                }
            }
        function resetVariblesWhenDisable(t) {
            t && (st = ct = dt = ft = nt = gt = vt = mt = !1)
        }
        function getCurrentSlide() {
            for (var t = P ? Mt - Ct : Mt; t < 0; )
                t += z;
            return t % z + 1
        }
        function getStartIndex(t) {
            return t = t ? Math.max(0, Math.min(at ? z - 1 : z - Q, t)) : 0,
            P ? t + Ct : t
        }
        function getAbsIndex(t) {
            for (null == t && (t = Mt), P && (t -= Ct); t < 0; )
                t += z;
            return Math.floor(t % z)
        }
        function getCurrentNavIndex() {
            var t,
            e = getAbsIndex();
            return t = ie ? e : q || X ? Math.ceil((e + 1) * Se / z - 1) : Math.floor(e / Q),
            !at && P && Mt === _t && (t = Se - 1),
            t
        }
        function getWindowWidth() {
            return v.innerWidth || M.documentElement.clientWidth || M.body.clientWidth
        }
        function getInsertPosition(t) {
            return "top" === t ? "afterbegin" : "beforeend"
        }
        function getViewportWidth() {
            var t = K ? 2 * K - $ : 0;
            return function getClientWidth(t) {
                var e,
                n,
                i = M.createElement("div");
                return t.appendChild(i),
                n = (e = i.getBoundingClientRect()).right - e.left,
                i.remove(),
                n || getClientWidth(t.parentNode)
            }
            (T) - t
        }
        function hasOption(t) {
            if (L[t])
                return !0;
            if (I)
                for (var e in I)
                    if (I[e][t])
                        return !0;
            return !1
        }
        function getOption(t, e) {
            if (null == e && (e = J), "items" === t && q)
                return Math.floor((Z + $) / (q + $)) || 1;
            var n = L[t];
            if (I)
                for (var i in I)
                    e >= parseInt(i) && t in I[i] && (n = I[i][t]);
            return "slideBy" === t && "page" === n && (n = getOption("items")),
            P || "slideBy" !== t && "items" !== t || (n = Math.floor(n)),
            n
        }
        function getInnerWrapperStyles(t, e, n, i, r) {
            var a = "";
            if (void 0 !== t) {
                var o = t;
                e && (o -= e),
                a = H ? "margin: 0 " + o + "px 0 " + t + "px;" : "margin: " + t + "px 0 " + o + "px 0;"
            } else if (e && !n) {
                var s = "-" + e + "px";
                a = "margin: 0 " + (H ? s + " 0 0" : "0 " + s + " 0") + ";"
            }
            return !P && r && y && i && (a += getTransitionDurationStyle(i)),
            a
        }
        function getContainerWidth(t, e, n) {
            return t ? (t + e) * St + "px" : m ? m + "(" + 100 * St + "% / " + n + ")" : 100 * St / n + "%"
        }
        function getSlideWidthStyle(t, e, n) {
            var i;
            if (t)
                i = t + e + "px";
            else {
                P || (n = Math.floor(n));
                var r = P ? St : n;
                i = m ? m + "(100% / " + r + ")" : 100 / r + "%"
            }
            return i = "width:" + i,
            "inner" !== _ ? i + ";" : i + " !important;"
        }
        function getSlideGutterStyle(t) {
            var e = "";
            !1 !== t && (e = (H ? "padding-" : "margin-") + (H ? "right" : "bottom") + ": " + t + "px;");
            return e
        }
        function getCSSPrefix(t, e) {
            var n = t.substring(0, t.length - e).toLowerCase();
            return n = n && "-" + n + "-"
        }
        function getTransitionDurationStyle(t) {
            return getCSSPrefix(y, 18) + "transition-duration:" + t / 1e3 + "s;"
        }
        function getAnimationDurationStyle(t) {
            return getCSSPrefix(w, 17) + "animation-duration:" + t / 1e3 + "s;"
        }
        function initSliderTransform() {
            if (hasOption("autoHeight") || X || !H) {
                var t = F.querySelectorAll("img");
                forEach(t, function (t) {
                    var e = t.src;
                    e && e.indexOf("data:image") < 0 ? (addEvents(t, ue), t.src = "", t.src = e, Ye(t, "loading")) : yt || imgLoaded(t)
                }),
                Ke(function () {
                    imgsLoadedCheck(arrayFromNodeList(t), function () {
                        k = !0
                    })
                }),
                !X && H && (t = getImageArray(Mt, Math.min(Mt + Q - 1, St - 1))),
                yt ? initSliderTransformStyleCheck() : Ke(function () {
                    imgsLoadedCheck(arrayFromNodeList(t), initSliderTransformStyleCheck)
                })
            } else
                P && doContainerTransformSilent(), initTools(), initEvents()
        }
        function initSliderTransformStyleCheck() {
            if (X) {
                var t = at ? Mt : z - 1;
                !function stylesApplicationCheck() {
                    j[t - 1].getBoundingClientRect().right.toFixed(2) === j[t].getBoundingClientRect().left.toFixed(2) ? initSliderTransformCore() : setTimeout(function () {
                        stylesApplicationCheck()
                    }, 16)
                }
                ()
            } else
                initSliderTransformCore()
        }
        function initSliderTransformCore() {
            H && !X || (setSlidePositions(), X ? (xt = getRightBoundary(), Jt && (Gt = getFreeze()), _t = Lt(), resetVariblesWhenDisable(jt || Gt)) : updateContentWrapperHeight()),
            P && doContainerTransformSilent(),
            initTools(),
            initEvents()
        }
        function initTools() {
            if (updateSlideStatus(), x.insertAdjacentHTML("afterbegin", '<div class="tns-liveregion tns-visually-hidden" aria-live="polite" aria-atomic="true">slide <span class="current">' + getLiveRegionStr() + "</span>  of " + z + "</div>"), U = x.querySelector(".tns-liveregion .current"), re) {
                var t = gt ? "stop" : "start";
                Ne ? setAttrs(Ne, {
                    "data-action": t
                }) : L.autoplayButtonOutput && (x.insertAdjacentHTML(getInsertPosition(L.autoplayPosition), '<button data-action="' + t + '">' + We[0] + t + We[1] + pt[0] + "</button>"), Ne = x.querySelector("[data-action]")),
                Ne && addEvents(Ne, {
                    click: toggleAutoplay
                }),
                gt && (startAutoplay(), vt && addEvents(F, Kt), mt && addEvents(F, $t))
            }
            if (ne) {
                if (we)
                    setAttrs(we, {
                        "aria-label": "Carousel Pagination"
                    }), forEach(ye = we.children, function (t, e) {
                        setAttrs(t, {
                            "data-nav": e,
                            tabindex: "-1",
                            "aria-label": ke + (e + 1),
                            "aria-controls": Ft
                        })
                    });
                else {
                    for (var e = "", n = ie ? "" : 'style="display:none"', i = 0; i < z; i++)
                        e += '<button data-nav="' + i + '" tabindex="-1" aria-controls="' + Ft + '" ' + n + ' aria-label="' + ke + (i + 1) + '"></button>';
                    e = '<div class="tns-nav" aria-label="Carousel Pagination">' + e + "</div>",
                    x.insertAdjacentHTML(getInsertPosition(L.navPosition), e),
                    we = x.querySelector(".tns-nav"),
                    ye = we.children
                }
                if (updateNavVisibility(), y) {
                    var r = y.substring(0, y.length - 18).toLowerCase(),
                    a = "transition: all " + it / 1e3 + "s";
                    r && (a = "-" + r + "-" + a),
                    addCSSRule(bt, "[aria-controls^=" + Ft + "-item]", a, getCssRulesLength(bt))
                }
                setAttrs(ye[Te], {
                    "aria-label": ke + (Te + 1) + Le
                }),
                removeAttrs(ye[Te], "tabindex"),
                Ye(ye[Te], Oe),
                addEvents(we, qt)
            }
            ee && (ge || pe && ve || (x.insertAdjacentHTML(getInsertPosition(L.controlsPosition), '<div class="tns-controls" aria-label="Carousel Navigation" tabindex="0"><button data-controls="prev" tabindex="-1" aria-controls="' + Ft + '">' + lt[0] + '</button><button data-controls="next" tabindex="-1" aria-controls="' + Ft + '">' + lt[1] + "</button></div>"), ge = x.querySelector(".tns-controls")), pe && ve || (pe = ge.children[0], ve = ge.children[1]), L.controlsContainer && setAttrs(ge, {
                    "aria-label": "Carousel Navigation",
                    tabindex: "0"
                }), (L.controlsContainer || L.prevButton && L.nextButton) && setAttrs([pe, ve], {
                    "aria-controls": Ft,
                    tabindex: "-1"
                }), (L.controlsContainer || L.prevButton && L.nextButton) && (setAttrs(pe, {
                        "data-controls": "prev"
                    }), setAttrs(ve, {
                        "data-controls": "next"
                    })), de = isButton(pe), fe = isButton(ve), updateControlsStatus(), ge ? addEvents(ge, Xt) : (addEvents(pe, Xt), addEvents(ve, Xt))),
            disableUI()
        }
        function initEvents() {
            if (P && u) {
                var t = {};
                t[u] = onTransitionEnd,
                addEvents(F, t)
            }
            dt && addEvents(F, Yt, L.preventScrollOnTouch),
            ft && addEvents(F, Qt),
            nt && addEvents(M, Zt),
            "inner" === _ ? Ht.on("outerResized", function () {
                resizeTasks(),
                Ht.emit("innerLoaded", info())
            }) : (I || q || X || ot || !H) && addEvents(v, {
                resize: onResize
            }),
            ot && ("outer" === _ ? Ht.on("innerLoaded", doAutoHeight) : jt || doAutoHeight()),
            doLazyLoad(),
            jt ? disableSlider() : Gt && freezeSlider(),
            Ht.on("indexChanged", additionalUpdates),
            "inner" === _ && Ht.emit("innerLoaded", info()),
            "function" == typeof Wt && Wt(info()),
            G = !0
        }
        function onResize(t) {
            Ke(function () {
                resizeTasks(getEvent(t))
            })
        }
        function resizeTasks(t) {
            if (G) {
                "outer" === _ && Ht.emit("outerResized", info(t)),
                J = getWindowWidth();
                var e,
                n = W,
                i = !1;
                I && (setBreakpointZone(), (e = n !== W) && Ht.emit("newBreakpointStart", info(t)));
                var r,
                a,
                o = Q,
                s = jt,
                l = Gt,
                u = nt,
                c = st,
                d = ct,
                f = dt,
                g = ft,
                h = gt,
                p = vt,
                v = mt,
                m = Mt;
                if (e) {
                    var b = q,
                    y = ot,
                    w = lt,
                    C = Y,
                    S = pt;
                    if (!D)
                        var E = $, x = K
                }
                if (nt = getOption("arrowKeys"), st = getOption("controls"), ct = getOption("nav"), dt = getOption("touch"), Y = getOption("center"), ft = getOption("mouseDrag"), gt = getOption("autoplay"), vt = getOption("autoplayHoverPause"), mt = getOption("autoplayResetOnVisibility"), e && (jt = getOption("disable"), q = getOption("fixedWidth"), it = getOption("speed"), ot = getOption("autoHeight"), lt = getOption("controlsText"), pt = getOption("autoplayText"), ht = getOption("autoplayTimeout"), D || (K = getOption("edgePadding"), $ = getOption("gutter"))), resetVariblesWhenDisable(jt), Z = getViewportWidth(), H && !X || jt || (setSlidePositions(), H || (updateContentWrapperHeight(), i = !0)), (q || X) && (xt = getRightBoundary(), _t = Lt()), (e || q) && (Q = getOption("items"), tt = getOption("slideBy"), (a = Q !== o) && (q || X || (_t = Lt()), Ge())), e && jt !== s && (jt ? disableSlider() : function enableSlider() {
                        if (!zt)
                            return;
                        if (bt.disabled = !1, F.className += Vt, doContainerTransformSilent(), at)
                            for (var t = Ct; t--; )
                                P && showElement(j[t]) , showElement(j[St - t - 1]);
                            if (!P)
                                for (var e = Mt, n = Mt + z; e < n; e++) {
                                    var i = j[e],
                                    r = e < Mt + Q ? R : B;
                                    i.style.left = 100 * (e - Mt) / Q + "%",
                                    Ye(i, r)
                                }
                            enableUI(),
                            zt = !1
                        }
                            ()), Jt && (e || q || X) && (Gt = getFreeze()) !== l && (Gt ? (doContainerTransform(getContainerTransformValue(getStartIndex(0))), freezeSlider()) : (function unfreezeSlider() {
                                if (!Ut)
                                    return;
                                K && D && (V.style.margin = "");
                                if (Ct)
                                    for (var t = "tns-transparent", e = Ct; e--; )
                                        P && Qe(j[e], t), Qe(j[St - e - 1], t);
                                enableUI(),
                                Ut = !1
                            }
                                (), i = !0)), resetVariblesWhenDisable(jt || Gt), gt || (vt = mt = !1), nt !== u && (nt ? addEvents(M, Zt) : removeEvents(M, Zt)), st !== c && (st ? ge ? showElement(ge) : (pe && showElement(pe), ve && showElement(ve)) : ge ? hideElement(ge) : (pe && hideElement(pe), ve && hideElement(ve))), ct !== d && (ct ? showElement(we) : hideElement(we)), dt !== f && (dt ? addEvents(F, Yt, L.preventScrollOnTouch) : removeEvents(F, Yt)), ft !== g && (ft ? addEvents(F, Qt) : removeEvents(F, Qt)), gt !== h && (gt ? (Ne && showElement(Ne), De || _e || startAutoplay()) : (Ne && hideElement(Ne), De && stopAutoplay())), vt !== p && (vt ? addEvents(F, Kt) : removeEvents(F, Kt)), mt !== v && (mt ? addEvents(M, $t) : removeEvents(M, $t)), e) {
                        if (q === b && Y === C || (i = !0), ot !== y && (ot || (V.style.height = "")), st && lt !== w && (pe.innerHTML = lt[0], ve.innerHTML = lt[1]), Ne && pt !== S) {
                            var T = gt ? 1 : 0,
                            A = Ne.innerHTML,
                            O = A.length - S[T].length;
                            A.substring(O) === S[T] && (Ne.innerHTML = A.substring(0, O) + pt[T])
                        }
                    }
                else
                    Y && (q || X) && (i = !0);
                if ((a || q && !X) && (Se = getPages(), updateNavVisibility()), (r = Mt !== m) ? (Ht.emit("indexChanged", info()), i = !0) : a ? r || additionalUpdates() : (q || X) && (doLazyLoad(), updateSlideStatus(), updateLiveRegion()), !a && P || function updateGallerySlidePositions() {
                    for (var t = Mt + Math.min(z, Q), e = St; e--; ) {
                        var n = j[e];
                        Mt <= e && e < t ? (Ye(n, "tns-moving"), n.style.left = 100 * (e - Mt) / Q + "%", Ye(n, R), Qe(n, B)) : n.style.left && (n.style.left = "", Ye(n, B), Qe(n, R)),
                        Qe(n, N)
                    }
                    setTimeout(function () {
                        forEach(j, function (t) {
                            Qe(t, "tns-moving")
                        })
                    }, 300)
                }
                    (), !jt && !Gt) {
                    if (e && !D && (ot === autoheightTem && it === speedTem || update_carousel_transition_duration(), K === x && $ === E || (V.style.cssText = getInnerWrapperStyles(K, $, q, it, ot)), H)) {
                        P && (F.style.width = getContainerWidth(q, $, Q));
                        var k = getSlideWidthStyle(q, $, Q) + getSlideGutterStyle($);
                        !function removeCSSRule(t, e) {
                            "deleteRule" in t ? t.deleteRule(e) : t.removeRule(e)
                        }
                        (bt, getCssRulesLength(bt) - 1),
                        addCSSRule(bt, "#" + Ft + " > .tns-item", k, getCssRulesLength(bt))
                    }
                    ot && doAutoHeight(),
                    i && (doContainerTransformSilent(), Dt = Mt)
                }
                e && Ht.emit("newBreakpointEnd", info(t))
            }
        }
        function getFreeze() {
            if (!q && !X)
                return z <= (Y ? Q - (Q - 1) / 2 : Q);
            var t = q ? (q + $) * z : O[z],
            e = K ? Z + 2 * K : Z + $;
            return Y && (e -= q ? (Z - q) / 2 : (Z - (O[Mt + 1] - O[Mt] - $)) / 2),
            t <= e
        }
        function setBreakpointZone() {
            for (var t in W = 0, I)
                (t = parseInt(t)) <= J && (W = t)
        }
        function disableUI() {
            !gt && Ne && hideElement(Ne),
            !ct && we && hideElement(we),
            st || (ge ? hideElement(ge) : (pe && hideElement(pe), ve && hideElement(ve)))
        }
        function enableUI() {
            gt && Ne && showElement(Ne),
            ct && we && showElement(we),
            st && (ge ? showElement(ge) : (pe && showElement(pe), ve && showElement(ve)))
        }
        function freezeSlider() {
            if (!Ut) {
                if (K && (V.style.margin = "0px"), Ct)
                    for (var t = "tns-transparent", e = Ct; e--; )
                        P && Ye(j[e], t), Ye(j[St - e - 1], t);
                disableUI(),
                Ut = !0
            }
        }
        function disableSlider() {
            if (!zt) {
                if (bt.disabled = !0, F.className = F.className.replace(Vt.substring(1), ""), removeAttrs(F, ["style"]), at)
                    for (var t = Ct; t--; )
                        P && hideElement(j[t]), hideElement(j[St - t - 1]);
                if (H && P || removeAttrs(V, ["style"]), !P)
                    for (var e = Mt, n = Mt + z; e < n; e++) {
                        var i = j[e];
                        removeAttrs(i, ["style"]),
                        Qe(i, R),
                        Qe(i, B)
                    }
                disableUI(),
                zt = !0
            }
        }
        function updateLiveRegion() {
            var t = getLiveRegionStr();
            U.innerHTML !== t && (U.innerHTML = t)
        }
        function getLiveRegionStr() {
            var t = getVisibleSlideRange(),
            e = t[0] + 1,
            n = t[1] + 1;
            return e === n ? e + "" : e + " to " + n
        }
        function getVisibleSlideRange(t) {
            null == t && (t = getContainerTransformValue());
            var n,
            i,
            r,
            a = Mt;
            if (Y || K ? (X || q) && (i =  - (parseFloat(t) + K), r = i + Z + 2 * K) : X && (i = O[Mt], r = i + Z), X)
                O.forEach(function (t, e) {
                    e < St && ((Y || K) && t <= i + .5 && (a = e), .5 <= r - t && (n = e))
                });
            else {
                if (q) {
                    var e = q + $;
                    n = Y || K ? (a = Math.floor(i / e), Math.ceil(r / e - 1)) : a + Math.ceil(Z / e) - 1
                } else if (Y || K) {
                    var o = Q - 1;
                    if (n = Y ? (a -= o / 2, Mt + o / 2) : Mt + o, K) {
                        var s = K * Q / Z;
                        a -= s,
                        n += s
                    }
                    a = Math.floor(a),
                    n = Math.ceil(n)
                } else
                    n = a + Q - 1;
                a = Math.max(a, 0),
                n = Math.min(n, St - 1)
            }
            return [a, n]
        }
        function doLazyLoad() {
            yt && !jt && getImageArray.apply(null, getVisibleSlideRange()).forEach(function (t) {
                if (!Ze(t, le)) {
                    var e = {};
                    e[u] = function (t) {
                        t.stopPropagation()
                    },
                    addEvents(t, e),
                    addEvents(t, ue),
                    t.src = getAttr(t, "data-src");
                    var n = getAttr(t, "data-srcset");
                    n && (t.srcset = n),
                    Ye(t, "loading")
                }
            })
        }
        function imgLoaded(t) {
            Ye(t, "loaded"),
            imgCompleted(t)
        }
        function imgCompleted(t) {
            Ye(t, "tns-complete"),
            Qe(t, "loading"),
            removeEvents(t, ue)
        }
        function getImageArray(t, e) {
            for (var n = []; t <= e; )
                forEach(j[t].querySelectorAll("img"), function (t) {
                    n.push(t)
                }), t++;
            return n
        }
        function doAutoHeight() {
            var t = getImageArray.apply(null, getVisibleSlideRange());
            Ke(function () {
                imgsLoadedCheck(t, updateInnerWrapperHeight)
            })
        }
        function imgsLoadedCheck(n, t) {
            return k ? t() : (n.forEach(function (t, e) {
                    Ze(t, le) && n.splice(e, 1)
                }), n.length ? void Ke(function () {
                    imgsLoadedCheck(n, t)
                }) : t())
        }
        function additionalUpdates() {
            doLazyLoad(),
            updateSlideStatus(),
            updateLiveRegion(),
            updateControlsStatus(),
            function updateNavStatus() {
                if (ct && (Te = 0 <= xe ? xe : getCurrentNavIndex(), xe = -1, Te !== Ae)) {
                    var t = ye[Ae],
                    e = ye[Te];
                    setAttrs(t, {
                        tabindex: "-1",
                        "aria-label": ke + (Ae + 1)
                    }),
                    Qe(t, Oe),
                    setAttrs(e, {
                        "aria-label": ke + (Te + 1) + Le
                    }),
                    removeAttrs(e, "tabindex"),
                    Ye(e, Oe),
                    Ae = Te
                }
            }
            ()
        }
        function update_carousel_transition_duration() {
            P && ot && (E.style[y] = it / 1e3 + "s")
        }
        function getMaxSlideHeight(t, e) {
            for (var n = [], i = t, r = Math.min(t + e, St); i < r; i++)
                n.push(j[i].offsetHeight);
            return Math.max.apply(null, n)
        }
        function updateInnerWrapperHeight() {
            var t = ot ? getMaxSlideHeight(Mt, Q) : getMaxSlideHeight(Ct, z),
            e = E || V;
            e.style.height !== t && (e.style.height = t + "px")
        }
        function setSlidePositions() {
            O = [0];
            var n = H ? "left" : "top",
            i = H ? "right" : "bottom",
            r = j[0].getBoundingClientRect()[n];
            forEach(j, function (t, e) {
                e && O.push(t.getBoundingClientRect()[n] - r),
                e === St - 1 && O.push(t.getBoundingClientRect()[i] - r)
            })
        }
        function updateSlideStatus() {
            var t = getVisibleSlideRange(),
            n = t[0],
            i = t[1];
            forEach(j, function (t, e) {
                n <= e && e <= i ? hasAttr(t, "aria-hidden") && (removeAttrs(t, ["aria-hidden", "tabindex"]), Ye(t, se)) : hasAttr(t, "aria-hidden") || (setAttrs(t, {
                        "aria-hidden": "true",
                        tabindex: "-1"
                    }), Qe(t, se))
            })
        }
        function getLowerCaseNodeName(t) {
            return t.nodeName.toLowerCase()
        }
        function isButton(t) {
            return "button" === getLowerCaseNodeName(t)
        }
        function isAriaDisabled(t) {
            return "true" === t.getAttribute("aria-disabled")
        }
        function disEnableElement(t, e, n) {
            t ? e.disabled = n : e.setAttribute("aria-disabled", n.toString())
        }
        function updateControlsStatus() {
            if (st && !rt && !at) {
                var t = de ? pe.disabled : isAriaDisabled(pe),
                e = fe ? ve.disabled : isAriaDisabled(ve),
                n = Mt <= It,
                i = !rt && _t <= Mt;
                n && !t && disEnableElement(de, pe, !0),
                !n && t && disEnableElement(de, pe, !1),
                i && !e && disEnableElement(fe, ve, !0),
                !i && e && disEnableElement(fe, ve, !1)
            }
        }
        function resetDuration(t, e) {
            y && (t.style[y] = e)
        }
        function getCenterGap(t) {
            return null == t && (t = Mt),
            X ? (Z - (K ? $ : 0) - (O[t + 1] - O[t] - $)) / 2 : q ? (Z - q) / 2 : (Q - 1) / 2
        }
        function getRightBoundary() {
            var t = Z + (K ? $ : 0) - function getSliderWidth() {
                return q ? (q + $) * St : O[St]
            }
            ();
            return Y && !at && (t = q ?  - (q + $) * (St - 1) - getCenterGap() : getCenterGap(St - 1) - O[St - 1]),
            0 < t && (t = 0),
            t
        }
        function getContainerTransformValue(t) {
            var e;
            if (null == t && (t = Mt), H && !X)
                if (q)
                    e =  - (q + $) * t, Y && (e += getCenterGap());
                else {
                    var n = a ? St : Q;
                    Y && (t -= getCenterGap()),
                    e = 100 * -t / n
                }
            else
                e = -O[t], Y && X && (e += getCenterGap());
            return Et && (e = Math.max(e, xt)),
            e += !H || X || q ? "px" : "%"
        }
        function doContainerTransformSilent(t) {
            resetDuration(F, "0s"),
            doContainerTransform(t)
        }
        function doContainerTransform(t) {
            null == t && (t = getContainerTransformValue()),
            "rtl" === ut && "-" === t.charAt(0) && (t = t.substr(1)),
            F.style[At] = Ot + t + kt
        }
        function animateSlide(t, e, n, i) {
            var r = t + Q;
            at || (r = Math.min(r, St));
            for (var a = t; a < r; a++) {
                var o = j[a];
                i || (o.style.left = 100 * (a - Mt) / Q + "%"),
                S && s && (o.style[s] = o.style[l] = S * (a - t) / 1e3 + "s"),
                Qe(o, e),
                Ye(o, n),
                i && wt.push(o)
            }
        }
        function render(t, e) {
            Tt && Ge(),
            Mt === Dt && !e || (Ht.emit("indexChanged", info()), Ht.emit("transitionStart", info()), ot && doAutoHeight(), De && t && 0 <= ["click", "keydown"].indexOf(t.type) && stopAutoplay(), Bt = !0, Ue())
        }
        function strTrans(t) {
            return t.toLowerCase().replace(/-/g, "")
        }
        function onTransitionEnd(t) {
            if (clearTimeout(te), te = null, P || Bt) {
                if (Ht.emit("transitionEnd", info(t)), !P && 0 < wt.length)
                    for (var e = 0; e < wt.length; e++) {
                        var n = wt[e];
                        n.style.left = "",
                        l && s && (n.style[l] = "", n.style[s] = ""),
                        Qe(n, N),
                        Ye(n, B)
                    }
                if (!t || !P && t.target.parentNode === F || t.target === F && strTrans(t.propertyName) === strTrans(At)) {
                    if (!Tt) {
                        var i = Mt;
                        Ge(),
                        Mt !== i && (Ht.emit("indexChanged", info()), doContainerTransformSilent())
                    }
                    "inner" === _ && Ht.emit("innerLoaded", info()),
                    Dt = Mt
                }
                Bt = !1
            }
        }
        function goTo(t, e) {
            if (!Gt)
                if ("prev" === t)
                    onControlsClick(e, -1);
                else if ("next" === t)
                    onControlsClick(e, 1);
                else {
                    if (Bt) {
                        if (Pt)
                            return;
                        onTransitionEnd()
                    }
                    var n = getAbsIndex(),
                    i = 0;
                    if ("first" === t ? i = -n : "last" === t ? i = P ? z - Q - n : z - 1 - n : ("number" != typeof t && (t = parseInt(t)), isNaN(t) || (e || (t = Math.max(0, Math.min(z - 1, t))), i = t - n)), !P && i && Math.abs(i) < Q) {
                        var r = 0 < i ? 1 : -1;
                        i += It <= Mt + i - z ? z * r : 2 * z * r * -1
                    }
                    Mt += i,
                    P && at && (Mt < It && (Mt += z), _t < Mt && (Mt -= z)),
                    getAbsIndex(Mt) !== getAbsIndex(Dt) && render(e)
                }
        }
        function onControlsClick(t, e) {
            if (Bt) {
                if (Pt)
                    return;
                onTransitionEnd()
            }
            var n;
            if (!e) {
                for (var i = getTarget(t = getEvent(t)); i !== ge && [pe, ve].indexOf(i) < 0; )
                    i = i.parentNode;
                var r = [pe, ve].indexOf(i);
                0 <= r && (n = !0, e = 0 === r ? -1 : 1)
            }
            if (rt) {
                if (Mt === It && -1 === e)
                    return void goTo("last", t);
                if (Mt === _t && 1 === e)
                    return void goTo("first", t)
            }
            e && (Mt += tt * e, X && (Mt = Math.floor(Mt)), render(n || t && "keydown" === t.type ? t : null))
        }
        function onNavClick(t) {
            if (Bt) {
                if (Pt)
                    return;
                onTransitionEnd()
            }
            for (var e = getTarget(t = getEvent(t)); e !== we && !hasAttr(e, "data-nav"); )
                e = e.parentNode;
            if (hasAttr(e, "data-nav")) {
                var n = xe = Number(getAttr(e, "data-nav")),
                i = q || X ? n * z / Se : n * Q;
                goTo(ie ? n : Math.min(Math.ceil(i), z - 1), t),
                Te === n && (De && stopAutoplay(), xe = -1)
            }
        }
        function setAutoplayTimer() {
            Me = setInterval(function () {
                onControlsClick(null, Re)
            }, ht),
            De = !0
        }
        function stopAutoplayTimer() {
            clearInterval(Me),
            De = !1
        }
        function updateAutoplayButton(t, e) {
            setAttrs(Ne, {
                "data-action": t
            }),
            Ne.innerHTML = We[0] + t + We[1] + e
        }
        function startAutoplay() {
            setAutoplayTimer(),
            Ne && updateAutoplayButton("stop", pt[1])
        }
        function stopAutoplay() {
            stopAutoplayTimer(),
            Ne && updateAutoplayButton("start", pt[0])
        }
        function toggleAutoplay() {
            _e = De ? (stopAutoplay(), !0) : (startAutoplay(), !1)
        }
        function setFocus(t) {
            t.focus()
        }
        function getEvent(t) {
            return isTouchEvent(t = t || v.event) ? t.changedTouches[0] : t
        }
        function getTarget(t) {
            return t.target || v.event.srcElement
        }
        function isTouchEvent(t) {
            return 0 <= t.type.indexOf("touch")
        }
        function preventDefaultBehavior(t) {
            t.preventDefault ? t.preventDefault() : t.returnValue = !1
        }
        function getMoveDirectionExpected() {
            return function getTouchDirection(t, e) {
                var n = !1,
                i = Math.abs(90 - Math.abs(t));
                return 90 - e <= i ? n = "horizontal" : i <= e && (n = "vertical"),
                n
            }
            (function toDegree(t, e) {
                return Math.atan2(t, e) * (180 / Math.PI)
            }
                (je.y - Fe.y, je.x - Fe.x), Rt) === L.axis
        }
        function onPanStart(t) {
            if (Bt) {
                if (Pt)
                    return;
                onTransitionEnd()
            }
            gt && De && stopAutoplayTimer(),
            ze = !0,
            Ve && ($e(Ve), Ve = null);
            var e = getEvent(t);
            Ht.emit(isTouchEvent(t) ? "touchStart" : "dragStart", info(t)),
            !isTouchEvent(t) && 0 <= ["img", "a"].indexOf(getLowerCaseNodeName(getTarget(t))) && preventDefaultBehavior(t),
            je.x = Fe.x = e.clientX,
            je.y = Fe.y = e.clientY,
            P && (He = parseFloat(F.style[At].replace(Ot, "")), resetDuration(F, "0s"))
        }
        function onPanMove(t) {
            if (ze) {
                var e = getEvent(t);
                je.x = e.clientX,
                je.y = e.clientY,
                P ? Ve = Ve || Ke(function () {
                    !function panUpdate(t) {
                        if (!Nt)
                            return void(ze = !1);
                        $e(Ve);
                        ze && (Ve = Ke(function () {
                                panUpdate(t)
                            }));
                        "?" === Nt && (Nt = getMoveDirectionExpected());
                        if (Nt) {
                            !ce && isTouchEvent(t) && (ce = !0);
                            try {
                                t.type && Ht.emit(isTouchEvent(t) ? "touchMove" : "dragMove", info(t))
                            } catch (t) {}
                            var e = !1,
                            n = He,
                            i = Je(je, Fe);
                            if (!H || q || X)
                                n += i, n += "px";
                            else {
                                var r = a ? i * Q * 100 / ((Z + $) * St) : 100 * i / (Z + $);
                                n = Math.max(Xe, Math.min(n + r, qe)),
                                e = n === Xe || n === qe,
                                n += "%"
                            }
                            F.style[At] = Ot + n + kt,
                            e && onPanEnd(t)
                        }
                    }
                    (t)
                }) : ("?" === Nt && (Nt = getMoveDirectionExpected()), Nt && (ce = !0)),
                ce && t.preventDefault()
            }
        }
        function onPanEnd(i) {
            if (ze) {
                Ve && ($e(Ve), Ve = null),
                P && resetDuration(F, ""),
                ze = !1;
                var t = getEvent(i);
                je.x = t.clientX,
                je.y = t.clientY;
                var r = Je(je, Fe);
                if (Math.abs(r)) {
                    if (!isTouchEvent(i)) {
                        var e = getTarget(i);
                        addEvents(e, {
                            click: function preventClick(t) {
                                preventDefaultBehavior(t),
                                removeEvents(e, {
                                    click: preventClick
                                })
                            }
                        })
                    }
                    P ? Ve = Ke(function () {
                        if (H && !X) {
                            var t = -r * Q / (Z + $);
                            t = 0 < r ? Math.floor(t) : Math.ceil(t),
                            10 <= Math.abs(r) && ("rtl" === ut ? Mt -= t : Mt += t)
                        } else {
                            var e =  - (He + r);
                            if (e <= 0)
                                Mt = It;
                            else if (e >= O[St - 1])
                                Mt = _t;
                            else
                                for (var n = 0; n < St && e >= O[n]; )
                                    e > O[Mt = n] && r < 0 && (Mt += 1), n++
                        }
                        render(i, r),
                        Ht.emit(isTouchEvent(i) ? "touchEnd" : "dragEnd", info(i))
                    }) : Nt && onControlsClick(i, 0 < r ? -1 : 1)
                }
            }
            "auto" === L.preventScrollOnTouch && (ce = !1),
            Rt && (Nt = "?"),
            gt && !De && setAutoplayTimer()
        }
        function updateContentWrapperHeight() {
            (E || V).style.height = O[Mt + Q] - O[Mt] + "px"
        }
        function getPages() {
            var t = q ? (q + $) * z / Z : z / Q;
            return Math.min(Math.ceil(t), z)
        }
        function updateNavVisibility() {
            if (ct && !ie && Se !== Ee) {
                var t = Ee,
                e = Se,
                n = showElement;
                for (Se < Ee && (t = Se, e = Ee, n = hideElement); t < e; )
                    n(ye[t]), t++;
                Ee = Se
            }
        }
        function info(t) {
            return {
                container: F,
                slideItems: j,
                navContainer: we,
                navItems: ye,
                controlsContainer: ge,
                hasControls: ee,
                prevButton: pe,
                nextButton: ve,
                items: Q,
                slideBy: tt,
                cloneCount: Ct,
                slideCount: z,
                slideCountNew: St,
                index: Mt,
                indexCached: Dt,
                displayIndex: getCurrentSlide(),
                navCurrentIndex: Te,
                navCurrentIndexCached: Ae,
                pages: Se,
                pagesCached: Ee,
                sheet: bt,
                isOn: G,
                event: t || {}
            }
        }
        d && console.warn("No slides found in", L.container)
    };
    return tn
}
();
window.matchMedia || (window.matchMedia = function () {
    "use strict";
    var e = window.styleMedia || window.media;
    if (!e) {
        var n,
        i = document.createElement("style"),
        t = document.getElementsByTagName("script")[0];
        i.type = "text/css",
        i.id = "matchmediajs-test",
        t.parentNode.insertBefore(i, t),
        n = "getComputedStyle" in window && window.getComputedStyle(i, null) || i.currentStyle,
        e = {
            matchMedium: function (t) {
                var e = "@media " + t + "{ #matchmediajs-test { width: 1px; } }";
                return i.styleSheet ? i.styleSheet.cssText = e : i.textContent = e,
                "1px" === n.width
            }
        }
    }
    return function (t) {
        return {
            matches: e.matchMedium(t || "all"),
            media: t || "all"
        }
    }
}
    ()), document.addEventListener("deviceready", function onDeviceReady() {
    window.plugins || (window.plugins = {}),
    window.plugins.gaPlugin || (window.plugins.gaPlugin = new GAPlugin)
}, !1), document.addEventListener("deviceready", function onDeviceReady() {
    window.plugins || (window.plugins = {}),
    window.plugins.utilities = new Utilities
}, !1);
