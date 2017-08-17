// ==UserScript==
// @name Adguard Popup Blocker Dev
// @name:ru	Блокировщик всплывающей рекламы Adguard Dev
// @name:uk Блокувальник спливаючої реклами Adguard Dev
// @name:de	Adguard Popup-Blocker Dev
// @name:sr	Koristi Adguard-ov blokator iskačućih prozora Dev
// @name:pl	Bloker wyskakujących okienek Dev
// @name:zh	使用 Adguard 弹窗拦截器 Dev
// @name:zh-TW	Adguard 彈出視窗阻擋器 Dev
// @name:sk	Adguard blokovač vyskakovacích okien Dev
// @name:fr	Bloqueur de popup de Adguard Dev
// @name:it	Blocco Pop-Up di Adguard Dev
// @name:es	Bloqueador Popup de Adguard Dev
// @namespace Adguard
// @description	Blocks popup ads on web pages
// @description:ru	Блокирует всплывающую рекламу на страницах
// @description:uk  Блокує спливаючу рекламу на веб-сторінках
// @description:de	Blockiert Anzeige-Popups auf Webseiten
// @description:tr	Web sayfalarında açılan pencere reklamları engeller
// @description:ko	웹 페이지의 팝업 광고를 차단 합니다.
// @description:sr	Blokira iskačuće reklame na veb stranicama
// @description:pl	Blokuje wyskakujące okienka z reklamami na stronach internetowych
// @description:zh	拦截网页弹窗广告
// @description:zh-TW	阻擋網頁彈窗廣告
// @description:sk	Blokuje vyskakovacie reklamy na webových stránkach
// @description:fr	Bloque les publicités intrusives sur les pages web
// @description:it	Blocca gli annunci di popup nelle pagine internet
// @description:vi	Chặn quảng cáo popup trên các trang web
// @description:es	Bloquea popups de anuncios en sitios web
// @version 2.1.0
// @downloadURL https://AdguardTeam.github.io/PopupBlocker/popupblocker.user.js
// @updateURL https://AdguardTeam.github.io/PopupBlocker/popupblocker.meta.js
// @match http://*/*
// @match https://*/*
// @grant GM_getValue
// @grant GM_setValue
// @grant unsafeWindow
// @run-at document-start
// ==/UserScript==
(function () {
var BRIDGE_KEY = '__PB' + (Math.random() * 1e9 >>> 0) + '__';

/**
 * @fileoverview
 * 'whitelist': comma-separated list of domain names that are allowed as popup destinations.
 * [domain]:DomainOption, JSON.stringify'd
 * 'salt': key that is used to hash messages sent to the top frame.
 */
function getValue(key, defaultValue) {
    var val = GM_getValue(key);
    if (typeof val === 'undefined') {
        GM_setValue(key, defaultValue);
        return defaultValue;
    }
    else {
        return val;
    }
}
var INITIAL_DOMAIN_OPTION = JSON.stringify({
    whitelisted: false,
    use_strict: false
});
var domainOption = JSON.parse(getValue(location.host, INITIAL_DOMAIN_OPTION));
var whitelistedDestinations = getValue('whitelist', '').split(',');
function requestDestinationWhitelist(dest) {
    whitelistedDestinations.push(dest);
    GM_setValue('whitelist', whitelistedDestinations.join(','));
}
function requestDomainWhitelist(domain) {
    domainOption['whitelisted'] = true;
    GM_setValue(domain, JSON.stringify(domainOption));
}

// Below is exposed for testing. It shouldn't be used for other purposes.
var SupportedLocales = {
    "en": { "popup_text_full": { "message": "Blocked an attempt to open a <0/> pop-up window" }, "popup_allow_dest": { "message": "Allow always ${dest}" }, "popup_allow_origin": { "message": "Allow all pop-ups on this website" }, "popup_text_min": { "message": "Blocked" }, "popup_allow_dest_min": { "message": "pop-up" } }
};
var currentLocale = null;
if (typeof AdguardSettings !== 'undefined') {
    var locale = AdguardSettings.locale;
    if (SupportedLocales[locale]) {
        currentLocale = locale;
    }
}
if (!currentLocale) {
    currentLocale = 'en';
}
var getMessage = function (messageId) {
    var message = SupportedLocales[currentLocale][messageId];
    if (!message) {
        throw messageId + ' not localized';
    }
    return message['message'];
};
// Marks start of placeholders, ${...} or <.../>.
var rePhStart = /(?:\${|<)/;
// Below is exposed for testing. It shouldn't be used for other purposes.
function parseMessage(message, context) {
    var res = [];
    var text = '';
    var match;
    var ind, i;
    while (message) {
        match = rePhStart.exec(message);
        if (!match) {
            text += message;
            if (text) {
                res.push(text);
            }
            return res;
        }
        else {
            ind = match.index;
            text += message.substr(0, ind);
            if (match[0].charCodeAt(0) === 36 /* $ */) {
                ind += 2;
                i = message.indexOf('}', ind);
                var messageId = message.slice(ind, i);
                var rep = context[messageId];
                if (rep) {
                    text += rep;
                }
                message = message.slice(i + 1);
            }
            else {
                ind++;
                i = message.indexOf('/>', ind);
                if (text) {
                    res.push(text);
                }
                text = '';
                var num = message.charCodeAt(ind) - 48; // parseInt(*, 10)
                res.push(num);
                message = message.slice(i + 2);
            }
        }
    }
    if (text) {
        res.push(text);
    }
    return res;
}
var reCommentPh = /^i18n:/;
var option = 128; /* NodeFilter.SHOW_COMMENT */
function translate(root, context) {
    var nodeIterator = document.createNodeIterator(root, option, null, false);
    var current;
    var val;
    // If DOM order is modified during iteration, 
    // NodeIterator may skip some nodes,
    // so we do a batch process.
    var tasks = [];
    while (current = nodeIterator.nextNode()) {
        val = current.nodeValue;
        if (reCommentPh.test(val)) {
            val = val.slice(5);
            var message = getMessage(val);
            var parsed = parseMessage(message, context);
            var pr = current.parentNode;
            tasks.push(new InsertTask(pr, current, parsed.map(function (el) {
                if (typeof el == 'number') {
                    return nthElemSib(current, el);
                }
                else {
                    return document.createTextNode(el);
                }
            })));
        }
    }
    for (var i = 0, l = tasks.length; i < l; i++) {
        tasks[i].insert();
    }
}
var InsertTask = (function () {
    function InsertTask(pr, before, toInsert) {
        this.pr = pr;
        this.before = before;
        this.toInsert = toInsert;
    }
    InsertTask.prototype.insert = function () {
        for (var i = 0, l = this.toInsert.length; i < l; i++) {
            this.pr.insertBefore(this.toInsert[i], this.before);
        }
        this.pr.removeChild(this.before);
    };
    return InsertTask;
}());
function nthElemSib(node, index) {
    var el = node;
    while (index >= 0) {
        // Edge and old browsers does not support `nextElementSibling` property on non-Element Nodes.
        el = el.nextSibling;
        if (el.nodeType === Node.ELEMENT_NODE) {
            index--;
        }
    }
    return el;
}

var innerHTML = "<!DOCTYPE html><html lang=en><head><meta charset=UTF-8><style>body{font-family:\"Gotham Pro\",\"Helvetica Neue\",Helvetica,Arial,sans-serif;margin:0}.popup{position:fixed;top:0;right:0;padding:15px 35px 15px 20px;font-size:13px;white-space:nowrap;background-color:#fff;border:1px solid #d6d6d6;box-shadow:0 2px 5px 0 rgba(0,0,0,.2)}.popup--min{padding:8px 38px 8px 14px}.popup--min .popup__text-min{display:block}.popup--min .popup__text-full{display:none}.popup--min .popup__logo{width:24px;height:24px;margin-right:9px}.popup--min .popup__text{font-size:11px;line-height:1.2}.popup--min .popup__close{top:50%;transform:translateY(-50%)}.popup__logo{display:inline-block;vertical-align:middle;width:30px;height:30px;margin-right:12px;background-repeat:no-repeat;background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNS4zIDI1LjkiPjxwYXRoIGZpbGw9IiM2OGJjNzEiIGQ9Ik0xMi43IDBDOC43IDAgMy45LjkgMCAzYzAgNC40LS4xIDE1LjQgMTIuNyAyM0MyNS40IDE4LjQgMjUuMyA3LjQgMjUuMyAzIDIxLjQuOSAxNi42IDAgMTIuNyAweiIvPjxwYXRoIGZpbGw9IiM2N2IyNzkiIGQ9Ik0xMi42IDI1LjlDLS4xIDE4LjQgMCA3LjQgMCAzYzMuOS0yIDguNy0zIDEyLjYtM3YyNS45eiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yIDE3LjNMMTkuOCA3YS45OS45OSAwIDAgMC0xLjMuMWwtNi40IDYuNi0yLjQtMi45Yy0xLjEtMS4zLTIuNy0uMy0zLjEgMGw1LjYgNi41Ii8+PC9zdmc+)}.popup__text{display:inline-block;vertical-align:middle;font-size:13px;line-height:1.6}.popup__text-min{display:none}.popup__text-blocked{max-width:150px;overflow:hidden;text-overflow:ellipsis}.popup__link{display:inline-block;vertical-align:middle;color:#66b574;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.popup__link--url{max-width:130px;vertical-align:bottom}.popup__link--allow{max-width:215px;margin-right:5px}.popup__close{position:absolute;top:10px;right:10px;width:15px;height:15px;border:0;background-color:#fff;background-repeat:no-repeat;background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMC41IDIwLjUiPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMS4zIDEwLjNsOS05Yy4zLS4zLjMtLjggMC0xLjFzLS44LS4zLTEuMSAwbC05IDktOS05QzEtLjEuNS0uMS4yLjJzLS4zLjggMCAxLjFsOSA5LTkgOWMtLjMuMy0uMy44IDAgMS4xLjEuMS4zLjIuNS4ycy40LS4xLjUtLjJsOS05IDkgOWMuMS4xLjMuMi41LjJzLjQtLjEuNS0uMmMuMy0uMy4zLS44IDAtMS4xbC04LjktOXoiLz48L3N2Zz4=);-webkit-appearance:none;appearance:none;cursor:pointer;opacity:.3}</style></head><body><div class=popup><div class=popup__logo></div><div class=popup__text><div class=popup__text-full><!--i18n:popup_text_full--> <a href=# class=\"popup__link popup__link--url\">${dest}</a><div class=popup__actions><a href=\"\" class=\"popup__link popup__link--allow\"><!--i18n:popup_allow_dest--> </a><a href=\"\" class=\"popup__link popup__link--all\"><!--i18n:popup_allow_origin--></a></div></div><div class=popup__text-min><div class=popup__text-blocked><!--i18n:popup_text_min--></div><div class=popup__actions><a href=\"\" class=\"popup__link popup__link--allow\"><!--i18n:popup_allow_dest_min--></a></div></div></div><button class=popup__close></button></div></body></html>";

var FULL_ALERT_TIMEOUT = 2000;
var COLLAPSED_ALERT_TIMEOUT = 5000;
var MAX_ALERT_NUM = 4;
var px = 'px';
var initialAlertFrameStyle = {
    "position": "fixed",
    "right": 10 /* right_offset */ + px,
    "top": 10 /* top_offset */ + px,
    "border": "none",
    "opacity": "0",
    "z-index": String(-1 - (1 << 31)),
    "transition": "opacity 500ms, top 500ms",
    "transitionTimingFunction": "cubic-bezier(0.86, 0, 0.07, 1), cubic-bezier(0.86, 0, 0.07, 1)"
};
function attachClickListenerForEach(iterable, listener) {
    var l = iterable.length;
    while (l-- > 0) {
        iterable[l].addEventListener('click', listener);
    }
}
var Alert = (function () {
    function Alert(orig_domain, popup_domain, showCollapsed) {
        var iframe = document.createElement('iframe');
        var loaded = false;
        // Prepare innerHTML
        var _innerHTML = innerHTML.replace(/\${dest}/g, popup_domain);
        iframe.addEventListener('load', function (evt) {
            // Attach event handlers
            if (loaded) {
                return;
            }
            loaded = true;
            var document = iframe.contentDocument;
            document.documentElement.innerHTML = _innerHTML; // document.write('..') does not work on FF Greasemonkey
            translate(document.body, {
                'dest': popup_domain
            });
            if (showCollapsed) {
                document[getElementsByClassName]('popup')[0].classList.add('popup--min');
            }
            attachClickListenerForEach(document[getElementsByClassName]('popup__link--allow'), function () {
                requestDestinationWhitelist(popup_domain);
            });
            attachClickListenerForEach(document[getElementsByClassName]('popup__link--all'), function () {
                requestDomainWhitelist(orig_domain);
            });
            requestAnimationFrame(function () {
                iframe.style['opacity'] = '1';
            });
            // Unless this, the background of the iframe will be white in IE11
            document.body.setAttribute('style', 'background-color:transparent;');
        });
        // Adjust css of an iframe
        iframe.setAttribute('allowTransparency', 'true');
        for (var prop in initialAlertFrameStyle) {
            iframe.style[prop] = initialAlertFrameStyle[prop];
        }
        var height = this.$height = showCollapsed ? 48 /* collapsed_height */ : 78;
        var width = showCollapsed ? 135 /* collapsed_width */ : 574;
        iframe.style['height'] = height + px;
        iframe.style['width'] = width + px;
        // Enable sandboxing
        iframe.setAttribute('sandbox', 'allow-same-origin');
        this.$element = iframe;
        this.$collapsed = showCollapsed;
        this.$top = 10 /* top_offset */;
        this.lastUpdate = new Date().getTime();
    }
    Alert.prototype.pushdown = function (amount) {
        var newTop = this.$top + amount;
        this.$element.style.top = newTop + px;
        this.$top = newTop;
    };
    Alert.prototype.$collapse = function () {
        if (this.$collapsed) {
            return;
        }
        this.$element.style['height'] = 48 /* collapsed_height */ + px;
        this.$element.style['width'] = 135 /* collapsed_width */ + px;
        var root = this.$element.contentDocument[getElementsByClassName]('popup')[0];
        root.classList.add('popup--min');
        this.$collapsed = true;
        this.$height = 48 /* collapsed_height */;
        // Since its state was changed, update its lastUpdate property.
        this.lastUpdate = new Date().getTime();
    };
    Alert.prototype.destroy = function () {
        clearTimeout(this.timerId);
        var parentNode = this.$element.parentNode;
        if (parentNode) {
            parentNode.removeChild(this.$element);
        }
    };
    return Alert;
}());
var AlertController = (function () {
    function AlertController() {
        this.alerts = [];
    }
    AlertController.prototype.createAlert = function (orig_domain, popup_domain, showCollapsed) {
        var _this = this;
        var alert = new Alert(orig_domain, popup_domain, showCollapsed);
        // Pushes previous alerts down
        var l = this.alerts.length;
        var offset = 10 /* middle_offset */ + alert.$height;
        this.moveBunch(l, offset);
        // Adds event listeners that needs to run in this context
        alert.$element.addEventListener('load', function () {
            attachClickListenerForEach(alert.$element.contentDocument[getElementsByClassName]('popup__close'), function () {
                _this.destroyAlert(alert);
            });
        });
        alert.$element.addEventListener('mouseover', function () { _this.onMouseOver(); });
        alert.$element.addEventListener('mouseout', function () { _this.onMouseOut(); });
        // Appends an alert to DOM
        document.body.appendChild(alert.$element);
        // Schedules collapsing & destroying
        if (showCollapsed) {
            alert.timerId = setTimeout(function () {
                _this.destroyAlert(alert);
            }, COLLAPSED_ALERT_TIMEOUT);
        }
        else {
            alert.timerId = setTimeout(function () {
                _this.collapseAlert(alert);
            }, FULL_ALERT_TIMEOUT);
        }
        // Pushes the new alert to an array, destroy from the oldest alert when needed
        if ((l = this.alerts.push(alert)) > MAX_ALERT_NUM) {
            l -= MAX_ALERT_NUM;
            while (l-- > 0) {
                this.destroyAlert(this.alerts[l]);
            }
        }
    };
    AlertController.prototype.moveBunch = function (index, offset) {
        while (index-- > 0) {
            this.alerts[index].pushdown(offset);
        }
    };
    /**
     * Collapses an alert and schedules its destruction
     */
    AlertController.prototype.collapseAlert = function (alert) {
        var prevHeight = alert.$height;
        alert.$collapse();
        var offset = alert.$height - prevHeight;
        var index = this.alerts.indexOf(alert);
        this.moveBunch(index, offset);
        var self = this;
        alert.timerId = setTimeout(function () {
            self.destroyAlert(alert);
        }, COLLAPSED_ALERT_TIMEOUT);
    };
    AlertController.prototype.destroyAlert = function (alert) {
        alert.destroy();
        var i = this.alerts.indexOf(alert);
        var offset = alert.$height + 10;
        this.moveBunch(i, -offset);
        this.alerts.splice(i, 1);
    };
    /************************************************************************************

        When a user hovers the mouse over any of alerts,

         1. All timers are cleared, so as to prevent ui change during
            user interaction;

         2. When the mouse is moved out of alerts:
           - It resumes all timers as if there was no pause;
           - If a pause was long enough so that ANY of timer's callback should
             have been called, call the oldest callback immediately, and then schedules
             other callbacks so that relative fire time differences are unchanged.

    **/
    AlertController.prototype.onMouseOver = function () {
        this.alerts.forEach(function (alert) {
            clearTimeout(alert.timerId);
        });
    };
    AlertController.prototype.onMouseOut = function () {
        var _this = this;
        var now = new Date().getTime();
        var time = this.getImminentDue();
        var pastDue = now > time ? now - time : 0;
        this.alerts.forEach(function (alert) {
            if (alert.$collapsed) {
                alert.timerId = setTimeout(function () {
                    _this.destroyAlert(alert);
                    // This value will be 0 for the oldest callback.
                }, alert.lastUpdate + COLLAPSED_ALERT_TIMEOUT - now + pastDue);
            }
            else {
                alert.timerId = setTimeout(function () {
                    _this.collapseAlert(alert);
                }, alert.lastUpdate + FULL_ALERT_TIMEOUT - now + pastDue);
            }
        });
    };
    AlertController.prototype.getImminentDue = function () {
        var amongCollapsed, amongUncollapsed;
        var alerts = this.alerts;
        for (var i = 0, l = alerts.length; i < l; i++) {
            if (alerts[i].$collapsed) {
                if (amongCollapsed) {
                    continue;
                }
                amongCollapsed = alerts[i].lastUpdate + COLLAPSED_ALERT_TIMEOUT;
                if (amongUncollapsed) {
                    break;
                }
            }
            else {
                if (amongUncollapsed) {
                    continue;
                }
                amongUncollapsed = alerts[i].lastUpdate + FULL_ALERT_TIMEOUT;
                if (amongCollapsed) {
                    break;
                }
            }
        }
        return amongCollapsed > amongUncollapsed ? amongUncollapsed : amongCollapsed;
    };
    return AlertController;
}());
// Minifiers will not inline below strings
var getElementsByClassName = 'getElementsByClassName';
var alertController = new AlertController();

var getTime = 'now' in performance ? function () {
    return performance.timing.navigationStart + performance.now();
} : function () {
    return (new Date()).getTime();
};

var prefix = '';
var win$1 = window;
while (win$1.parent !== win$1) {
    win$1 = win$1.parent;
    prefix += '-- ';
}
var loc = location.href;
var suffix = "    (at " + loc + ")";
function call(msg) {
    console.group(prefix + msg + suffix);
}
function callEnd() {
    console.groupEnd();
}
function print(str, obj) {
    var date = getTime().toFixed(3);
    var indent = 10 - date.length;
    if (indent < 0) {
        indent = 0;
    }
    var indentstr = '';
    while (indent-- > 0) {
        indentstr += ' ';
    }
    console.log(prefix + ("[" + indentstr + date + "]: " + str + suffix));
    if (obj !== undefined) {
        console.log(prefix + '=============================');
        console.log(obj);
        console.log(prefix + '=============================');
    }
}

/**
 * @fileoverview This establishes a private messaging channel between child frames and
 * the top frame using `postMessage` and `MessageChannel` api, to be used to trigger an
 * alert for blocked popups. This is for security; if we used a plain `postMessage`, all
 * `message` event listeners in the top frame would be able to listen to such a message
 * and frames would be able to simulate our postMessage requests, opening a gate for a
 * potential abuse.
 * Expected messages:
 *  - a request to show a blocked popup alert.
 *  - a request to pass a MessagePort from a child-child-iframe
 */
var supported = typeof WeakMap === 'function';
var parent = window.parent;
var isTopOrEmpty = parent === window || location.href === 'about:blank';
var createAlertInTopFrame = function (orig_domain, popup_domain, isGeneric) {
    alertController.createAlert(orig_domain, popup_domain, isGeneric);
};
if (supported) {
    var MAGIC_1 = 'handshake';
    var MAGIC_CHILD_1 = 'handshake-child';
    var connectedFrames_1 = new WeakMap();
    var channel_1 = isTopOrEmpty ? null : new MessageChannel(); // Do not initialize messagechannel when it is not going to be used
    /**
     * A `message` event handler to store private messaging channel.
     * Each iframe posts a message to its parent frame with a port of a newly created
     * MessageChannel. This handler receives it and calls `stopImmediatePropagation`
     * so that other `message` event handler cannot listen to such messages.
     */
    var handshake = function (evt) {
        if (evt.origin === "null" || evt.origin === "about://") {
            // For such empty frames, PopupBlocker inject itself and shares the bridge object.
            // So there is no need to use a messaging channel.
            // IE and Edge recognize empty frames' origin as `about://`.
            return;
        }
        if (evt.data !== MAGIC_1) {
            // `MAGIC` indicates that this message is sent by the popupblocker from the child frame.
            return;
        }
        if (connectedFrames_1.has(evt.source)) {
            // Such frames have already sent its message port, we do not accept additional ports.
            return;
        }
        print('received a message from:', evt.source);
        var port = evt.ports[0]; // This is a port that a child frame sent.
        port.onmessage = onMessage_1; // Registers a listener
        connectedFrames_1.set(evt.source, true);
        evt.stopImmediatePropagation();
        evt.preventDefault();
    };
    /**
     * This is a function that will be used as a message event handler for private
     * messaging channel we establishes.
     */
    var onMessage_1 = function (evt) {
        call('Received a message from a private channel');
        if (evt.data === MAGIC_CHILD_1) {
            print('It is a request to pass a MessagePort to a parent frame');
            var port = evt.ports[0];
            port.onmessage = onMessage_1;
        }
        else {
            if (isTopOrEmpty) {
                var data = JSON.parse(evt.data);
                alertController.createAlert(data.orig_domain, data.popup_domain, data.isGeneric);
            }
            else {
                channel_1.port2.postMessage(MAGIC_CHILD_1, [evt.ports[0]]);
            }
        }
        callEnd();
    };
    window.addEventListener('message', handshake);
    if (!isTopOrEmpty) {
        parent.postMessage(MAGIC_1, '*', [channel_1.port1]); // Passes a messeging channel to parent.
        createAlertInTopFrame = function (orig_domain, popup_domain, isGeneric) {
            channel_1.port2.postMessage(JSON.stringify({
                orig_domain: orig_domain,
                popup_domain: popup_domain,
                isGeneric: isGeneric
            }));
        };
    }
}
else {
    if (!isTopOrEmpty) {
        createAlertInTopFrame = function (orig_domain, popup_domain, isGeneric) { };
    }
}
var createAlertInTopFrame$1 = createAlertInTopFrame;

// Shim for AG Win
var clone = typeof cloneInto === 'function' ? cloneInto : function (x) { return x; };
var createObject = typeof createObjectIn === 'function' ? createObjectIn : function (target, option) {
    var obj = {};
    target[option.defineAs] = obj;
    return obj;
};
var exportFn = typeof exportFunction === 'function' ? exportFunction : function (fn, target, option) {
    target[option.defineAs] = fn;
};
//
var bridge = createObject(unsafeWindow, {
    defineAs: BRIDGE_KEY
});
bridge.domain = location.host;
bridge.domainOption = clone(domainOption, bridge, { defineAs: 'domainOption' });
bridge.whitelistedDestinations = clone(whitelistedDestinations, bridge, { defineAs: 'whitelistedDestinations' });
exportFn(createAlertInTopFrame$1, bridge, {
    defineAs: 'showAlert'
});

/**
 * @fileoverview
 */
/**
 * @param {string=} KEY It is used for communication between a script in a page's context and a script in its child frame's context
 * @param {string} bridge_key It is used for communication between a script in userscript host's sandboxed context and the page's context.
 */
function popupBlocker(window, KEY, _BRIDGE_KEY) {
    var getTime = 'now' in performance ? function () {
    return performance.timing.navigationStart + performance.now();
} : function () {
    return (new Date()).getTime();
};

var prefix = '';
var win = window;
while (win.parent !== win) {
    win = win.parent;
    prefix += '-- ';
}
var loc = location.href;
var suffix = "    (at " + loc + ")";
function call(msg) {
    console.group(prefix + msg + suffix);
}
function callEnd() {
    console.groupEnd();
}
function print(str, obj) {
    var date = getTime().toFixed(3);
    var indent = 10 - date.length;
    if (indent < 0) {
        indent = 0;
    }
    var indentstr = '';
    while (indent-- > 0) {
        indentstr += ' ';
    }
    console.log(prefix + ("[" + indentstr + date + "]: " + str + suffix));
    if (obj !== undefined) {
        console.log(prefix + '=============================');
        console.log(obj);
        console.log(prefix + '=============================');
    }
}
function connect(fn, message) {
    return function () {
        call(message);
        var ret = fn.apply(this, arguments);
        callEnd();
        return ret;
    };
}

var createOpen = function (index, events) {
    print('index:', index);
    var evt = events[index][0];
    if (evt.$type == 0 /* CREATE */ && getTime() - evt.$timeStamp < 200) {
        return false;
    }
    return true;
};
var createOpen$1 = connect(createOpen, 'Performing create test');

var aboutBlank = function (index, events) {
    // if there is a blocked popup within 100 ms, do not allow opening popup with url about:blank.
    // It is a common technique used by popunder scripts on FF to regain focus of the current window.
    var latestOpenEvent = events[index][events[index].length - 1];
    var now = latestOpenEvent.$timeStamp;
    if (latestOpenEvent.$type === 1 /* APPLY */ && latestOpenEvent.$name === 'open' && latestOpenEvent.$data.arguments[0] == 'about:blank') {
        print('The latest event is open(\'about:blank\')');
        var l = events.length;
        while (l-- > 0) {
            var frameEvents = events[l];
            var k = frameEvents.length;
            while (k-- > 0) {
                var event_1 = frameEvents[k];
                if (now - event_1.$timeStamp > 200) {
                    break;
                }
                if (event_1.$name === 'open' && event_1.$type === 1 /* APPLY */) {
                    if (event_1.$data.context['mocked']) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
};
var aboutBlank$1 = connect(aboutBlank, 'Performing aboutBlank test');

var TimelineEvent = (function () {
    function TimelineEvent($type, $name, $data) {
        this.$type = $type;
        this.$name = $name;
        this.$data = $data;
        this.$timeStamp = getTime();
    }
    return TimelineEvent;
}());

var beforeTest = [createOpen$1, aboutBlank$1];
var afterTest = [];
var EVENT_RETENTION_LENGTH = 5000;
var Timeline = (function () {
    function Timeline() {
        this.events = [[]];
        this.isRecording = false;
        // Registers a unique event when it is first created.
        this.registerEvent(new TimelineEvent(0 /* CREATE */, undefined, undefined), 0);
    }
    /**
     * When an event is registered, it performs some checks by calling functions of type `condition`
     * which accepts an existing events as a first argument, and an incoming event as a second argument.
     * An object at which the event is happened is included in the event as a `data` property,
     * and such functions can act on it appropriately, for example, it can close a popup window.
     */
    Timeline.prototype.registerEvent = function (event, index) {
        var i = afterTest.length;
        while (i--) {
            afterTest[i](index, this.events, event);
        }
        var frameEvents = this.events[index];
        frameEvents.push(event);
        if (!this.isRecording) {
            setTimeout(function () {
                frameEvents.splice(frameEvents.indexOf(event), 1);
            }, EVENT_RETENTION_LENGTH);
        }
        else {
            var name_1 = event.$name ? event.$name.toString() : '';
            print("Timeline.registerEvent: " + event.$type + " " + name_1, event.$data);
        }
    };
    /**
     * Wrapped window.open calls this. If it returns false, it does not call window.open.
     * beforeTests are basically the same as the afterTests except that
     * it does not accept a second argument.
     */
    Timeline.prototype.canOpenPopup = function (index) {
        call('Inquiring events timeline about whether window.open can be called...');
        var i = beforeTest.length;
        while (i--) {
            if (!beforeTest[i](index, this.events)) {
                print('false');
                callEnd();
                return false;
            }
        }
        print('true');
        callEnd();
        return true;
    };
    Timeline.prototype.onNewFrame = function () {
        var pos = this.events.push([]) - 1;
        // Registers a unique event when a frame is first created.
        this.registerEvent(new TimelineEvent(0 /* CREATE */, undefined, undefined), pos);
        return pos;
    };
    /**
     * Below methods are used only for logging & testing purposes.
     * It does not provide any functionality to block popups,
     * and is stipped out in production builds.
     * In dev build, the timeline instance is exposed to the global scope with a name '__t',
     * and one can call below methods of it to inspect how the popup script calls browser apis.
     * In test builds, it is used to access a private member `events`.
     */
    Timeline.prototype.startRecording = function () {
        this.isRecording = true;
    };
    /**
     * Returns an array. Its elements corresponds to frames to which the current window
     * has access, and the first element corresponds to the current window.
     */
    Timeline.prototype.takeRecords = function () {
        this.isRecording = false;
        var res = this.events.map(function (el) { return (Array.prototype.slice.call(el)); });
        var now = getTime();
        var l = this.events.length;
        while (l-- > 0) {
            var frameEvents = this.events[l];
            while (frameEvents[0]) {
                if (now - frameEvents[0].$timeStamp > EVENT_RETENTION_LENGTH) {
                    frameEvents.shift();
                }
                else {
                    break;
                }
            }
        }
        return res;
    };
    return Timeline;
}());
var timeline$1 = typeof KEY === 'string' ? window.parent[KEY][2] : new Timeline();
var position = typeof KEY === 'string' ? timeline$1.onNewFrame() : 0;
// These are called from the outside of the code, so we have to make sure that call structures of those are not modified.
// It is removed in minified builds, see the gulpfile.
window['__t'] = timeline$1;

// https://github.com/Polymer/WeakMap
var wm$1;
if (typeof WeakMap == 'function') {
    wm$1 = WeakMap;
}
else {
    var counter_1 = Date.now() % 1e9;
    var defineProperty_1 = Object.defineProperty;
    wm$1 = (function () {
        function WM() {
            this.name = '__st' + (Math.random() * 1e9 >>> 0) + (counter_1++ + '__');
        }
        WM.prototype.set = function (key, value) {
            var entry = key[this.name];
            if (entry && entry[0] === key)
                entry[1] = value;
            else
                defineProperty_1(key, this.name, { value: [key, value], writable: true });
            return this;
        };
        WM.prototype.get = function (key) {
            var entry;
            return (entry = key[this.name]) && entry[0] === key ?
                entry[1] : undefined;
        };
        WM.prototype.delete = function (key) {
            var entry = key[this.name];
            if (!entry)
                return false;
            var hasValue = entry[0] === key;
            entry[0] = entry[1] = undefined;
            return hasValue;
        };
        WM.prototype.has = function (key) {
            var entry = key[this.name];
            if (!entry)
                return false;
            return entry[0] === key;
        };
        return WM;
    }());
}
var WeakMap$1 = wm$1;

var bridge;
if (typeof _BRIDGE_KEY !== 'undefined') {
    bridge = window[_BRIDGE_KEY];
    delete window[_BRIDGE_KEY];
}
else {
    // KEY should be defined
    bridge = window.parent[KEY][3];
}
var bridge$1 = bridge;

var supported = false;
supported = typeof Proxy !== 'undefined';
/**
 * Why not use Proxy on production version?
 * Using proxy instead of an original object in some places require overriding Function#bind,apply,call,
 * and replacing such native codes into js implies serious performance effects on codes completely unrelated to popups.
 */
var _bind = Function.prototype.bind;
var _apply = Function.prototype.apply;
var _call = Function.prototype.call;
var _toStringFn = Function.prototype.toString;
var _reflect;
if (supported) {
    _reflect = Reflect.apply;
}
// Lodash isNative
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsNative = new RegExp('^' + _toStringFn.call(Object.prototype.hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
/**
 * Certain built-in functions depends on internal slots of 'this' of its execution context.
 * In order to make such methods of proxied objects behave identical to the original object,
 * we need to bind the original 'this' for the proxy's [[Get]] handler.
 * However, non-native functions does not have access to object's internal slots,
 * so we can safely bind the proxied objects for such non-native methods.
 * If isNativeFn test is passed, the object is either a native function,
 * or a non-native function whose function body consists of '[native code]',
 * which obviously does not have access to the internal slot of 'this'.
 */
var isNativeFn = function (fn) {
    if (typeof fn !== 'function') {
        return false;
    }
    var tostr;
    try {
        tostr = _reflect(_toStringFn, fn, []);
    }
    catch (e) {
        // The above block throws if `fn` is a Proxy constructed over a function, from a third-party code.
        // Such a proxy is still callable, so Function.prototype.(bind,apply,call) may be invoked on it.
        // It is a common practice to bind the correct `this` to methods, so we try in that way.
        try {
            tostr = fn.toString();
        }
        catch (e) {
            // In this case, we bail out, hoping for a third-party code does not mess with internal slots.
            return false;
        }
    }
    return reIsNative.test(tostr);
};
// See HTMLIFrame.ts
var proxyToReal = typeof KEY === 'string' ? window.parent[KEY][0] : new WeakMap$1();
var realToProxy = typeof KEY === 'string' ? window.parent[KEY][1] : new WeakMap$1();
var expose = function (key) { window[key] = [proxyToReal, realToProxy, timeline$1, bridge$1]; };
var unexpose = function (key) { delete window[key]; };
/**
 * An apply handler to be used to proxy Function#(bind, apply, call) methods.
 * Example: (Event.prototype.addEventListener).call(window, 'click', function() { });
 * target: Function.prototype.call
 * _this: Event.prototype.addEventListener
 * _arguments: [window, 'click', function() { }]
 * We unproxies 'window' in the above case.
 *
 * @param target Must be one of Function#(bind, apply, call).
 * @param _this A function which called (bind, apply, call).
 * @param _arguments
 */
var applyWithUnproxiedThis = function (target, _this, _arguments) {
    // Convert _arguments[0] to its unproxied version
    // When it is kind of object which may depend on its internal slot
    var _caller = proxyToReal.get(_this) || _this;
    if (isNativeFn(_caller) && _caller !== _bind && _caller !== _apply && _caller !== _call) {
        // Function#(bind, apply, call) does not depend on the target's internal slots,
        // In (Function.prototype.call).apply(Function.prototype.toString, open)
        // we should not convert Function.prototype.toString to the original function.
        var thisOfReceiver = _arguments[0];
        var unproxied = proxyToReal.get(thisOfReceiver);
        if (unproxied) {
            _arguments[0] = unproxied;
        }
    }
    return _reflect(target, _this, _arguments);
};
/**
 * An apply handler to make Reflect.apply handler
 * Reflect.apply(EventTarget.prototype.addEventListener, proxideWindow, ['click', function(){}])
 */
var reflectWithUnproxiedThis = function (target, _this, _arguments) {
    var appliedFn = _arguments[0];
    appliedFn = proxyToReal.get(appliedFn) || appliedFn;
    if (isNativeFn(appliedFn) && appliedFn !== _bind && appliedFn !== _apply && appliedFn !== _call) {
        var thisOfAppliedFn = _arguments[1];
        var unproxied = proxyToReal.get(thisOfAppliedFn);
        if (unproxied) {
            _arguments[1] = unproxied;
        }
    }
    return _reflect(target, _this, _arguments);
};
/**
 * An apply handler to make invoke handler.
 */
var invokeWithUnproxiedThis = function (target, _this, _arguments) {
    var unproxied = proxyToReal.get(_this);
    if (typeof unproxied == 'undefined') {
        unproxied = _this;
    }
    return supported ? _reflect(target, unproxied, _arguments) : target.apply(unproxied, _arguments);
};
/**
 * An apply handler to be used for MessageEvent.prototype.source.
 */
var proxifyReturn = function (target, _this, _arguments) {
    var ret = _reflect(target, _this, _arguments);
    var proxy = realToProxy.get(ret);
    if (proxy) {
        ret = proxy;
    }
    return ret;
};
function makeObjectProxy(obj) {
    if (obj === null || typeof obj !== 'object' || !supported) {
        return obj;
    }
    var proxy = realToProxy.get(obj);
    if (proxy) {
        return proxy;
    }
    proxy = new Proxy(obj, {
        get: function (target, prop, receiver) {
            var _receiver = proxyToReal.get(receiver) || receiver;
            timeline$1.registerEvent(new TimelineEvent(2 /* GET */, prop, _receiver), position);
            var value = Reflect.get(target, prop, _receiver);
            if (isNativeFn(value)) {
                return makeFunctionWrapper(value, invokeWithUnproxiedThis);
            }
            else {
                return value;
            }
        },
        set: function (target, prop, value, receiver) {
            var _receiver = proxyToReal.get(receiver) || receiver;
            timeline$1.registerEvent(new TimelineEvent(3 /* SET */, prop, _receiver), position);
            return Reflect.set(target, prop, value, _receiver);
        }
    });
    realToProxy.set(obj, proxy);
    proxyToReal.set(proxy, obj);
    return proxy;
}
var defaultApplyHandler = supported ? _reflect : function (_target, _this, _arguments) { return (_target.apply(_this, _arguments)); };
function makeFunctionWrapper(orig, applyHandler) {
    var wrapped;
    var proxy = realToProxy.get(orig);
    if (proxy) {
        return proxy;
    }
    if (supported) {
        wrapped = new Proxy(orig, { apply: applyHandler });
    }
    else {
        wrapped = function () { return applyHandler(orig, this, arguments); };
        copyProperty(orig, wrapped, 'name');
        copyProperty(orig, wrapped, 'length');
    }
    proxyToReal.set(wrapped, orig);
    realToProxy.set(orig, wrapped);
    return wrapped;
}
function copyProperty(orig, wrapped, prop) {
    var desc = Object.getOwnPropertyDescriptor(orig, prop);
    if (desc && desc.configurable) {
        desc.value = orig[prop];
        Object.defineProperty(wrapped, prop, desc);
    }
}
/**
 * @param option Can be a boolean 'false' to disable logging, or can be a function which accepts the same type
 * of params as ApplyHandler and returns booleans which indicates whether to log it or not.
 */
function makeLoggedFunctionWrapper(orig, type, name, applyHandler, option) {
    applyHandler = applyHandler || defaultApplyHandler;
    if (option === false) {
        return makeFunctionWrapper(orig, applyHandler);
    }
    return makeFunctionWrapper(orig, function (target, _this, _arguments) {
        var context = {};
        if (typeof option == 'undefined' || option(target, _this, _arguments)) {
            var data = {
                this: _this,
                arguments: _arguments,
                context: context
            };
            timeline$1.registerEvent(new TimelineEvent(type, name, data), position);
        }
        return applyHandler(target, _this, _arguments, context);
    });
}
function wrapMethod(obj, prop, applyHandler, option) {
    if (obj.hasOwnProperty(prop)) {
        obj[prop] = makeLoggedFunctionWrapper(obj[prop], 1 /* APPLY */, prop, applyHandler, option);
    }
}
function wrapAccessor(obj, prop, getterApplyHandler, setterApplyHandler, option) {
    var desc = Object.getOwnPropertyDescriptor(obj, prop);
    if (desc && desc.get && desc.configurable) {
        var getter = makeLoggedFunctionWrapper(desc.get, 2 /* GET */, prop, getterApplyHandler, option);
        var setter;
        if (desc.set) {
            setter = makeLoggedFunctionWrapper(desc.set, 3 /* SET */, prop, setterApplyHandler, option);
        }
        Object.defineProperty(obj, prop, {
            get: getter,
            set: setter,
            configurable: true,
            enumerable: desc.enumerable
        });
    }
}
if (supported) {
    wrapMethod(Function.prototype, 'bind', applyWithUnproxiedThis, false);
    wrapMethod(Function.prototype, 'apply', applyWithUnproxiedThis, false);
    wrapMethod(Function.prototype, 'call', applyWithUnproxiedThis, false);
    wrapMethod(Reflect, 'apply', reflectWithUnproxiedThis, false);
    wrapAccessor(MessageEvent.prototype, 'source', proxifyReturn, undefined, false);
}
wrapMethod(Function.prototype, 'toString', invokeWithUnproxiedThis, false);
wrapMethod(Function.prototype, 'toSource', invokeWithUnproxiedThis, false);

var CurrentMouseEvent = (function () {
    function CurrentMouseEvent() {
        var mousedownQueue = [];
        var mouseupQueue = [];
        var clickQueue = [];
        var removeFromQueue = function (array, el) {
            var i = array.indexOf(el);
            if (i != -1) {
                array.splice(i, 1);
            }
        };
        var captureListener = function (queue) {
            return function (evt) {
                queue.push(evt);
                /**
                 * Schedules dequeueing in next task. It will be executed once all event handlers
                 * for the current event fires up. Note that task queue is flushed between the end of
                 * `mousedown` event handlers and the start of `mouseup` event handlers, but may not between
                 * the end of `mouseup` and `click` depending on browsers.
                 */
                setTimeout(removeFromQueue.bind(null, queue, evt));
            };
        };
        window.addEventListener('mousedown', captureListener(mousedownQueue), true);
        window.addEventListener('mouseup', captureListener(mouseupQueue), true);
        window.addEventListener('click', captureListener(clickQueue), true);
        /**
         * Some events in event queues may have been finished firing event handlers,
         * either by bubbling up to `window` or by `Event#(stopPropagation,stopImmediatePropagation)`
         * or by `Event#cancelBubble`. Such events will satisfy `.currentTarget === null`. We skip
         * such events.
         */
        var getLatest = function (queue) {
            var l = queue.length;
            var evt;
            while (!evt || !evt.currentTarget) {
                if (l === 0) {
                    return undefined;
                }
                evt = queue[--l];
            }
            return evt;
        };
        /**
         * When there are latest events of different types,
         * we choose the latest one.
         */
        var compareTimestamp = function (a, b) {
            if (!a) {
                return 1;
            }
            if (!b) {
                return -1;
            }
            return b.timeStamp - a.timeStamp;
        };
        this.getCurrentMouseEvent = function () {
            call('getCurrentClickEvent');
            var md = getLatest(mousedownQueue);
            var mu = getLatest(mouseupQueue);
            var cl = getLatest(clickQueue);
            var evt = [cl, md, mu].sort(compareTimestamp)[0];
            print('Retrieved event is: ', evt);
            callEnd();
            return evt;
        };
    }
    return CurrentMouseEvent;
}());

/**
 * On IE 10 and lower, window.event is a `MSEventObj` instance which does not implement `target` property.
 * We use a polyfill for such cases.
 */
var supported$1 = 'event' in window && (!('documentMode' in document) || (document.documentMode === 11));
var currentMouseEvent;
if (!supported$1) {
    print('window.event is not supported.');
    currentMouseEvent = (new CurrentMouseEvent()).getCurrentMouseEvent;
}
else {
    print('window.event is supported.');
}
/**
 * Gets the event that is being currently handled.
 * @suppress {es5Strict}
 */
function retrieveEvent() {
    call('Retrieving event');
    var win = window;
    var currentEvent;
    if (supported$1) {
        currentEvent = win.event;
        while (!currentEvent) {
            var parent_1 = win.parent;
            if (parent_1 === win) {
                break;
            }
            win = parent_1;
            try {
                currentEvent = win.event;
            }
            catch (e) {
                // Cross-origin error
                break;
            }
        }
    }
    else {
        currentEvent = currentMouseEvent();
    }
    if (!currentEvent) {
        print('window.event does not exist, trying to get event from Function.caller');
        try {
            var caller = arguments.callee;
            var touched = new WeakMap$1();
            while (caller.caller) {
                caller = caller.caller;
                if (touched.has(caller)) {
                    throw "Recursion in the call stack";
                }
                touched.set(caller, true);
            }
            print('Reached at the top of caller chain.');
            if (caller.arguments && caller.arguments[0] && 'target' in caller.arguments[0]) {
                currentEvent = caller.arguments[0];
                print('The function at the bottom of the stack has an expected type. The current event is:', currentEvent);
            }
            else {
                print('The function at the bottom of the call stack does not have an expected type.', caller.arguments[0]);
            }
        }
        catch (e) {
            print('Getting event from Function.caller failed, due to an error:', e);
        }
    }
    else {
        print('window.event exists, of which the value is:', currentEvent);
    }
    callEnd();
    return currentEvent;
}

/**
 * @param event Optional argument, an event to test with. Default value is currentEvent.
 * @return True if the event is legit, false if it is something that we should not allow window.open or dispatchEvent.
 */
function verifyEvent(event) {
    if (event) {
        call('Verifying event');
        var currentTarget = event.currentTarget;
        if (currentTarget) {
            print('Event is:', event);
            if ('nodeName' in currentTarget) {
                var tagName = currentTarget.nodeName.toLowerCase();
                if (tagName == '#document' || tagName == 'html' || tagName == 'body') {
                    print('VerifyEvent - the current event handler is suspicious, for the current target is either document, html, or body.');
                    callEnd();
                    return false;
                }
                else if ('offsetHeight' in currentTarget && maybeOverlay(currentTarget)) {
                    print('VerifyEvent - the current event handler is suspicious, for the current target looks like an artificial overlay.');
                    callEnd();
                    return false;
                }
            }
        }
    }
    callEnd();
    return true;
}

function verifyCurrentEvent() {
    return verifyEvent(retrieveEvent());
}
/**
 * Detects common overlay pattern.
 * @param el an element to check whether it is an overlay.
 * @return true if el is an overlay.
 */
function maybeOverlay(el) {
    call('maybeOverlay test');
    var w = window.innerWidth, h = window.innerHeight;
    if (el.offsetLeft << 4 < w && (w - el.offsetWidth) << 3 < w
        && el.offsetTop << 4 < h && (h - el.offsetHeight) << 3 < w) {
        var style = getComputedStyle(el);
        var position = style.getPropertyValue('position');
        var zIndex = parseInt(style.getPropertyValue('z-index'), 10);
        print('An element passed offset test.');
        if ((position == 'fixed' || position == 'absolute') && zIndex > 1000) {
            print('An element passed computedStyle test.');
            callEnd();
            return true;
        }
    }
    // ToDo: the element may have been modified in the event handler.
    // We may still test it using the inline style attribute.
    callEnd();
    return false;
}

var dispatchVerifiedEvent = function (_dispatchEvent, _this, _arguments) {
    var evt = _arguments[0];
    if ('clientX' in evt && _this.nodeName.toLowerCase() == 'a' && !evt.isTrusted) {
        call('It is a MouseEvent on an anchor tag.');
        // Checks if an url is in a whitelist
        if (bridge$1.whitelistedDestinations.indexOf(_this.host)) {
            return _dispatchEvent.call(_this, evt);
        }
        var passed = verifyCurrentEvent();
        if (!passed) {
            print('It did not pass the test, not dispatching event');
            callEnd();
            bridge$1.showAlert(bridge$1.domain, _this.host, false);
            return false;
            // Or, we may open a new widnow with window.open to save a reference and do additional checks.
        }
        callEnd();
    }
    return _dispatchEvent.call(_this, evt);
};
var isUIEvent = function (target, _this, _arguments) {
    return 'view' in _this;
};
var eventTargetPType = typeof EventTarget == 'undefined' ? Node.prototype : EventTarget.prototype;
var _dispatchEvent = eventTargetPType.dispatchEvent;
wrapMethod(eventTargetPType, 'dispatchEvent', dispatchVerifiedEvent, isUIEvent);

var openVerifiedWindow = function (_open, _this, _arguments, context) {
    var url = _arguments[0];
    call('Called window.open with url ' + url);
    // Checks if an url is in a whitelist
    if (bridge$1.whitelistedDestinations.indexOf(url) !== -1) {
        return _open.apply(_this, _arguments);
    }
    var currentEvent = retrieveEvent();
    var passed = verifyEvent(currentEvent);
    var win;
    if (passed) {
        print('event verified, inquiring event timeline..');
        if (timeline$1.canOpenPopup(position)) {
            print('calling original window.open...');
            win = _open.apply(_this, _arguments);
            win = makeObjectProxy(win);
            callEnd();
            return win;
        }
        print('canOpenPopup returned false');
        callEnd();
    }
    if (currentEvent) {
        var redispatched = dispatchIfBlockedByMask(currentEvent);
        // Determines whether to return null or a mocked window object.
        // If an url is first-party or the target is an anchor, the original page may try to navigate away
        // In such cases we return null to signal that the request was unsuccessful.
        var target = currentEvent.target;
        var targetIsAnchor = 'nodeName' in target && target.nodeName.toLowerCase() == 'a';
        var urlIsHrefOfAnchor = void 0;
        if (targetIsAnchor) {
            var anchor = target;
            if (anchor.href == _arguments[0]) {
                urlIsHrefOfAnchor = true;
            }
        }
        var urlIsCurrentHref = void 0;
        if (location.href === _arguments[0]) {
            urlIsCurrentHref = true;
        }
        if (redispatched || urlIsHrefOfAnchor || urlIsCurrentHref) {
            print("An event is re-dispatched or the opened url is equal to the target's href or the url is equal to the current href");
            callEnd();
            bridge$1.showAlert(bridge$1.domain, url, false);
            return null;
        }
    }
    print('mock a window object');
    // Return a mock window object, in order to ensure that the page's own script does not accidentally throw TypeErrors.
    win = mockWindow(_arguments[0], _arguments[1]);
    context['mocked'] = true;
    callEnd();
    bridge$1.showAlert(bridge$1.domain, url, false);
    return win;
};
/**
 * Some popup scripts adds transparent overlays on each of page's links
 * which disappears only when popups are opened.
 * To restore the expected behavior, we need to detect if the event is 'masked' by artificial layers
 * and redirect it to the correct element.
 * ToDo: touch events: https://developer.mozilla.org/en/docs/Web/API/Touch_events
 * ToDo: check for real target's ancestors for anchor or input elements.
 * @return true if an event is re-dispatched.
 */
var dispatchIfBlockedByMask = function (event) {
    var currentEvent = event;
    if (currentEvent) {
        if ('clientX' in currentEvent && currentEvent.isTrusted) {
            call('Checking current MouseEvent for its genuine target..');
            var mouseEvent = currentEvent;
            var x = mouseEvent.clientX, y = mouseEvent.clientY, target = mouseEvent.target;
            if (target.nodeType !== Node.ELEMENT_NODE) {
                callEnd();
                return;
            }
            var elts = void 0;
            if (document.elementsFromPoint) {
                elts = document.elementsFromPoint(x, y);
            }
            else if (document.msElementsFromPoint) {
                elts = document.msElementsFromPoint(x, y);
            }
            else {
                print('document.elementsFromPoint API is not available, exiting');
                callEnd();
                return;
            }
            print('Elements at the clicked position are:', elts);
            var el = void 0;
            if (elts[0] === target) {
                print('The target is staying.');
                el = elts[1];
            }
            else {
                print('The target has modified inside event handlers.');
                el = elts[0];
            }
            if (!el) {
                callEnd();
                return;
            }
            var name_1 = el.nodeName.toLowerCase();
            if (name_1 == 'iframe' || name_1 == 'input' || name_1 == 'a' || el.hasAttribute('onclick') || el.hasAttribute('onmousedown')) {
                print('A real target candidate has default event handlers');
                var style = getComputedStyle(target);
                var position$$1 = style.getPropertyValue('position');
                var zIndex = parseInt(style.getPropertyValue('z-index'), 10);
                if ((position$$1 == 'absolute' || position$$1 == 'fixed') && zIndex > 1000) {
                    print('A mask candidate has expected style');
                    if (target.textContent.trim().length === 0 && target.getElementsByTagName('img').length === 0) {
                        print('A mask candidate has expected content, re-dispatching events..');
                        target.style.setProperty('display', 'none', 'important');
                        target.style.setProperty('pointer-events', 'none', 'important');
                        var clone = new MouseEvent(currentEvent.type, currentEvent);
                        currentEvent.stopPropagation();
                        currentEvent.stopImmediatePropagation();
                        _dispatchEvent.call(el, clone);
                        callEnd();
                        return true;
                    }
                }
            }
            callEnd();
        }
    }
};
var mockWindow = function (href, name) {
    var loc = document.createElement('a');
    loc.href = href;
    var doc = Object.create(HTMLDocument.prototype);
    var win = {};
    Object.getOwnPropertyNames(window).forEach(function (prop) {
        switch (typeof window[prop]) {
            case 'object':
                win[prop] = {};
                break;
            case 'function':
                win[prop] = function () { return true; };
                break;
            case 'string':
                win[prop] = '';
                break;
            case 'number':
                win[prop] = NaN;
                break;
            case 'boolean':
                win[prop] = false;
                break;
            case 'undefined':
                win[prop] = undefined;
                break;
        }
    });
    doc.location = loc;
    // doc.open = function(){return this;}
    // doc.write = function(){};
    // doc.close = function(){};
    win.opener = window;
    win.closed = false;
    win.name = name;
    win.location = loc;
    win.document = doc;
    return win;
};
wrapMethod(window, 'open', openVerifiedWindow);
wrapMethod(Window.prototype, 'open', openVerifiedWindow); // for IE

var clickVerified = function (_click, _this) {
    if (_this.nodeName.toLowerCase() == 'a') {
        print('click() was called on an anchor tag');
        // Checks if an url is in a whitelist
        if (bridge$1.whitelistedDestinations.indexOf(_this.host) !== -1) {
            _click.call(_this);
            return;
        }
        var passed = verifyCurrentEvent();
        if (!passed) {
            print('It did not pass the test, not clicking element');
            bridge$1.showAlert(bridge$1.domain, _this.host, false);
            callEnd();
            return;
        }
    }
    _click.call(_this);
};
clickVerified = connect(clickVerified, 'Verifying click');
wrapMethod(HTMLElement.prototype, 'click', clickVerified);

/**
 * @fileoverview Applies the userscript to iframes which has `location.href` `about:blank`.
 * It evaluates the code to the iframe's contentWindow when its getter is called for the first time.
 * There is a 2-way binding we are maintaining in proxy.ts between objects and proxied objects,
 * and this must be shared to the iframe, because objects can be passed back and forth between
 * the parent and the child iframes. To do so, we temporarily expose 2 weakmaps to the global scope
 * just before calling `eval`, and deletes it afterwards.
 * When debugging is active, iframe elements are printed to consoles, and some browsers may
 * invoke the contentWindow's getter. This may cause an infinite loop, so we do not apply the main block of eval'ing
 * the userscript when it is being processed, and to do so, we store such informaction in a `beingProcessed` WeakMap instance.
 */
var processed = new WeakMap$1();
var beingProcessed = new WeakMap$1();
var getContentWindow = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow').get;
var applyPopupBlockerOnGet = function (_get, _this) {
    if (!processed.has(_this)) {
        if (!beingProcessed.has(_this)) {
            call('getContent');
            beingProcessed.set(_this, true);
            var key = Math.random().toString(36).substr(7);
            var contentWindow = getContentWindow.call(_this);
            try {
                if (contentWindow.location.href === 'about:blank') {
                    print('An empty iframe called the contentWindow/Document getter for the first time, applying popupBlocker..', _this);
                    expose(key);
                    var code = 'window.__t = ' +
                        '(' + popupBlocker.toString() + ')(window,"' + key + '");';
                    contentWindow.eval(code);
                }
            }
            catch (e) {
                print('Applying popupBlocker to an iframe failed, due to an error:', e);
            }
            finally {
                unexpose(key);
                processed.set(_this, true);
                beingProcessed.delete(_this);
                callEnd();
            }
        }
    }
    return makeObjectProxy(_get.call(_this));
};
wrapAccessor(HTMLIFrameElement.prototype, 'contentWindow', applyPopupBlockerOnGet);
wrapAccessor(HTMLIFrameElement.prototype, 'contentDocument', applyPopupBlockerOnGet);
wrapAccessor(HTMLIFrameElement.prototype, 'src'); // logging only
wrapAccessor(HTMLIFrameElement.prototype, 'srcdoc');

wrapAccessor(HTMLObjectElement.prototype, 'data');

wrapMethod(Node.prototype, 'appendChild'); //This cause too much noise during document startup
wrapMethod(Node.prototype, 'removeCHild');

window.onbeforeunload = function (e) {
    return undefined;
};
window.addEventListener('unload', function () {
});

wrapMethod(Document.prototype, 'write');
wrapMethod(Document.prototype, 'writeIn');

return timeline$1;
;
}

if (!bridge.domainOption.whitelisted) {
    /**
     * In Firefox, userscripts can't write properties of unsafeWindow, so we create a <script> tag
     * to run the script in the page's context.
     */
    if (typeof InstallTrigger !== 'undefined' && document.currentScript === null) {
        // Firefox userscript
        var script = document.createElement('script');
        var text = "(" + popupBlocker.toString() + ")(this,!1,'" + BRIDGE_KEY + "')";
        script.textContent = text;
        var el = document.body || document.head || document.documentElement;
        el.appendChild(script);
        el.removeChild(script);
    }
    else {
        var win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
        popupBlocker(win, false, BRIDGE_KEY);
    }
}

}());
