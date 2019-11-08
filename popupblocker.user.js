// ==UserScript==
// @name AdGuard Popup Blocker (Dev)
// @name:ar مانع النوافذ المنبثقة AdGuard (Dev)
// @name:be Блакавальнік усплывальнай рэкламы ад AdGuard (Dev)
// @name:cs Blok. vyskak. oken AdGuard (Dev)
// @name:da AdGuard Popup Blocker (Dev)
// @name:de AdGuard Pop-up-Blocker (Dev)
// @name:es Bloqueador de popup de AdGuard (Dev)
// @name:fa مسدودساز پاپ-آپ AdGuard (Dev)
// @name:fi AdGuardin Ponnahdusikkunan estäjä (Dev)
// @name:fr Bloqueur de fenêtres pop-up de AdGuard (Dev)
// @name:id Pemblokir Popup AdGuard (Dev)
// @name:it Blocco Pop-Up di AdGuard (Dev)
// @name:ja AdGuard ポップアップブロッカー (Dev)
// @name:ko AdGuard 팝업 차단기 (Dev)
// @name:lt AdGuard iššokančiųjų langų blokatorius (Dev)
// @name:ms AdGuard Penyekat Pop Timbul (Dev)
// @name:no AdGuards popup-blokkerer (Dev)
// @name:pl Bloker wyskakujących okienek przez AdGuard (Dev)
// @name:pt AdGuard Bloqueador de Pop-ups (Dev)
// @name:pt-PT Bloqueador de Popup AdGuard (Dev)
// @name:ru Блокировщик всплывающей рекламы от AdGuard (Dev)
// @name:sl AdGuard Zaviralec pojavnih oken (Dev)
// @name:tr AdGuard Popup Blocker eklentisi (Dev)
// @name:uk Блокувальник спливаючої реклами AdGuard (Dev)
// @name:vi AdGuard Popup Blocker (Dev)
// @name:zh AdGuard 弹窗拦截器 (Dev)
// @name:zh-TW AdGuard 彈出式視窗封鎖器 (Dev)
// @namespace adguard
// @description Blocks popup ads on web pages
// @description:ar لحظر الإعلانات المنبثقة على صفحات الويب
// @description:be Блакуе ўсплывальную рэкламу на старонках
// @description:cs Blokuje vyskakovací reklamy na webových stránkách
// @description:da Blokerer pop-up reklamer på websider
// @description:de Blockiert Anzeige-Pop-ups auf Webseiten
// @description:es Bloquea elementos emergentes en sitios web
// @description:fa مسدودسازی تبلیغات پاپ آپ در صفحات وب.
// @description:fi Estää ponnahdusikkunamainokset verkkosivustoilla
// @description:fr Bloque les fenêtres pop-up avec publicités intrusives sur les pages web
// @description:id Blokir iklan popup di halaman web
// @description:it Blocca gli annunci di popup nelle pagine internet
// @description:ja Webページでポップアップ広告をブロックします。
// @description:ko 웹 페이지에서 팝업 광고를 차단
// @description:lt Blokuoja iššokančius skelbimus tinklalapiuose
// @description:ms Sekat pop timbul pada laman web
// @description:no Blokker popup-annonser på nettsider
// @description:pl Blokuje wyskakujące okienka na stronach internetowych
// @description:pt Bloqueia anúncios pop-ups dentro dos sites
// @description:pt-PT Bloqueia anúncios popup em páginas da web.
// @description:ru Блокирует всплывающую рекламу на страницах
// @description:sl Blokira pojavne oglase na spletnih straneh
// @description:tr Web sayfalarında açılan pencere reklamları engeller
// @description:uk Блокує спливаючу рекламу на веб-сторінках
// @description:vi Chặn quảng cáo bật lên trên các trang web
// @description:zh 拦截网页弹窗广告
// @description:zh-TW 封鎖於網頁上之彈出式視窗廣告
// @version 2.5.23
// @license LGPL-3.0; https://github.com/AdguardTeam/PopupBlocker/blob/master/LICENSE
// @downloadURL https://AdguardTeam.github.io/PopupBlocker/popupblocker.user.js
// @updateURL https://AdguardTeam.github.io/PopupBlocker/popupblocker.meta.js
// @supportURL https://github.com/AdguardTeam/PopupBlocker/issues
// @homepageURL https://popupblocker.adguard.com/
// @match http://*/*
// @match https://*/*
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @grant GM_listValues
// @grant GM_getResourceURL
// @grant unsafeWindow
// @icon ./assets/128.png
// @resource ./assets/fonts/bold/OpenSans-Bold.woff ./assets/fonts/bold/OpenSans-Bold.woff
// @resource ./assets/fonts/bold/OpenSans-Bold.woff2 ./assets/fonts/bold/OpenSans-Bold.woff2
// @resource ./assets/fonts/regular/OpenSans-Regular.woff ./assets/fonts/regular/OpenSans-Regular.woff
// @resource ./assets/fonts/regular/OpenSans-Regular.woff2 ./assets/fonts/regular/OpenSans-Regular.woff2
// @resource ./assets/fonts/semibold/OpenSans-Semibold.woff ./assets/fonts/semibold/OpenSans-Semibold.woff
// @resource ./assets/fonts/semibold/OpenSans-Semibold.woff2 ./assets/fonts/semibold/OpenSans-Semibold.woff2
// @run-at document-start
// ==/UserScript==
(function () {


}());
(function () {
var I18nService = /** @class */ (function () {
    function I18nService($getMessage) {
        this.$getMessage = $getMessage;
    }
    I18nService.prototype.getMsg = function (messageId, opt_values) {
        var str = this.$getMessage(messageId);
        if (opt_values) {
            str = str.replace(/\{\$([^}]+)}/g, function (match, key) {
                return (opt_values != null && key in opt_values) ? opt_values[key] : match;
            });
        }
        return str;
    };
    return I18nService;
}());

var matches = Element.prototype.matches || Element.prototype.msMatchesSelector;
var closest = 'closest' in Element.prototype ? function (el, selector) {
    return el.closest(selector);
} : function (el, selector) {
    while (el) {
        if (matches.call(el, selector)) {
            return el;
        }
        else {
            el = el.parentElement;
        }
    }
    return null;
};
/**
 * This serves as a whitelist on various checks where we block re-triggering of events.
 * See dom/dispatchEvent.ts.
 */


/**
 * Detects about:blank, about:srcdoc urls.
 */


var frameElementDesc = Object.getOwnPropertyDescriptor(window, 'frameElement') || Object.getOwnPropertyDescriptor(Window.prototype, 'frameElement');
var getFrameElement = frameElementDesc.get;

var shadowDomV1Support = 'attachShadow' in Element.prototype;

/**
 * @fileoverview Utility functions for instanceof checks against DOM classes. Used for type casting.
 * Since it is common for us to cross the border of browsing contexts, instanceof
 * check for DOM element is not reliable.
 */






/**/











/**/
function isUndef(obj) {
    return typeof obj === 'undefined';
}

function isNumber(obj) {
    return typeof obj === 'number';
}
/**/

function trustedEventListener(listener, __this) {
    return function (evt) {
        if (!evt || evt.isTrusted) {
            listener.call(__this, evt);
            evt && evt.preventDefault();
        }
    };
}
function getByClsName(className, element) {
    if (element === void 0) { element = document; }
    return element.getElementsByClassName(className);
}
function concatStyle(style, important) {
    var cssText = '';
    for (var i = 0, l = style.length; i < l; i++) {
        cssText += style[i] + ':' + style[++i];
        if (important) {
            cssText += '!important';
        }
        cssText += ';';
    }
    return cssText;
}
var safeDoc;
function getSafeDocument() {
    if (isUndef(safeDoc)) {
        safeDoc = document.implementation.createHTMLDocument('');
    }
    return safeDoc;
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var SingleEventEmitter = /** @class */ (function () {
    function SingleEventEmitter(eventName) {
        this.eventName = eventName;
        this.listeners = [];
    }
    SingleEventEmitter.prototype.emit = function () {
        var listeners = this.listeners;
        for (var i = 0, l = listeners.length; i < l; i++) {
            var listener = listeners[i];
            try {
                listener();
            }
            catch (e) { }
        }
    };
    SingleEventEmitter.prototype.addListener = function (listener) {
        this.listeners.push(listener);
    };
    SingleEventEmitter.prototype.removeListener = function (listener) {
        var i = this.listeners.indexOf(listener);
        if (i !== -1) {
            this.listeners.splice(i, 1);
        }
    };
    SingleEventEmitter.prototype.handleEvent = function (evt) {
        if (evt.isTrusted) {
            this.emit();
        }
    };
    SingleEventEmitter.prototype.$install = function (target) {
        target.addEventListener(this.eventName, this);
    };
    SingleEventEmitter.prototype.$uninstall = function (target) {
        target.removeEventListener(this.eventName, this);
    };
    return SingleEventEmitter;
}());

/**
 * It is a common practice for us to inject UI elements to page's DOM.
 * This class provides an abstraction of such
 */
var FrameInjector = /** @class */ (function (_super) {
    __extends(FrameInjector, _super);
    function FrameInjector() {
        var _this = _super.call(this, 'load') || this;
        // Made public to be accessed in handleEvent method body
        _this.loadedOnce = false;
        var iframe = _this.iframe = getSafeDocument().createElement('iframe');
        iframe.setAttribute('allowTransparency', 'true');
        if (FrameInjector.isIE10OrLower()) {
            // Workaround for https://github.com/AdguardTeam/PopupBlocker/issues/67
            iframe.src = "javascript:document.write('<script>document.domain=\"" + document.domain + "\";</script>');document.close();";
        }
        _this.$install(iframe);
        FrameInjector.instances.push(_this);
        return _this;
    }
    FrameInjector.isIE10OrLower = function () {
        var documentMode = document.documentMode;
        return documentMode < 11;
    };
    FrameInjector.getShadowRoot = function () {
        var shadowRoot = FrameInjector.shadowRoot;
        if (isUndef(shadowRoot)) {
            var host = getSafeDocument().createElement('div');
            shadowRoot = FrameInjector.shadowRoot = host.attachShadow({ mode: 'closed' });
            var hostStyleEl = getSafeDocument().createElement('style');
            hostStyleEl.textContent = ":host{" + concatStyle(FrameInjector.shadowHostStyle, true) + "}";
            shadowRoot.appendChild(hostStyleEl);
            document.documentElement.appendChild(host);
        }
        return shadowRoot;
    };
    FrameInjector.detach = function (el) {
        var parent = el.parentNode;
        if (!parent) {
            return;
        }
        parent.removeChild(el);
    };
    FrameInjector.prototype.handleEvent = function (evt) {
        if (this.loadedOnce) {
            return;
        }
        if (!evt.isTrusted) {
            return;
        }
        this.loadedOnce = true;
        var listeners = this.listeners;
        for (var i = 0, l = listeners.length; i < l; i++) {
            var cb = listeners[i];
            cb();
        }
    };
    FrameInjector.prototype.inject = function () {
        if (shadowDomV1Support) {
            FrameInjector.getShadowRoot().appendChild(this.iframe);
        }
        else {
            document.documentElement.appendChild(this.iframe);
        }
    };
    FrameInjector.prototype.getFrameElement = function () {
        return this.iframe;
    };
    FrameInjector.prototype.$destroy = function () {
        var i = FrameInjector.instances.indexOf(this);
        if (i === -1) {
            return;
        }
        FrameInjector.instances.splice(i, 1);
        var iframe = this.iframe;
        FrameInjector.detach(iframe);
        iframe.removeEventListener('load', this);
        this.iframe = undefined;
        if (shadowDomV1Support && FrameInjector.instances.length === 0) {
            // detach shadowRoot when it is no longer used.
            var host = FrameInjector.shadowRoot.host;
            FrameInjector.detach(host);
            FrameInjector.shadowRoot = undefined;
        }
    };
    FrameInjector.shadowHostStyle = [
        "display", "block",
        "position", "relative",
        "width", String(0),
        "height", String(0),
        "margin", String(0),
        "padding", String(0),
        "overflow", "hidden",
        "z-index", String(-1 - (1 << 31))
    ];
    FrameInjector.instances = [];
    return FrameInjector;
}(SingleEventEmitter));

// soyutils.js will be inlined here.
// A few closure library functions that are used in compiled soy templates
// but are missing in soyutils.js
goog.getCssName = function (arg) {
    return arg;
};

goog.isString = function (arg) {
    return typeof arg === 'string';
};

goog.isNumber = function (arg) {
    return typeof arg === 'number';
};

// https://github.com/google/closure-library/blob/master/closure/goog/asserts/asserts.js
goog.asserts.assertArray = function (arg) {
    if (!Array.isArray(arg)) {
        throw 'A closure library shim error has occured';
    }
    return arg;
};

/**
 * @fileoverview Global namespace to be used throughout the content script.
 */
var adguard = {};

var soydata_VERY_UNSAFE = soydata.VERY_UNSAFE;

var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

var create = Object.create;




var functionApply = Function.prototype.apply;
var functionCall = Function.prototype.call;
var functionBind = Function.prototype.bind;
var functionToString = Function.prototype.toString;

var ProxyCtor = window.Proxy;
// Conditional export workaround for tsickle

var MO = window.MutationObserver || window.WebKitMutationObserver;
var MessageChannelCtor = window.MessageChannel;
var setTimeout$1 = window.setTimeout.bind(window);
var getContentWindow = getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow').get;
var getContentDocument = getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentDocument').get;
var getMessageSource = getOwnPropertyDescriptor(MessageEvent.prototype, 'source').get;

/// <reference path="../../../node_modules/closure-library.ts/closure-library.d.ts/all.d.ts"/>
/// <reference path="../../../node_modules/closure-tools-helper/soyutils.d.ts"/>
var px = 'px';
/**************************************************************************************************/
/**
 * These magic numbers are dictated in the CSS.
 * These are base of position calculation; There are other constants that are
 * dictated in the CSS such as the width of the alert, but we instead read it from
 * `HTMLElement.offset***` api to reduce coupling with CSS.
 */
var PIN_TOP = 5;
var PIN_RIGHT = 5;
var ALERT_TOP_REL_PIN = 0;
/**
 * Specified in styles as box-shadow: 0 0 10px 3px
 * https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow#<blur-radius>
 */
var BLUR_OFFSET = 10 / 2 + 3;
var PIN_OFFSET_RIGHT = BLUR_OFFSET;
var IFRAME_RIGHT = PIN_RIGHT - PIN_OFFSET_RIGHT;
var PIN_OFFSET_TOP_COLLAPSED = BLUR_OFFSET;
var IFRAME_TOP_COLLAPSED = PIN_TOP - PIN_OFFSET_TOP_COLLAPSED;
var ALERT_OFFSET_TOP_EXPANDED = BLUR_OFFSET;
var PIN_OFFSET_TOP_EXPANDED = ALERT_OFFSET_TOP_EXPANDED - ALERT_TOP_REL_PIN;
var IFRAME_TOP_EXPANDED = PIN_TOP - PIN_OFFSET_TOP_EXPANDED;
/**************************************************************************************************/
var AlertView = /** @class */ (function () {
    function AlertView(cssService, controller) {
        this.cssService = cssService;
        this.controller = controller;
        // Wraps methods of the controller to a trusted event listener
        this.onClose = trustedEventListener(this.controller.onClose, this.controller);
        this.onPinClick = trustedEventListener(this.controller.onPinClick, this.controller);
        this.onContinueBlocking = trustedEventListener(this.controller.onContinueBlocking, this.controller);
        this.onOptionChange = trustedEventListener(this.controller.onOptionChange, this.controller);
        this.onMouseEnter = trustedEventListener(this.controller.onMouseEnter, this.controller);
        this.onMouseLeave = trustedEventListener(this.controller.onMouseLeave, this.controller);
        this.onUserInteraction = trustedEventListener(this.controller.onUserInteraction, this.controller);
        this.renderHead = functionBind.call(this.renderHead, this);
        this.appendIframe();
    }
    AlertView.prototype.appendIframe = function () {
        // Create a FrameInjector instance, and store related states.
        var frameInjector = this.frameInjector = new FrameInjector();
        // Add `load` event listeners
        frameInjector.addListener(this.renderHead);
        // Set inline style for the frame.
        /** @todo Abstract this operation from FrameInjector, remove `getFrameElement` */
        var iframe = frameInjector.getFrameElement();
        iframe.style.cssText = concatStyle(AlertView.initialAlertFrameStyle, false);
        this.iframeWidth = this.iframeHeight = 0;
        iframe.style.width = iframe.style.height = 0 + px;
        // Append to the DOM.
        frameInjector.inject();
    };
    AlertView.prototype.render = function (numPopup, origDomain, destUrl, callback) {
        var _this = this;
        if (this.frameDoc && this.frameDoc.readyState === 'complete') {
            this.renderBodyOnLoad(numPopup, origDomain, destUrl);
            callback();
        }
        else {
            this.frameInjector.addListener(function (evt) {
                _this.renderBodyOnLoad(numPopup, origDomain, destUrl);
                callback();
                // This is a workaround for issues on Edge and IE.
                // It seems that right after our template is appended, element's offsetWidth and such
                // are not fully realized. It is lesser for about 16 or 17 pixels then it should have been,
                // and it causes a part of ui to be cropped from the left side.
                // Maybe there is some asynchronous rendering going on. Maybe box-shadows.
                // TODO: find an exact cause of it, and remove this
                requestAnimationFrame(function () {
                    _this.updateIframePosition();
                });
            });
        }
    };
    AlertView.prototype.renderHead = function () {
        var document = this.frameDoc = this.frameInjector.getFrameElement().contentDocument;
        // Render template
        var template = popupblockerUI.head({
            cssText: soydata_VERY_UNSAFE.ordainSanitizedHtml(this.cssService.getAlertCSS()),
            preloadFonts: this.cssService.getAlertPreloadFontURLs()
        });
        document.documentElement.innerHTML = template;
        // Attach event listeners.
        document.addEventListener('click', this.onUserInteraction, true);
        document.addEventListener('touchstart', this.onUserInteraction, true);
    };
    AlertView.prototype.renderBodyOnLoad = function (numPopup, origDomain, destUrl) {
        var document = this.frameDoc;
        var template = popupblockerUI.content({ numPopup: numPopup, origDomain: origDomain, destUrl: destUrl });
        document.body.innerHTML = template;
        var doc = this.frameDoc;
        // Get references of elements.
        this.alertRoot = getByClsName(goog.getCssName('alert'), doc)[0];
        this.pinRoot = getByClsName(goog.getCssName('pin'), doc)[0];
        // Get references of interactive elements.
        var closeBtn = getByClsName(goog.getCssName('alert__close'), doc)[0];
        var pin = this.pinRoot;
        var continueBtn = getByClsName(goog.getCssName('alert__btn'), doc)[0];
        var select = getByClsName(goog.getCssName('alert__select'), doc)[0];
        // Attach event listeners.
        closeBtn.addEventListener('click', this.onClose);
        pin.addEventListener('click', this.onPinClick);
        continueBtn.addEventListener('click', this.onContinueBlocking);
        select.addEventListener('change', this.onOptionChange);
        this.alertRoot.addEventListener('mouseenter', this.onMouseEnter);
        this.alertRoot.addEventListener('mouseleave', this.onMouseLeave);
        pin.addEventListener('mouseenter', this.onMouseEnter);
        pin.addEventListener('mouseleave', this.onMouseLeave);
        // The template is rendered in a collapsed state.
        if (!this.collapsed) {
            this.alertRoot.classList.add(goog.getCssName('alert--show'));
        }
        this.updatePosition();
    };
    AlertView.prototype.$expand = function () {
        this.alertRoot.classList.add(goog.getCssName('alert--show'));
        this.collapsed = false;
        this.updatePosition();
    };
    AlertView.prototype.$collapse = function () {
        this.alertRoot.classList.remove(goog.getCssName('alert--show'));
        this.collapsed = true;
        this.updatePosition();
    };
    AlertView.prototype.updatePosition = function (evt) {
        this.updatePinRootHeight();
        this.updateIframePosition();
    };
    AlertView.prototype.updatePinRootHeight = function () {
        var pinOffsetTop = this.collapsed ? PIN_OFFSET_TOP_COLLAPSED : PIN_OFFSET_TOP_EXPANDED;
        this.pinRoot.style.top = pinOffsetTop + px;
    };
    AlertView.prototype.updateIframePosition = function () {
        var iframeStyle = this.frameInjector.getFrameElement().style;
        var _a = (this.collapsed ? this.pinRoot : this.alertRoot), offsetLeft = _a.offsetLeft, offsetTop = _a.offsetTop, offsetHeight = _a.offsetHeight;
        // Adjusts iframe width and height so that the bottom left corner of the element
        // (pinRoot in collapsed, alertRoot in un-collapsed mode) plus its shadow fits in the iframe
        iframeStyle.width = (this.iframeWidth -= offsetLeft - BLUR_OFFSET) + px;
        iframeStyle.height = (this.iframeHeight = offsetTop + offsetHeight + BLUR_OFFSET) + px;
        iframeStyle.right = IFRAME_RIGHT + px;
        iframeStyle.top = (this.collapsed ? IFRAME_TOP_COLLAPSED : IFRAME_TOP_EXPANDED) + px;
    };
    AlertView.prototype.$destroy = function () {
        this.frameInjector.$destroy();
        this.frameInjector = null;
    };
    /**
     * Constants used to configure the view
     */
    AlertView.initialAlertFrameStyle = [
        "position", "fixed",
        "right", 0 + px,
        "top", 0 + px,
        "border", "none",
        "z-index", String(-1 - (1 << 31))
    ];
    return AlertView;
}());

/**
 * @fileoverview This instance enables firing callbacks when text size changes, e.g. due to external font being applied.
 * The logic is exactly the same as one described in http://smnh.me/web-font-loading-detection-without-timers/
 */
var px$1 = 'px';
var TextSizeWatcher = /** @class */ (function (_super) {
    __extends(TextSizeWatcher, _super);
    function TextSizeWatcher(root) {
        var _this = _super.call(this, "scroll") || this;
        _this.root = root;
        _this.createDetectorElement();
        return _this;
    }
    /**
     * Returns !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz
     */
    TextSizeWatcher.getTestText = function () {
        var codePoints = [];
        for (var i = 0x21; i <= 0x7a; i++) {
            codePoints.push(i);
        }
        return String.fromCharCode.apply(null, codePoints);
    };
    TextSizeWatcher.prototype.createDetectorElement = function () {
        var document = this.root.ownerDocument;
        var wrapper = this.wrapper = document.createElement('div');
        var content = document.createElement('div');
        var innerWrapper = this.innerWrapper = document.createElement('div');
        var innerContent = document.createElement('div');
        wrapper.style.cssText = "left:9999px;positiion:absolute;overflow:hidden";
        content.style.cssText = "position:relative;white-space:nowrap;font-family:serif";
        innerWrapper.style.cssText = "position:absolute;width:100%;height:100%;overflow:hidden";
        var contentText = document.createTextNode(TextSizeWatcher.getTestText());
        content.appendChild(contentText);
        wrapper
            .appendChild(content)
            .appendChild(innerWrapper)
            .appendChild(innerContent);
        this.root.appendChild(wrapper);
        var offsetWidth = content.offsetWidth, offsetHeight = content.offsetHeight;
        var wrapperStyle = wrapper.style;
        var innerContentStyle = innerContent.style;
        wrapperStyle.width = innerContentStyle.width = offsetWidth - 1 + px$1;
        wrapperStyle.height = innerContentStyle.height = offsetHeight - 1 + px$1;
        TextSizeWatcher.scrollElementToBottomRightCorner(wrapper);
        TextSizeWatcher.scrollElementToBottomRightCorner(innerContent);
        this.$install(wrapper);
        this.$install(innerWrapper);
    };
    TextSizeWatcher.scrollElementToBottomRightCorner = function (el) {
        var scrollWidth = el.scrollWidth, clientWidth = el.clientWidth, scrollHeight = el.scrollHeight, clientHeight = el.clientHeight;
        el.scrollLeft = scrollWidth - clientWidth;
        el.scrollTop = scrollHeight - clientHeight;
    };
    TextSizeWatcher.prototype.$destroy = function () {
        this.$uninstall(this.wrapper);
        this.$uninstall(this.innerWrapper);
    };
    return TextSizeWatcher;
}(SingleEventEmitter));

/// <reference path="../../../node_modules/closure-library.ts/closure-library.d.ts/all.d.ts"/>
var px$2 = 'px';
var ToastController = /** @class */ (function () {
    function ToastController(cssService, defaultDuration) {
        this.cssService = cssService;
        this.defaultDuration = defaultDuration;
        this.$state = 0 /* NONE */;
        this.updateIframePosition = functionBind.call(this.updateIframePosition, this);
        this.updateIframePositionOnLoad = functionBind.call(this.updateIframePositionOnLoad, this);
    }
    ToastController.prototype.showNotification = function (message, duration) {
        var _this = this;
        // Stores duration of the current toast
        this.currentDuration = duration || this.defaultDuration;
        // Dismiss existing toast, if there was any.
        var prevState = this.$state;
        this.dismissCurrentNotification();
        // Attach toast Element
        var outerHTML = popupblockerUI.head({
            cssText: soydata_VERY_UNSAFE.ordainSanitizedHtml(this.cssService.getToastCSS()),
            preloadFonts: this.cssService.getToastPreloadFontURLs()
        });
        var toastHTML = popupblockerNotificationUI.toast({ message: message });
        var frameInjector = this.frameInjector = new FrameInjector();
        frameInjector.getFrameElement().style.cssText = concatStyle(ToastController.TOAST_FRAME_STYLE, false);
        frameInjector.addListener(function () {
            if (isUndef(_this.frameInjector)) {
                return;
            }
            var toastHTML = popupblockerNotificationUI.toast({ message: message });
            var iframe = _this.frameInjector.getFrameElement();
            var doc = iframe.contentDocument;
            doc.documentElement.innerHTML = outerHTML;
            doc.body.innerHTML = toastHTML;
            _this.toastEl = doc.body.firstElementChild;
        });
        frameInjector.addListener(this.updateIframePositionOnLoad);
        frameInjector.addListener(function () {
            _this.setState(prevState === 2 /* FULL */ || prevState === 3 /* WANING */ ?
                2 /* FULL */ :
                1 /* WAXING */);
        });
        frameInjector.inject();
    };
    ToastController.prototype.updateIframePositionOnLoad = function () {
        this.updateIframePosition();
        var textSizeWatcher = this.textSizeWatcher = new TextSizeWatcher(this.toastEl);
        textSizeWatcher.addListener(this.updateIframePosition);
    };
    ToastController.prototype.updateIframePosition = function () {
        var _a = this.toastEl.firstElementChild, offsetWidth = _a.offsetWidth, offsetHeight = _a.offsetHeight;
        var iframeStyle = this.frameInjector.getFrameElement().style;
        iframeStyle.left = "calc(50% - " + offsetWidth / 2 + "px)";
        iframeStyle.width = offsetWidth + px$2;
        iframeStyle.height = offsetHeight + px$2;
    };
    ToastController.prototype.dismissCurrentNotification = function () {
        var frameInjector = this.frameInjector;
        if (isUndef(frameInjector)) {
            return;
        }
        frameInjector.$destroy();
        clearTimeout(this.stateTransitionTimer);
        var textSizeWatcher = this.textSizeWatcher;
        if (isUndef(textSizeWatcher)) {
            return;
        }
        textSizeWatcher.$destroy();
        this.frameInjector = this.toastEl = this.stateTransitionTimer = this.textSizeWatcher = undefined;
    };
    ToastController.prototype.setState = function (state) {
        var _this = this;
        clearTimeout(this.stateTransitionTimer);
        switch (state) {
            case 1 /* WAXING */:
                requestAnimationFrame(function () {
                    _this.toastEl.classList.add(goog.getCssName('toast--active'));
                });
                this.stateTransitionTimer = setTimeout(function () {
                    _this.setState(2 /* FULL */);
                }, ToastController.TRANSITION_DURATION);
                break;
            case 2 /* FULL */:
                this.toastEl.classList.add(goog.getCssName('toast--active'));
                this.stateTransitionTimer = setTimeout(function () {
                    _this.setState(3 /* WANING */);
                }, this.currentDuration);
                break;
            case 3 /* WANING */:
                this.toastEl.classList.remove(goog.getCssName('toast--active'));
                this.stateTransitionTimer = setTimeout(function () {
                    _this.setState(0 /* NONE */);
                }, ToastController.TRANSITION_DURATION);
                break;
            case 0 /* NONE */:
                this.dismissCurrentNotification();
                this.stateTransitionTimer = undefined;
                break;
        }
        this.$state = state;
    };
    ToastController.TOAST_STYLE = ".toast{width:100%;position:absolute;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;bottom:0;left:0;opacity:0;visibility:hidden;transition:.3s ease opacity,.3s ease visibility;font-size:14px;font-family:\"Open Sans\",-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Ubuntu,\"Helvetica Neue\",Arial,sans-serif;font-weight:400}.toast--active{opacity:1;visibility:visible}.toast__in{padding:15px 30px;max-width:190px;color:#fff;border-radius:5px;text-align:center;white-space:nowrap;background-color:rgba(0,0,0,.7)}";
    ToastController.TOAST_FRAME_STYLE = [
        "position", "fixed",
        "bottom", 15 + px$2,
        "width", 0 + px$2,
        "height", 0 + px$2,
        "border", "none",
        "z-index", String(-1 - (1 << 31))
    ];
    ToastController.TRANSITION_DURATION = 300;
    return ToastController;
}());

var AlertController = /** @class */ (function () {
    function AlertController(cssService, settingsDao, 
        // Platform-specific functionalities are injected via ctor
        $openOptionsPage) {
        this.cssService = cssService;
        this.settingsDao = settingsDao;
        this.$openOptionsPage = $openOptionsPage;
        /**
         * Controller state provided from external sources
         */
        this.domainToPopupCount = create(null);
        /**
         * Controller internal states
         */
        this.$state = 0 /* NONE */;
        this.$expand = functionBind.call(this.$expand, this);
        this.$collapse = functionBind.call(this.$collapse, this);
        this.$destroy = functionBind.call(this.$destroy, this);
        this.notifyAboutSavedSettings = functionBind.call(this.notifyAboutSavedSettings, this);
        this.toastController = new ToastController(this.cssService, AlertController.TOAST_DURATION);
    }
    /**
     * Not providing @param callback means that a currently scheduled transition will be canceled.
     */
    AlertController.prototype.scheduleTransition = function (callback, timeout) {
        clearTimeout(this.stateTransitionTimer);
        if (callback) {
            this.stateTransitionTimer = setTimeout$1(callback, timeout);
            this.timerStart = Date.now();
            this.remainingTimeout = timeout;
        }
        else {
            this.stateTransitionTimer = this.timerStart = this.remainingTimeout = null;
        }
    };
    /**
     * State transition handlers
     */
    AlertController.prototype.$expand = function () {
        this.alertView.$expand();
        this.$state = 1 /* EXPANDED */;
        // Schedules auto-collapse.
        this.scheduleTransition(this.$collapse, AlertController.STATE_TRANSITION_TIMEOUT);
        this.remainingAfterMouseLeave = null;
    };
    AlertController.prototype.$collapse = function () {
        this.alertView.$collapse();
        this.$state = 2 /* COLLAPSED */;
        // Schedules auto-destroy.
        this.scheduleTransition(this.$destroy, AlertController.STATE_TRANSITION_TIMEOUT);
        this.remainingAfterMouseLeave = null;
    };
    AlertController.prototype.$destroy = function () {
        if (this.alertView) {
            this.alertView.$destroy();
            this.alertView = null;
        }
        this.$state = 0 /* NONE */;
        this.scheduleTransition();
        this.remainingAfterMouseLeave = null;
    };
    /**
     * Public methods
     */
    AlertController.prototype.createAlert = function (origDomain, destUrl) {
        var _this = this;
        var domainToPopupCount = this.domainToPopupCount;
        var numPopup = isUndef(domainToPopupCount[origDomain]) ?
            (domainToPopupCount[origDomain] = 1) :
            ++domainToPopupCount[origDomain];
        // Initialize view when necessary
        if (!this.alertView) {
            this.alertView = new AlertView(this.cssService, this);
        }
        var alertData = this.currentAlertData = { origDomain: origDomain, destUrl: destUrl };
        this.alertView.render(numPopup, origDomain, destUrl, function () {
            _this.renderedAlertData = alertData;
        });
        switch (this.$state) {
            case 0 /* NONE */:
                // If it is a first alert, start in an expanded state
                // The View will render the alert in an expanded state in this case.
                this.$state = 1 /* EXPANDED */;
                this.scheduleTransition(this.$collapse, AlertController.STATE_TRANSITION_TIMEOUT);
                break;
            case 1 /* EXPANDED */:
                // If a new alert has arrived while it is in an expanded state,
                // resets the timer.
                this.scheduleTransition(this.$collapse, AlertController.STATE_TRANSITION_TIMEOUT);
                break;
        }
    };
    AlertController.prototype.onMouseEnter = function () {
        // Only do the logic of postponing state transition when there is
        // an ongoing timer.
        if (!isNumber(this.stateTransitionTimer)) {
            return;
        }
        this.remainingAfterMouseLeave = this.remainingTimeout - (Date.now() - this.timerStart);
        this.scheduleTransition();
    };
    AlertController.prototype.onMouseLeave = function () {
        if (!isNumber(this.remainingAfterMouseLeave)) {
            return;
        }
        // The alert should not be collapsed within 2 sec of of mouseleave event.
        this.scheduleTransition(this.$state === 1 /* EXPANDED */ ? this.$collapse : this.$destroy, max(this.remainingAfterMouseLeave, AlertController.HOVER_TIMEOUT_INCR));
        this.remainingAfterMouseLeave = null;
    };
    AlertController.prototype.onClose = function () {
        this.$collapse();
    };
    AlertController.prototype.onPinClick = function () {
        switch (this.$state) {
            case 2 /* COLLAPSED */:
                this.$expand();
                break;
            case 1 /* EXPANDED */:
                this.$collapse();
                break;
        }
    };
    AlertController.prototype.onContinueBlocking = function () {
        this.$destroy();
    };
    AlertController.prototype.onOptionChange = function (evt) {
        var select = evt.target;
        var selectedValue = select.value;
        switch (selectedValue) {
            case "1":
                this.settingsDao.setWhitelist(this.renderedAlertData.origDomain, true, this.notifyAboutSavedSettings);
                break;
            case "2":
                this.settingsDao.setSourceOption(this.renderedAlertData.origDomain, 1 /* SILENCED */, this.notifyAboutSavedSettings);
                break;
            case "3":
                this.$openOptionsPage();
                this.onOptionChangeOperationCompletion();
                break;
            case "4":
                window.open(this.renderedAlertData.destUrl, '_blank');
                this.onOptionChangeOperationCompletion();
                break;
        }
        evt.preventDefault();
    };
    AlertController.prototype.onUserInteraction = function () {
        this.scheduleTransition();
    };
    AlertController.prototype.onOptionChangeOperationCompletion = function () {
        this.$destroy();
    };
    AlertController.prototype.notifyAboutSavedSettings = function () {
        var toastController = this.toastController;
        if (toastController) {
            toastController.showNotification(adguard.i18nService.$getMessage("settings_saved"));
        }
        this.onOptionChangeOperationCompletion();
    };
    /**
     * Configuration constants
     */
    AlertController.STATE_TRANSITION_TIMEOUT = 1000 * 10; // 10 sec
    AlertController.HOVER_TIMEOUT_INCR = 1000 * 2; // 2 sec
    AlertController.TOAST_DURATION = 1000 * 2; // 2 seconds
    return AlertController;
}());
function max(a, b) {
    return a > b ? a : b;
}

var crypto = window.crypto || window.msCrypto;
var getRandomStr = crypto ? function () {
    var buffer = new Uint8Array(24);
    crypto.getRandomValues(buffer);
    return btoa(String.fromCharCode.apply(null, buffer));
} : (function () {
    var counter = Date.now() % 1e9;
    return function () {
        return '' + (Math.random() * 1e9 >>> 0) + counter++;
    };
})();

var XHR = window.XMLHttpRequest;
var UserscriptSettingsDao = /** @class */ (function () {
    function UserscriptSettingsDao() {
        this.settingsChangeListeners = [];
    }
    UserscriptSettingsDao.migrateDataIfNeeded = function () {
        var dataVersion = parseFloat(GM_getValue(UserscriptSettingsDao.DATA_VERSION_KEY, '1'));
        if (dataVersion < 2) {
            var whitelist = [];
            GM_forEach(new Ver1DataMigrator(whitelist));
            GM_setValue(UserscriptSettingsDao.WHITELIST, whitelist.join(','));
            GM_setValue(UserscriptSettingsDao.DATA_VERSION_KEY, String(UserscriptSettingsDao.CURRENT_VERSION));
        }
    };
    UserscriptSettingsDao.prototype.setSourceOption = function (domain, option, cb) {
        GM_setValue(domain, option);
        this.flushPageCache();
        if (!isUndef(cb)) {
            cb();
        }
        this.fireListeners();
    };
    UserscriptSettingsDao.prototype.getSourceOption = function (domain) {
        return GM_getValue(domain, 0 /* NONE */);
    };
    UserscriptSettingsDao.getWhitelist = function () {
        var whitelistStringified = GM_getValue(UserscriptSettingsDao.WHITELIST);
        if (isUndef(whitelistStringified) || whitelistStringified.length === 0) {
            // Discard zero-length string
            return [];
        }
        return whitelistStringified.split(',');
    };
    UserscriptSettingsDao.prototype.setWhitelist = function (domain, whitelisted, cb) {
        var whitelist = UserscriptSettingsDao.getWhitelist();
        var prevWhitelistInd = whitelist.indexOf(domain);
        if (prevWhitelistInd === -1 && whitelisted !== false) {
            whitelist.push(domain);
        }
        else if (prevWhitelistInd !== -1 && whitelisted !== true) {
            whitelist.splice(prevWhitelistInd, 1);
        }
        else {
            if (!isUndef(cb)) {
                cb();
            }
            return;
        }
        GM_setValue(UserscriptSettingsDao.WHITELIST, whitelist.join(','));
        this.flushPageCache();
        if (!isUndef(cb)) {
            cb();
        }
        this.fireListeners();
    };
    UserscriptSettingsDao.prototype.getIsWhitelisted = function (domain) {
        var whitelist = UserscriptSettingsDao.getWhitelist();
        return whitelist.indexOf(domain) !== -1;
    };
    UserscriptSettingsDao.prototype.getEnumeratedOptions = function () {
        var whitelisted = [];
        var silenced = [];
        GM_forEach(new AllOptionsBuilder(whitelisted, silenced));
        return [whitelisted, silenced];
    };
    UserscriptSettingsDao.prototype.enumerateOptions = function (cb) {
        cb(this.getEnumeratedOptions());
    };
    UserscriptSettingsDao.prototype.fireListeners = function () {
        var listeners = this.settingsChangeListeners;
        var options = this.getEnumeratedOptions();
        for (var i = 0, l = listeners.length; i < l; i++) {
            listeners[i](options);
        }
    };
    UserscriptSettingsDao.prototype.onSettingsChange = function (cb) {
        this.settingsChangeListeners.push(cb);
    };
    UserscriptSettingsDao.prototype.getInstanceID = function () {
        var instanceID = GM_getValue(UserscriptSettingsDao.INSTANCE_ID_KEY);
        if (isUndef(instanceID)) {
            instanceID = getRandomStr();
            GM_setValue(UserscriptSettingsDao.INSTANCE_ID_KEY, instanceID);
            this.flushPageCache();
        }
        return instanceID;
    };
    /**
     * Force flush the current page cache.
     * This is an ugly solution for https://github.com/AdguardTeam/PopupBlocker/issues/131
     */
    UserscriptSettingsDao.prototype.flushPageCache = function () {
        var xhr = new XHR();
        xhr.open('GET', window.location.href, true);
        xhr.setRequestHeader('Pragma', 'no-cache');
        xhr.setRequestHeader('Expires', '-1');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.send();
    };
    /**
     * The version number of the data scheme that this implemenation uses.
     */
    UserscriptSettingsDao.CURRENT_VERSION = 2;
    /**
     * A GM_value key, storing a data scheme's version number in a string.
     */
    UserscriptSettingsDao.DATA_VERSION_KEY = "ver";
    /**
     * A GM_value key, storing a comma-separated list of whitelisted domains.
     */
    UserscriptSettingsDao.WHITELIST = "whitelist";
    UserscriptSettingsDao.INSTANCE_ID_KEY = '#id';
    return UserscriptSettingsDao;
}());
function GM_forEach(iterator) {
    var keys = GM_listValues();
    for (var i = 0, l = keys.length; i < l; i++) {
        var key = keys[i];
        var value = GM_getValue(key);
        iterator.callback(key, value);
    }
}
var Ver1DataMigrator = /** @class */ (function () {
    function Ver1DataMigrator(whitelist) {
        this.whitelist = whitelist;
    }
    Ver1DataMigrator.prototype.callback = function (key, value) {
        if (typeof value === 'string') {
            if (key === Ver1DataMigrator.VER_1_WHITELIST_KEY) {
                Array.prototype.push.apply(this.whitelist, value.split(','));
            }
            else {
                try {
                    // Domain settings
                    if (JSON.parse(value)['whitelisted'] === true) {
                        if (this.whitelist.indexOf(key) === -1) {
                            this.whitelist.push(key);
                        }
                    }
                }
                catch (e) { }
            }
        }
        GM_deleteValue(key);
    };
    Ver1DataMigrator.VER_1_WHITELIST_KEY = 'whitelist';
    return Ver1DataMigrator;
}());
var AllOptionsBuilder = /** @class */ (function () {
    function AllOptionsBuilder(whitelisted, silenced) {
        this.whitelisted = whitelisted;
        this.silenced = silenced;
    }
    AllOptionsBuilder.prototype.callback = function (key, value) {
        if (key === UserscriptSettingsDao.WHITELIST) {
            if (value.length > 0) {
                Array.prototype.push.apply(this.whitelisted, value.split(','));
            }
        }
        else if (key !== UserscriptSettingsDao.DATA_VERSION_KEY) {
            if ((value & 1 /* SILENCED */) !== 0) {
                this.silenced.push(key);
            }
        }
    };
    return AllOptionsBuilder;
}());

/**
 * Note: it should always request new data with GM_getValue,
 * in order to retrieve the most up-to-date data.
 */
var UserscriptContentScriptApiFacade = /** @class */ (function () {
    function UserscriptContentScriptApiFacade(settingsDao, alertController, $getMessage) {
        this.settingsDao = settingsDao;
        this.alertController = alertController;
        this.$getMessage = $getMessage;
        this.domain = location.hostname;
        this.envIsFirefoxBrowserExt = typeof InstallTrigger !== 'undefined' && document.currentScript;
    }
    UserscriptContentScriptApiFacade.prototype.originIsWhitelisted = function (domain) {
        if (domain === void 0) { domain = this.domain; }
        return this.settingsDao.getIsWhitelisted(domain);
    };
    UserscriptContentScriptApiFacade.prototype.originIsSilenced = function () {
        return (this.settingsDao.getSourceOption(this.domain) & 1 /* SILENCED */) !== 0;
    };
    UserscriptContentScriptApiFacade.prototype.showAlert = function (orig_domain, popup_url) {
        var _this = this;
        setTimeout(function () {
            _this.alertController.createAlert(orig_domain, popup_url);
        });
    };
    UserscriptContentScriptApiFacade.prototype.getInstanceID = function () {
        return this.settingsDao.getInstanceID();
    };
    /**
     * Methods are defined in privileged context, we need to expose it to the
     * page's context in order to use it in injected script.
     */
    UserscriptContentScriptApiFacade.prototype.expose = function () {
        var BRIDGE_KEY = '__PB' + (Math.random() * 1e9 >>> 0) + '__';
        if (this.envIsFirefoxBrowserExt) {
            this.originIsWhitelisted = this.originIsWhitelisted.bind(this);
            this.originIsSilenced = this.originIsSilenced.bind(this);
            this.showAlert = this.showAlert.bind(this);
            unsafeWindow[BRIDGE_KEY] = cloneInto(this, unsafeWindow, { cloneFunctions: true });
        }
        else {
            unsafeWindow[BRIDGE_KEY] = this;
        }
        return BRIDGE_KEY;
    };
    return UserscriptContentScriptApiFacade;
}());

/**
 * @fileoverview A custom getMessage implementation for userscripts.
 */
var translations = {"en":{"userscript_name":"AdGuard Popup Blocker","on_navigation_by_popunder":"This transition to the new page is likely to be caused by a pop-under. Do you wish to continue?","aborted_popunder_execution":"Popup Blocker aborted a script execution to prevent background redirect","settings_saved":"Settings saved","show_popup":"Show {$destUrl}","continue_blocking":"Continue blocking","allow_from":"Allow pop-ups on {$origDomain}","manage_pref":"Manage preferences...","popup_text":"AdGuard prevented this website from opening {$numPopup} pop-up windows","options":"Options","silence_noti":"Don't show this message on {$origDomain}"},"ar":{"userscript_name":"مانع النوافذ المنبثقة AdGuard","on_navigation_by_popunder":"من المحتمل ان يكون هذا الانتقال إلى الصفحة الجديدة ناتجا عن الإطار المنبثق. هل ترغب في المتابعة ؟","aborted_popunder_execution":"مانع النوافذ المنبثقة احبط تنفيذ script لمنع أعاده توجيه الخلفية","settings_saved":"الإعدادات المحفوظة","show_popup":"{$destUrl}اظهار","continue_blocking":"متابعة الحظر","allow_from":"{$origDomain}السماح بالنوافذ المنبثقة على","manage_pref":"...أداره التفضيلات","popup_text":"النوافذالمنبثقة{$numPopup} منع ادجارد موقع الويب هذا من فتح","options":"الخيارات","silence_noti":"{$origDomain}عدم إظهار هذه الرسالة على"},"be":{"userscript_name":"Блакавальнік усплывальнай рэкламы ад AdGuard","on_navigation_by_popunder":"Гэты пераход на новую старонку найхутчэй выкліканы поп-андэрам. Усё адно працягнуць?","aborted_popunder_execution":"Блакавальнік усплывальнай рэкламы перапыніў выкананне скрыпту, каб перадухіліць фонавае пераадрасаванне","settings_saved":"Налады захаваны","show_popup":"Паказаць {$destUrl}","continue_blocking":"Працягнуць блакаванне","allow_from":"Дазволіць усплывальныя вокны на {$origDomain}","manage_pref":"Кіраваць наладамі...","popup_text":"AdGuard запабег паказ {$numPopup} усплывальных вокнаў на гэтым сайце","options":"Опцыі","silence_noti":"Не паказваць гэта паведамленне на {$origDomain}"},"cs":{"userscript_name":"Blok. vyskak. oken AdGuard","on_navigation_by_popunder":"Tento přechod na novou stránku bude pravděpodobně způsoben pop-under. Chcete pokračovat?","aborted_popunder_execution":"Blokátor vyskakovacích oken zrušil spuštění skriptu, aby zabránil přesměrování na pozadí","settings_saved":"Nastavení uložena","show_popup":"Zobrazit {$destUrl}","continue_blocking":"Pokračovat v blokování","allow_from":"Povolit vyskakovací okna na {$origDomain}","manage_pref":"Spravovat předvolby","popup_text":"AdGuard zabránil tomu, aby tato webová stránka otevřela vyskakovací okna: {$numPopup}","options":"Možnosti","silence_noti":"Tuto zprávu nezobrazovat na {$origDomain}"},"da":{"userscript_name":"AdGuard Popup Blocker","on_navigation_by_popunder":"Denne overgang til den nye side vil sandsynligvis medføre et pop under-vindue. Ønsker du at fortsætte?","aborted_popunder_execution":"Popup Blocker afbrød en script eksekvering for at forhindre baggrundsomdirigering","settings_saved":"Indstillingerne er gemt","show_popup":"Vis {$destUrl}","continue_blocking":"Fortsæt blokering","allow_from":"Tillad pop-ups på {$origDomain}","manage_pref":"Administrer præferencer...","popup_text":"AdGuard forhindrede denne hjemmeside i at åbne {$numPopup} pop op-vinduer","options":"Valgmuligheder","silence_noti":"Vis ikke denne meddelelse på {$origDomain}"},"de":{"userscript_name":"AdGuard Pop-up-Blocker","on_navigation_by_popunder":"Diese Seiten-Navigation wird wahrscheinlich durch ein Pop-under verursacht. Möchten Sie fortfahren?","aborted_popunder_execution":"Pop-up-Blocker hat eine Skript-Ausführung abgebrochen, um eine Hintergrundumleitung zu verhindern","settings_saved":"Einstellungen gespeichert","show_popup":"{$destUrl} anzeigen","continue_blocking":"Blockieren fortsetzen","allow_from":"Pop-ups auf {$origDomain} zulassen","manage_pref":"Einstellungen verwalten...","popup_text":"AdGuard hat auf dieser Webseite {$numPopup} Pop-up-Fenster verhindert","options":"Optionen","silence_noti":"Diese Nachricht auf {$origDomain} nicht anzeigen"},"es":{"userscript_name":"Bloqueador de popup de AdGuard","on_navigation_by_popunder":"Parece que la transición a nueva página sea causada por un pop-under (elemento emergente). ¿Quiere continuar?","aborted_popunder_execution":"Popup Blocker canceló la ejecución de un script para evitar la redirección en segundo plano","settings_saved":"Ajustes guardados","show_popup":"Mostrar {$destUrl}","continue_blocking":"Continuar bloqueando\n","allow_from":"Permitir ventanas emergentes en {$origDomain}","manage_pref":"Administrar preferencias...","popup_text":"AdGuard impidió que este sitio web abriera {$numPopup} ventanas emergentes","options":"Opciones","silence_noti":"No mostrar este mensaje en {$origDomain}"},"fa":{"userscript_name":"مسدودساز پاپ-آپ AdGuard","on_navigation_by_popunder":"انتقال به این صفحه جدید احتمالا بخاطر یه پاپ-آندر انجام شده است. میخواهید ادامه دهید؟","aborted_popunder_execution":"مسدودساز پاپ-آپ اجرای کد را لغو کرده تا از ریدایرکت جبلوگیری شود","settings_saved":"تنظيمات ذخیره شد","show_popup":"نمایش {$destUrl}","continue_blocking":"ادامه مسدودسازی","allow_from":"اجازه پاپ آپ ها در {$origDomain}","manage_pref":"مدیریت اولویت ها...","popup_text":"AdGuard این وبسایت را از بازکردن {$numPopup} پنجره پاپ آپ جلوگیری کرد","options":"گزینه ها","silence_noti":"این پیام را نشان نده در {$origDomain}"},"fi":{"userscript_name":"AdGuardin Ponnahdusikkunan estäjä","aborted_popunder_execution":"Ponnahdusikkunoiden estäjä keskeytti komentosarjan suorituksen estääksesi taustan uudelleenohjauksen","settings_saved":"Asetukset tallennettiin","show_popup":"Näytä {$destUrl}","continue_blocking":"Jatka estämistä","allow_from":"Salli ponnahdusikkunat sivustolle {$origDomain}","manage_pref":"Hallitse asetuksia...","popup_text":"AdGuard esti tätä verkkosivustoa avaamasta {$numPopup} ponnahdusikkunaa","options":"Vaihtoehdot","silence_noti":"Älä näytä tätä viestiä sivustolle {$origDomain}"},"fr":{"userscript_name":"Bloqueur de fenêtres pop-up de AdGuard","on_navigation_by_popunder":"Cette transition vers la nouvelle page est susceptible d'être causée par un pop-under. Désirez-vous continuer?","aborted_popunder_execution":"Le bloqueur de pop-ups a interrompu l'exécution d'un script pour empêcher une redirection en arrière-plan","settings_saved":"Paramètres sauvegardés","show_popup":"Afficher {$destUrl}","continue_blocking":"Continuer le blocage","allow_from":"Autoriser fenêtres pop-up pour {$origDomain}","manage_pref":"Administrer les préférences...","popup_text":"AdGuard a empêché ce site web d'afficher {$numPopup} fenêtres pop-up","options":"Options","silence_noti":"Ne pas afficher ce message sur {$origDomain}"},"id":{"userscript_name":"Pemblokir Popup AdGuard","on_navigation_by_popunder":"Transisi ke laman baru ini kemungkinan disebabkan oleh sebuah pop-up. Apakah Anda ingin melanjutkan?","aborted_popunder_execution":"Popup Blocker menghentikan eksekusi skrip untuk mencegah perubahan laman di latar belakang","settings_saved":"Pengaturan disimpan","show_popup":"Tampilkan {$destUrl}","continue_blocking":"Lanjutkan pemblokiran","allow_from":"Izinkan popup di {$origDomain}","manage_pref":"Kelola pengaturan...","popup_text":"AdGuard mencegah situs web ini membuka {$numPopup} jendela popup","options":"Opsi","silence_noti":"Jangan tampilkan pesan ini di {$origDomain}"},"it":{"userscript_name":"Blocco Pop-Up di AdGuard","on_navigation_by_popunder":"Questo passaggio alla nuova pagina è probabilmente causato da un pop-under. Vuoi continuare?","aborted_popunder_execution":"PopupBlocker ha interrotto l'esecuzione di uno script per impedire il reindirizzamento in background","settings_saved":"Impostazioni salvate","show_popup":"Mostra {$destUrl}","continue_blocking":"Continua a bloccare","allow_from":"Permetti popup per {$origDomain}","manage_pref":"Gestisci opzioni","popup_text":"AdGuard ha impedito a questo sito web di aprire {$numPopup} finestre di popup","options":"Impostazioni","silence_noti":"Non mostrare questo messaggio in  {$origDomain}"},"ja":{"userscript_name":"AdGuard ポップアップブロッカー","on_navigation_by_popunder":"新しいページへの移動はポップアンダーによって生じた可能性があります。続行しますか？","aborted_popunder_execution":"ポップアップブロッカーはバックグラウンドリダイレクトを防ぐためにスクリプトの実行を中止しました","settings_saved":"設定保存完了","show_popup":"{$destUrl}を表示する","continue_blocking":"ブロッキングを続ける","allow_from":"{$origDomain}のポップアップを許可する","manage_pref":"設定を管理…","popup_text":"AdGuardはこのウェブサイトが{$numPopup}のポップアップウィンドウを開くのを防ぎました","options":"オプション","silence_noti":"{$origDomain}にこのメッセージを表示しない"},"ko":{"userscript_name":"AdGuard 팝업 차단기","on_navigation_by_popunder":"이 새 페이지로의 이동은 팝언더 광고에 의한 것일 수 있습니다. 계속 하시겠습니까?","aborted_popunder_execution":"팝업 차단기가 백그라운드 리디렉션을 방지하기 위해 스크립트 실행을 중단하였습니다","settings_saved":"설정 저장됨","show_popup":"{$destUrl} 표시","continue_blocking":"계속 차단하기","allow_from":"{$origDomain}의 팝업 허용하기","manage_pref":"환경 설정 관리...","popup_text":"AdGuard가 이 웹사이트에서 {$numPopup}개의 팝업 창을 차단하였습니다","options":"옵션","silence_noti":"{$origDomain}에서 이 메세지 표시하지 않기"},"lt":{"userscript_name":"AdGuard iššokančiųjų langų blokatorius","on_navigation_by_popunder":"Šis perėjimas į naują puslapį greičiausiai buvo įtakotas pop-under. Ar norite tęsti?","aborted_popunder_execution":"Iškylančių langų blokatorius nutraukė skripto vykdymą, kad būtų išvengta foninio peradresavimo","settings_saved":"Nustatymai išsaugoti","show_popup":"Rodyti {$destUrl}","continue_blocking":"Tęsti blokavimą","allow_from":"Leisti iššokančius langus {$origDomain}","manage_pref":"Tvarkyti nuostatas...","popup_text":"„AdGuard“ neleido šiai svetainei atidaryti {$numPopup} iššokančius langus","options":"Parinktys","silence_noti":"Nerodyti šio pranešimo {$origDomain}"},"ms":{"userscript_name":"AdGuard Penyekat Pop Timbul","on_navigation_by_popunder":"Peralihan ke laman baru ini kemungkinan disebabkan oleh pop-bawah. Anda ingin meneruskan?","aborted_popunder_execution":"Penyekat Pop Timbul menggugurkan pelaksanaan skrip bagi mengelakkan arah semula latar belakang","settings_saved":"Tetapan disimpan","show_popup":"Tunjukkan {$destUrl}","continue_blocking":"Terus menyekat","allow_from":"Benarkan pop-timbul untuk {$origDomain}","manage_pref":"Urus keutamaan...","popup_text":"AdGuard menghalang laman web ini daripada membuka {$numPopup} tetingkap pop-timbul","options":"Pilihan","silence_noti":"Jangan tunjuk mesej ini pada {$origDomain}"},"no":{"userscript_name":"AdGuards popup-blokkerer","on_navigation_by_popunder":"Omdirigeringen til den nye nettsiden er sannsynligvis forårsaket av en pop-under. Ønsker du å fortsette?","aborted_popunder_execution":"Popup Blocker avbrøt en skrift fra å kjøre for å hindre bakgrunnsomdirigering","settings_saved":"Innstillinger lagret","show_popup":"Vis {$destUrl}","continue_blocking":"Fortsett blokkering","allow_from":"Tillat popup-vinduer for {$origDomain}","manage_pref":"Administrer preferanser…","popup_text":"AdGuard forhindret denne nettsiden i å åpne popup-vinduer for {$numPopup}","options":"Alternativer","silence_noti":"Ikke vis denne meldingen for {$origDomain}"},"pl":{"userscript_name":"Bloker wyskakujących okienek przez AdGuard","on_navigation_by_popunder":"To przejście na nową stronę może być spowodowane przez pop-under. Czy chcesz kontynuować?","aborted_popunder_execution":"Bloker wyskakujących okienek przerwał wykonywanie skryptu, aby zapobiec przekierowaniu w tle","settings_saved":"Ustawienia zapisane","show_popup":"Pokaż {$destUrl}","continue_blocking":"Kontynuuj blokowanie","allow_from":"Zezwalaj na wyskakujące okienka dla {$origDomain}","manage_pref":"Zarządzaj preferencjami...","popup_text":"AdGuard zapobiegł na tej stronie otwarcie  {$numPopup} wyskakujacego okienka.","options":"Opcje","silence_noti":"Nie pokazuj tej wiadomości w {$origDomain}"},"pt":{"userscript_name":"AdGuard Bloqueador de Pop-ups","on_navigation_by_popunder":"Essa transição para a nova página provavelmente será causada por um pop-under. Você deseja continuar?","aborted_popunder_execution":"O bloqueador de pop-ups interrompeu uma execução de script para evitar um redirecionamento em segundo plano","settings_saved":"Configurações salvas","show_popup":"Mostrar {$destUrl}","continue_blocking":"Continuar bloqueando","allow_from":"Permitir pop-ups em {$origDomain}","manage_pref":"Gerenciar preferências...","popup_text":"O AdGuard impediu este site de abrir {$numPopup} pop-ups","options":"Opções","silence_noti":"Não mostrar essa mensagem no {$origDomain}"},"pt-PT":{"userscript_name":"Bloqueador de Popup AdGuard","on_navigation_by_popunder":"Esta transição para a nova página  será  provavelmente causada por um popunder. Deseja continuar?","aborted_popunder_execution":"PopupBlocker abortou uma execução de script para evitar o redireccionamento em segundo plano","settings_saved":"As definições foram guardadas","show_popup":"Mostrar {$destUrl}","continue_blocking":"Continuar a bloquear","allow_from":"Permitir popups em {$origDomain}","manage_pref":"Gerir preferências...","popup_text":"O AdGuard impediu que este site abrisse janelas popup de {$numPopup}","options":"Opções","silence_noti":"Não mostrar esta mensagem em {$origDomain}"},"ru":{"userscript_name":"Блокировщик всплывающей рекламы от AdGuard","on_navigation_by_popunder":"Этот переход на новую страницу скорее всего вызван поп-андером. Всё равно продолжить?","aborted_popunder_execution":"Блокировщик всплывающей рекламы прервал исполнение скрипта, чтобы предотвратить фоновую переадресацию","settings_saved":"Настройки сохранены","show_popup":"Показать {$destUrl}","continue_blocking":"Продолжить блокировку","allow_from":"Разрешить всплывающие окна на {$origDomain}","manage_pref":"Управлять настройками...","popup_text":"AdGuard предотвратил показ {$numPopup} всплывающих окон на этом сайте","options":"Опции","silence_noti":"Не показывать это сообщение на {$origDomain}"},"sl":{"userscript_name":"AdGuard Zaviralec pojavnih oken","on_navigation_by_popunder":"Ta prehod na novo stran je verjetno posledica pojavnega okna. Ali želite nadaljevati?","aborted_popunder_execution":"Zaviralec pojavnih oken je prekinil izvajanje skripta, da bi preprečil preusmerjanje v ozadju","settings_saved":"Nastavitve so shranjene","show_popup":" Prikaži {$destUrl}","continue_blocking":"Nadaljuj z zaviranjem","allow_from":"Dovoli pojavna okna na {$origDomain}","manage_pref":"Upravljaj nastavitve...","popup_text":"AdGuard je tej spletni strani preprečil odpiranje {$numPopup} pojavnih oken","options":"Možnosti","silence_noti":"Ne prikazuj tega sporočila na {$origDomain}"},"tr":{"userscript_name":"AdGuard Popup Blocker eklentisi","on_navigation_by_popunder":"Yeni sayfaya geçiş, bir gizli pencere nedeniyle meydana gelmiş olabilir. Devam etmek istiyor musunuz?","aborted_popunder_execution":"Arka plan yönlendirmesini önlemek için Açılır Pencere Engelleyicisi bir komut dosyasının çalışmasını engelledi","settings_saved":"Ayarlar kaydedildi","show_popup":"{$destUrl} Göster","continue_blocking":"Engellemeye devam et","allow_from":"{$origDomain} için açılır pencerelere izin ver","manage_pref":"Tercihleri yönet...","popup_text":"AdGuard bu sitenin {$numPopup} açılır pencere açmasını önledi","options":"Ayarlar","silence_noti":"Bu mesajı {$origDomain} alan adı üzerinde gösterme"},"uk":{"userscript_name":"Блокувальник спливаючої реклами AdGuard","on_navigation_by_popunder":"Цей перехід на нову сторінку, ймовірно, міг бути викликаний поп-андером. Бажаєте продовжити?","aborted_popunder_execution":"PopupBlocker перервав виконання скрипта, щоб запобігти фоновому перенаправленню","settings_saved":"Налаштування збережені","show_popup":"Показати {$destUrl}","continue_blocking":"Продовжити блокування","allow_from":"Дозволити спливаючі вікна {$origDomain}","manage_pref":"Керувати налаштуваннями...","popup_text":"AdGuard запобіг показу {$numPopup} спливаючих вікон на цьому сайті","options":"Опції","silence_noti":"Не показувати це повідомлення на {$origDomain}"},"vi":{"userscript_name":"AdGuard Popup Blocker","on_navigation_by_popunder":"Việc chuyển đổi sang trang mới này có thể được gây ra bởi một cửa sổ bật xuống. Bạn có muốn tiếp tục?","aborted_popunder_execution":"Trình chặn Popup đã hủy bỏ việc thực thi tập lệnh để ngăn chuyển hướng nền","settings_saved":"Đã lưu cài đặt","show_popup":"Hiện {$destUrl}","continue_blocking":"Tiếp tục chặn","allow_from":"Cho phép cửa sổ bật lên cho {$origDomain}","manage_pref":"Quản lý tùy chọn...","popup_text":"AdGuard đã ngăn trang web này mở {$numPopup} cửa sổ bật lên","options":"Tuỳ chọn","silence_noti":"Đừng hiển thị thông báo này trên {$origDomain}"},"zh":{"userscript_name":"AdGuard 弹窗拦截器","on_navigation_by_popunder":"此网页导航可能导致弹窗。您要继续？","aborted_popunder_execution":"PopupBlocker 已中止脚本执行以防止后台重新定向","settings_saved":"设置已保存","show_popup":"显示 {$destUrl}","continue_blocking":"继续拦截","allow_from":"允许 {$origDomain} 弹窗","manage_pref":"管理首选项...","popup_text":"AdGuard 已防止此网站打开的 {$numPopup} 个弹窗","options":"选项","silence_noti":"在 {$origDomain} 上不再显示此讯息"},"zh-TW":{"userscript_name":"AdGuard 彈出式視窗封鎖器","on_navigation_by_popunder":"此至新的頁面之轉換很可能是由一個背彈式視窗引起。您想要繼續嗎？","aborted_popunder_execution":"彈出式視窗封鎖器已中止腳本執行以防止背景重新導向","settings_saved":"設定被儲存","show_popup":"顯示 {$destUrl}","continue_blocking":"繼續封鎖","allow_from":"允許在 {$origDomain} 的彈出式視窗","manage_pref":"管理偏好設定…","popup_text":"AdGuard 已防止該網站開啟 {$numPopup} 彈出式視窗","options":"選項","silence_noti":"不要於 {$origDomain} 上顯示該訊息"}};
/**
 * AdGuard for Windows noramlizes locales like this.
 */
function normalizeLocale(locale) {
    return locale.replace('_', '-');
}
var supportedLocales = Object.keys(translations).map(function (locale) { return normalizeLocale(locale); });
var defaultLocale = 'en';
var currentLocale = null;
function setLocaleIfSupported(locale) {
    if (supportedLocales.indexOf(locale) !== -1) {
        currentLocale = locale;
        return true;
    }
    return false;
}
function setLocale() {
    if (typeof AdguardSettings !== 'undefined') {
        var locale = normalizeLocale(AdguardSettings.locale);
        if (setLocaleIfSupported(locale)) {
            return;
        }
    }
    var lang = normalizeLocale(navigator.language);
    if (setLocaleIfSupported(lang)) {
        return;
    }
    var i = lang.indexOf('-');
    if (i !== -1) {
        lang = lang.slice(0, i);
    }
    if (setLocaleIfSupported(lang)) {
        return;
    }
    currentLocale = defaultLocale;
}
setLocale();
function getMessage (messageId) {
    var message = translations[currentLocale][messageId];
    if (!message) {
        message = translations[defaultLocale][messageId];
        if (!message) {
            throw messageId + ' not localized';
        }
    }
    return message;
}

/**
 * @fileoverview Provides various CSS in JS string
 */
var CSSService = /** @class */ (function () {
    function CSSService($getURL) {
        this.$getURL = $getURL;
    }
    CSSService.prototype.getFontURLs = function () {
        if (isUndef(this.fontURLs)) {
            var fontsDir = CSSService.fontsDir;
            var opensans = "/OpenSans-";
            var woff = '.woff';
            var WOFF_OPENSANS_REGULAR = fontsDir + "regular" + opensans + "Regular" + woff;
            var WOFF_OPENSANS_SEMIBOLD = fontsDir + "semibold" + opensans + "Semibold" + woff;
            var WOFF_OPENSANS_BOLD = fontsDir + "bold" + opensans + "Bold" + woff;
            var WOFF2_OPENSANS_REGULAR = WOFF_OPENSANS_REGULAR + 2;
            var WOFF2_OPENSANS_SEMIBOLD = WOFF_OPENSANS_SEMIBOLD + 2;
            var WOFF2_OPENSANS_BOLD = WOFF_OPENSANS_BOLD + 2;
            this.fontURLs = [
                this.$getURL(WOFF_OPENSANS_REGULAR),
                this.$getURL(WOFF2_OPENSANS_REGULAR),
                this.$getURL(WOFF_OPENSANS_SEMIBOLD),
                this.$getURL(WOFF2_OPENSANS_SEMIBOLD),
                this.$getURL(WOFF_OPENSANS_BOLD),
                this.$getURL(WOFF2_OPENSANS_BOLD)
            ];
        }
        return this.fontURLs;
    };
    CSSService.isNotDataURI = function (url) {
        return !CSSService.reDataURI.test(url);
    };
    // every browser that supports preload supports woff2.
    CSSService.prototype.getAlertPreloadFontURLs = function () {
        var urls = this.getFontURLs();
        // Regular and Bold woff2
        return [urls[1], urls[5]]
            .filter(CSSService.isNotDataURI); // There is no point of applying 'preload'
        // to data URIs. 
    };
    CSSService.prototype.getToastPreloadFontURLs = function () {
        var urls = this.getFontURLs();
        // Regular woff2
        return [urls[1]].filter(CSSService.isNotDataURI);
    };
    CSSService.prototype.getInlineFontCSS = function () {
        var urls = this.getFontURLs();
        return "@font-face{font-family:\"Open Sans\";src:url("+urls[1]+") format(\"woff2\"),url("+urls[0]+") format(\"woff\");font-weight:400;font-style:normal}@font-face{font-family:\"Open Sans\";src:url("+urls[3]+") format(\"woff2\"),url("+urls[2]+") format(\"woff\");font-weight:600;font-style:normal}@font-face{font-family:\"Open Sans\";src:url("+urls[5]+") format(\"woff2\"),url("+urls[4]+") format(\"woff\");font-weight:700;font-style:normal}";
    };
    CSSService.prototype.getAlertCSS = function () {
        return this.getInlineFontCSS() + "*{box-sizing:border-box}html{font-size:10px;height:100%}body{height:100%;margin:0;font-size:1.3rem;line-height:1.428571429;color:#282828;font-family:\"Open Sans\",-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Ubuntu,\"Helvetica Neue\",Arial,sans-serif;font-weight:400}body.body--overflow{overflow:hidden}ul{list-style:none}input{outline:0}button{font-size:inherit;color:inherit;border:0;outline:0;background-color:transparent}select::-ms-expand{display:none}.radio{display:none}.radio-label{padding-left:30px;position:relative}.radio-label:after{content:\'\';cursor:pointer;position:absolute;left:0;top:0;width:18px;height:18px;border-radius:100%;box-shadow:0 0 0 1px #ccc;transition:.3s ease box-shadow}.radio-label:hover:after{box-shadow:0 0 0 1px #66b574}.radio:checked+.radio-label:before{content:\'\';position:absolute;top:4px;left:4px;width:10px;height:10px;border-radius:100%;background-color:#66b574}.radio:disabled+.radio-label:after{background-color:#f1f1f1;cursor:default}.radio:disabled+.radio-label:hover:after{box-shadow:0 0 0 1px #ccc}.checkbox{display:none}.checkbox-label{padding-left:30px;position:relative}.checkbox-label:after{content:\'\';cursor:pointer;position:absolute;left:0;top:-1px;width:19px;height:19px;border-radius:3px;box-shadow:0 0 0 1px #ccc;transition:.3s ease box-shadow,.3s ease background-color}.checkbox-label:hover:after{box-shadow:0 0 0 1px #66b574}.checkbox:checked+.checkbox-label:after{background-color:#66b574;box-shadow:0 0 0 1px #66b574}.checkbox:checked+.checkbox-label:before{content:\'\';cursor:pointer;position:absolute;z-index:1;top:5px;left:4px;width:11px;height:9px;background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg width=\'11\' height=\'9\' viewBox=\'0 0 11 9\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctitle%3ELine 5%3C/title%3E%3Cpath d=\'M.91 4.059l3.41 3.408L9.684.597\' stroke=\'%23FFF\' stroke-width=\'1.2\' fill=\'none\' fill-rule=\'evenodd\' stroke-linecap=\'round\'/%3E%3C/svg%3E\")}.checkbox:checked+.checkbox-label:hover:after{background-color:#66b574}.checkbox:disabled+.checkbox-label:after{background-color:#f1f1f1;cursor:default}.checkbox:disabled+.checkbox-label:hover:after{box-shadow:0 0 0 1px #ccc}.userscript-options-page{background-color:#e6e6e6}.userscript-options-page .settings{-ms-flex-pack:center;justify-content:center}.alert{display:none;position:fixed;top:8px;right:48px;width:390px;background-color:#fff;padding:45px 20px 20px;box-shadow:0 0 10px 3px rgba(162,161,161,.3)}.alert:after{content:\"▲\";position:absolute;right:-9px;top:7px;transform:rotate(90deg) scaleY(.7);color:#fff}.alert--show{display:block}.alert__close{display:block;position:absolute;background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg viewBox=\'0 0 16 16\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctitle%3EGroup 2%3C/title%3E%3Cg stroke=\'%23979797\' stroke-width=\'1.5\' fill=\'none\' fill-rule=\'evenodd\' opacity=\'.661\' stroke-linecap=\'square\'%3E%3Cpath d=\'M1.473 1.273l13 13M1.473 14.273l13-13\'/%3E%3C/g%3E%3C/svg%3E\");cursor:pointer;top:20px;right:20px;width:15px;height:15px}.alert__in{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;margin-bottom:35px}.alert__ico{margin-right:20px}.alert__ico--windows{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg viewBox=\'0 0 49 41\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctitle%3EGroup 3%3C/title%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M2.374.715h44.4a1.8 1.8 0 0 1 1.8 1.8v36.4a1.8 1.8 0 0 1-1.8 1.8h-44.4a1.8 1.8 0 0 1-1.8-1.8v-36.4a1.8 1.8 0 0 1 1.8-1.8z\' fill=\'%23F5A623\'/%3E%3Cpath d=\'M5.204 10.117h38.74a1.8 1.8 0 0 1 1.8 1.8v23.596a1.8 1.8 0 0 1-1.8 1.8H5.204a1.8 1.8 0 0 1-1.8-1.8V11.917a1.8 1.8 0 0 1 1.8-1.8z\' fill=\'%23FFF\' opacity=\'.149\'/%3E%3Cg stroke=\'%23FFF\' stroke-linecap=\'round\' stroke-width=\'1.5\'%3E%3Cpath d=\'M19.149 19.004L29.816 29.67M19.149 29.671l10.667-10.667\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\");width:49px;height:41px;margin-right:20px}.alert__ico--touch{width:31px;height:40px;background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg viewBox=\'0 0 31 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctitle%3EGroup 2%3C/title%3E%3Cg fill=\'%2366B574\' fill-rule=\'nonzero\'%3E%3Cpath d=\'M21.115 25.65c-.491 1.018-1.06 2-1.701 2.94a11.367 11.367 0 0 0 2.726 4.356 11.393 11.393 0 0 0 3.726 2.49 14.968 14.968 0 0 0 1.579-1.86c-3.449-1.101-6.013-4.198-6.33-7.926z\'/%3E%3Cpath d=\'M25.65 24.87v-9.137c0-5.668-4.612-10.279-10.28-10.279-5.667 0-10.278 4.611-10.278 10.279A4.573 4.573 0 0 1 .524 20.3v2.284a6.86 6.86 0 0 0 6.852-6.852c0-4.408 3.587-7.995 7.995-7.995 4.408 0 7.994 3.587 7.994 7.995v9.136c0 3.246 2.268 5.971 5.302 6.676.345-.691.637-1.412.872-2.158a4.575 4.575 0 0 1-3.89-4.518zM20.525 34.562a13.785 13.785 0 0 1-2-2.532l-.76-1.238-1.087 1.095a22.72 22.72 0 0 1-9.214 5.619 14.804 14.804 0 0 0 2.828 1.391 25.004 25.004 0 0 0 7.072-4.51 16.126 16.126 0 0 0 4.303 4.002c.8-.376 1.561-.821 2.275-1.328a13.727 13.727 0 0 1-3.417-2.5z\'/%3E%3Cpath d=\'M15.37.886C7.185.886.525 7.546.525 15.733v2.284a2.287 2.287 0 0 0 2.284-2.284c0-6.927 5.636-12.563 12.563-12.563 6.927 0 12.562 5.636 12.562 12.563v9.136c0 1.205.938 2.194 2.121 2.278.107-.719.163-1.454.163-2.202v-9.212c0-8.187-6.66-14.847-14.846-14.847z\'/%3E%3Cpath d=\'M15.37 10.022a5.717 5.717 0 0 0-5.71 5.71c0 5.039-4.098 9.137-9.136 9.137v.076c0 .75.056 1.486.164 2.206a11.343 11.343 0 0 0 7.913-3.34 11.347 11.347 0 0 0 3.343-8.078 3.43 3.43 0 0 1 3.427-3.426 3.43 3.43 0 0 1 3.426 3.426c0 9.083-6.662 16.638-15.357 18.039.53.713 1.12 1.377 1.766 1.985a20.41 20.41 0 0 0 9.857-5.485 20.425 20.425 0 0 0 6.018-14.54 5.717 5.717 0 0 0-5.71-5.71zM17.295 37.792l-.207-.21a27.22 27.22 0 0 1-3.26 2.13 14.952 14.952 0 0 0 5.216-.38 18.558 18.558 0 0 1-1.75-1.54z\'/%3E%3Cpath d=\'M15.37 14.59c-.63 0-1.141.512-1.141 1.143 0 7.325-5.778 13.327-13.015 13.687.243.77.548 1.513.909 2.223a15.866 15.866 0 0 0 9.71-4.602 15.886 15.886 0 0 0 4.68-11.308c0-.631-.512-1.142-1.142-1.142z\'/%3E%3C/g%3E%3C/svg%3E\")}.alert__text{width:258px}.alert__btns{display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between}.alert__select{width:170px;background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg viewBox=\'0 0 11 8\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctitle%3ETriangle%3C/title%3E%3Cpath stroke=\'%231D1D1D\' stroke-width=\'1.5\' d=\'M9.63.914L5.147 5.945.665.914\' fill=\'none\' fill-rule=\'evenodd\' opacity=\'.337\'/%3E%3C/svg%3E\");background-size:10px 8px;background-position:153px 17px;background-repeat:no-repeat;text-align-last:center;border-radius:0;-webkit-appearance:none;-moz-appearance:none;appearance:none;outline:0;font-size:inherit;border:0;cursor:pointer;text-align:center;box-shadow:0 0 0 1px rgba(197,197,197,.47);padding:0 20px;height:40px;line-height:40px;background-color:#fff;transition:.3s ease background-color;font-family:\"Open Sans\",-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Ubuntu,\"Helvetica Neue\",Arial,sans-serif;font-weight:700}.alert__select:hover{background-color:rgba(104,188,113,.2)}.alert__btn{display:block;width:170px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer;text-align:center;box-shadow:0 0 0 1px rgba(197,197,197,.47);padding:0 20px;height:40px;line-height:40px;background-color:#fff;transition:.3s ease background-color;font-family:\"Open Sans\",-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Ubuntu,\"Helvetica Neue\",Arial,sans-serif;font-weight:700}.alert__btn:hover{background-color:rgba(104,188,113,.2)}.alert__btn:active{background-color:#66b574;color:#fff}.pin{display:none;width:30px;height:30px;position:fixed;right:8px;cursor:pointer;border-radius:100%;box-shadow:0 0 10px 3px rgba(162,161,161,.3);background-color:#fff;background-repeat:no-repeat;background-position:50%;transition:.3s ease background-color;padding:0}.pin:hover{background-color:rgba(104,188,113,.2)}.pin--show{display:block}.pin--shield{width:60px;height:60px;background-size:30px;background-position:50% 17px;background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 25.3 25.9\'%3E%3Cpath fill=\'%2368bc71\' d=\'M12.7 0C8.7 0 3.9.9 0 3c0 4.4-.1 15.4 12.7 23C25.4 18.4 25.3 7.4 25.3 3 21.4.9 16.6 0 12.7 0z\'/%3E%3Cpath fill=\'%2367b279\' d=\'M12.6 25.9C-.1 18.4 0 7.4 0 3c3.9-2 8.7-3 12.6-3v25.9z\'/%3E%3Cpath fill=\'%23fff\' d=\'M12.2 17.3L19.8 7a.99.99 0 0 0-1.3.1l-6.4 6.6-2.4-2.9c-1.1-1.3-2.7-.3-3.1 0l5.6 6.5\'/%3E%3C/svg%3E\")}.pin--win-hidden{background-size:16px 13px;background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg viewBox=\'0 0 49 41\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctitle%3EGroup 3%3C/title%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M2.374.715h44.4a1.8 1.8 0 0 1 1.8 1.8v36.4a1.8 1.8 0 0 1-1.8 1.8h-44.4a1.8 1.8 0 0 1-1.8-1.8v-36.4a1.8 1.8 0 0 1 1.8-1.8z\' fill=\'%23F5A623\'/%3E%3Cpath d=\'M5.204 10.117h38.74a1.8 1.8 0 0 1 1.8 1.8v23.596a1.8 1.8 0 0 1-1.8 1.8H5.204a1.8 1.8 0 0 1-1.8-1.8V11.917a1.8 1.8 0 0 1 1.8-1.8z\' fill=\'%23FFF\' opacity=\'.149\'/%3E%3Cg stroke=\'%23FFF\' stroke-linecap=\'round\' stroke-width=\'1.5\'%3E%3Cpath d=\'M19.149 19.004L29.816 29.67M19.149 29.671l10.667-10.667\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")}.pin--touch{background-size:13px 16px;background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg viewBox=\'0 0 31 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctitle%3EGroup 2%3C/title%3E%3Cg fill=\'%2366B574\' fill-rule=\'nonzero\'%3E%3Cpath d=\'M21.115 25.65c-.491 1.018-1.06 2-1.701 2.94a11.367 11.367 0 0 0 2.726 4.356 11.393 11.393 0 0 0 3.726 2.49 14.968 14.968 0 0 0 1.579-1.86c-3.449-1.101-6.013-4.198-6.33-7.926z\'/%3E%3Cpath d=\'M25.65 24.87v-9.137c0-5.668-4.612-10.279-10.28-10.279-5.667 0-10.278 4.611-10.278 10.279A4.573 4.573 0 0 1 .524 20.3v2.284a6.86 6.86 0 0 0 6.852-6.852c0-4.408 3.587-7.995 7.995-7.995 4.408 0 7.994 3.587 7.994 7.995v9.136c0 3.246 2.268 5.971 5.302 6.676.345-.691.637-1.412.872-2.158a4.575 4.575 0 0 1-3.89-4.518zM20.525 34.562a13.785 13.785 0 0 1-2-2.532l-.76-1.238-1.087 1.095a22.72 22.72 0 0 1-9.214 5.619 14.804 14.804 0 0 0 2.828 1.391 25.004 25.004 0 0 0 7.072-4.51 16.126 16.126 0 0 0 4.303 4.002c.8-.376 1.561-.821 2.275-1.328a13.727 13.727 0 0 1-3.417-2.5z\'/%3E%3Cpath d=\'M15.37.886C7.185.886.525 7.546.525 15.733v2.284a2.287 2.287 0 0 0 2.284-2.284c0-6.927 5.636-12.563 12.563-12.563 6.927 0 12.562 5.636 12.562 12.563v9.136c0 1.205.938 2.194 2.121 2.278.107-.719.163-1.454.163-2.202v-9.212c0-8.187-6.66-14.847-14.846-14.847z\'/%3E%3Cpath d=\'M15.37 10.022a5.717 5.717 0 0 0-5.71 5.71c0 5.039-4.098 9.137-9.136 9.137v.076c0 .75.056 1.486.164 2.206a11.343 11.343 0 0 0 7.913-3.34 11.347 11.347 0 0 0 3.343-8.078 3.43 3.43 0 0 1 3.427-3.426 3.43 3.43 0 0 1 3.426 3.426c0 9.083-6.662 16.638-15.357 18.039.53.713 1.12 1.377 1.766 1.985a20.41 20.41 0 0 0 9.857-5.485 20.425 20.425 0 0 0 6.018-14.54 5.717 5.717 0 0 0-5.71-5.71zM17.295 37.792l-.207-.21a27.22 27.22 0 0 1-3.26 2.13 14.952 14.952 0 0 0 5.216-.38 18.558 18.558 0 0 1-1.75-1.54z\'/%3E%3Cpath d=\'M15.37 14.59c-.63 0-1.141.512-1.141 1.143 0 7.325-5.778 13.327-13.015 13.687.243.77.548 1.513.909 2.223a15.866 15.866 0 0 0 9.71-4.602 15.886 15.886 0 0 0 4.68-11.308c0-.631-.512-1.142-1.142-1.142z\'/%3E%3C/g%3E%3C/svg%3E\")}";
    };
    CSSService.prototype.getToastCSS = function () {
        return this.getInlineFontCSS() + ".toast{width:100%;position:absolute;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;bottom:0;left:0;opacity:0;visibility:hidden;transition:.3s ease opacity,.3s ease visibility;font-size:14px;font-family:\"Open Sans\",-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Ubuntu,\"Helvetica Neue\",Arial,sans-serif;font-weight:400}.toast--active{opacity:1;visibility:visible}.toast__in{padding:15px 30px;max-width:190px;color:#fff;border-radius:5px;text-align:center;white-space:nowrap;background-color:rgba(0,0,0,.7)}";
    };
    CSSService.fontsDir = './assets/fonts/';
    CSSService.reDataURI = /^data\:/;
    return CSSService;
}());

var i18nService = new I18nService(getMessage);
var settingsDao = new UserscriptSettingsDao();
var cssService = new CSSService(GM_getResourceURL);
var alertController = new AlertController(cssService, settingsDao, function () {
    window.open('https://popupblocker.adguard.com/options.html', '__popupBlocker_options_page__');
});
var csApiFacade = new UserscriptContentScriptApiFacade(settingsDao, alertController, getMessage);
adguard.i18nService = i18nService;
UserscriptSettingsDao.migrateDataIfNeeded();
var BRIDGE_KEY = csApiFacade.expose();
var win = typeof unsafeWindow !== 'undefined' ? unsafeWindow.window : window;
/**
 * In Firefox, userscripts can't write properties of unsafeWindow, so we
 * create a <script> tag to run the script in the page's context.
 */
if (csApiFacade.envIsFirefoxBrowserExt) {
    var script = document.createElement('script');
    var text = "(" + popupBlocker.toString() + ")(this,'" + BRIDGE_KEY + "')";
    script.textContent = text;
    var el = document.body || document.head || document.documentElement;
    el.appendChild(script);
    el.removeChild(script);
}
else {
    popupBlocker(win, BRIDGE_KEY);
}
/**
 * Expose GM_api on options page.
 */
function isOptionsPage() {
    var href = location.href;
    return href === 'https://adguardteam.github.io/PopupBlocker/options.html' ||
        href === 'https://popupblocker.adguard.com/options.html' ||
        href === 'http://localhost:8000/options.html'; // For debug purposes.
}
if (isOptionsPage()) {
    document.title = i18nService.$getMessage('userscript_name') || 'Adguard Popup Blocker';
    // Export GM functions (used by the Dao layer)
    win['GM_getValue'] = exportFunction(GM_getValue, unsafeWindow);
    win['GM_setValue'] = exportFunction(GM_setValue, unsafeWindow);
    win['GM_listValues'] = exportFunction(GM_listValues, unsafeWindow);
    // Export AdguardSettings so that it was used by getMessage on the options page
    unsafeWindow['AdguardSettings'] = AdguardSettings;
}

}());
