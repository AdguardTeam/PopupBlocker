// ==UserScript==
// @name AdGuard Popup Blocker (Dev)
// @name:ru Блокировщик всплывающей рекламы от AdGuard (Dev)
// @name:es-419 AdGuard Popup Blocker (Dev)
// @name:hu AdGuard Felugró Szűrő (Dev)
// @name:pt-PT AdGuard Popup Blocker (Dev)
// @name:it Blocco Pop-Up di AdGuard (Dev)
// @name:tr AdGuard Popup Blocker (Dev)
// @name:fr Bloqueur de popup de AdGuard (Dev)
// @name:ko AdGuard Popup Blocker (Dev)
// @name:zh-CN AdGuard 弹窗拦截器 (Dev)
// @name:zh-TW AdGuard 彈出式視窗封鎖器 (Dev)
// @name:fa مسدودساز پاپ-آپ AdGuard (Dev)
// @name:pl Bloker wyskakujących okienek przez AdGuard (Dev)
// @name:id AdGuard Popup Blocker (Dev)
// @name:de AdGuard Pop-up-Blocker (Dev)
// @name:sv AdGuards popup-blockerare (Dev)
// @name:mk-MK AdGuard Popup Blocker (Dev)
// @name:sk AdGuard blokovač vyskakovacích okien (Dev)
// @name:da AdGuard Popup Blocker (Dev)
// @name:nl AdGuard Popup Blocker (Dev)
// @name:ms AdGuard Popup Blocker (Dev)
// @name:uk Блокувальник спливаючої реклами AdGuard (Dev)
// @name:es-ES Bloqueador de popup de AdGuard (Dev)
// @name:vi AdGuard Popup Blocker (Dev)
// @name:no AdGuards popup-blokkerer (Dev)
// @name:sr-Latn AdGuard blokator iskačućih prozora (Dev)
// @name:ja AdGuard ポップアップブロッカー (Dev)
// @name:pt-BR AdGuard Bloqueador de Pop-ups (Dev)
// @name:ar AdGuard Popup Blocker (Dev)
// @namespace AdGuard
// @description Blocks popup ads on web pages
// @description:ru Блокирует всплывающую рекламу на страницах
// @description:es-419 Bloquea anuncios emergentes en páginas web
// @description:hu A felugró hirdetéseket szűri minden weboldalon
// @description:pt-PT Bloqueia anúncios popup em páginas da web.
// @description:it Blocca gli annunci di popup nelle pagine internet
// @description:tr Web sayfalarında açılan pencere reklamları engeller
// @description:fr Bloque les publicités intrusives sur les pages web
// @description:ko 웹 페이지의 팝업 광고를 차단합니다.
// @description:zh-CN 拦截网页弹窗广告
// @description:zh-TW 封鎖於網頁上之彈出式視窗廣告
// @description:fa مسدودسازی تبلیغات پاپ آپ در صفحات وب.
// @description:pl Blokuje wyskakujące okienka z reklamami na stronach internetowych
// @description:id Blocks popup ads on web pages
// @description:de Blockiert Anzeige-Pop-ups auf Webseiten
// @description:sv Blockerar popupfönster på webbsidor
// @description:mk-MK Blocks popup ads on web pages
// @description:sk Blokuje vyskakovacie reklamy na webových stránkach
// @description:da Blokerer pop-up reklamer på websider
// @description:nl Blokkeert pop up advertenties op webpagina's
// @description:ms Halang iklan popup di laman web
// @description:uk Блокує спливаючу рекламу на веб-сторінках
// @description:es-ES Bloquea elementos emergentes en sitios web
// @description:vi Chặn quảng cáo popup trên các trang web
// @description:no Blokker popup-annonser på nettsider
// @description:sr-Latn Blokira iskačuće reklame na veb stranicama
// @description:ja Webページでポップアップ広告をブロックします。
// @description:pt-BR Bloqueia anúncios pop-ups dentro dos sites
// @description:ar لحظر الإعلانات المنبثقة على صفحات الويب
// @version 2.5.2
// @license LGPL-3.0; https://github.com/AdguardTeam/PopupBlocker/blob/master/LICENSE
// @downloadURL https://popupblocker.adguard.com/popupblocker.user.js
// @updateURL https://popupblocker.adguard.com/popupblocker.meta.js
// @supportURL https://github.com/AdguardTeam/PopupBlocker/issues
// @homepageURL https://popupblocker.adguard.com/
// @match http://*/*
// @match https://*/*
// @grant GM_getValue
// @grant GM_setValue
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

/**
 * This serves as a whitelist on various checks where we block re-triggering of events.
 * See dom/dispatchEvent.ts.
 */


/**
 * Detects about:blank, about:srcdoc urls.
 */



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

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

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
/*
 * Copyright 2008 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview
 * Utility functions and classes for Soy.
 *
 * <p>
 * The top portion of this file contains utilities for Soy users:<ul>
 *   <li> soy.StringBuilder: Compatible with the 'stringbuilder' code style.
 *   <li> soy.renderElement: Render template and set as innerHTML of an element.
 *   <li> soy.renderAsFragment: Render template and return as HTML fragment.
 * </ul>
 *
 * <p>
 * The bottom portion of this file contains utilities that should only be called
 * by Soy-generated JS code. Please do not use these functions directly from
 * your hand-writen code. Their names all start with '$$'.
 *
 * @author Garrett Boyer
 * @author Mike Samuel
 * @author Kai Huang
 * @author Aharon Lanin
 */


// COPIED FROM nogoog_shim.js

// Create closure namespaces.
var goog = goog || {};


goog.DEBUG = false;


goog.inherits = function(childCtor, parentCtor) {
  /** @constructor */
  function tempCtor() {};
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  childCtor.prototype.constructor = childCtor;

  /**
   * Calls superclass constructor/method.
   * @param {!Object} me Should always be "this".
   * @param {string} methodName
   * @param {...*} var_args
   * @return {?} The return value of the superclass method/constructor.
   */
  childCtor.base = function(me, methodName, var_args) {
    var args = Array.prototype.slice.call(arguments, 2);
    return parentCtor.prototype[methodName].apply(me, args);
  };
};


// Just enough browser detection for this file.
if (!goog.userAgent) {
  goog.userAgent = (function() {
    var userAgent = "";
    if ("undefined" !== typeof navigator && navigator
        && "string" == typeof navigator.userAgent) {
      userAgent = navigator.userAgent;
    }
    var isOpera = userAgent.indexOf('Opera') == 0;
    return {
      jscript: {
        /**
         * @type {boolean}
         */
        HAS_JSCRIPT: 'ScriptEngine' in this
      },
      /**
       * @type {boolean}
       */
      OPERA: isOpera,
      /**
       * @type {boolean}
       */
      IE: !isOpera && userAgent.indexOf('MSIE') != -1,
      /**
       * @type {boolean}
       */
      WEBKIT: !isOpera && userAgent.indexOf('WebKit') != -1
    };
  })();
}

if (!goog.asserts) {
  goog.asserts = {
    /**
     * @param {*} condition Condition to check.
     */
    assert: function (condition) {
      if (!condition) {
        throw Error('Assertion error');
      }
    },
    /**
     * @param {...*} var_args
     */
    fail: function (var_args) {}
  };
}


// Stub out the document wrapper used by renderAs*.
if (!goog.dom) {
  goog.dom = {};
  /**
   * @param {Document=} d
   * @constructor
   */
  goog.dom.DomHelper = function(d) {
    this.document_ = d || document;
  };
  /**
   * @return {!Document}
   */
  goog.dom.DomHelper.prototype.getDocument = function() {
    return this.document_;
  };
  /**
   * Creates a new element.
   * @param {string} name Tag name.
   * @return {!Element}
   */
  goog.dom.DomHelper.prototype.createElement = function(name) {
    return this.document_.createElement(name);
  };
  /**
   * Creates a new document fragment.
   * @return {!DocumentFragment}
   */
  goog.dom.DomHelper.prototype.createDocumentFragment = function() {
    return this.document_.createDocumentFragment();
  };
}


if (!goog.format) {
  goog.format = {
    insertWordBreaks: function(str, maxCharsBetweenWordBreaks) {
      str = String(str);

      var resultArr = [];
      var resultArrLen = 0;

      // These variables keep track of important state inside str.
      var isInTag = false;  // whether we're inside an HTML tag
      var isMaybeInEntity = false;  // whether we might be inside an HTML entity
      var numCharsWithoutBreak = 0;  // number of chars since last word break
      var flushIndex = 0;  // index of first char not yet flushed to resultArr

      for (var i = 0, n = str.length; i < n; ++i) {
        var charCode = str.charCodeAt(i);

        // If hit maxCharsBetweenWordBreaks, and not space next, then add <wbr>.
        if (numCharsWithoutBreak >= maxCharsBetweenWordBreaks &&
            // space
            charCode != 32) {
          resultArr[resultArrLen++] = str.substring(flushIndex, i);
          flushIndex = i;
          resultArr[resultArrLen++] = goog.format.WORD_BREAK;
          numCharsWithoutBreak = 0;
        }

        if (isInTag) {
          // If inside an HTML tag and we see '>', it's the end of the tag.
          if (charCode == 62) {
            isInTag = false;
          }

        } else if (isMaybeInEntity) {
          switch (charCode) {
            // Inside an entity, a ';' is the end of the entity.
            // The entity that just ended counts as one char, so increment
            // numCharsWithoutBreak.
          case 59:  // ';'
            isMaybeInEntity = false;
            ++numCharsWithoutBreak;
            break;
            // If maybe inside an entity and we see '<', we weren't actually in
            // an entity. But now we're inside and HTML tag.
          case 60:  // '<'
            isMaybeInEntity = false;
            isInTag = true;
            break;
            // If maybe inside an entity and we see ' ', we weren't actually in
            // an entity. Just correct the state and reset the
            // numCharsWithoutBreak since we just saw a space.
          case 32:  // ' '
            isMaybeInEntity = false;
            numCharsWithoutBreak = 0;
            break;
          }

        } else {  // !isInTag && !isInEntity
          switch (charCode) {
            // When not within a tag or an entity and we see '<', we're now
            // inside an HTML tag.
          case 60:  // '<'
            isInTag = true;
            break;
            // When not within a tag or an entity and we see '&', we might be
            // inside an entity.
          case 38:  // '&'
            isMaybeInEntity = true;
            break;
            // When we see a space, reset the numCharsWithoutBreak count.
          case 32:  // ' '
            numCharsWithoutBreak = 0;
            break;
            // When we see a non-space, increment the numCharsWithoutBreak.
          default:
            ++numCharsWithoutBreak;
            break;
          }
        }
      }

      // Flush the remaining chars at the end of the string.
      resultArr[resultArrLen++] = str.substring(flushIndex);

      return resultArr.join('');
    },
    /**
     * String inserted as a word break by insertWordBreaks(). Safari requires
     * <wbr></wbr>, Opera needs the &shy; entity, though this will give a
     * visible hyphen at breaks. IE8+ use a zero width space. Other browsers
     * just use <wbr>.
     * @type {string}
     * @private
     */
    WORD_BREAK:
        goog.userAgent.WEBKIT ? '<wbr></wbr>' :
        goog.userAgent.OPERA ? '&shy;' :
        goog.userAgent.IE ? '&#8203;' :
        '<wbr>'
  };
}


if (!goog.i18n) {
  goog.i18n = {
    bidi: {}
  };
}


/**
 * Constant that defines whether or not the current locale is an RTL locale.
 *
 * @type {boolean}
 */
goog.i18n.bidi.IS_RTL = false;


/**
 * Directionality enum.
 * @enum {number}
 */
goog.i18n.bidi.Dir = {
  /**
   * Left-to-right.
   */
  LTR: 1,

  /**
   * Right-to-left.
   */
  RTL: -1,

  /**
   * Neither left-to-right nor right-to-left.
   */
  NEUTRAL: 0,

  /**
   * A historical misnomer for NEUTRAL.
   * @deprecated For "neutral", use NEUTRAL; for "unknown", use null.
   */
  UNKNOWN: 0
};


/**
 * Convert a directionality given in various formats to a goog.i18n.bidi.Dir
 * constant. Useful for interaction with different standards of directionality
 * representation.
 *
 * @param {goog.i18n.bidi.Dir|number|boolean|null} givenDir Directionality given
 *     in one of the following formats:
 *     1. A goog.i18n.bidi.Dir constant.
 *     2. A number (positive = LTR, negative = RTL, 0 = neutral).
 *     3. A boolean (true = RTL, false = LTR).
 *     4. A null for unknown directionality.
 * @param {boolean=} opt_noNeutral Whether a givenDir of zero or
 *     goog.i18n.bidi.Dir.NEUTRAL should be treated as null, i.e. unknown, in
 *     order to preserve legacy behavior.
 * @return {?goog.i18n.bidi.Dir} A goog.i18n.bidi.Dir constant matching the
 *     given directionality. If given null, returns null (i.e. unknown).
 */
goog.i18n.bidi.toDir = function(givenDir, opt_noNeutral) {
  if (typeof givenDir == 'number') {
    // This includes the non-null goog.i18n.bidi.Dir case.
    return givenDir > 0 ? goog.i18n.bidi.Dir.LTR :
        givenDir < 0 ? goog.i18n.bidi.Dir.RTL :
        opt_noNeutral ? null : goog.i18n.bidi.Dir.NEUTRAL;
  } else if (givenDir == null) {
    return null;
  } else {
    // Must be typeof givenDir == 'boolean'.
    return givenDir ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR;
  }
};


/**
 * Estimates the directionality of a string based on relative word counts.
 * If the number of RTL words is above a certain percentage of the total number
 * of strongly directional words, returns RTL.
 * Otherwise, if any words are strongly or weakly LTR, returns LTR.
 * Otherwise, returns NEUTRAL.
 * Numbers are counted as weakly LTR.
 * @param {string} str The string to be checked.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {goog.i18n.bidi.Dir} Estimated overall directionality of {@code str}.
 */
goog.i18n.bidi.estimateDirection = function(str, opt_isHtml) {
  var rtlCount = 0;
  var totalCount = 0;
  var hasWeaklyLtr = false;
  var tokens = soyshim.$$bidiStripHtmlIfNecessary_(str, opt_isHtml).
      split(soyshim.$$bidiWordSeparatorRe_);
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    if (soyshim.$$bidiRtlDirCheckRe_.test(token)) {
      rtlCount++;
      totalCount++;
    } else if (soyshim.$$bidiIsRequiredLtrRe_.test(token)) {
      hasWeaklyLtr = true;
    } else if (soyshim.$$bidiLtrCharRe_.test(token)) {
      totalCount++;
    } else if (soyshim.$$bidiHasNumeralsRe_.test(token)) {
      hasWeaklyLtr = true;
    }
  }

  return totalCount == 0 ?
      (hasWeaklyLtr ? goog.i18n.bidi.Dir.LTR : goog.i18n.bidi.Dir.NEUTRAL) :
      (rtlCount / totalCount > soyshim.$$bidiRtlDetectionThreshold_ ?
          goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR);
};


/**
 * Utility class for formatting text for display in a potentially
 * opposite-directionality context without garbling. Provides the following
 * functionality:
 *
 * @param {goog.i18n.bidi.Dir|number|boolean|null} dir The context
 *     directionality, in one of the following formats:
 *     1. A goog.i18n.bidi.Dir constant. NEUTRAL is treated the same as null,
 *        i.e. unknown, for backward compatibility with legacy calls.
 *     2. A number (positive = LTR, negative = RTL, 0 = unknown).
 *     3. A boolean (true = RTL, false = LTR).
 *     4. A null for unknown directionality.
 * @constructor
 */
goog.i18n.BidiFormatter = function(dir) {
  /**
   * The overall directionality of the context in which the formatter is being
   * used.
   * @type {?goog.i18n.bidi.Dir}
   * @private
   */
  this.dir_ = goog.i18n.bidi.toDir(dir, true /* opt_noNeutral */);
};

/**
 * @return {?goog.i18n.bidi.Dir} The context directionality.
 */
goog.i18n.BidiFormatter.prototype.getContextDir = function() {
  return this.dir_;
};

/**
 * Returns 'dir="ltr"' or 'dir="rtl"', depending on the given directionality, if
 * it is not the same as the context directionality. Otherwise, returns the
 * empty string.
 *
 * @param {goog.i18n.bidi.Dir} dir A directionality.
 * @return {string} 'dir="rtl"' for RTL text in non-RTL context; 'dir="ltr"' for
 *     LTR text in non-LTR context; else, the empty string.
 */
goog.i18n.BidiFormatter.prototype.knownDirAttr = function(dir) {
  return !dir || dir == this.dir_ ? '' : dir < 0 ? 'dir="rtl"' : 'dir="ltr"';
};

/**
 * Returns the trailing horizontal edge, i.e. "right" or "left", depending on
 * the global bidi directionality.
 * @return {string} "left" for RTL context and "right" otherwise.
 */
goog.i18n.BidiFormatter.prototype.endEdge = function () {
  return this.dir_ < 0 ? 'left' : 'right';
};

/**
 * Returns the Unicode BiDi mark matching the context directionality (LRM for
 * LTR context directionality, RLM for RTL context directionality), or the
 * empty string for unknown context directionality.
 *
 * @return {string} LRM for LTR context directionality and RLM for RTL context
 *     directionality.
 */
goog.i18n.BidiFormatter.prototype.mark = function () {
  return (
      (this.dir_ > 0) ? '\u200E' /*LRM*/ :
      (this.dir_ < 0) ? '\u200F' /*RLM*/ :
      '');
};

/**
 * Returns a Unicode bidi mark matching the context directionality (LRM or RLM)
 * if the directionality or the exit directionality of {@code text} are opposite
 * to the context directionality. Otherwise returns the empty string.
 * If opt_isHtml, makes sure to ignore the LTR nature of the mark-up and escapes
 * in text, making the logic suitable for HTML and HTML-escaped text.
 * @param {?goog.i18n.bidi.Dir} textDir {@code text}'s overall directionality,
 *     or null if unknown and needs to be estimated.
 * @param {string} text The text whose directionality is to be estimated.
 * @param {boolean=} opt_isHtml Whether text is HTML/HTML-escaped.
 *     Default: false.
 * @return {string} A Unicode bidi mark matching the context directionality, or
 *     the empty string when either the context directionality is unknown or
 *     neither the text's overall nor its exit directionality is opposite to it.
 */
goog.i18n.BidiFormatter.prototype.markAfterKnownDir = function (
    textDir, text, opt_isHtml) {
  if (textDir == null) {
    textDir = goog.i18n.bidi.estimateDirection(text, opt_isHtml);
  }
  return (
      this.dir_ > 0 && (textDir < 0 ||
          soyshim.$$bidiIsRtlExitText_(text, opt_isHtml)) ? '\u200E' : // LRM
      this.dir_ < 0 && (textDir > 0 ||
          soyshim.$$bidiIsLtrExitText_(text, opt_isHtml)) ? '\u200F' : // RLM
      '');
};

/**
 * Formats an HTML string for use in HTML output of the context directionality,
 * so an opposite-directionality string is neither garbled nor garbles what
 * follows it.
 *
 * @param {?goog.i18n.bidi.Dir} textDir {@code str}'s overall directionality, or
 *     null if unknown and needs to be estimated.
 * @param {string} str The input text (HTML or HTML-escaped).
 * @param {boolean=} placeholder This argument exists for consistency with the
 *     Closure Library. Specifying it has no effect.
 * @return {string} The input text after applying the above processing.
 */
goog.i18n.BidiFormatter.prototype.spanWrapWithKnownDir = function(
    textDir, str, placeholder) {
  if (textDir == null) {
    textDir = goog.i18n.bidi.estimateDirection(str, true);
  }
  var reset = this.markAfterKnownDir(textDir, str, true);
  if (textDir > 0 && this.dir_ <= 0) {
    str = '<span dir="ltr">' + str + '</span>';
  } else if (textDir < 0 && this.dir_ >= 0) {
    str = '<span dir="rtl">' + str + '</span>';
  }
  return str + reset;
};

/**
 * Returns the leading horizontal edge, i.e. "left" or "right", depending on
 * the global bidi directionality.
 * @return {string} "right" for RTL context and "left" otherwise.
 */
goog.i18n.BidiFormatter.prototype.startEdge = function () {
  return this.dir_ < 0 ? 'right' : 'left';
};

/**
 * Formats an HTML-escaped string for use in HTML output of the context
 * directionality, so an opposite-directionality string is neither garbled nor
 * garbles what follows it.
 * As opposed to {@link #spanWrapWithKnownDir}, this makes use of unicode bidi
 * formatting characters. In HTML, it should only be used inside attribute
 * values and elements that do not allow markup, e.g. an 'option' tag.
 *
 * @param {?goog.i18n.bidi.Dir} textDir {@code str}'s overall directionality, or
 *     null if unknown and needs to be estimated.
 * @param {string} str The input text (HTML-escaped).
 * @param {boolean=} opt_isHtml Whether {@code str} is HTML / HTML-escaped.
 *     Default: false.
 * @return {string} The input text after applying the above processing.
 */
goog.i18n.BidiFormatter.prototype.unicodeWrapWithKnownDir = function(
    textDir, str, opt_isHtml) {
  if (textDir == null) {
    textDir = goog.i18n.bidi.estimateDirection(str, opt_isHtml);
  }
  var reset = this.markAfterKnownDir(textDir, str, opt_isHtml);
  if (textDir > 0 && this.dir_ <= 0) {
    str = '\u202A' + str + '\u202C';
  } else if (textDir < 0 && this.dir_ >= 0) {
    str = '\u202B' + str + '\u202C';
  }
  return str + reset;
};


if (!goog.string) {
  goog.string = {
    /**
     * Converts \r\n, \r, and \n to <br>s
     * @param {*} str The string in which to convert newlines.
     * @param {boolean=} opt_xml Whether to use XML compatible tags.
     * @return {string} A copy of {@code str} with converted newlines.
     */
    newLineToBr: function(str, opt_xml) {

      str = String(str);

      // This quick test helps in the case when there are no chars to replace,
      // in the worst case this makes barely a difference to the time taken.
      if (!goog.string.NEWLINE_TO_BR_RE_.test(str)) {
        return str;
      }

      return str.replace(/(\r\n|\r|\n)/g, opt_xml ? '<br />' : '<br>');
    },
    urlEncode: encodeURIComponent,
    /**
     * Regular expression used within newlineToBr().
     * @type {RegExp}
     * @private
     */
    NEWLINE_TO_BR_RE_: /[\r\n]/
  };
}

/**
 * Utility class to facilitate much faster string concatenation in IE,
 * using Array.join() rather than the '+' operator. For other browsers
 * we simply use the '+' operator.
 *
 * @param {Object|number|string|boolean=} opt_a1 Optional first initial item
 *     to append.
 * @param {...Object|number|string|boolean} var_args Other initial items to
 *     append, e.g., new goog.string.StringBuffer('foo', 'bar').
 * @constructor
 */
goog.string.StringBuffer = function(opt_a1, var_args) {
  /**
   * Internal buffer for the string to be concatenated.
   * @type {string|Array}
   * @private
   */
  this.buffer_ = goog.userAgent.jscript.HAS_JSCRIPT ? [] : '';

  if (opt_a1 != null) {
    this.append.apply(this, arguments);
  }
};


/**
 * Length of internal buffer (faster than calling buffer_.length).
 * Only used for IE.
 * @type {number}
 * @private
 */
goog.string.StringBuffer.prototype.bufferLength_ = 0;

/**
 * Appends one or more items to the string.
 *
 * Calling this with null, undefined, or empty arguments is an error.
 *
 * @param {Object|number|string|boolean} a1 Required first string.
 * @param {Object|number|string|boolean=} opt_a2 Optional second string.
 * @param {...Object|number|string|boolean} var_args Other items to append,
 *     e.g., sb.append('foo', 'bar', 'baz').
 * @return {goog.string.StringBuffer} This same StringBuilder object.
 */
goog.string.StringBuffer.prototype.append = function(a1, opt_a2, var_args) {

  if (goog.userAgent.jscript.HAS_JSCRIPT) {
    if (opt_a2 == null) {  // no second argument (note: undefined == null)
      // Array assignment is 2x faster than Array push. Also, use a1
      // directly to avoid arguments instantiation, another 2x improvement.
      this.buffer_[this.bufferLength_++] = a1;
    } else {
      var arr = /**@type {Array.<number|string|boolean>}*/(this.buffer_);
      arr.push.apply(arr, arguments);
      this.bufferLength_ = this.buffer_.length;
    }

  } else {

    // Use a1 directly to avoid arguments instantiation for single-arg case.
    this.buffer_ += a1;
    if (opt_a2 != null) {  // no second argument (note: undefined == null)
      for (var i = 1; i < arguments.length; i++) {
        this.buffer_ += arguments[i];
      }
    }
  }

  return this;
};


/**
 * Clears the string.
 */
goog.string.StringBuffer.prototype.clear = function() {

  if (goog.userAgent.jscript.HAS_JSCRIPT) {
     this.buffer_.length = 0;  // reuse array to avoid creating new object
     this.bufferLength_ = 0;

   } else {
     this.buffer_ = '';
   }
};


/**
 * Returns the concatenated string.
 *
 * @return {string} The concatenated string.
 */
goog.string.StringBuffer.prototype.toString = function() {

  if (goog.userAgent.jscript.HAS_JSCRIPT) {
    var str = this.buffer_.join('');
    // Given a string with the entire contents, simplify the StringBuilder by
    // setting its contents to only be this string, rather than many fragments.
    this.clear();
    if (str) {
      this.append(str);
    }
    return str;

  } else {
    return /** @type {string} */ (this.buffer_);
  }
};


if (!goog.soy) goog.soy = {
  /**
   * Helper function to render a Soy template and then set the
   * output string as the innerHTML of an element. It is recommended
   * to use this helper function instead of directly setting
   * innerHTML in your hand-written code, so that it will be easier
   * to audit the code for cross-site scripting vulnerabilities.
   *
   * @param {Function} template The Soy template defining element's content.
   * @param {Object=} opt_templateData The data for the template.
   * @param {Object=} opt_injectedData The injected data for the template.
   * @param {(goog.dom.DomHelper|Document)=} opt_dom The context in which DOM
   *     nodes will be created.
   */
  renderAsElement: function(
    template, opt_templateData, opt_injectedData, opt_dom) {
    return /** @type {!Element} */ (soyshim.$$renderWithWrapper_(
        template, opt_templateData, opt_dom, true /* asElement */,
        opt_injectedData));
  },
  /**
   * Helper function to render a Soy template into a single node or
   * a document fragment. If the rendered HTML string represents a
   * single node, then that node is returned (note that this is
   * *not* a fragment, despite them name of the method). Otherwise a
   * document fragment is returned containing the rendered nodes.
   *
   * @param {Function} template The Soy template defining element's content.
   * @param {Object=} opt_templateData The data for the template.
   * @param {Object=} opt_injectedData The injected data for the template.
   * @param {(goog.dom.DomHelper|Document)=} opt_dom The context in which DOM
   *     nodes will be created.
   * @return {!Node} The resulting node or document fragment.
   */
  renderAsFragment: function(
    template, opt_templateData, opt_injectedData, opt_dom) {
    return soyshim.$$renderWithWrapper_(
        template, opt_templateData, opt_dom, false /* asElement */,
        opt_injectedData);
  },
  /**
   * Helper function to render a Soy template and then set the output string as
   * the innerHTML of an element. It is recommended to use this helper function
   * instead of directly setting innerHTML in your hand-written code, so that it
   * will be easier to audit the code for cross-site scripting vulnerabilities.
   *
   * NOTE: New code should consider using goog.soy.renderElement instead.
   *
   * @param {Element} element The element whose content we are rendering.
   * @param {Function} template The Soy template defining the element's content.
   * @param {Object=} opt_templateData The data for the template.
   * @param {Object=} opt_injectedData The injected data for the template.
   */
  renderElement: function(
      element, template, opt_templateData, opt_injectedData) {
    element.innerHTML = template(opt_templateData, null, opt_injectedData);
  },
  data: {}
};


/**
 * A type of textual content.
 *
 * This is an enum of type Object so that these values are unforgeable.
 *
 * @enum {!Object}
 */
goog.soy.data.SanitizedContentKind = {

  /**
   * A snippet of HTML that does not start or end inside a tag, comment, entity,
   * or DOCTYPE; and that does not contain any executable code
   * (JS, {@code <object>}s, etc.) from a different trust domain.
   */
  HTML: goog.DEBUG ? {sanitizedContentKindHtml: true} : {},

  /**
   * Executable Javascript code or expression, safe for insertion in a
   * script-tag or event handler context, known to be free of any
   * attacker-controlled scripts. This can either be side-effect-free
   * Javascript (such as JSON) or Javascript that's entirely under Google's
   * control.
   */
  JS: goog.DEBUG ? {sanitizedContentJsChars: true} : {},

  /**
   * A sequence of code units that can appear between quotes (either kind) in a
   * JS program without causing a parse error, and without causing any side
   * effects.
   * <p>
   * The content should not contain unescaped quotes, newlines, or anything else
   * that would cause parsing to fail or to cause a JS parser to finish the
   * string its parsing inside the content.
   * <p>
   * The content must also not end inside an escape sequence ; no partial octal
   * escape sequences or odd number of '{@code \}'s at the end.
   */
  JS_STR_CHARS: goog.DEBUG ? {sanitizedContentJsStrChars: true} : {},

  /** A properly encoded portion of a URI. */
  URI: goog.DEBUG ? {sanitizedContentUri: true} : {},

  /**
   * Repeated attribute names and values. For example,
   * {@code dir="ltr" foo="bar" onclick="trustedFunction()" checked}.
   */
  ATTRIBUTES: goog.DEBUG ? {sanitizedContentHtmlAttribute: true} : {},

  // TODO: Consider separating rules, declarations, and values into
  // separate types, but for simplicity, we'll treat explicitly blessed
  // SanitizedContent as allowed in all of these contexts.
  /**
   * A CSS3 declaration, property, value or group of semicolon separated
   * declarations.
   */
  CSS: goog.DEBUG ? {sanitizedContentCss: true} : {},

  /**
   * Unsanitized plain-text content.
   *
   * This is effectively the "null" entry of this enum, and is sometimes used
   * to explicitly mark content that should never be used unescaped. Since any
   * string is safe to use as text, being of ContentKind.TEXT makes no
   * guarantees about its safety in any other context such as HTML.
   */
  TEXT: goog.DEBUG ? {sanitizedContentKindText: true} : {}
};



/**
 * A string-like object that carries a content-type and a content direction.
 *
 * IMPORTANT! Do not create these directly, nor instantiate the subclasses.
 * Instead, use a trusted, centrally reviewed library as endorsed by your team
 * to generate these objects. Otherwise, you risk accidentally creating
 * SanitizedContent that is attacker-controlled and gets evaluated unescaped in
 * templates.
 *
 * @constructor
 */
goog.soy.data.SanitizedContent = function() {
  throw Error('Do not instantiate directly');
};


/**
 * The context in which this content is safe from XSS attacks.
 * @type {goog.soy.data.SanitizedContentKind}
 */
goog.soy.data.SanitizedContent.prototype.contentKind;


/**
 * The content's direction; null if unknown and thus to be estimated when
 * necessary.
 * @type {?goog.i18n.bidi.Dir}
 */
goog.soy.data.SanitizedContent.prototype.contentDir = null;


/**
 * The already-safe content.
 * @type {string}
 */
goog.soy.data.SanitizedContent.prototype.content;


/** @override */
goog.soy.data.SanitizedContent.prototype.toString = function() {
  return this.content;
};


var soy = { esc: {} };
var soydata = {};
soydata.VERY_UNSAFE = {};
var soyshim = { $$DEFAULT_TEMPLATE_DATA_: {} };
/**
 * Helper function to render a Soy template into a single node or a document
 * fragment. If the rendered HTML string represents a single node, then that
 * node is returned. Otherwise a document fragment is created and returned
 * (wrapped in a DIV element if #opt_singleNode is true).
 *
 * @param {Function} template The Soy template defining the element's content.
 * @param {Object=} opt_templateData The data for the template.
 * @param {(goog.dom.DomHelper|Document)=} opt_dom The context in which DOM
 *     nodes will be created.
 * @param {boolean=} opt_asElement Whether to wrap the fragment in an
 *     element if the template does not render a single element. If true,
 *     result is always an Element.
 * @param {Object=} opt_injectedData The injected data for the template.
 * @return {!Node} The resulting node or document fragment.
 * @private
 */
soyshim.$$renderWithWrapper_ = function(
    template, opt_templateData, opt_dom, opt_asElement, opt_injectedData) {

  var dom = opt_dom || document;
  var wrapper = dom.createElement('div');
  wrapper.innerHTML = template(
    opt_templateData || soyshim.$$DEFAULT_TEMPLATE_DATA_, undefined,
    opt_injectedData);

  // If the template renders as a single element, return it.
  if (wrapper.childNodes.length == 1) {
    var firstChild = wrapper.firstChild;
    if (!opt_asElement || firstChild.nodeType == 1 /* Element */) {
      return /** @type {!Node} */ (firstChild);
    }
  }

  // If we're forcing it to be a single element, return the wrapper DIV.
  if (opt_asElement) {
    return wrapper;
  }

  // Otherwise, create and return a fragment.
  var fragment = dom.createDocumentFragment();
  while (wrapper.firstChild) {
    fragment.appendChild(wrapper.firstChild);
  }
  return fragment;
};


/**
 * Strips str of any HTML mark-up and escapes. Imprecise in several ways, but
 * precision is not very important, since the result is only meant to be used
 * for directionality detection.
 * Based on goog.i18n.bidi.stripHtmlIfNeeded_().
 * @param {string} str The string to be stripped.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {string} The stripped string.
 * @private
 */
soyshim.$$bidiStripHtmlIfNecessary_ = function(str, opt_isHtml) {
  return opt_isHtml ? str.replace(soyshim.$$BIDI_HTML_SKIP_RE_, '') : str;
};


/**
 * Simplified regular expression for am HTML tag (opening or closing) or an HTML
 * escape - the things we want to skip over in order to ignore their ltr
 * characters.
 * Copied from goog.i18n.bidi.htmlSkipReg_.
 * @type {RegExp}
 * @private
 */
soyshim.$$BIDI_HTML_SKIP_RE_ = /<[^>]*>|&[^;]+;/g;


/**
 * A practical pattern to identify strong LTR character. This pattern is not
 * theoretically correct according to unicode standard. It is simplified for
 * performance and small code size.
 * Copied from goog.i18n.bidi.ltrChars_.
 * @type {string}
 * @private
 */
soyshim.$$bidiLtrChars_ =
    'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF' +
    '\u200E\u2C00-\uFB1C\uFE00-\uFE6F\uFEFD-\uFFFF';


/**
 * A practical pattern to identify strong RTL character. This pattern is not
 * theoretically correct according to unicode standard. It is simplified for
 * performance and small code size.
 * Copied from goog.i18n.bidi.rtlChars_.
 * @type {string}
 * @private
 */
soyshim.$$bidiRtlChars_ = '\u0591-\u07FF\u200F\uFB1D-\uFDFF\uFE70-\uFEFC';


/**
 * Regular expressions to check if a piece of text is of RTL directionality
 * on first character with strong directionality.
 * Based on goog.i18n.bidi.rtlDirCheckRe_.
 * @type {RegExp}
 * @private
 */
soyshim.$$bidiRtlDirCheckRe_ = new RegExp(
    '^[^' + soyshim.$$bidiLtrChars_ + ']*[' + soyshim.$$bidiRtlChars_ + ']');


/**
 * Regular expression to check for LTR characters.
 * Based on goog.i18n.bidi.ltrCharReg_.
 * @type {RegExp}
 * @private
 */
soyshim.$$bidiLtrCharRe_ = new RegExp('[' + soyshim.$$bidiLtrChars_ + ']');


/**
 * Regular expression to check if a string looks like something that must
 * always be LTR even in RTL text, e.g. a URL. When estimating the
 * directionality of text containing these, we treat these as weakly LTR,
 * like numbers.
 * Copied from goog.i18n.bidi.isRequiredLtrRe_.
 * @type {RegExp}
 * @private
 */
soyshim.$$bidiIsRequiredLtrRe_ = /^http:\/\/.*/;


/**
 * Regular expression to check if a string contains any numerals. Used to
 * differentiate between completely neutral strings and those containing
 * numbers, which are weakly LTR.
 * Copied from goog.i18n.bidi.hasNumeralsRe_.
 * @type {RegExp}
 * @private
 */
soyshim.$$bidiHasNumeralsRe_ = /\d/;


/**
 * Regular expression to split a string into "words" for directionality
 * estimation based on relative word counts.
 * Copied from goog.i18n.bidi.wordSeparatorRe_.
 * @type {RegExp}
 * @private
 */
soyshim.$$bidiWordSeparatorRe_ = /\s+/;


/**
 * This constant controls threshold of rtl directionality.
 * Copied from goog.i18n.bidi.rtlDetectionThreshold_.
 * @type {number}
 * @private
 */
soyshim.$$bidiRtlDetectionThreshold_ = 0.40;

/**
 * Regular expressions to check if the last strongly-directional character in a
 * piece of text is LTR.
 * Based on goog.i18n.bidi.ltrExitDirCheckRe_.
 * @type {RegExp}
 * @private
 */
soyshim.$$bidiLtrExitDirCheckRe_ = new RegExp(
    '[' + soyshim.$$bidiLtrChars_ + '][^' + soyshim.$$bidiRtlChars_ + ']*$');


/**
 * Regular expressions to check if the last strongly-directional character in a
 * piece of text is RTL.
 * Based on goog.i18n.bidi.rtlExitDirCheckRe_.
 * @type {RegExp}
 * @private
 */
soyshim.$$bidiRtlExitDirCheckRe_ = new RegExp(
    '[' + soyshim.$$bidiRtlChars_ + '][^' + soyshim.$$bidiLtrChars_ + ']*$');


/**
 * Check if the exit directionality a piece of text is LTR, i.e. if the last
 * strongly-directional character in the string is LTR.
 * Based on goog.i18n.bidi.endsWithLtr().
 * @param {string} str string being checked.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether LTR exit directionality was detected.
 * @private
 */
soyshim.$$bidiIsLtrExitText_ = function(str, opt_isHtml) {
  str = soyshim.$$bidiStripHtmlIfNecessary_(str, opt_isHtml);
  return soyshim.$$bidiLtrExitDirCheckRe_.test(str);
};


/**
 * Check if the exit directionality a piece of text is RTL, i.e. if the last
 * strongly-directional character in the string is RTL.
 * Based on goog.i18n.bidi.endsWithRtl().
 * @param {string} str string being checked.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether RTL exit directionality was detected.
 * @private
 */
soyshim.$$bidiIsRtlExitText_ = function(str, opt_isHtml) {
  str = soyshim.$$bidiStripHtmlIfNecessary_(str, opt_isHtml);
  return soyshim.$$bidiRtlExitDirCheckRe_.test(str);
};


// =============================================================================
// COPIED FROM soyutils_usegoog.js


// -----------------------------------------------------------------------------
// StringBuilder (compatible with the 'stringbuilder' code style).


/**
 * Utility class to facilitate much faster string concatenation in IE,
 * using Array.join() rather than the '+' operator. For other browsers
 * we simply use the '+' operator.
 *
 * @param {Object} var_args Initial items to append,
 *     e.g., new soy.StringBuilder('foo', 'bar').
 * @constructor
 */
soy.StringBuilder = goog.string.StringBuffer;


// -----------------------------------------------------------------------------
// soydata: Defines typed strings, e.g. an HTML string {@code "a<b>c"} is
// semantically distinct from the plain text string {@code "a<b>c"} and smart
// templates can take that distinction into account.

/**
 * A type of textual content.
 *
 * This is an enum of type Object so that these values are unforgeable.
 *
 * @enum {!Object}
 */
soydata.SanitizedContentKind = goog.soy.data.SanitizedContentKind;


/**
 * Checks whether a given value is of a given content kind.
 *
 * @param {*} value The value to be examined.
 * @param {soydata.SanitizedContentKind} contentKind The desired content
 *     kind.
 * @return {boolean} Whether the given value is of the given kind.
 * @private
 */
soydata.isContentKind = function(value, contentKind) {
  // TODO(user): This function should really include the assert on
  // value.constructor that is currently sprinkled at most of the call sites.
  // Unfortunately, that would require a (debug-mode-only) switch statement.
  // TODO(user): Perhaps we should get rid of the contentKind property
  // altogether and only at the constructor.
  return value != null && value.contentKind === contentKind;
};


/**
 * Returns a given value's contentDir property, constrained to a
 * goog.i18n.bidi.Dir value or null. Returns null if the value is null,
 * undefined, a primitive or does not have a contentDir property, or the
 * property's value is not 1 (for LTR), -1 (for RTL), or 0 (for neutral).
 *
 * @param {*} value The value whose contentDir property, if any, is to
 *     be returned.
 * @return {?goog.i18n.bidi.Dir} The contentDir property.
 */
soydata.getContentDir = function(value) {
  if (value != null) {
    switch (value.contentDir) {
      case goog.i18n.bidi.Dir.LTR:
        return goog.i18n.bidi.Dir.LTR;
      case goog.i18n.bidi.Dir.RTL:
        return goog.i18n.bidi.Dir.RTL;
      case goog.i18n.bidi.Dir.NEUTRAL:
        return goog.i18n.bidi.Dir.NEUTRAL;
    }
  }
  return null;
};


/**
 * Content of type {@link soydata.SanitizedContentKind.HTML}.
 *
 * The content is a string of HTML that can safely be embedded in a PCDATA
 * context in your app.  If you would be surprised to find that an HTML
 * sanitizer produced {@code s} (e.g.  it runs code or fetches bad URLs) and
 * you wouldn't write a template that produces {@code s} on security or privacy
 * grounds, then don't pass {@code s} here. The default content direction is
 * unknown, i.e. to be estimated when necessary.
 *
 * @constructor
 * @extends {goog.soy.data.SanitizedContent}
 */
soydata.SanitizedHtml = function() {
  goog.soy.data.SanitizedContent.call(this);  // Throws an exception.
};
goog.inherits(soydata.SanitizedHtml, goog.soy.data.SanitizedContent);

/** @override */
soydata.SanitizedHtml.prototype.contentKind = soydata.SanitizedContentKind.HTML;

/**
 * Returns a SanitizedHtml object for a particular value. The content direction
 * is preserved.
 *
 * This HTML-escapes the value unless it is already SanitizedHtml.
 *
 * @param {*} value The value to convert. If it is already a SanitizedHtml
 *     object, it is left alone.
 * @return {!soydata.SanitizedHtml} A SanitizedHtml object derived from the
 *     stringified value. It is escaped unless the input is SanitizedHtml.
 */
soydata.SanitizedHtml.from = function(value) {
  // The check is soydata.isContentKind() inlined for performance.
  if (value != null &&
      value.contentKind === soydata.SanitizedContentKind.HTML) {
    goog.asserts.assert(value.constructor === soydata.SanitizedHtml);
    return /** @type {!soydata.SanitizedHtml} */ (value);
  }
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(
      soy.esc.$$escapeHtmlHelper(String(value)), soydata.getContentDir(value));
};


/**
 * Content of type {@link soydata.SanitizedContentKind.JS}.
 *
 * The content is Javascript source that when evaluated does not execute any
 * attacker-controlled scripts. The content direction is LTR.
 *
 * @constructor
 * @extends {goog.soy.data.SanitizedContent}
 */
soydata.SanitizedJs = function() {
  goog.soy.data.SanitizedContent.call(this);  // Throws an exception.
};
goog.inherits(soydata.SanitizedJs, goog.soy.data.SanitizedContent);

/** @override */
soydata.SanitizedJs.prototype.contentKind =
    soydata.SanitizedContentKind.JS;

/** @override */
soydata.SanitizedJs.prototype.contentDir = goog.i18n.bidi.Dir.LTR;


/**
 * Content of type {@link soydata.SanitizedContentKind.JS_STR_CHARS}.
 *
 * The content can be safely inserted as part of a single- or double-quoted
 * string without terminating the string. The default content direction is
 * unknown, i.e. to be estimated when necessary.
 *
 * @constructor
 * @extends {goog.soy.data.SanitizedContent}
 */
soydata.SanitizedJsStrChars = function() {
  goog.soy.data.SanitizedContent.call(this);  // Throws an exception.
};
goog.inherits(soydata.SanitizedJsStrChars, goog.soy.data.SanitizedContent);

/** @override */
soydata.SanitizedJsStrChars.prototype.contentKind =
    soydata.SanitizedContentKind.JS_STR_CHARS;

/**
 * Content of type {@link soydata.SanitizedContentKind.URI}.
 *
 * The content is a URI chunk that the caller knows is safe to emit in a
 * template. The content direction is LTR.
 *
 * @constructor
 * @extends {goog.soy.data.SanitizedContent}
 */
soydata.SanitizedUri = function() {
  goog.soy.data.SanitizedContent.call(this);  // Throws an exception.
};
goog.inherits(soydata.SanitizedUri, goog.soy.data.SanitizedContent);

/** @override */
soydata.SanitizedUri.prototype.contentKind = soydata.SanitizedContentKind.URI;

/** @override */
soydata.SanitizedUri.prototype.contentDir = goog.i18n.bidi.Dir.LTR;


/**
 * Content of type {@link soydata.SanitizedContentKind.ATTRIBUTES}.
 *
 * The content should be safely embeddable within an open tag, such as a
 * key="value" pair. The content direction is LTR.
 *
 * @constructor
 * @extends {goog.soy.data.SanitizedContent}
 */
soydata.SanitizedHtmlAttribute = function() {
  goog.soy.data.SanitizedContent.call(this);  // Throws an exception.
};
goog.inherits(soydata.SanitizedHtmlAttribute, goog.soy.data.SanitizedContent);

/** @override */
soydata.SanitizedHtmlAttribute.prototype.contentKind =
    soydata.SanitizedContentKind.ATTRIBUTES;

/** @override */
soydata.SanitizedHtmlAttribute.prototype.contentDir = goog.i18n.bidi.Dir.LTR;


/**
 * Content of type {@link soydata.SanitizedContentKind.CSS}.
 *
 * The content is non-attacker-exploitable CSS, such as {@code color:#c3d9ff}.
 * The content direction is LTR.
 *
 * @constructor
 * @extends {goog.soy.data.SanitizedContent}
 */
soydata.SanitizedCss = function() {
  goog.soy.data.SanitizedContent.call(this);  // Throws an exception.
};
goog.inherits(soydata.SanitizedCss, goog.soy.data.SanitizedContent);

/** @override */
soydata.SanitizedCss.prototype.contentKind =
    soydata.SanitizedContentKind.CSS;

/** @override */
soydata.SanitizedCss.prototype.contentDir = goog.i18n.bidi.Dir.LTR;


/**
 * Unsanitized plain text string.
 *
 * While all strings are effectively safe to use as a plain text, there are no
 * guarantees about safety in any other context such as HTML. This is
 * sometimes used to mark that should never be used unescaped.
 *
 * @param {*} content Plain text with no guarantees.
 * @param {?goog.i18n.bidi.Dir=} opt_contentDir The content direction; null if
 *     unknown and thus to be estimated when necessary. Default: null.
 * @constructor
 * @extends {goog.soy.data.SanitizedContent}
 */
soydata.UnsanitizedText = function(content, opt_contentDir) {
  /** @override */
  this.content = String(content);
  this.contentDir = opt_contentDir != null ? opt_contentDir : null;
};
goog.inherits(soydata.UnsanitizedText, goog.soy.data.SanitizedContent);

/** @override */
soydata.UnsanitizedText.prototype.contentKind =
    soydata.SanitizedContentKind.TEXT;


/**
 * Empty string, used as a type in Soy templates.
 * @enum {string}
 * @private
 */
soydata.$$EMPTY_STRING_ = {
  VALUE: ''
};


/**
 * Creates a factory for SanitizedContent types.
 *
 * This is a hack so that the soydata.VERY_UNSAFE.ordainSanitized* can
 * instantiate Sanitized* classes, without making the Sanitized* constructors
 * publicly usable. Requiring all construction to use the VERY_UNSAFE names
 * helps callers and their reviewers easily tell that creating SanitizedContent
 * is not always safe and calls for careful review.
 *
 * @param {function(new: T)} ctor A constructor.
 * @return {!function(*, ?goog.i18n.bidi.Dir=): T} A factory that takes
 *     content and an optional content direction and returns a new instance. If
 *     the content direction is undefined, ctor.prototype.contentDir is used.
 * @template T
 * @private
 */
soydata.$$makeSanitizedContentFactory_ = function(ctor) {
  /** @type {function(new: goog.soy.data.SanitizedContent)} */
  function InstantiableCtor() {}
  InstantiableCtor.prototype = ctor.prototype;
  /**
   * Creates a ctor-type SanitizedContent instance.
   *
   * @param {*} content The content to put in the instance.
   * @param {?goog.i18n.bidi.Dir=} opt_contentDir The content direction. If
   *     undefined, ctor.prototype.contentDir is used.
   * @return {goog.soy.data.SanitizedContent} The new instance. It is actually
   *     of type T above (ctor's type, a descendant of SanitizedContent), but
   *     there is no way to express that here.
   */
  function sanitizedContentFactory(content, opt_contentDir) {
    var result = new InstantiableCtor();
    result.content = String(content);
    if (opt_contentDir !== undefined) {
      result.contentDir = opt_contentDir;
    }
    return result;
  }
  return sanitizedContentFactory;
};


/**
 * Creates a factory for SanitizedContent types that should always have their
 * default directionality.
 *
 * This is a hack so that the soydata.VERY_UNSAFE.ordainSanitized* can
 * instantiate Sanitized* classes, without making the Sanitized* constructors
 * publicly usable. Requiring all construction to use the VERY_UNSAFE names
 * helps callers and their reviewers easily tell that creating SanitizedContent
 * is not always safe and calls for careful review.
 *
 * @param {function(new: T, string)} ctor A constructor.
 * @return {!function(*): T} A factory that takes content and returns a new
 *     instance (with default directionality, i.e. ctor.prototype.contentDir).
 * @template T
 * @private
 */
soydata.$$makeSanitizedContentFactoryWithDefaultDirOnly_ = function(ctor) {
  /** @type {function(new: goog.soy.data.SanitizedContent)} */
  function InstantiableCtor() {}
  InstantiableCtor.prototype = ctor.prototype;
  /**
   * Creates a ctor-type SanitizedContent instance.
   *
   * @param {*} content The content to put in the instance.
   * @return {goog.soy.data.SanitizedContent} The new instance. It is actually
   *     of type T above (ctor's type, a descendant of SanitizedContent), but
   *     there is no way to express that here.
   */
  function sanitizedContentFactory(content) {
    var result = new InstantiableCtor();
    result.content = String(content);
    return result;
  }
  return sanitizedContentFactory;
};


// -----------------------------------------------------------------------------
// Sanitized content ordainers. Please use these with extreme caution (with the
// exception of markUnsanitizedText). A good recommendation is to limit usage
// of these to just a handful of files in your source tree where usages can be
// carefully audited.


/**
 * Protects a string from being used in an noAutoescaped context.
 *
 * This is useful for content where there is significant risk of accidental
 * unescaped usage in a Soy template. A great case is for user-controlled
 * data that has historically been a source of vulernabilities.
 *
 * @param {*} content Text to protect.
 * @param {?goog.i18n.bidi.Dir=} opt_contentDir The content direction; null if
 *     unknown and thus to be estimated when necessary. Default: null.
 * @return {!soydata.UnsanitizedText} A wrapper that is rejected by the
 *     Soy noAutoescape print directive.
 */
soydata.markUnsanitizedText = function(content, opt_contentDir) {
  return new soydata.UnsanitizedText(content, opt_contentDir);
};


/**
 * Takes a leap of faith that the provided content is "safe" HTML.
 *
 * @param {*} content A string of HTML that can safely be embedded in
 *     a PCDATA context in your app. If you would be surprised to find that an
 *     HTML sanitizer produced {@code s} (e.g. it runs code or fetches bad URLs)
 *     and you wouldn't write a template that produces {@code s} on security or
 *     privacy grounds, then don't pass {@code s} here.
 * @param {?goog.i18n.bidi.Dir=} opt_contentDir The content direction; null if
 *     unknown and thus to be estimated when necessary. Default: null.
 * @return {!soydata.SanitizedHtml} Sanitized content wrapper that
 *     indicates to Soy not to escape when printed as HTML.
 */
soydata.VERY_UNSAFE.ordainSanitizedHtml =
    soydata.$$makeSanitizedContentFactory_(soydata.SanitizedHtml);


/**
 * Takes a leap of faith that the provided content is "safe" (non-attacker-
 * controlled, XSS-free) Javascript.
 *
 * @param {*} content Javascript source that when evaluated does not
 *     execute any attacker-controlled scripts.
 * @return {!soydata.SanitizedJs} Sanitized content wrapper that indicates to
 *     Soy not to escape when printed as Javascript source.
 */
soydata.VERY_UNSAFE.ordainSanitizedJs =
    soydata.$$makeSanitizedContentFactoryWithDefaultDirOnly_(
        soydata.SanitizedJs);


// TODO: This function is probably necessary, either externally or internally
// as an implementation detail. Generally, plain text will always work here,
// as there's no harm to unescaping the string and then re-escaping when
// finally printed.
/**
 * Takes a leap of faith that the provided content can be safely embedded in
 * a Javascript string without re-esacping.
 *
 * @param {*} content Content that can be safely inserted as part of a
 *     single- or double-quoted string without terminating the string.
 * @param {?goog.i18n.bidi.Dir=} opt_contentDir The content direction; null if
 *     unknown and thus to be estimated when necessary. Default: null.
 * @return {!soydata.SanitizedJsStrChars} Sanitized content wrapper that
 *     indicates to Soy not to escape when printed in a JS string.
 */
soydata.VERY_UNSAFE.ordainSanitizedJsStrChars =
    soydata.$$makeSanitizedContentFactory_(soydata.SanitizedJsStrChars);


/**
 * Takes a leap of faith that the provided content is "safe" to use as a URI
 * in a Soy template.
 *
 * This creates a Soy SanitizedContent object which indicates to Soy there is
 * no need to escape it when printed as a URI (e.g. in an href or src
 * attribute), such as if it's already been encoded or  if it's a Javascript:
 * URI.
 *
 * @param {*} content A chunk of URI that the caller knows is safe to
 *     emit in a template.
 * @return {!soydata.SanitizedUri} Sanitized content wrapper that indicates to
 *     Soy not to escape or filter when printed in URI context.
 */
soydata.VERY_UNSAFE.ordainSanitizedUri =
    soydata.$$makeSanitizedContentFactoryWithDefaultDirOnly_(
        soydata.SanitizedUri);


/**
 * Takes a leap of faith that the provided content is "safe" to use as an
 * HTML attribute.
 *
 * @param {*} content An attribute name and value, such as
 *     {@code dir="ltr"}.
 * @return {!soydata.SanitizedHtmlAttribute} Sanitized content wrapper that
 *     indicates to Soy not to escape when printed as an HTML attribute.
 */
soydata.VERY_UNSAFE.ordainSanitizedHtmlAttribute =
    soydata.$$makeSanitizedContentFactoryWithDefaultDirOnly_(
        soydata.SanitizedHtmlAttribute);


/**
 * Takes a leap of faith that the provided content is "safe" to use as CSS
 * in a style attribute or block.
 *
 * @param {*} content CSS, such as {@code color:#c3d9ff}.
 * @return {!soydata.SanitizedCss} Sanitized CSS wrapper that indicates to
 *     Soy there is no need to escape or filter when printed in CSS context.
 */
soydata.VERY_UNSAFE.ordainSanitizedCss =
    soydata.$$makeSanitizedContentFactoryWithDefaultDirOnly_(
        soydata.SanitizedCss);


// -----------------------------------------------------------------------------
// Public utilities.


/**
 * Helper function to render a Soy template and then set the output string as
 * the innerHTML of an element. It is recommended to use this helper function
 * instead of directly setting innerHTML in your hand-written code, so that it
 * will be easier to audit the code for cross-site scripting vulnerabilities.
 *
 * NOTE: New code should consider using goog.soy.renderElement instead.
 *
 * @param {Element} element The element whose content we are rendering.
 * @param {Function} template The Soy template defining the element's content.
 * @param {Object=} opt_templateData The data for the template.
 * @param {Object=} opt_injectedData The injected data for the template.
 */
soy.renderElement = goog.soy.renderElement;


/**
 * Helper function to render a Soy template into a single node or a document
 * fragment. If the rendered HTML string represents a single node, then that
 * node is returned (note that this is *not* a fragment, despite them name of
 * the method). Otherwise a document fragment is returned containing the
 * rendered nodes.
 *
 * NOTE: New code should consider using goog.soy.renderAsFragment
 * instead (note that the arguments are different).
 *
 * @param {Function} template The Soy template defining the element's content.
 * @param {Object=} opt_templateData The data for the template.
 * @param {Document=} opt_document The document used to create DOM nodes. If not
 *     specified, global document object is used.
 * @param {Object=} opt_injectedData The injected data for the template.
 * @return {!Node} The resulting node or document fragment.
 */
soy.renderAsFragment = function(
    template, opt_templateData, opt_document, opt_injectedData) {
  return goog.soy.renderAsFragment(
      template, opt_templateData, opt_injectedData,
      new goog.dom.DomHelper(opt_document));
};


/**
 * Helper function to render a Soy template into a single node. If the rendered
 * HTML string represents a single node, then that node is returned. Otherwise,
 * a DIV element is returned containing the rendered nodes.
 *
 * NOTE: New code should consider using goog.soy.renderAsElement
 * instead (note that the arguments are different).
 *
 * @param {Function} template The Soy template defining the element's content.
 * @param {Object=} opt_templateData The data for the template.
 * @param {Document=} opt_document The document used to create DOM nodes. If not
 *     specified, global document object is used.
 * @param {Object=} opt_injectedData The injected data for the template.
 * @return {!Element} Rendered template contents, wrapped in a parent DIV
 *     element if necessary.
 */
soy.renderAsElement = function(
    template, opt_templateData, opt_document, opt_injectedData) {
  return goog.soy.renderAsElement(
      template, opt_templateData, opt_injectedData,
      new goog.dom.DomHelper(opt_document));
};


// -----------------------------------------------------------------------------
// Below are private utilities to be used by Soy-generated code only.


/**
 * Whether the locale is right-to-left.
 *
 * @type {boolean}
 */
soy.$$IS_LOCALE_RTL = goog.i18n.bidi.IS_RTL;


/**
 * Builds an augmented map. The returned map will contain mappings from both
 * the base map and the additional map. If the same key appears in both, then
 * the value from the additional map will be visible, while the value from the
 * base map will be hidden. The base map will be used, but not modified.
 *
 * @param {!Object} baseMap The original map to augment.
 * @param {!Object} additionalMap A map containing the additional mappings.
 * @return {!Object} An augmented map containing both the original and
 *     additional mappings.
 */
soy.$$augmentMap = function(baseMap, additionalMap) {

  // Create a new map whose '__proto__' field is set to baseMap.
  /** @constructor */
  function TempCtor() {}
  TempCtor.prototype = baseMap;
  var augmentedMap = new TempCtor();

  // Add the additional mappings to the new map.
  for (var key in additionalMap) {
    augmentedMap[key] = additionalMap[key];
  }

  return augmentedMap;
};


/**
 * Checks that the given map key is a string.
 * @param {*} key Key to check.
 * @return {string} The given key.
 */
soy.$$checkMapKey = function(key) {
  // TODO: Support map literal with nonstring key.
  if ((typeof key) != 'string') {
    throw Error(
        'Map literal\'s key expression must evaluate to string' +
        ' (encountered type "' + (typeof key) + '").');
  }
  return key;
};


/**
 * Gets the keys in a map as an array. There are no guarantees on the order.
 * @param {Object} map The map to get the keys of.
 * @return {Array.<string>} The array of keys in the given map.
 */
soy.$$getMapKeys = function(map) {
  var mapKeys = [];
  for (var key in map) {
    mapKeys.push(key);
  }
  return mapKeys;
};


/**
 * Gets a consistent unique id for the given delegate template name. Two calls
 * to this function will return the same id if and only if the input names are
 * the same.
 *
 * <p> Important: This function must always be called with a string constant.
 *
 * <p> If Closure Compiler is not being used, then this is just this identity
 * function. If Closure Compiler is being used, then each call to this function
 * will be replaced with a short string constant, which will be consistent per
 * input name.
 *
 * @param {string} delTemplateName The delegate template name for which to get a
 *     consistent unique id.
 * @return {string} A unique id that is consistent per input name.
 *
 * @consistentIdGenerator
 */
soy.$$getDelTemplateId = function(delTemplateName) {
  return delTemplateName;
};


/**
 * Map from registered delegate template key to the priority of the
 * implementation.
 * @type {Object}
 * @private
 */
soy.$$DELEGATE_REGISTRY_PRIORITIES_ = {};

/**
 * Map from registered delegate template key to the implementation function.
 * @type {Object}
 * @private
 */
soy.$$DELEGATE_REGISTRY_FUNCTIONS_ = {};


/**
 * Registers a delegate implementation. If the same delegate template key (id
 * and variant) has been registered previously, then priority values are
 * compared and only the higher priority implementation is stored (if
 * priorities are equal, an error is thrown).
 *
 * @param {string} delTemplateId The delegate template id.
 * @param {string} delTemplateVariant The delegate template variant (can be
 *     empty string).
 * @param {number} delPriority The implementation's priority value.
 * @param {Function} delFn The implementation function.
 */
soy.$$registerDelegateFn = function(
    delTemplateId, delTemplateVariant, delPriority, delFn) {

  var mapKey = 'key_' + delTemplateId + ':' + delTemplateVariant;
  var currPriority = soy.$$DELEGATE_REGISTRY_PRIORITIES_[mapKey];
  if (currPriority === undefined || delPriority > currPriority) {
    // Registering new or higher-priority function: replace registry entry.
    soy.$$DELEGATE_REGISTRY_PRIORITIES_[mapKey] = delPriority;
    soy.$$DELEGATE_REGISTRY_FUNCTIONS_[mapKey] = delFn;
  } else if (delPriority == currPriority) {
    // Registering same-priority function: error.
    throw Error(
        'Encountered two active delegates with the same priority ("' +
            delTemplateId + ':' + delTemplateVariant + '").');
  } else {
    // Registering lower-priority function: do nothing.
  }
};


/**
 * Retrieves the (highest-priority) implementation that has been registered for
 * a given delegate template key (id and variant). If no implementation has
 * been registered for the key, then the fallback is the same id with empty
 * variant. If the fallback is also not registered, and allowsEmptyDefault is
 * true, then returns an implementation that is equivalent to an empty template
 * (i.e. rendered output would be empty string).
 *
 * @param {string} delTemplateId The delegate template id.
 * @param {string|number} delTemplateVariant The delegate template variant (can
 *     be an empty string, or a number when a global is used).
 * @param {boolean} allowsEmptyDefault Whether to default to the empty template
 *     function if there's no active implementation.
 * @return {Function} The retrieved implementation function.
 */
soy.$$getDelegateFn = function(
    delTemplateId, delTemplateVariant, allowsEmptyDefault) {

  var delFn = soy.$$DELEGATE_REGISTRY_FUNCTIONS_[
      'key_' + delTemplateId + ':' + delTemplateVariant];
  if (! delFn && delTemplateVariant != '') {
    // Fallback to empty variant.
    delFn = soy.$$DELEGATE_REGISTRY_FUNCTIONS_['key_' + delTemplateId + ':'];
  }

  if (delFn) {
    return delFn;
  } else if (allowsEmptyDefault) {
    return soy.$$EMPTY_TEMPLATE_FN_;
  } else {
    throw Error(
        'Found no active impl for delegate call to "' + delTemplateId + ':' +
            delTemplateVariant + '" (and not allowemptydefault="true").');
  }
};


/**
 * Private helper soy.$$getDelegateFn(). This is the empty template function
 * that is returned whenever there's no delegate implementation found.
 *
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @param {Object.<string, *>=} opt_ijData
 * @return {string}
 * @private
 */
soy.$$EMPTY_TEMPLATE_FN_ = function(opt_data, opt_sb, opt_ijData) {
  return '';
};


// -----------------------------------------------------------------------------
// Internal sanitized content wrappers.


/**
 * Creates a SanitizedContent factory for SanitizedContent types for internal
 * Soy let and param blocks.
 *
 * This is a hack within Soy so that SanitizedContent objects created via let
 * and param blocks will truth-test as false if they are empty string.
 * Tricking the Javascript runtime to treat empty SanitizedContent as falsey is
 * not possible, and changing the Soy compiler to wrap every boolean statement
 * for just this purpose is impractical.  Instead, we just avoid wrapping empty
 * string as SanitizedContent, since it's a no-op for empty strings anyways.
 *
 * @param {function(new: T)} ctor A constructor.
 * @return {!function(*, ?goog.i18n.bidi.Dir=): (T|soydata.$$EMPTY_STRING_)}
 *     A factory that takes content and an optional content direction and
 *     returns a new instance, or an empty string. If the content direction is
 *     undefined, ctor.prototype.contentDir is used.
 * @template T
 * @private
 */
soydata.$$makeSanitizedContentFactoryForInternalBlocks_ = function(ctor) {
  /** @type {function(new: goog.soy.data.SanitizedContent)} */
  function InstantiableCtor() {}
  InstantiableCtor.prototype = ctor.prototype;
  /**
   * Creates a ctor-type SanitizedContent instance.
   *
   * @param {*} content The content to put in the instance.
   * @param {?goog.i18n.bidi.Dir=} opt_contentDir The content direction. If
   *     undefined, ctor.prototype.contentDir is used.
   * @return {goog.soy.data.SanitizedContent|soydata.$$EMPTY_STRING_} The new
   *     instance, or an empty string. A new instance is actually of type T
   *     above (ctor's type, a descendant of SanitizedContent), but there's no
   *     way to express that here.
   */
  function sanitizedContentFactory(content, opt_contentDir) {
    var contentString = String(content);
    if (!contentString) {
      return soydata.$$EMPTY_STRING_.VALUE;
    }
    var result = new InstantiableCtor();
    result.content = String(content);
    if (opt_contentDir !== undefined) {
      result.contentDir = opt_contentDir;
    }
    return result;
  }
  return sanitizedContentFactory;
};


/**
 * Creates a SanitizedContent factory for SanitizedContent types that should
 * always have their default directionality for internal Soy let and param
 * blocks.
 *
 * This is a hack within Soy so that SanitizedContent objects created via let
 * and param blocks will truth-test as false if they are empty string.
 * Tricking the Javascript runtime to treat empty SanitizedContent as falsey is
 * not possible, and changing the Soy compiler to wrap every boolean statement
 * for just this purpose is impractical.  Instead, we just avoid wrapping empty
 * string as SanitizedContent, since it's a no-op for empty strings anyways.
 *
 * @param {function(new: T)} ctor A constructor.
 * @return {!function(*): (T|soydata.$$EMPTY_STRING_)} A
 *     factory that takes content and returns a
 *     new instance (with default directionality, i.e.
 *     ctor.prototype.contentDir), or an empty string.
 * @template T
 * @private
 */
soydata.$$makeSanitizedContentFactoryWithDefaultDirOnlyForInternalBlocks_ =
    function(ctor) {
  /** @type {function(new: goog.soy.data.SanitizedContent)} */
  function InstantiableCtor() {}
  InstantiableCtor.prototype = ctor.prototype;
  /**
   * Creates a ctor-type SanitizedContent instance.
   *
   * @param {*} content The content to put in the instance.
   * @return {goog.soy.data.SanitizedContent|soydata.$$EMPTY_STRING_} The new
   *     instance, or an empty string. A new instance is actually of type T
   *     above (ctor's type, a descendant of SanitizedContent), but there's no
   *     way to express that here.
   */
  function sanitizedContentFactory(content) {
    var contentString = String(content);
    if (!contentString) {
      return soydata.$$EMPTY_STRING_.VALUE;
    }
    var result = new InstantiableCtor();
    result.content = String(content);
    return result;
  }
  return sanitizedContentFactory;
};


/**
 * Creates kind="text" block contents (internal use only).
 *
 * @param {*} content Text.
 * @param {?goog.i18n.bidi.Dir=} opt_contentDir The content direction; null if
 *     unknown and thus to be estimated when necessary. Default: null.
 * @return {!soydata.UnsanitizedText|soydata.$$EMPTY_STRING_} Wrapped result.
 */
soydata.$$markUnsanitizedTextForInternalBlocks = function(
    content, opt_contentDir) {
  var contentString = String(content);
  if (!contentString) {
    return soydata.$$EMPTY_STRING_.VALUE;
  }
  return new soydata.UnsanitizedText(contentString, opt_contentDir);
};


/**
 * Creates kind="html" block contents (internal use only).
 *
 * @param {*} content Text.
 * @param {?goog.i18n.bidi.Dir=} opt_contentDir The content direction; null if
 *     unknown and thus to be estimated when necessary. Default: null.
 * @return {soydata.SanitizedHtml|soydata.$$EMPTY_STRING_} Wrapped result.
 */
soydata.VERY_UNSAFE.$$ordainSanitizedHtmlForInternalBlocks =
    soydata.$$makeSanitizedContentFactoryForInternalBlocks_(
        soydata.SanitizedHtml);


/**
 * Creates kind="js" block contents (internal use only).
 *
 * @param {*} content Text.
 * @return {soydata.SanitizedJs|soydata.$$EMPTY_STRING_} Wrapped result.
 */
soydata.VERY_UNSAFE.$$ordainSanitizedJsForInternalBlocks =
    soydata.$$makeSanitizedContentFactoryWithDefaultDirOnlyForInternalBlocks_(
        soydata.SanitizedJs);


/**
 * Creates kind="uri" block contents (internal use only).
 *
 * @param {*} content Text.
 * @return {soydata.SanitizedUri|soydata.$$EMPTY_STRING_} Wrapped result.
 */
soydata.VERY_UNSAFE.$$ordainSanitizedUriForInternalBlocks =
    soydata.$$makeSanitizedContentFactoryWithDefaultDirOnlyForInternalBlocks_(
        soydata.SanitizedUri);


/**
 * Creates kind="attributes" block contents (internal use only).
 *
 * @param {*} content Text.
 * @return {soydata.SanitizedHtmlAttribute|soydata.$$EMPTY_STRING_} Wrapped
 *     result.
 */
soydata.VERY_UNSAFE.$$ordainSanitizedAttributesForInternalBlocks =
    soydata.$$makeSanitizedContentFactoryWithDefaultDirOnlyForInternalBlocks_(
        soydata.SanitizedHtmlAttribute);


/**
 * Creates kind="css" block contents (internal use only).
 *
 * @param {*} content Text.
 * @return {soydata.SanitizedCss|soydata.$$EMPTY_STRING_} Wrapped result.
 */
soydata.VERY_UNSAFE.$$ordainSanitizedCssForInternalBlocks =
    soydata.$$makeSanitizedContentFactoryWithDefaultDirOnlyForInternalBlocks_(
        soydata.SanitizedCss);


// -----------------------------------------------------------------------------
// Escape/filter/normalize.


/**
 * Returns a SanitizedHtml object for a particular value. The content direction
 * is preserved.
 *
 * This HTML-escapes the value unless it is already SanitizedHtml. Escapes
 * double quote '"' in addition to '&', '<', and '>' so that a string can be
 * included in an HTML tag attribute value within double quotes.
 *
 * @param {*} value The value to convert. If it is already a SanitizedHtml
 *     object, it is left alone.
 * @return {!soydata.SanitizedHtml} An escaped version of value.
 */
soy.$$escapeHtml = function(value) {
  return soydata.SanitizedHtml.from(value);
};


/**
 * Strips unsafe tags to convert a string of untrusted HTML into HTML that
 * is safe to embed. The content direction is preserved.
 *
 * @param {*} value The string-like value to be escaped. May not be a string,
 *     but the value will be coerced to a string.
 * @return {!soydata.SanitizedHtml} A sanitized and normalized version of value.
 */
soy.$$cleanHtml = function(value) {
  if (soydata.isContentKind(value, soydata.SanitizedContentKind.HTML)) {
    goog.asserts.assert(value.constructor === soydata.SanitizedHtml);
    return /** @type {!soydata.SanitizedHtml} */ (value);
  }
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(
      soy.$$stripHtmlTags(value, soy.esc.$$SAFE_TAG_WHITELIST_),
      soydata.getContentDir(value));
};


/**
 * Escapes HTML special characters in a string so that it can be embedded in
 * RCDATA.
 * <p>
 * Escapes HTML special characters so that the value will not prematurely end
 * the body of a tag like {@code <textarea>} or {@code <title>}. RCDATA tags
 * cannot contain other HTML entities, so it is not strictly necessary to escape
 * HTML special characters except when part of that text looks like an HTML
 * entity or like a close tag : {@code </textarea>}.
 * <p>
 * Will normalize known safe HTML to make sure that sanitized HTML (which could
 * contain an innocuous {@code </textarea>} don't prematurely end an RCDATA
 * element.
 *
 * @param {*} value The string-like value to be escaped. May not be a string,
 *     but the value will be coerced to a string.
 * @return {string} An escaped version of value.
 */
soy.$$escapeHtmlRcdata = function(value) {
  if (soydata.isContentKind(value, soydata.SanitizedContentKind.HTML)) {
    goog.asserts.assert(value.constructor === soydata.SanitizedHtml);
    return soy.esc.$$normalizeHtmlHelper(value.content);
  }
  return soy.esc.$$escapeHtmlHelper(value);
};


/**
 * Matches any/only HTML5 void elements' start tags.
 * See http://www.w3.org/TR/html-markup/syntax.html#syntax-elements
 * @type {RegExp}
 * @private
 */
soy.$$HTML5_VOID_ELEMENTS_ = new RegExp(
    '^<(?:area|base|br|col|command|embed|hr|img|input' +
    '|keygen|link|meta|param|source|track|wbr)\\b');


/**
 * Removes HTML tags from a string of known safe HTML.
 * If opt_tagWhitelist is not specified or is empty, then
 * the result can be used as an attribute value.
 *
 * @param {*} value The HTML to be escaped. May not be a string, but the
 *     value will be coerced to a string.
 * @param {Object.<string, number>=} opt_tagWhitelist Has an own property whose
 *     name is a lower-case tag name and whose value is {@code 1} for
 *     each element that is allowed in the output.
 * @return {string} A representation of value without disallowed tags,
 *     HTML comments, or other non-text content.
 */
soy.$$stripHtmlTags = function(value, opt_tagWhitelist) {
  if (!opt_tagWhitelist) {
    // If we have no white-list, then use a fast track which elides all tags.
    return String(value).replace(soy.esc.$$HTML_TAG_REGEX_, '')
        // This is just paranoia since callers should normalize the result
        // anyway, but if they didn't, it would be necessary to ensure that
        // after the first replace non-tag uses of < do not recombine into
        // tags as in "<<foo>script>alert(1337)</<foo>script>".
        .replace(soy.esc.$$LT_REGEX_, '&lt;');
  }

  // Escapes '[' so that we can use [123] below to mark places where tags
  // have been removed.
  var html = String(value).replace(/\[/g, '&#91;');

  // Consider all uses of '<' and replace whitelisted tags with markers like
  // [1] which are indices into a list of approved tag names.
  // Replace all other uses of < and > with entities.
  var tags = [];
  html = html.replace(
    soy.esc.$$HTML_TAG_REGEX_,
    function(tok, tagName) {
      if (tagName) {
        tagName = tagName.toLowerCase();
        if (opt_tagWhitelist.hasOwnProperty(tagName) &&
            opt_tagWhitelist[tagName]) {
          var start = tok.charAt(1) === '/' ? '</' : '<';
          var index = tags.length;
          tags[index] = start + tagName + '>';
          return '[' + index + ']';
        }
      }
      return '';
    });

  // Escape HTML special characters. Now there are no '<' in html that could
  // start a tag.
  html = soy.esc.$$normalizeHtmlHelper(html);

  var finalCloseTags = soy.$$balanceTags_(tags);

  // Now html contains no tags or less-than characters that could become
  // part of a tag via a replacement operation and tags only contains
  // approved tags.
  // Reinsert the white-listed tags.
  html = html.replace(
       /\[(\d+)\]/g, function(_, index) { return tags[index]; });

  // Close any still open tags.
  // This prevents unclosed formatting elements like <ol> and <table> from
  // breaking the layout of containing HTML.
  return html + finalCloseTags;
};


/**
 * Throw out any close tags that don't correspond to start tags.
 * If {@code <table>} is used for formatting, embedded HTML shouldn't be able
 * to use a mismatched {@code </table>} to break page layout.
 *
 * @param {Array.<string>} tags an array of tags that will be modified in place
 *    include tags, the empty string, or concatenations of empty tags.
 * @return {string} zero or more closed tags that close all elements that are
 *    opened in tags but not closed.
 * @private
 */
soy.$$balanceTags_ = function(tags) {
  var open = [];
  for (var i = 0, n = tags.length; i < n; ++i) {
    var tag = tags[i];
    if (tag.charAt(1) === '/') {
      var openTagIndex = open.length - 1;
      // NOTE: This is essentially lastIndexOf, but it's not supported in IE.
      while (openTagIndex >= 0 && open[openTagIndex] != tag) {
        openTagIndex--;
      }
      if (openTagIndex < 0) {
        tags[i] = '';  // Drop close tag.
      } else {
        tags[i] = open.slice(openTagIndex).reverse().join('');
        open.length = openTagIndex;
      }
    } else if (!soy.$$HTML5_VOID_ELEMENTS_.test(tag)) {
      open.push('</' + tag.substring(1));
    }
  }
  return open.reverse().join('');
};


/**
 * Escapes HTML special characters in an HTML attribute value.
 *
 * @param {*} value The HTML to be escaped. May not be a string, but the
 *     value will be coerced to a string.
 * @return {string} An escaped version of value.
 */
soy.$$escapeHtmlAttribute = function(value) {
  // NOTE: We don't accept ATTRIBUTES here because ATTRIBUTES is actually not
  // the attribute value context, but instead k/v pairs.
  if (soydata.isContentKind(value, soydata.SanitizedContentKind.HTML)) {
    // NOTE: After removing tags, we also escape quotes ("normalize") so that
    // the HTML can be embedded in attribute context.
    goog.asserts.assert(value.constructor === soydata.SanitizedHtml);
    return soy.esc.$$normalizeHtmlHelper(soy.$$stripHtmlTags(value.content));
  }
  return soy.esc.$$escapeHtmlHelper(value);
};


/**
 * Escapes HTML special characters in a string including space and other
 * characters that can end an unquoted HTML attribute value.
 *
 * @param {*} value The HTML to be escaped. May not be a string, but the
 *     value will be coerced to a string.
 * @return {string} An escaped version of value.
 */
soy.$$escapeHtmlAttributeNospace = function(value) {
  if (soydata.isContentKind(value, soydata.SanitizedContentKind.HTML)) {
    goog.asserts.assert(value.constructor === soydata.SanitizedHtml);
    return soy.esc.$$normalizeHtmlNospaceHelper(
        soy.$$stripHtmlTags(value.content));
  }
  return soy.esc.$$escapeHtmlNospaceHelper(value);
};


/**
 * Filters out strings that cannot be a substring of a valid HTML attribute.
 *
 * Note the input is expected to be key=value pairs.
 *
 * @param {*} value The value to escape. May not be a string, but the value
 *     will be coerced to a string.
 * @return {string} A valid HTML attribute name part or name/value pair.
 *     {@code "zSoyz"} if the input is invalid.
 */
soy.$$filterHtmlAttributes = function(value) {
  // NOTE: Explicitly no support for SanitizedContentKind.HTML, since that is
  // meaningless in this context, which is generally *between* html attributes.
  if (soydata.isContentKind(value, soydata.SanitizedContentKind.ATTRIBUTES)) {
    goog.asserts.assert(value.constructor === soydata.SanitizedHtmlAttribute);
    // Add a space at the end to ensure this won't get merged into following
    // attributes, unless the interpretation is unambiguous (ending with quotes
    // or a space).
    return value.content.replace(/([^"'\s])$/, '$1 ');
  }
  // TODO: Dynamically inserting attributes that aren't marked as trusted is
  // probably unnecessary.  Any filtering done here will either be inadequate
  // for security or not flexible enough.  Having clients use kind="attributes"
  // in parameters seems like a wiser idea.
  return soy.esc.$$filterHtmlAttributesHelper(value);
};


/**
 * Filters out strings that cannot be a substring of a valid HTML element name.
 *
 * @param {*} value The value to escape. May not be a string, but the value
 *     will be coerced to a string.
 * @return {string} A valid HTML element name part.
 *     {@code "zSoyz"} if the input is invalid.
 */
soy.$$filterHtmlElementName = function(value) {
  // NOTE: We don't accept any SanitizedContent here. HTML indicates valid
  // PCDATA, not tag names. A sloppy developer shouldn't be able to cause an
  // exploit:
  // ... {let userInput}script src=http://evil.com/evil.js{/let} ...
  // ... {param tagName kind="html"}{$userInput}{/param} ...
  // ... <{$tagName}>Hello World</{$tagName}>
  return soy.esc.$$filterHtmlElementNameHelper(value);
};


/**
 * Escapes characters in the value to make it valid content for a JS string
 * literal.
 *
 * @param {*} value The value to escape. May not be a string, but the value
 *     will be coerced to a string.
 * @return {string} An escaped version of value.
 * @deprecated
 */
soy.$$escapeJs = function(value) {
  return soy.$$escapeJsString(value);
};


/**
 * Escapes characters in the value to make it valid content for a JS string
 * literal.
 *
 * @param {*} value The value to escape. May not be a string, but the value
 *     will be coerced to a string.
 * @return {string} An escaped version of value.
 */
soy.$$escapeJsString = function(value) {
  if (soydata.isContentKind(value, soydata.SanitizedContentKind.JS_STR_CHARS)) {
    // TODO: It might still be worthwhile to normalize it to remove
    // unescaped quotes, null, etc: replace(/(?:^|[^\])['"]/g, '\\$
    goog.asserts.assert(value.constructor === soydata.SanitizedJsStrChars);
    return value.content;
  }
  return soy.esc.$$escapeJsStringHelper(value);
};


/**
 * Encodes a value as a JavaScript literal.
 *
 * @param {*} value The value to escape. May not be a string, but the value
 *     will be coerced to a string.
 * @return {string} A JavaScript code representation of the input.
 */
soy.$$escapeJsValue = function(value) {
  // We surround values with spaces so that they can't be interpolated into
  // identifiers by accident.
  // We could use parentheses but those might be interpreted as a function call.
  if (value == null) {  // Intentionally matches undefined.
    // Java returns null from maps where there is no corresponding key while
    // JS returns undefined.
    // We always output null for compatibility with Java which does not have a
    // distinct undefined value.
    return ' null ';
  }
  if (soydata.isContentKind(value, soydata.SanitizedContentKind.JS)) {
    goog.asserts.assert(value.constructor === soydata.SanitizedJs);
    return value.content;
  }
  switch (typeof value) {
    case 'boolean': case 'number':
      return ' ' + value + ' ';
    default:
      return "'" + soy.esc.$$escapeJsStringHelper(String(value)) + "'";
  }
};


/**
 * Escapes characters in the string to make it valid content for a JS regular
 * expression literal.
 *
 * @param {*} value The value to escape. May not be a string, but the value
 *     will be coerced to a string.
 * @return {string} An escaped version of value.
 */
soy.$$escapeJsRegex = function(value) {
  return soy.esc.$$escapeJsRegexHelper(value);
};


/**
 * Matches all URI mark characters that conflict with HTML attribute delimiters
 * or that cannot appear in a CSS uri.
 * From <a href="http://www.w3.org/TR/CSS2/grammar.html">G.2: CSS grammar</a>
 * <pre>
 *     url        ([!#$%&*-~]|{nonascii}|{escape})*
 * </pre>
 *
 * @type {RegExp}
 * @private
 */
soy.$$problematicUriMarks_ = /['()]/g;

/**
 * @param {string} ch A single character in {@link soy.$$problematicUriMarks_}.
 * @return {string}
 * @private
 */
soy.$$pctEncode_ = function(ch) {
  return '%' + ch.charCodeAt(0).toString(16);
};

/**
 * Escapes a string so that it can be safely included in a URI.
 *
 * @param {*} value The value to escape. May not be a string, but the value
 *     will be coerced to a string.
 * @return {string} An escaped version of value.
 */
soy.$$escapeUri = function(value) {
  if (soydata.isContentKind(value, soydata.SanitizedContentKind.URI)) {
    goog.asserts.assert(value.constructor === soydata.SanitizedUri);
    return soy.$$normalizeUri(value);
  }
  // Apostophes and parentheses are not matched by encodeURIComponent.
  // They are technically special in URIs, but only appear in the obsolete mark
  // production in Appendix D.2 of RFC 3986, so can be encoded without changing
  // semantics.
  var encoded = soy.esc.$$escapeUriHelper(value);
  soy.$$problematicUriMarks_.lastIndex = 0;
  if (soy.$$problematicUriMarks_.test(encoded)) {
    return encoded.replace(soy.$$problematicUriMarks_, soy.$$pctEncode_);
  }
  return encoded;
};


/**
 * Removes rough edges from a URI by escaping any raw HTML/JS string delimiters.
 *
 * @param {*} value The value to escape. May not be a string, but the value
 *     will be coerced to a string.
 * @return {string} An escaped version of value.
 */
soy.$$normalizeUri = function(value) {
  return soy.esc.$$normalizeUriHelper(value);
};


/**
 * Vets a URI's protocol and removes rough edges from a URI by escaping
 * any raw HTML/JS string delimiters.
 *
 * @param {*} value The value to escape. May not be a string, but the value
 *     will be coerced to a string.
 * @return {string} An escaped version of value.
 */
soy.$$filterNormalizeUri = function(value) {
  if (soydata.isContentKind(value, soydata.SanitizedContentKind.URI)) {
    goog.asserts.assert(value.constructor === soydata.SanitizedUri);
    return soy.$$normalizeUri(value);
  }
  return soy.esc.$$filterNormalizeUriHelper(value);
};


/**
 * Allows only data-protocol image URI's.
 *
 * @param {*} value The value to process. May not be a string, but the value
 *     will be coerced to a string.
 * @return {!soydata.SanitizedUri} An escaped version of value.
 */
soy.$$filterImageDataUri = function(value) {
  // NOTE: Even if it's a SanitizedUri, we will still filter it.
  return soydata.VERY_UNSAFE.ordainSanitizedUri(
      soy.esc.$$filterImageDataUriHelper(value));
};


/**
 * Escapes a string so it can safely be included inside a quoted CSS string.
 *
 * @param {*} value The value to escape. May not be a string, but the value
 *     will be coerced to a string.
 * @return {string} An escaped version of value.
 */
soy.$$escapeCssString = function(value) {
  return soy.esc.$$escapeCssStringHelper(value);
};


/**
 * Encodes a value as a CSS identifier part, keyword, or quantity.
 *
 * @param {*} value The value to escape. May not be a string, but the value
 *     will be coerced to a string.
 * @return {string} A safe CSS identifier part, keyword, or quanitity.
 */
soy.$$filterCssValue = function(value) {
  if (soydata.isContentKind(value, soydata.SanitizedContentKind.CSS)) {
    goog.asserts.assert(value.constructor === soydata.SanitizedCss);
    return value.content;
  }
  // Uses == to intentionally match null and undefined for Java compatibility.
  if (value == null) {
    return '';
  }
  return soy.esc.$$filterCssValueHelper(value);
};


/**
 * Sanity-checks noAutoescape input for explicitly tainted content.
 *
 * SanitizedContentKind.TEXT is used to explicitly mark input that was never
 * meant to be used unescaped.
 *
 * @param {*} value The value to filter.
 * @return {*} The value, that we dearly hope will not cause an attack.
 */
soy.$$filterNoAutoescape = function(value) {
  if (soydata.isContentKind(value, soydata.SanitizedContentKind.TEXT)) {
    // Fail in development mode.
    goog.asserts.fail(
        'Tainted SanitizedContentKind.TEXT for |noAutoescape: `%s`',
        [value.content]);
    // Return innocuous data in production.
    return 'zSoyz';
  }

  return value;
};


// -----------------------------------------------------------------------------
// Basic directives/functions.


/**
 * Converts \r\n, \r, and \n to <br>s
 * @param {*} value The string in which to convert newlines.
 * @return {string|!soydata.SanitizedHtml} A copy of {@code value} with
 *     converted newlines. If {@code value} is SanitizedHtml, the return value
 *     is also SanitizedHtml, of the same known directionality.
 */
soy.$$changeNewlineToBr = function(value) {
  var result = goog.string.newLineToBr(String(value), false);
  if (soydata.isContentKind(value, soydata.SanitizedContentKind.HTML)) {
    return soydata.VERY_UNSAFE.ordainSanitizedHtml(
        result, soydata.getContentDir(value));
  }
  return result;
};


/**
 * Inserts word breaks ('wbr' tags) into a HTML string at a given interval. The
 * counter is reset if a space is encountered. Word breaks aren't inserted into
 * HTML tags or entities. Entites count towards the character count; HTML tags
 * do not.
 *
 * @param {*} value The HTML string to insert word breaks into. Can be other
 *     types, but the value will be coerced to a string.
 * @param {number} maxCharsBetweenWordBreaks Maximum number of non-space
 *     characters to allow before adding a word break.
 * @return {string|!soydata.SanitizedHtml} The string including word
 *     breaks. If {@code value} is SanitizedHtml, the return value
 *     is also SanitizedHtml, of the same known directionality.
 */
soy.$$insertWordBreaks = function(value, maxCharsBetweenWordBreaks) {
  var result = goog.format.insertWordBreaks(
      String(value), maxCharsBetweenWordBreaks);
  if (soydata.isContentKind(value, soydata.SanitizedContentKind.HTML)) {
    return soydata.VERY_UNSAFE.ordainSanitizedHtml(
        result, soydata.getContentDir(value));
  }
  return result;
};


/**
 * Truncates a string to a given max length (if it's currently longer),
 * optionally adding ellipsis at the end.
 *
 * @param {*} str The string to truncate. Can be other types, but the value will
 *     be coerced to a string.
 * @param {number} maxLen The maximum length of the string after truncation
 *     (including ellipsis, if applicable).
 * @param {boolean} doAddEllipsis Whether to add ellipsis if the string needs
 *     truncation.
 * @return {string} The string after truncation.
 */
soy.$$truncate = function(str, maxLen, doAddEllipsis) {

  str = String(str);
  if (str.length <= maxLen) {
    return str;  // no need to truncate
  }

  // If doAddEllipsis, either reduce maxLen to compensate, or else if maxLen is
  // too small, just turn off doAddEllipsis.
  if (doAddEllipsis) {
    if (maxLen > 3) {
      maxLen -= 3;
    } else {
      doAddEllipsis = false;
    }
  }

  // Make sure truncating at maxLen doesn't cut up a unicode surrogate pair.
  if (soy.$$isHighSurrogate_(str.charAt(maxLen - 1)) &&
      soy.$$isLowSurrogate_(str.charAt(maxLen))) {
    maxLen -= 1;
  }

  // Truncate.
  str = str.substring(0, maxLen);

  // Add ellipsis.
  if (doAddEllipsis) {
    str += '...';
  }

  return str;
};

/**
 * Private helper for $$truncate() to check whether a char is a high surrogate.
 * @param {string} ch The char to check.
 * @return {boolean} Whether the given char is a unicode high surrogate.
 * @private
 */
soy.$$isHighSurrogate_ = function(ch) {
  return 0xD800 <= ch && ch <= 0xDBFF;
};

/**
 * Private helper for $$truncate() to check whether a char is a low surrogate.
 * @param {string} ch The char to check.
 * @return {boolean} Whether the given char is a unicode low surrogate.
 * @private
 */
soy.$$isLowSurrogate_ = function(ch) {
  return 0xDC00 <= ch && ch <= 0xDFFF;
};


// -----------------------------------------------------------------------------
// Bidi directives/functions.


/**
 * Cache of bidi formatter by context directionality, so we don't keep on
 * creating new objects.
 * @type {!Object.<!goog.i18n.BidiFormatter>}
 * @private
 */
soy.$$bidiFormatterCache_ = {};


/**
 * Returns cached bidi formatter for bidiGlobalDir, or creates a new one.
 * @param {number} bidiGlobalDir The global directionality context: 1 if ltr, -1
 *     if rtl, 0 if unknown.
 * @return {goog.i18n.BidiFormatter} A formatter for bidiGlobalDir.
 * @private
 */
soy.$$getBidiFormatterInstance_ = function(bidiGlobalDir) {
  return soy.$$bidiFormatterCache_[bidiGlobalDir] ||
         (soy.$$bidiFormatterCache_[bidiGlobalDir] =
             new goog.i18n.BidiFormatter(bidiGlobalDir));
};


/**
 * Estimate the overall directionality of text. If opt_isHtml, makes sure to
 * ignore the LTR nature of the mark-up and escapes in text, making the logic
 * suitable for HTML and HTML-escaped text.
 * If text has a goog.i18n.bidi.Dir-valued contentDir, this is used instead of
 * estimating the directionality.
 *
 * @param {*} text The content whose directionality is to be estimated.
 * @param {boolean=} opt_isHtml Whether text is HTML/HTML-escaped.
 *     Default: false.
 * @return {number} 1 if text is LTR, -1 if it is RTL, and 0 if it is neutral.
 */
soy.$$bidiTextDir = function(text, opt_isHtml) {
  var contentDir = soydata.getContentDir(text);
  if (contentDir != null) {
    return contentDir;
  }
  var isHtml = opt_isHtml ||
      soydata.isContentKind(text, soydata.SanitizedContentKind.HTML);
  return goog.i18n.bidi.estimateDirection(text + '', isHtml);
};


/**
 * Returns 'dir="ltr"' or 'dir="rtl"', depending on text's estimated
 * directionality, if it is not the same as bidiGlobalDir.
 * Otherwise, returns the empty string.
 * If opt_isHtml, makes sure to ignore the LTR nature of the mark-up and escapes
 * in text, making the logic suitable for HTML and HTML-escaped text.
 * If text has a goog.i18n.bidi.Dir-valued contentDir, this is used instead of
 * estimating the directionality.
 *
 * @param {number} bidiGlobalDir The global directionality context: 1 if ltr, -1
 *     if rtl, 0 if unknown.
 * @param {*} text The content whose directionality is to be estimated.
 * @param {boolean=} opt_isHtml Whether text is HTML/HTML-escaped.
 *     Default: false.
 * @return {soydata.SanitizedHtmlAttribute} 'dir="rtl"' for RTL text in non-RTL
 *     context; 'dir="ltr"' for LTR text in non-LTR context;
 *     else, the empty string.
 */
soy.$$bidiDirAttr = function(bidiGlobalDir, text, opt_isHtml) {
  var formatter = soy.$$getBidiFormatterInstance_(bidiGlobalDir);
  var contentDir = soydata.getContentDir(text);
  if (contentDir == null) {
    var isHtml = opt_isHtml ||
        soydata.isContentKind(text, soydata.SanitizedContentKind.HTML);
    contentDir = goog.i18n.bidi.estimateDirection(text + '', isHtml);
  }
  return soydata.VERY_UNSAFE.ordainSanitizedHtmlAttribute(
      formatter.knownDirAttr(contentDir));
};


/**
 * Returns a Unicode BiDi mark matching bidiGlobalDir (LRM or RLM) if the
 * directionality or the exit directionality of text are opposite to
 * bidiGlobalDir. Otherwise returns the empty string.
 * If opt_isHtml, makes sure to ignore the LTR nature of the mark-up and escapes
 * in text, making the logic suitable for HTML and HTML-escaped text.
 * If text has a goog.i18n.bidi.Dir-valued contentDir, this is used instead of
 * estimating the directionality.
 *
 * @param {number} bidiGlobalDir The global directionality context: 1 if ltr, -1
 *     if rtl, 0 if unknown.
 * @param {*} text The content whose directionality is to be estimated.
 * @param {boolean=} opt_isHtml Whether text is HTML/HTML-escaped.
 *     Default: false.
 * @return {string} A Unicode bidi mark matching bidiGlobalDir, or the empty
 *     string when text's overall and exit directionalities both match
 *     bidiGlobalDir, or bidiGlobalDir is 0 (unknown).
 */
soy.$$bidiMarkAfter = function(bidiGlobalDir, text, opt_isHtml) {
  var formatter = soy.$$getBidiFormatterInstance_(bidiGlobalDir);
  var isHtml = opt_isHtml ||
      soydata.isContentKind(text, soydata.SanitizedContentKind.HTML);
  return formatter.markAfterKnownDir(soydata.getContentDir(text), text + '',
      isHtml);
};


/**
 * Returns text wrapped in a <span dir="ltr|rtl"> according to its
 * directionality - but only if that is neither neutral nor the same as the
 * global context. Otherwise, returns text unchanged.
 * Always treats text as HTML/HTML-escaped, i.e. ignores mark-up and escapes
 * when estimating text's directionality.
 * If text has a goog.i18n.bidi.Dir-valued contentDir, this is used instead of
 * estimating the directionality.
 *
 * @param {number} bidiGlobalDir The global directionality context: 1 if ltr, -1
 *     if rtl, 0 if unknown.
 * @param {*} text The string to be wrapped. Can be other types, but the value
 *     will be coerced to a string.
 * @return {!goog.soy.data.SanitizedContent|string} The wrapped text.
 */
soy.$$bidiSpanWrap = function(bidiGlobalDir, text) {
  var formatter = soy.$$getBidiFormatterInstance_(bidiGlobalDir);

  // We always treat the value as HTML, because span-wrapping is only useful
  // when its output will be treated as HTML (without escaping), and because
  // |bidiSpanWrap is not itself specified to do HTML escaping in Soy. (Both
  // explicit and automatic HTML escaping, if any, is done before calling
  // |bidiSpanWrap because the BidiSpanWrapDirective Java class implements
  // SanitizedContentOperator, but this does not mean that the input has to be
  // HTML SanitizedContent. In legacy usage, a string that is not
  // SanitizedContent is often printed in an autoescape="false" template or by
  // a print with a |noAutoescape, in which case our input is just SoyData.) If
  // the output will be treated as HTML, the input had better be safe
  // HTML/HTML-escaped (even if it isn't HTML SanitizedData), or we have an XSS
  // opportunity and a much bigger problem than bidi garbling.
  var wrappedText = formatter.spanWrapWithKnownDir(
      soydata.getContentDir(text), text + '', true /* opt_isHtml */);

  // Like other directives whose Java class implements SanitizedContentOperator,
  // |bidiSpanWrap is called after the escaping (if any) has already been done,
  // and thus there is no need for it to produce actual SanitizedContent.
  return wrappedText;
};


/**
 * Returns text wrapped in Unicode BiDi formatting characters according to its
 * directionality, i.e. either LRE or RLE at the beginning and PDF at the end -
 * but only if text's directionality is neither neutral nor the same as the
 * global context. Otherwise, returns text unchanged.
 * Only treats soydata.SanitizedHtml as HTML/HTML-escaped, i.e. ignores mark-up
 * and escapes when estimating text's directionality.
 * If text has a goog.i18n.bidi.Dir-valued contentDir, this is used instead of
 * estimating the directionality.
 *
 * @param {number} bidiGlobalDir The global directionality context: 1 if ltr, -1
 *     if rtl, 0 if unknown.
 * @param {*} text The string to be wrapped. Can be other types, but the value
 *     will be coerced to a string.
 * @return {!goog.soy.data.SanitizedContent|string} The wrapped string.
 */
soy.$$bidiUnicodeWrap = function(bidiGlobalDir, text) {
  var formatter = soy.$$getBidiFormatterInstance_(bidiGlobalDir);

  // We treat the value as HTML if and only if it says it's HTML, even though in
  // legacy usage, we sometimes have an HTML string (not SanitizedContent) that
  // is passed to an autoescape="false" template or a {print $foo|noAutoescape},
  // with the output going into an HTML context without escaping. We simply have
  // no way of knowing if this is what is happening when we get
  // non-SanitizedContent input, and most of the time it isn't.
  var isHtml = soydata.isContentKind(text, soydata.SanitizedContentKind.HTML);
  var wrappedText = formatter.unicodeWrapWithKnownDir(
      soydata.getContentDir(text), text + '', isHtml);

  // Bidi-wrapping a value converts it to the context directionality. Since it
  // does not cost us anything, we will indicate this known direction in the
  // output SanitizedContent, even though the intended consumer of that
  // information - a bidi wrapping directive - has already been run.
  var wrappedTextDir = formatter.getContextDir();

  // Unicode-wrapping UnsanitizedText gives UnsanitizedText.
  // Unicode-wrapping safe HTML or JS string data gives valid, safe HTML or JS
  // string data.
  // ATTENTION: Do these need to be ...ForInternalBlocks()?
  if (soydata.isContentKind(text, soydata.SanitizedContentKind.TEXT)) {
    return new soydata.UnsanitizedText(wrappedText, wrappedTextDir);
  }
  if (isHtml) {
    return soydata.VERY_UNSAFE.ordainSanitizedHtml(wrappedText, wrappedTextDir);
  }
  if (soydata.isContentKind(text, soydata.SanitizedContentKind.JS_STR_CHARS)) {
    return soydata.VERY_UNSAFE.ordainSanitizedJsStrChars(
        wrappedText, wrappedTextDir);
  }

  // Unicode-wrapping does not conform to the syntax of the other types of
  // content. For lack of anything better to do, we we do not declare a content
  // kind at all by falling through to the non-SanitizedContent case below.
  // TODO(user): Consider throwing a runtime error on receipt of
  // SanitizedContent other than TEXT, HTML, or JS_STR_CHARS.

  // The input was not SanitizedContent, so our output isn't SanitizedContent
  // either.
  return wrappedText;
};


// -----------------------------------------------------------------------------
// Generated code.








// START GENERATED CODE FOR ESCAPERS.

/**
 * @type {function (*) : string}
 */
soy.esc.$$escapeUriHelper = function(v) {
  return encodeURIComponent(String(v));
};

/**
 * Maps characters to the escaped versions for the named escape directives.
 * @type {Object.<string, string>}
 * @private
 */
soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_ = {
  '\x00': '\x26#0;',
  '\x22': '\x26quot;',
  '\x26': '\x26amp;',
  '\x27': '\x26#39;',
  '\x3c': '\x26lt;',
  '\x3e': '\x26gt;',
  '\x09': '\x26#9;',
  '\x0a': '\x26#10;',
  '\x0b': '\x26#11;',
  '\x0c': '\x26#12;',
  '\x0d': '\x26#13;',
  ' ': '\x26#32;',
  '-': '\x26#45;',
  '\/': '\x26#47;',
  '\x3d': '\x26#61;',
  '`': '\x26#96;',
  '\x85': '\x26#133;',
  '\xa0': '\x26#160;',
  '\u2028': '\x26#8232;',
  '\u2029': '\x26#8233;'
};

/**
 * A function that can be used with String.replace.
 * @param {string} ch A single character matched by a compatible matcher.
 * @return {string} A token in the output language.
 * @private
 */
soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_ = function(ch) {
  return soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_[ch];
};

/**
 * Maps characters to the escaped versions for the named escape directives.
 * @type {Object.<string, string>}
 * @private
 */
soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_ = {
  '\x00': '\\x00',
  '\x08': '\\x08',
  '\x09': '\\t',
  '\x0a': '\\n',
  '\x0b': '\\x0b',
  '\x0c': '\\f',
  '\x0d': '\\r',
  '\x22': '\\x22',
  '\x26': '\\x26',
  '\x27': '\\x27',
  '\/': '\\\/',
  '\x3c': '\\x3c',
  '\x3d': '\\x3d',
  '\x3e': '\\x3e',
  '\\': '\\\\',
  '\x85': '\\x85',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
  '$': '\\x24',
  '(': '\\x28',
  ')': '\\x29',
  '*': '\\x2a',
  '+': '\\x2b',
  ',': '\\x2c',
  '-': '\\x2d',
  '.': '\\x2e',
  ':': '\\x3a',
  '?': '\\x3f',
  '[': '\\x5b',
  ']': '\\x5d',
  '^': '\\x5e',
  '{': '\\x7b',
  '|': '\\x7c',
  '}': '\\x7d'
};

/**
 * A function that can be used with String.replace.
 * @param {string} ch A single character matched by a compatible matcher.
 * @return {string} A token in the output language.
 * @private
 */
soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_ = function(ch) {
  return soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_[ch];
};

/**
 * Maps characters to the escaped versions for the named escape directives.
 * @type {Object.<string, string>}
 * @private
 */
soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_CSS_STRING_ = {
  '\x00': '\\0 ',
  '\x08': '\\8 ',
  '\x09': '\\9 ',
  '\x0a': '\\a ',
  '\x0b': '\\b ',
  '\x0c': '\\c ',
  '\x0d': '\\d ',
  '\x22': '\\22 ',
  '\x26': '\\26 ',
  '\x27': '\\27 ',
  '(': '\\28 ',
  ')': '\\29 ',
  '*': '\\2a ',
  '\/': '\\2f ',
  ':': '\\3a ',
  ';': '\\3b ',
  '\x3c': '\\3c ',
  '\x3d': '\\3d ',
  '\x3e': '\\3e ',
  '@': '\\40 ',
  '\\': '\\5c ',
  '{': '\\7b ',
  '}': '\\7d ',
  '\x85': '\\85 ',
  '\xa0': '\\a0 ',
  '\u2028': '\\2028 ',
  '\u2029': '\\2029 '
};

/**
 * A function that can be used with String.replace.
 * @param {string} ch A single character matched by a compatible matcher.
 * @return {string} A token in the output language.
 * @private
 */
soy.esc.$$REPLACER_FOR_ESCAPE_CSS_STRING_ = function(ch) {
  return soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_CSS_STRING_[ch];
};

/**
 * Maps characters to the escaped versions for the named escape directives.
 * @type {Object.<string, string>}
 * @private
 */
soy.esc.$$ESCAPE_MAP_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_ = {
  '\x00': '%00',
  '\x01': '%01',
  '\x02': '%02',
  '\x03': '%03',
  '\x04': '%04',
  '\x05': '%05',
  '\x06': '%06',
  '\x07': '%07',
  '\x08': '%08',
  '\x09': '%09',
  '\x0a': '%0A',
  '\x0b': '%0B',
  '\x0c': '%0C',
  '\x0d': '%0D',
  '\x0e': '%0E',
  '\x0f': '%0F',
  '\x10': '%10',
  '\x11': '%11',
  '\x12': '%12',
  '\x13': '%13',
  '\x14': '%14',
  '\x15': '%15',
  '\x16': '%16',
  '\x17': '%17',
  '\x18': '%18',
  '\x19': '%19',
  '\x1a': '%1A',
  '\x1b': '%1B',
  '\x1c': '%1C',
  '\x1d': '%1D',
  '\x1e': '%1E',
  '\x1f': '%1F',
  ' ': '%20',
  '\x22': '%22',
  '\x27': '%27',
  '(': '%28',
  ')': '%29',
  '\x3c': '%3C',
  '\x3e': '%3E',
  '\\': '%5C',
  '{': '%7B',
  '}': '%7D',
  '\x7f': '%7F',
  '\x85': '%C2%85',
  '\xa0': '%C2%A0',
  '\u2028': '%E2%80%A8',
  '\u2029': '%E2%80%A9',
  '\uff01': '%EF%BC%81',
  '\uff03': '%EF%BC%83',
  '\uff04': '%EF%BC%84',
  '\uff06': '%EF%BC%86',
  '\uff07': '%EF%BC%87',
  '\uff08': '%EF%BC%88',
  '\uff09': '%EF%BC%89',
  '\uff0a': '%EF%BC%8A',
  '\uff0b': '%EF%BC%8B',
  '\uff0c': '%EF%BC%8C',
  '\uff0f': '%EF%BC%8F',
  '\uff1a': '%EF%BC%9A',
  '\uff1b': '%EF%BC%9B',
  '\uff1d': '%EF%BC%9D',
  '\uff1f': '%EF%BC%9F',
  '\uff20': '%EF%BC%A0',
  '\uff3b': '%EF%BC%BB',
  '\uff3d': '%EF%BC%BD'
};

/**
 * A function that can be used with String.replace.
 * @param {string} ch A single character matched by a compatible matcher.
 * @return {string} A token in the output language.
 * @private
 */
soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_ = function(ch) {
  return soy.esc.$$ESCAPE_MAP_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_[ch];
};

/**
 * Matches characters that need to be escaped for the named directives.
 * @type RegExp
 * @private
 */
soy.esc.$$MATCHER_FOR_ESCAPE_HTML_ = /[\x00\x22\x26\x27\x3c\x3e]/g;

/**
 * Matches characters that need to be escaped for the named directives.
 * @type RegExp
 * @private
 */
soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_ = /[\x00\x22\x27\x3c\x3e]/g;

/**
 * Matches characters that need to be escaped for the named directives.
 * @type RegExp
 * @private
 */
soy.esc.$$MATCHER_FOR_ESCAPE_HTML_NOSPACE_ = /[\x00\x09-\x0d \x22\x26\x27\x2d\/\x3c-\x3e`\x85\xa0\u2028\u2029]/g;

/**
 * Matches characters that need to be escaped for the named directives.
 * @type RegExp
 * @private
 */
soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_NOSPACE_ = /[\x00\x09-\x0d \x22\x27\x2d\/\x3c-\x3e`\x85\xa0\u2028\u2029]/g;

/**
 * Matches characters that need to be escaped for the named directives.
 * @type RegExp
 * @private
 */
soy.esc.$$MATCHER_FOR_ESCAPE_JS_STRING_ = /[\x00\x08-\x0d\x22\x26\x27\/\x3c-\x3e\\\x85\u2028\u2029]/g;

/**
 * Matches characters that need to be escaped for the named directives.
 * @type RegExp
 * @private
 */
soy.esc.$$MATCHER_FOR_ESCAPE_JS_REGEX_ = /[\x00\x08-\x0d\x22\x24\x26-\/\x3a\x3c-\x3f\x5b-\x5e\x7b-\x7d\x85\u2028\u2029]/g;

/**
 * Matches characters that need to be escaped for the named directives.
 * @type RegExp
 * @private
 */
soy.esc.$$MATCHER_FOR_ESCAPE_CSS_STRING_ = /[\x00\x08-\x0d\x22\x26-\x2a\/\x3a-\x3e@\\\x7b\x7d\x85\xa0\u2028\u2029]/g;

/**
 * Matches characters that need to be escaped for the named directives.
 * @type RegExp
 * @private
 */
soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_ = /[\x00- \x22\x27-\x29\x3c\x3e\\\x7b\x7d\x7f\x85\xa0\u2028\u2029\uff01\uff03\uff04\uff06-\uff0c\uff0f\uff1a\uff1b\uff1d\uff1f\uff20\uff3b\uff3d]/g;

/**
 * A pattern that vets values produced by the named directives.
 * @type RegExp
 * @private
 */
soy.esc.$$FILTER_FOR_FILTER_CSS_VALUE_ = /^(?!-*(?:expression|(?:moz-)?binding))(?:[.#]?-?(?:[_a-z0-9-]+)(?:-[_a-z0-9-]+)*-?|-?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[a-z]{1,2}|%)?|!important|)$/i;

/**
 * A pattern that vets values produced by the named directives.
 * @type RegExp
 * @private
 */
soy.esc.$$FILTER_FOR_FILTER_NORMALIZE_URI_ = /^(?:(?:https?|mailto):|[^&:\/?#]*(?:[\/?#]|$))/i;

/**
 * A pattern that vets values produced by the named directives.
 * @type RegExp
 * @private
 */
soy.esc.$$FILTER_FOR_FILTER_IMAGE_DATA_URI_ = /^data:image\/(?:bmp|gif|jpe?g|png|tiff|webp);base64,[a-z0-9+\/]+=*$/i;

/**
 * A pattern that vets values produced by the named directives.
 * @type RegExp
 * @private
 */
soy.esc.$$FILTER_FOR_FILTER_HTML_ATTRIBUTES_ = /^(?!style|on|action|archive|background|cite|classid|codebase|data|dsync|href|longdesc|src|usemap)(?:[a-z0-9_$:-]*)$/i;

/**
 * A pattern that vets values produced by the named directives.
 * @type RegExp
 * @private
 */
soy.esc.$$FILTER_FOR_FILTER_HTML_ELEMENT_NAME_ = /^(?!script|style|title|textarea|xmp|no)[a-z0-9_$:-]*$/i;

/**
 * A helper for the Soy directive |escapeHtml
 * @param {*} value Can be of any type but will be coerced to a string.
 * @return {string} The escaped text.
 */
soy.esc.$$escapeHtmlHelper = function(value) {
  var str = String(value);
  return str.replace(
      soy.esc.$$MATCHER_FOR_ESCAPE_HTML_,
      soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_);
};

/**
 * A helper for the Soy directive |normalizeHtml
 * @param {*} value Can be of any type but will be coerced to a string.
 * @return {string} The escaped text.
 */
soy.esc.$$normalizeHtmlHelper = function(value) {
  var str = String(value);
  return str.replace(
      soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_,
      soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_);
};

/**
 * A helper for the Soy directive |escapeHtmlNospace
 * @param {*} value Can be of any type but will be coerced to a string.
 * @return {string} The escaped text.
 */
soy.esc.$$escapeHtmlNospaceHelper = function(value) {
  var str = String(value);
  return str.replace(
      soy.esc.$$MATCHER_FOR_ESCAPE_HTML_NOSPACE_,
      soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_);
};

/**
 * A helper for the Soy directive |normalizeHtmlNospace
 * @param {*} value Can be of any type but will be coerced to a string.
 * @return {string} The escaped text.
 */
soy.esc.$$normalizeHtmlNospaceHelper = function(value) {
  var str = String(value);
  return str.replace(
      soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_NOSPACE_,
      soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_);
};

/**
 * A helper for the Soy directive |escapeJsString
 * @param {*} value Can be of any type but will be coerced to a string.
 * @return {string} The escaped text.
 */
soy.esc.$$escapeJsStringHelper = function(value) {
  var str = String(value);
  return str.replace(
      soy.esc.$$MATCHER_FOR_ESCAPE_JS_STRING_,
      soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_);
};

/**
 * A helper for the Soy directive |escapeJsRegex
 * @param {*} value Can be of any type but will be coerced to a string.
 * @return {string} The escaped text.
 */
soy.esc.$$escapeJsRegexHelper = function(value) {
  var str = String(value);
  return str.replace(
      soy.esc.$$MATCHER_FOR_ESCAPE_JS_REGEX_,
      soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_);
};

/**
 * A helper for the Soy directive |escapeCssString
 * @param {*} value Can be of any type but will be coerced to a string.
 * @return {string} The escaped text.
 */
soy.esc.$$escapeCssStringHelper = function(value) {
  var str = String(value);
  return str.replace(
      soy.esc.$$MATCHER_FOR_ESCAPE_CSS_STRING_,
      soy.esc.$$REPLACER_FOR_ESCAPE_CSS_STRING_);
};

/**
 * A helper for the Soy directive |filterCssValue
 * @param {*} value Can be of any type but will be coerced to a string.
 * @return {string} The escaped text.
 */
soy.esc.$$filterCssValueHelper = function(value) {
  var str = String(value);
  if (!soy.esc.$$FILTER_FOR_FILTER_CSS_VALUE_.test(str)) {
    return 'zSoyz';
  }
  return str;
};

/**
 * A helper for the Soy directive |normalizeUri
 * @param {*} value Can be of any type but will be coerced to a string.
 * @return {string} The escaped text.
 */
soy.esc.$$normalizeUriHelper = function(value) {
  var str = String(value);
  return str.replace(
      soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_,
      soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_);
};

/**
 * A helper for the Soy directive |filterNormalizeUri
 * @param {*} value Can be of any type but will be coerced to a string.
 * @return {string} The escaped text.
 */
soy.esc.$$filterNormalizeUriHelper = function(value) {
  var str = String(value);
  if (!soy.esc.$$FILTER_FOR_FILTER_NORMALIZE_URI_.test(str)) {
    return '#zSoyz';
  }
  return str.replace(
      soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_,
      soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_);
};

/**
 * A helper for the Soy directive |filterImageDataUri
 * @param {*} value Can be of any type but will be coerced to a string.
 * @return {string} The escaped text.
 */
soy.esc.$$filterImageDataUriHelper = function(value) {
  var str = String(value);
  if (!soy.esc.$$FILTER_FOR_FILTER_IMAGE_DATA_URI_.test(str)) {
    return 'data:image/gif;base64,zSoyz';
  }
  return str;
};

/**
 * A helper for the Soy directive |filterHtmlAttributes
 * @param {*} value Can be of any type but will be coerced to a string.
 * @return {string} The escaped text.
 */
soy.esc.$$filterHtmlAttributesHelper = function(value) {
  var str = String(value);
  if (!soy.esc.$$FILTER_FOR_FILTER_HTML_ATTRIBUTES_.test(str)) {
    return 'zSoyz';
  }
  return str;
};

/**
 * A helper for the Soy directive |filterHtmlElementName
 * @param {*} value Can be of any type but will be coerced to a string.
 * @return {string} The escaped text.
 */
soy.esc.$$filterHtmlElementNameHelper = function(value) {
  var str = String(value);
  if (!soy.esc.$$FILTER_FOR_FILTER_HTML_ELEMENT_NAME_.test(str)) {
    return 'zSoyz';
  }
  return str;
};

/**
 * Matches all tags, HTML comments, and DOCTYPEs in tag soup HTML.
 * By removing these, and replacing any '<' or '>' characters with
 * entities we guarantee that the result can be embedded into a
 * an attribute without introducing a tag boundary.
 *
 * @type {RegExp}
 * @private
 */
soy.esc.$$HTML_TAG_REGEX_ = /<(?:!|\/?([a-zA-Z][a-zA-Z0-9:\-]*))(?:[^>'"]|"[^"]*"|'[^']*')*>/g;

/**
 * Matches all occurrences of '<'.
 *
 * @type {RegExp}
 * @private
 */
soy.esc.$$LT_REGEX_ = /</g;

/**
 * Maps lower-case names of innocuous tags to 1.
 *
 * @type {Object.<string,number>}
 * @private
 */
soy.esc.$$SAFE_TAG_WHITELIST_ = {'b': 1, 'br': 1, 'em': 1, 'i': 1, 's': 1, 'sub': 1, 'sup': 1, 'u': 1};

// END GENERATED CODE
;

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

// This file was automatically generated from alert.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace popupblockerUI.
 */

if (typeof popupblockerUI == 'undefined') { var popupblockerUI = {}; }


/**
 * @param {{
 *    cssText: string,
 *    preloadFonts: !Array.<string>
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @suppress {checkTypes|uselessCode}
 */
popupblockerUI.head = function(opt_data, opt_ignored) {
  goog.asserts.assert(goog.isString(opt_data.cssText) || (opt_data.cssText instanceof goog.soy.data.SanitizedContent), "expected param 'cssText' of type string|goog.soy.data.SanitizedContent.");
  var cssText = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.cssText);
  var preloadFonts = goog.asserts.assertArray(opt_data.preloadFonts, "expected parameter 'preloadFonts' of type list<string>.");
  var output = '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge">';
  var hrefList13 = preloadFonts;
  var hrefListLen13 = hrefList13.length;
  for (var hrefIndex13 = 0; hrefIndex13 < hrefListLen13; hrefIndex13++) {
    var hrefData13 = hrefList13[hrefIndex13];
    output += '<link rel="preload" href="' + soy.$$escapeHtml(hrefData13) + '" as="font" crossorigin="anonymous">';
  }
  output += '<style>' + soy.$$escapeHtml(cssText) + '</style></head></html>';
  return output;
};
if (goog.DEBUG) {
  popupblockerUI.head.soyTemplateName = 'popupblockerUI.head';
}


/**
 * @param {{
 *    numPopup: number,
 *    origDomain: string,
 *    destUrl: string
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @suppress {checkTypes|uselessCode}
 */
popupblockerUI.content = function(opt_data, opt_ignored) {
  goog.asserts.assert(goog.isNumber(opt_data.numPopup), "expected param 'numPopup' of type number.");
  var numPopup = /** @type {number} */ (opt_data.numPopup);
  goog.asserts.assert(goog.isString(opt_data.origDomain) || (opt_data.origDomain instanceof goog.soy.data.SanitizedContent), "expected param 'origDomain' of type string|goog.soy.data.SanitizedContent.");
  var origDomain = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.origDomain);
  goog.asserts.assert(goog.isString(opt_data.destUrl) || (opt_data.destUrl instanceof goog.soy.data.SanitizedContent), "expected param 'destUrl' of type string|goog.soy.data.SanitizedContent.");
  var destUrl = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.destUrl);
  var output = '';
  /** @desc AdGuard prevented this website from opening {$numPopup} pop-up windows */
  var MSG_UNNAMED_36 = adguard.i18nService.getMsg('popup_text',
      {'numPopup': soy.$$escapeHtml(numPopup)});
  var msg_s109 = MSG_UNNAMED_36;
  /** @desc Options */
  var MSG_UNNAMED_46 = adguard.i18nService.getMsg('options');
  var msg_s111 = MSG_UNNAMED_46;
  /** @desc Allow pop-ups for {$origDomain} */
  var MSG_UNNAMED_50 = adguard.i18nService.getMsg('allow_from',
      {'origDomain': soy.$$escapeHtml(origDomain)});
  var msg_s113 = MSG_UNNAMED_50;
  /** @desc Don't show this message on {$origDomain} */
  var MSG_UNNAMED_56 = adguard.i18nService.getMsg('silence_noti',
      {'origDomain': soy.$$escapeHtml(origDomain)});
  var msg_s115 = MSG_UNNAMED_56;
  /** @desc Manage preferences... */
  var MSG_UNNAMED_62 = adguard.i18nService.getMsg('manage_pref');
  var msg_s117 = MSG_UNNAMED_62;
  /** @desc Show {$destUrl} */
  var MSG_UNNAMED_66 = adguard.i18nService.getMsg('show_popup',
      {'destUrl': soy.$$escapeHtml(destUrl)});
  var msg_s119 = MSG_UNNAMED_66;
  /** @desc Continue blocking */
  var MSG_UNNAMED_74 = adguard.i18nService.getMsg('continue_blocking');
  var msg_s121 = MSG_UNNAMED_74;
  output += '<div class="alert"><button class="alert__close"></button><div class="alert__in"><div class="alert__ico alert__ico--windows"></div><div class="alert__text">' + msg_s109 + '</div></div><div class="alert__btns"><select class="alert__select" name="options"><option value="0" disabled selected>' + msg_s111 + '</option><option value="1">' + msg_s113 + '</option><option value="2">' + msg_s115 + '</option><option value="3">' + msg_s117 + '</option><option value="4">' + msg_s119 + '</option></select><button class="alert__btn">' + msg_s121 + '</button></div></div><button class="pin pin--win-hidden pin--show"></button>';
  return output;
};
if (goog.DEBUG) {
  popupblockerUI.content.soyTemplateName = 'popupblockerUI.content';
}
;

var soydata_VERY_UNSAFE = soydata.VERY_UNSAFE;

var create = Object.create;






var functionBind = Function.prototype.bind;



// Conditional export workaround for tsickle



var setTimeout$1 = window.setTimeout.bind(window);

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

// This file was automatically generated from toast.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace popupblockerNotificationUI.
 */

if (typeof popupblockerNotificationUI == 'undefined') { var popupblockerNotificationUI = {}; }


/**
 * @param {{
 *    message: string
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @suppress {checkTypes|uselessCode}
 */
popupblockerNotificationUI.toast = function(opt_data, opt_ignored) {
  goog.asserts.assert(goog.isString(opt_data.message) || (opt_data.message instanceof goog.soy.data.SanitizedContent), "expected param 'message' of type string|goog.soy.data.SanitizedContent.");
  var message = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.message);
  return '<div class="toast"><div class="toast__in">' + soy.$$escapeHtml(message) + '</div></div>';
};
if (goog.DEBUG) {
  popupblockerNotificationUI.toast.soyTemplateName = 'popupblockerNotificationUI.toast';
}
;

/**
 * @fileoverview This instance enables firing callbacks when text size changes, e.g. due to external font being applied.
 * The logic is exactly the same as one described in http://smnh.me/web-font-loading-detection-without-timers/
 */
var px$2 = 'px';
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
        wrapperStyle.width = innerContentStyle.width = offsetWidth - 1 + px$2;
        wrapperStyle.height = innerContentStyle.height = offsetHeight - 1 + px$2;
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
var px$1 = 'px';
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
        iframeStyle.width = offsetWidth + px$1;
        iframeStyle.height = offsetHeight + px$1;
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
        "bottom", 15 + px$1,
        "width", 0 + px$1,
        "height", 0 + px$1,
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
        }
        return instanceID;
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
var translations = {"ru":{"userscript_name":"Блокировщик всплывающей рекламы от AdGuard","on_navigation_by_popunder":"Этот переход на новую страницу скорее всего вызван поп-андером. Всё равно продолжить?","aborted_popunder_execution":"PopupBlocker прервал исполнение скрипта, чтобы предотвратить фоновую переадресацию"},"es-419":{"userscript_name":"AdGuard Popup Blocker","on_navigation_by_popunder":"Esta transición a la nueva página parece estar causada por un pop-under (que aparece detrás de la ventada actual). ¿Desea continuar?","aborted_popunder_execution":"PopupBlocker abortó la ejecución de un script para prevenir un redireccionamiento en segundo plano.","settings_saved":"Ajustes guardados","show_popup":"Mostrar {$destUrl}","continue_blocking":"Continuar bloqueando","allow_from":"Permitir pop-ups para {$origDomain}","manage_pref":"Gestionar preferencias...","popup_text":"AdGuard canceló abrir {$numPopup} ventanas emergentes (pop-up) en este sitio web","options":"Opciones","silence_noti":"No mostrar este mensaje en {$origDomain}"},"hu":{"userscript_name":"AdGuard Felugró Szűrő","on_navigation_by_popunder":"Ez az átmenetet egy másik oldalra egy pop-under okozta. Szeretné folytatni?","aborted_popunder_execution":"Popup Szűrő megszakított egy scriptet ami a háttérben átirányította volna"},"pt-PT":{"on_navigation_by_popunder":"Esta transição para a nova página  será  provavelmente causada por um popunder. Deseja continuar?","aborted_popunder_execution":"PopupBlocker abortou uma execução de script para evitar o redireccionamento em segundo plano","options":"Opções"},"it":{"userscript_name":"Blocco Pop-Up di AdGuard","on_navigation_by_popunder":"Questo passaggio alla nuova pagina è probabilmente causato da un pop-under. Vuoi continuare?","aborted_popunder_execution":"PopupBlocker ha interrotto l'esecuzione di uno script per impedire il reindirizzamento in background"},"tr":{"userscript_name":"AdGuard Popup Blocker","on_navigation_by_popunder":"Yeni sayfaya geçiş, bir gizli pencere nedeniyle meydana gelmiş olabilir. Devam etmek istiyor musunuz?","aborted_popunder_execution":"Arka plan yönlendirmesini önlemek için Açılır Pencere Engelleyicisi bir komut dosyasının çalışmasını engelledi","settings_saved":"Ayarlar kaydedildi","show_popup":"{$destUrl} Göster","continue_blocking":"Engellemeye devam et","allow_from":"{$origDomain} için açılır pencerelere izin ver","manage_pref":"Tercihleri yönet...","popup_text":"AdGuard bu sitenin {$numPopup} açılır pencere açmasını önledi","options":"Ayarlar","silence_noti":"Bu mesajı {$origDomain} alan adı üzerinde gösterme"},"fr":{"userscript_name":"Bloqueur de popup de AdGuard","on_navigation_by_popunder":"Cette transition vers la nouvelle page est susceptible d'être causé par un pop-under. Désirez-vous continuer?","aborted_popunder_execution":"PopupBlocker a interrompu l'exécution d'un script pour éviter la redirection du fond d'écran "},"ko":{"on_navigation_by_popunder":"이 페이지 전환은 팝업 스크립트가 유발했을 수 있습니다. 계속하시겠습니까?","aborted_popunder_execution":"페이지 전환이 일어나지 않도록 팝업 차단기가 스크립트 실행을 중단시켰습니다"},"zh-CN":{"userscript_name":"AdGuard 弹窗拦截器","on_navigation_by_popunder":"此网页导航可能导致弹窗。您要继续？","aborted_popunder_execution":"PopupBlocker 已中止脚本执行以防止后台重新定向","settings_saved":"设置已保存","show_popup":"显示 {$destUrl}","continue_blocking":"继续拦截","allow_from":"允许 {$origDomain} 弹窗","manage_pref":"管理首选项...","popup_text":"AdGuard 已防止此网站打开的 {$numPopup} 个弹窗","options":"选项","silence_noti":"在 {$origDomain} 上不再显示此讯息"},"zh-TW":{"userscript_name":"AdGuard 彈出式視窗封鎖器","on_navigation_by_popunder":"此至新的頁面之轉換很可能是由一個背彈式視窗引起。您想要繼續嗎？","aborted_popunder_execution":"彈出式視窗封鎖器中止腳本執行以防止背景重定向","settings_saved":"已儲存之設定","show_popup":"顯示 {$destUrl}","continue_blocking":"繼續封鎖","allow_from":"對於 {$origDomain} 允許彈出式視窗","manage_pref":"管理偏好...","popup_text":"AdGuard阻止該網站展現 {$numPopup} 彈出式視窗","options":"選項","silence_noti":"不要於 {$origDomain} 上顯示該訊息"},"fa":{"userscript_name":"مسدودساز پاپ-آپ AdGuard","on_navigation_by_popunder":"انتقال به این صفحه جدید احتمالا بخاطر یه پاپ-آندر انجام شده است. میخواهید ادامه دهید؟","aborted_popunder_execution":"مسدودساز پاپ-آپ اجرای کد را لغو کرده تا از ریدایرکت جبلوگیری شود"},"pl":{"userscript_name":"Bloker wyskakujących okienek przez AdGuard","on_navigation_by_popunder":"To przejście na nową stronę może być spowodowane przez pop-under. Czy chcesz kontynuować?","aborted_popunder_execution":"PopupBlocker anulował wykonanie skryptu by przeciwdziałać przekierowaniu w tle"},"id":{"on_navigation_by_popunder":"Transisi ke laman baru ini kemungkinan disebabkan oleh sebuah pop-up. Apakah Anda ingin melanjutkan?","aborted_popunder_execution":"PopupBlocker menghentikan eksekusi script untuk mencegah perubahan laman di latar belakang"},"de":{"userscript_name":"AdGuard Pop-up-Blocker","on_navigation_by_popunder":"Diese Seiten-Navigation wird wahrscheinlich durch ein Pop-under verursacht. Möchten Sie fortfahren?","aborted_popunder_execution":"Pop-up-Blocker hat eine Skript-Ausführung abgebrochen, um eine Hintergrundumleitung zu verhindern"},"en":{"userscript_name":"AdGuard Popup Blocker","on_navigation_by_popunder":"This transition to the new page is likely to be caused by a pop-under. Do you wish to continue?","aborted_popunder_execution":"PopupBlocker aborted a script execution to prevent background redirect","settings_saved":"Settings saved","show_popup":"Show {$destUrl}","continue_blocking":"Continue blocking","allow_from":"Allow pop-ups for {$origDomain}","manage_pref":"Manage preferences...","popup_text":"AdGuard prevented this website from opening {$numPopup} pop-up windows","options":"Options","silence_noti":"Don't show this message on {$origDomain}"},"sv":{"userscript_name":"AdGuards popup-blockerare","on_navigation_by_popunder":"Övergången till den nya webbsidan orsakas sannolikt av en underliggande fönster (en s.k. pop-under). Vill du fortsätta?","aborted_popunder_execution":"Popupblockeraren avbröt en skriptexekvering för att hindra omdirigering av en bakgrundsaktivitet."},"sk":{"userscript_name":"AdGuard blokovač vyskakovacích okien","on_navigation_by_popunder":"Tento prechod na novú stránku je pravdepodobne spôsobený pop-under. Chcete pokračovať?","aborted_popunder_execution":"PopupBlocker prerušil vykonanie skriptu, aby zabránil presmerovaniu na pozadí"},"da":{"userscript_name":"AdGuard Popup Blocker","on_navigation_by_popunder":"Denne overgang til den nye side vil sandsynligvis medføre et pop under-vindue. Ønsker du at fortsætte?","aborted_popunder_execution":"PopupBlocker afbrød en script eksekvering for at forhindre baggrundsomdirigering","settings_saved":"Indstillingerne er gemt","show_popup":"Vis {$destUrl}","continue_blocking":"Fortsæt blokering","allow_from":"Tillad pop-ups for {$origDomain}","manage_pref":"Administrer præferencer...","popup_text":"AdGuard forhindrede denne hjemmeside i at åbne {$numPopup} pop op-vinduer","options":"Valgmuligheder","silence_noti":"Vis ikke denne meddelelse på {$origDomain}"},"nl":{"on_navigation_by_popunder":"De overgang naar de nieuwe pagina wordt waarschijnlijk veroorzaakt door een pop-under. Wil je doorgaan?","aborted_popunder_execution":"De pop-up blocker heeft de uitvoering van een script onderbroken om te voorkomen dat er op de achtergrond een redirect plaatsvindt."},"ms":{"on_navigation_by_popunder":"Transisi ke laman baru berkemungkinan disebabkan oleh pop-under. Anda pasti untuk teruskan?","aborted_popunder_execution":"Penghalang Popup menghentikan pelaksanaan skrip untuk mencegah pelencongan dari belakang tabir"},"uk":{"userscript_name":"Блокувальник спливаючої реклами AdGuard","on_navigation_by_popunder":"Цей перехід на нову сторінку, ймовірно, міг бути викликаний поп-андером. Бажаєте продовжити?","aborted_popunder_execution":"PopupBlocker перервав виконання скрипта, щоб запобігти фоновому перенаправленню"},"es-ES":{"userscript_name":"Bloqueador de popup de AdGuard","on_navigation_by_popunder":"Parece que la transición a nueva página sea causada por un pop-under (elemento emergente). ¿Quiere continuar?","aborted_popunder_execution":" Bloqueador de popup canceló  la ejecución del script para evitar una redirección de segundo plano","settings_saved":"Ajustes guardados","show_popup":"Mostrar {$destUrl}","continue_blocking":"Continuar bloqueando","allow_from":"Permitir ventanas emergentes para {$origDomain}","manage_pref":"Administrar preferencias...","popup_text":"AdGuard ha impedido abrir {$numPopup}  las ventanas emergentes en este sitio web","options":"Opciones","silence_noti":"No mostrar este mensaje en {$origDomain}"},"no":{"userscript_name":"AdGuards popup-blokkerer","on_navigation_by_popunder":"Omdirigeringen til den nye nettsiden er sannsynligvis forårsaket av en pop-under. Ønsker du å fortsette?","aborted_popunder_execution":"PopupBlocker avbrøt en skrift fra å kjøre for å hindre bakgrunnsomdirigering"},"sr-Latn":{"userscript_name":"AdGuard blokator iskačućih prozora","on_navigation_by_popunder":"Ovaj prelaz na novu stranicu je verovatno uzrokovan iskačućim prozorom. Želite li da nastavite?","aborted_popunder_execution":"Blokator iskačućeg prozora je blokirao izvršenje skripte kako bi sprečio pozadinsko preusmerenje"},"ja":{"userscript_name":"AdGuard ポップアップブロッカー","on_navigation_by_popunder":"新しいページへの移動はポップアンダーによって生じた可能性があります。続行しますか？","aborted_popunder_execution":"ポップアップブロッカーはバックグラウンドリダイレクトを防ぐためにスクリプトの実行を中止しました","settings_saved":"設定保存完了","show_popup":"{$destUrl}を表示する","continue_blocking":"ブロッキングを続ける","allow_from":"{$origDomain}のポップアップを許可する","manage_pref":"設定を管理…","popup_text":"AdGuardはこのウェブサイトが{$numPopup}のポップアップウィンドウを開くのを防ぎました","options":"オプション","silence_noti":"{$origDomain}にこのメッセージを表示しない"},"pt-BR":{"userscript_name":"AdGuard Bloqueador de Pop-ups","on_navigation_by_popunder":"Essa transição para a nova página provavelmente será causada por um pop-under. Você deseja continuar?","aborted_popunder_execution":"O bloqueador de pop-ups interrompeu uma execução de script para evitar um redirecionamento em segundo plano","settings_saved":"Configurações salvas","show_popup":"Mostrar {$destUrl}","continue_blocking":"Continuar bloqueando","allow_from":"Permitir pop-ups de {$origDomain}","manage_pref":"Gerenciar preferências...","popup_text":"O AdGuard impediu este site de abrir {$numPopup} pop-ups","options":"Opções","silence_noti":"Não mostrar essa mensagem no {$origDomain}"},"ar":{"on_navigation_by_popunder":"من المحتمل ان يكون هذا الانتقال إلى الصفحة الجديدة ناتجا عن الإطار المنبثق. هل ترغب في المتابعة ؟","aborted_popunder_execution":"تم إحباط البرنامج النصي لمنع أعاده توجيه الخلفية"}};
/**
 * AdGuard for Windows noramlizes locales like this.
 */
function normalizeLocale(locale) {
    return locale.toLowerCase().replace('_', '-');
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
var getMessage = function (messageId) {
    var message = translations[currentLocale][messageId];
    if (!message) {
        message = translations[defaultLocale][messageId];
        if (!message) {
            throw messageId + ' not localized';
        }
    }
    return message;
};

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
    window.open('https://adguardteam.github.io/PopupBlocker/options.html', '__popupBlocker_options_page__');
});
var csApiFacade = new UserscriptContentScriptApiFacade(settingsDao, alertController, getMessage);
adguard.i18nService = i18nService;
UserscriptSettingsDao.migrateDataIfNeeded();
function popupBlocker(window,CONTENT_SCRIPT_KEY){(function () {


}());
(function () {
/**
 * @fileoverview Global namespace to be used throughout the page script.
 */
var adguard = {};

var matches = Element.prototype.matches || Element.prototype.msMatchesSelector;
var closest = 'closest' in Element.prototype ? function (el, selector) {
    return el.closest(selector);
} : function (el, selector) {
    for (var parent_1 = el; parent_1; parent_1 = parent_1.parentElement) {
        if (matches.call(el, selector)) {
            return el;
        }
    }
};
/**
 * This serves as a whitelist on various checks where we block re-triggering of events.
 * See dom/dispatchEvent.ts.
 */
function targetsAreChainable(prev, next) {
    if (prev.nodeType === 3 /* Node.TEXT_NODE */) {
        // Based on observation that certain libraries re-triggers
        // an event on text nodes on its parent due to iOS quirks.
        prev = prev.parentNode;
    }
    return prev === next;
}
var getTagName = function (el) {
    return el.nodeName.toUpperCase();
};
/**
 * Detects about:blank, about:srcdoc urls.
 */
var ABOUT_PROTOCOL = 'about:';
var reEmptyUrl = new RegExp('^' + ABOUT_PROTOCOL);
var isEmptyUrl = function (url) {
    return reEmptyUrl.test(url);
};
var frameElementDesc = Object.getOwnPropertyDescriptor(window, 'frameElement') || Object.getOwnPropertyDescriptor(Window.prototype, 'frameElement');
var getFrameElement = frameElementDesc.get;
/**
 * A function to be called inside an empty iframe to obtain a reference to a parent window.
 * `window.parent` is writable and configurable, so this could be modified by external scripts,
 * and this is actually common for popup/popunder scripts.
 * However, `frameElement` property is defined with a getter, so we can keep its reference
 * and use it afterhands.
 */
var getSafeParent = function (window) {
    var frameElement = getFrameElement.call(window);
    if (!frameElement) {
        return null;
    }
    return frameElement.ownerDocument.defaultView;
};
var getSafeNonEmptyParent = function (window) {
    var frame = window;
    while (frame && isEmptyUrl(frame.location.href)) {
        frame = getSafeParent(frame);
    }
    if (!frame) {
        return null;
    }
    return frame;
};

/**
 * @fileoverview Keeps a reference of MutationObserver constructor.
 * Other than this being more succinct, we need to retrieve a reference
 * from a 'persistent' frame, because it seems that browser discards
 * from the DOM the observer when the originating frame is detached
 * from the document.
 */
var parent = getSafeNonEmptyParent(window);
var MO = parent.MutationObserver || parent.WebKitMutationObserver;

/**
 * @fileoverview Utility functions for instanceof checks against DOM classes. Used for type casting.
 * Since it is common for us to cross the border of browsing contexts, instanceof
 * check for DOM element is not reliable.
 */
function isMouseEvent(event) {
    return 'clientX' in event;
}

function isTouchEvent(event) {
    return 'touches' in event;
}

function isUIEvent(event) {
    return 'view' in event;
}

/**/
function isNode(el) {
    return 'nodeName' in el;
}

function isElement(el) {
    return 'id' in el;
}

function isHTMLElement(el) {
    return 'style' in el;
}

function isAnchor(el) {
    return getTagName(el) === 'A';
}

function isIFrame(node) {
    return getTagName(node) === 'IFRAME';
}
/**/
var toString = Object.prototype.toString;
function isWindow(el) {
    return toString.call(el) === '[object Window]';
}
function isLocation(el) {
    return toString.call(el) === '[object Location]';
}
/**/
function isUndef(obj) {
    return typeof obj === 'undefined';
}


/**/
function isClickEvent(evt) {
    var type = evt.type;
    return type === 'click' || type === 'mousedown' || type === 'mouseup';
}

var eventTargetIsRootNode = function (el) {
    if (isWindow(el)) {
        return true;
    }
    if (isNode(el)) {
        var name_1 = getTagName(el);
        // Technically, document.body can be a frameset node,
        // but ui events originating from its child frames won't propagate
        // past the frame border, so such cases are irrelevant.
        // https://www.w3.org/TR/html401/present/frames.html
        if (name_1 === '#DOCUMENT' || name_1 === 'HTML' || name_1 === 'BODY') {
            return true;
        }
    }
    return false;
};
var maskContentTest = function (el) {
    var textContent = el.textContent;
    if (textContent && textContent.trim().length) {
        return false;
    }
    return el.getElementsByTagName('img').length === 0;
};
/**
 * Detects common overlay pattern.
 * @param el an element to check whether it is an overlay.
 * @return true if el is an overlay.
 */
function maybeOverlay(el) {
    if (!isHTMLElement(el)) {
        return false;
    } // not an HTMLElement instance
    var view = el.ownerDocument.defaultView;
    var w = view.innerWidth, h = view.innerHeight;
    var _a = el.getBoundingClientRect();
    if (rectAlmostCoversView(el.getBoundingClientRect(), w, h)) {
        // Find artificial stacking context root
        do {
            if (isArtificialStackingContextRoot(el)) {
                return true;
            }
        } while (el = el.parentElement);
    }
    // ToDo: the element may have been modified in the event handler.
    // We may still test it using the inline style attribute.
    return false;
}
/**
 * Detects a common stacking context root pattern.
 * Stacking context root: https://philipwalton.com/articles/what-no-one-told-you-about-z-index/
 * https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context
 */
function isArtificialStackingContextRoot(el) {
    var _a = getComputedStyle(el), zIndex = _a.zIndex, position = _a.position, opacity = _a.opacity;
    if ((position !== 'static' && zIndex !== 'auto') ||
        parseFloat(opacity) < 1) {
        if (parseInt(zIndex) > 1000) {
            return true;
        }
    }
    return false;
}
function numsAreClose(x, y, threshold) {
    return (((x - y) / threshold) | 0) === 0;
}
/**
 * @param w view.innerWidth
 * @param h view.innerHeight
 */
function rectAlmostCoversView(rect, w, h) {
    var left = rect.left, right = rect.right, top = rect.top, bottom = rect.bottom;
    return numsAreClose(left, 0, w >> 4) &&
        numsAreClose(right, w, w >> 4) &&
        numsAreClose(top, 0, h >> 4) &&
        numsAreClose(bottom, h, h >> 4);
}

var getTime = 'now' in performance ? function () {
    return performance.timing.navigationStart + performance.now();
} : Date.now;

/**
 * @fileoverview Logging functions to be used in dev channel. Function bodies are enclosed with preprocess
 * directives in order to ensure that these are stripped out by minifier in beta and release channels.
 */
var prefix = '';
var win = window;
while (win.parent !== win) {
    win = win.parent;
    prefix += '-- ';
}
var loc = location.href;
var suffix = "    (at " + loc + ")";
var depth = 0;
function call(msg) {
    depth++;
    console.group(prefix + msg + suffix);
}
function callEnd() {
    depth--;
    console.groupEnd();
}
function closeAllGroup() {
    while (depth > 0) {
        console.groupEnd();
        depth--;
    }
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
        try {
            console.log(obj);
            /**
             * Acconding to testing, Edge 41.16299 throws some errors
             * while printing some `Proxy` objects in console, such as
             * new Proxy(window, { get: Reflect.get }).
             * Strangely, just having a try-catch block enclosing it prevents errors.
             */
        }
        catch (e) {
            console.log('Object not printed due to an error');
        }
        console.log(prefix + '=============================');
    }
}
/**
 * Accepts a function, and returns a wrapped function that calls `call` and `callEnd`
 * automatically before and after invoking the function, respectively.
 * @param fn A function to wrap
 * @param message
 * @param cond optional argument, the function argument will be passed to `cond` function, and
 * its return value will determine whether to call `call` and `callEnd`.
 */
function connect(fn, message, cond) {
    return function () {
        var shouldLog = cond ? cond.apply(null, arguments) : true;
        if (shouldLog) {
            call(message);
        }
        var ret = fn.apply(this, arguments);
        if (shouldLog) {
            callEnd();
        }
        return ret;
    };
}
function throwMessage(thrown, code) {
    throw thrown;
}

var onbeforeunloadHandler = function (evt) {
    var MSG = adguard.contentScriptApiFacade.$getMessage('on_navigation_by_popunder');
    evt.returnValue = MSG;
    return MSG;
};
var setBeforeunloadHandler = function () {
    // ToDo: if this is found to be useful, consider making it work on cross-origin iframes
    if (window === window.top) {
        call("Attaching beforeunload event handler");
        window.addEventListener('beforeunload', onbeforeunloadHandler);
        setTimeout(function () {
            window.removeEventListener('beforeunload', onbeforeunloadHandler);
        }, 1000);
        callEnd();
    }
};

/**
 * A polyfill for the WeakMap that covers only the most basic usage.
 * Originally based on {@link https://github.com/Polymer/WeakMap}
 */
var counter = Date.now() % 1e9;
var defineProperty = Object.defineProperty;
var WeakMapPolyfill = /** @class */ (function () {
    function WeakMapPolyfill() {
        this.$name = '__st' + (Math.random() * 1e9 >>> 0) + (counter++ + '__');
    }
    WeakMapPolyfill.prototype.set = function (key, value) {
        var entry = key[this.$name];
        if (entry && entry[0] === key)
            entry[1] = value;
        else
            defineProperty(key, this.$name, { value: [key, value], writable: true });
        return this;
    };
    WeakMapPolyfill.prototype.get = function (key) {
        var entry;
        return (entry = key[this.$name]) && entry[0] === key ?
            entry[1] : undefined;
    };
    WeakMapPolyfill.prototype.delete = function (key) {
        var entry = key[this.$name];
        if (!entry)
            return false;
        var hasValue = entry[0] === key;
        entry[0] = entry[1] = undefined;
        return hasValue;
    };
    WeakMapPolyfill.prototype.has = function (key) {
        var entry = key[this.$name];
        if (!entry)
            return false;
        return entry[0] === key;
    };
    return WeakMapPolyfill;
}());
var nativeWeakMapSupport = typeof WeakMap === 'function';
/**
 * Firefox has a buggy WeakMap implementation as of 58. It won't accept
 * certain objects which are relatively recently added to the engine.
 * {@link https://bugzilla.mozilla.org/show_bug.cgi?id=1391116}
 * {@link https://bugzilla.mozilla.org/show_bug.cgi?id=1351501}
 * A similar error prevents using `AudioBuffer` as a key.
 */
var buggyWeakMapSupport = !nativeWeakMapSupport ? false : (function () {
    if (typeof DOMPoint !== 'function') {
        return false;
    }
    var key = new DOMPoint();
    var weakmap = new WeakMap();
    try {
        weakmap.set(key, undefined); // Firefox 58 throws here.
        return false;
    }
    catch (e) {
        print('Buggy WeakMap support');
        return true;
    }
})();
// To be used in AudioBufferCache

var wm$1 = nativeWeakMapSupport ? WeakMap : WeakMapPolyfill;

var defineProperty$1 = Object.defineProperty;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;



var objectKeys = Object.keys;
var hasOwnProperty = Object.prototype.hasOwnProperty;

var functionApply = Function.prototype.apply;
var functionCall = Function.prototype.call;
var functionBind = Function.prototype.bind;
var functionToString = Function.prototype.toString;
var regexpExec = RegExp.prototype.exec;
var ProxyCtor = window.Proxy;
// Conditional export workaround for tsickle
var reflectNamespace = {};
if (ProxyCtor) {
    reflectNamespace.reflectGetOwnProperty = Reflect.getOwnPropertyDescriptor;
    reflectNamespace.reflectDefineProperty = Reflect.defineProperty;
    reflectNamespace.reflectGet = Reflect.get;
    reflectNamespace.reflectSet = Reflect.set;
    reflectNamespace.reflectDeleteProperty = Reflect.deleteProperty;
    reflectNamespace.reflectOwnKeys = Reflect.ownKeys;
    reflectNamespace.reflectApply = Reflect.apply;
}
var MO$2 = window.MutationObserver || window.WebKitMutationObserver;
var MessageChannelCtor = window.MessageChannel;
var setTimeout$1 = window.setTimeout.bind(window);
var getContentWindow = getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow').get;
var getContentDocument = getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentDocument').get;
var getMessageSource = getOwnPropertyDescriptor(MessageEvent.prototype, 'source').get;
var captureStackTrace = Error.captureStackTrace;

var use_proxy = false;
use_proxy = typeof ProxyCtor !== 'undefined';
/**
 * Why not use Proxy on production version?
 * Using proxy instead of an original object in some places require overriding Function#bind,apply,call,
 * and replacing such native codes into js implies serious performance effects on codes completely unrelated to popups.
 */
/**
 * Issue 102: Keep native RegExp methods.
 * RegExp.prototype.test, even though being a native function,
 * may call third-party code outside our membrane.
 * Instead, we need to use `exec` whenever possible.
 */
var _reflect = ProxyCtor ?
    reflectNamespace.reflectApply :
    (function () {
        /**
         * It is not possible to emulate `Reflect.apply` simply with references to `Function#apply`
         * and such.
         * Instead, we create a random property key, and attach `Function#call` as a
         * non-writable non-enumerable non-configurable property of `Function#apply` and use it
         * to call `Function.prototype.apply.call`.
         * @todo make this success deterministically
         */
        var PRIVATE_PROPERTY;
        do {
            PRIVATE_PROPERTY = Math.random();
        } while (PRIVATE_PROPERTY in functionApply);
        defineProperty$1(functionApply, PRIVATE_PROPERTY, { value: functionCall });
        return function (target, thisArg, args) {
            return functionApply[PRIVATE_PROPERTY](target, thisArg, args);
        };
    })();
// Lodash isNative
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsNative = new RegExp('^' + functionToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
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
    if (fn === functionBind || fn === functionCall || fn === functionApply || fn === functionToString || fn === regexpExec) {
        // This is our assumption. If, for example, another browser extension modifies them before us,
        // It is their responsibility to do so transparently.
        return true;
    }
    var tostr;
    try {
        tostr = _reflect(functionToString, fn, []);
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
    return _reflect(regexpExec, reIsNative, [tostr]) !== null;
};
var proxyToReal = new wm$1();
var realToProxy = new wm$1();
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
    if (_caller !== functionBind && _caller !== functionApply && _caller !== functionCall && isNativeFn(_caller)) {
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
    if (appliedFn !== functionBind && appliedFn !== functionApply && appliedFn !== functionCall && isNativeFn(appliedFn)) {
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
    return use_proxy ? _reflect(target, unproxied, _arguments) : target.apply(unproxied, _arguments);
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
function makeFunctionWrapper(orig, applyHandler) {
    var wrapped;
    var proxy = realToProxy.get(orig);
    if (proxy) {
        return proxy;
    }
    if (use_proxy) {
        wrapped = new ProxyCtor(orig, { apply: applyHandler });
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
    var desc = getOwnPropertyDescriptor(orig, prop);
    if (desc && desc.configurable) {
        desc.value = orig[prop];
        defineProperty$1(wrapped, prop, desc);
    }
}
function _wrapMethod(obj, prop, applyHandler) {
    if (obj.hasOwnProperty(prop)) {
        obj[prop] = makeFunctionWrapper(obj[prop], applyHandler);
    }
}
function _wrapAccessor(obj, prop, getterApplyHandler, setterApplyHandler) {
    var desc = getOwnPropertyDescriptor(obj, prop);
    if (desc && desc.get && desc.configurable) {
        var getter = makeFunctionWrapper(desc.get, getterApplyHandler);
        var setter;
        if (desc.set) {
            setter = makeFunctionWrapper(desc.set, setterApplyHandler);
        }
        defineProperty$1(obj, prop, {
            get: getter,
            set: setter,
            configurable: true,
            enumerable: desc.enumerable
        });
    }
}
function $apply(window) {
    var functionPrototype = window.Function.prototype;
    if (use_proxy) {
        _wrapMethod(functionPrototype, 'bind', applyWithUnproxiedThis);
        _wrapMethod(functionPrototype, 'apply', applyWithUnproxiedThis);
        _wrapMethod(functionPrototype, 'call', applyWithUnproxiedThis);
        _wrapMethod(window.Reflect, 'apply', reflectWithUnproxiedThis);
        _wrapAccessor(window.MessageEvent.prototype, 'source', proxifyReturn);
    }
    _wrapMethod(functionPrototype, 'toString', invokeWithUnproxiedThis);
    _wrapMethod(functionPrototype, 'toSource', invokeWithUnproxiedThis);
}
var ProxyServiceExternalError = /** @class */ (function () {
    function ProxyServiceExternalError(original) {
        this.original = original;
    }
    return ProxyServiceExternalError;
}());
/**
 * Internal errors shall not be re-thrown and will be reported in dev versions.
 */
function reportIfInternalError(error, target) {
    if (error instanceof ProxyServiceExternalError) {
        return true;
    }
    print("Internal error from proxyService:", error);
    print("from a target:", target);
    return false;
}
/**
 * This addresses {@link https://github.com/AdguardTeam/PopupBlocker/issues/91}
 */
var WrappedExecutionContext = /** @class */ (function () {
    function WrappedExecutionContext(orig, thisArg, wrapper) {
        this.orig = orig;
        this.thisArg = thisArg;
        this.wrapper = wrapper;
        this.originalInvoked = false; // friend class ProxyService
        // Can't use this.invokeTarget = this.invokeTarget.bind(this); as it accesses unsafe functions.
        this.invokeTarget = _reflect(functionBind, this.invokeTarget, [this]);
    }
    // Throws ProxyServiceExternalError
    WrappedExecutionContext.prototype.invokeTarget = function (args, thisArg) {
        if (thisArg === void 0) { thisArg = this.thisArg; }
        if (this.originalInvoked) {
            throwMessage("A wrapped target was invoked more than once.", 1);
        }
        this.originalInvoked = true;
        try {
            // Calls `this.orig`, using Reflect.apply when supported.
            return _reflect(this.orig, thisArg, args);
        }
        catch (e) {
            // Errors thrown from target functions are re-thrown.
            if (captureStackTrace) {
                // When possible, strip out inner functions from stack trace
                try {
                    captureStackTrace(e, this.wrapper);
                }
                catch (e) {
                    // `e` thrown from this.orig may not be an instance of error
                    // and in such cases captureStackTrace will throw.
                }
            }
            throw new ProxyServiceExternalError(e);
        }
    };
    return WrappedExecutionContext;
}());
var defaultApplyHandler = function (ctxt, args) {
    return ctxt.invokeTarget(args);
};
function makeSafeFunctionWrapper(orig, applyHandler) {
    if (applyHandler === void 0) { applyHandler = defaultApplyHandler; }
    var wrapped;
    var rawApplyHandler = function (orig, _this, _arguments) {
        var context = new WrappedExecutionContext(orig, _this, wrapped);
        try {
            return applyHandler(context, _arguments);
        }
        catch (error) {
            if (reportIfInternalError(error, orig)) {
                // error is an external error; re-throws it.
                throw error.original;
            }
            // error is an internal error - this is caused by our code, which should be fixed.
            if (!context.originalInvoked) {
                // Try to make up the original call, in order to preserve the contract.
                try {
                    return context.invokeTarget(_arguments);
                }
                catch (error) {
                    if (reportIfInternalError(error, orig)) {
                        // Re-throws an external error.
                        throw error.original;
                    }
                }
            }
        }
    };
    wrapped = makeFunctionWrapper(orig, rawApplyHandler);
    return wrapped;
}
function wrapMethod(obj, prop, applyHandler) {
    if (obj.hasOwnProperty(prop)) {
        obj[prop] = makeSafeFunctionWrapper(obj[prop], applyHandler);
    }
}

/**
 * @fileoverview There are some unfortunate cases where throwing inside a script is necessary
 * for seamless user experience. When a popunder script tries to replicate a window to a popup
 * and navigate the window to some ads landing page, it usually uses methods of `location` object
 * and we cannot add a layer of check on those methods (they are all non-configurable).
 * See https://github.com/AdguardTeam/PopupBlocker/issues/14, nothing prevent from popunder scripts
 * using it at any time. Currently, the only reliable way is to abort script execution on an attempt
 * to open a popup window which must happen before calling `location` methods.
 * To do so, during popup detection, we additionaly checks if the target of the popup is identical
 * to the current window or `href` attribute of a clicked anchor, and triggers aborting in such cases.
 */
var MAGIC;
function abort() {
    closeAllGroup();
    MAGIC = Math.random().toString(36).substr(7);
    console.warn(adguard.contentScriptApiFacade.$getMessage('aborted_popunder_execution'));
    throw new ProxyServiceExternalError(MAGIC);
}

var elementsFromPoint = document.elementsFromPoint || document.msElementsFromPoint;
var getEventPath = (function () {
    var eventPType = Event.prototype;
    var pathDesc = getOwnPropertyDescriptor(eventPType, 'path');
    return pathDesc ? pathDesc.get : eventPType.composedPath;
})();
/**
 * Some popup scripts adds transparent overlays on each of page's links which disappears only when
 * popups are opened. To restore the expected behavior, we need to detect if the event is 'masked'
 * by artificial layers and redirect it to the correct element.

 * examineTarget function examines target and performs operations that are sensitive to the
 * inspected information.
 *
 *  - Neutralizes masks
 *  - Dispatch mouse event to shadowed targets if there was at least one mask above it
 *  - Set beforeunload event handler if target won't trigger navigation
 *  - If "real intended target" is an anchor, having href identical to the "popup url", abort.
 *
 * bubbling
 *    ^
 *    |                                                                   Goal(needsRecovery, not maskLike)
 *    |
 *    |      ⋮
 *    |    el_02                                  ⋮
 *    |    el_01            el_11     el_a1
 *    |   (target = el_00)  el_10  …  el_a0 el_a+10 (=el_a1)
 *                          --------------------------------------------------> ElementsFromPoint
 *
 *  When an element Goal was found, it should neutralize all maskLikes met during the search.
 *
 *  [needsRecovery] IFRAME, A, INPUT, BUTTON, AREA,
 *         has either of: onclick, onmousedown, onmouseup attributes
 *  [maskLike] Let R be the closest stacking context of E.
 *         If R has very high z-index, and E is very empty.
 *         every element between E and R must be invisible or barely be contained in E.
 *         E almost covers T.
 *
 * @todo We may need to prevent `preventDefault` in touch events
 */
var examineTarget = elementsFromPoint ? function (currentEvent, popupHref, popupContext) {
    print('Event is:', currentEvent);
    if (!currentEvent.isTrusted) {
        return;
    }
    var target;
    var x, y;
    if (isMouseEvent(currentEvent)) {
        // mouse event
        print("It is a mouse event");
        target = currentEvent.target;
        x = currentEvent.clientX;
        y = currentEvent.clientY;
    }
    else if (isTouchEvent(currentEvent)) {
        // This is just a stuff. It needs more research.
        target = currentEvent.target;
        var touch = currentEvent.changedTouches[0];
        if (!touch) {
            return;
        }
        x = touch.clientX;
        y = touch.clientY;
    }
    if (!target || !isElement(target)) {
        return;
    }
    /**
     * Use Document#elementsFromPoint API to get a candidate of real target.
     * It is IMPORTANT to call this api on a context where the event is originating from,
     * otherwise the result can be platform-dependent.
     */
    var originDocument = currentEvent.view.document;
    var candidates = elementsFromPoint.call(originDocument, x, y);
    if (!candidates) {
        return;
    }
    print('ElementsFromPoint:', candidates);
    var potentialMaskData = [];
    var candidate = target;
    var result;
    if (candidate !== candidates[0]) {
        print('target has modified within event handlers');
    }
    /**
     * @return true if found a goal; false if we should stop iterating over candidates
     * undefined otherwise;
     */
    var subroutine_forSingleCandidate = function () {
        if (result.hasDefaultEventHandler) {
            if (!result.maskRoot) {
                // this is the candidate. do things with this
                return true;
            }
            // Otherwise, we do maskContentTest and prevent pointer event
            preventPointerEvent(candidate);
        }
        else {
            if (result.maskRoot) {
                // Put this to a list of potential mask elements.
                potentialMaskData.push({
                    maskRoot: result.maskRoot,
                    mask: candidate
                });
            }
            else {
                // Not a needsRecovery, nor a mask,
                // It means we need to quit this
                setBeforeunloadHandler();
                return false;
            }
        }
    };
    subroutine_iterateUntilGoal: {
        // Un-rolling first iteration, to use `event.path` when supported.
        if (getEventPath) {
            candidate = target;
            result = examineEventPath(getEventPath.call(currentEvent));
            var flag = subroutine_forSingleCandidate();
            if (flag === true) {
                break subroutine_iterateUntilGoal;
            }
            else if (flag === false) {
                return;
            }
        }
        for (var i = getEventPath && candidates[0] === target ? 1 : 0, l = candidates.length; i < l; i++) {
            candidate = candidates[i];
            result = examineBubblingPath(candidate);
            var flag = subroutine_forSingleCandidate();
            if (flag === true) {
                break subroutine_iterateUntilGoal;
            }
            else if (flag === false) {
                return;
            }
        }
    }
    // We have a defaultEventHandler, and a several masklikes above it.
    var defaultEventHandlerTarget = result.defaultEventHandlerTarget;
    if (defaultEventHandlerTarget) {
        if (popupContext) {
            popupContext.defaultEventHandlerTarget = defaultEventHandlerTarget;
        }
        if (popupHref === defaultEventHandlerTarget) {
            print("Throwing, because the target url is an href of an eventTarget or its ancestor");
            abort();
        }
    }
    // We first check that those masks are real masks.
    var subroutine_checkMaskData_returnValueBuffer = true;
    subroutine_checkMaskData: {
        if (potentialMaskData.length === 0) {
            subroutine_checkMaskData_returnValueBuffer = false;
            break subroutine_checkMaskData;
        }
        var _a = originDocument.defaultView, w = _a.innerWidth, h = _a.innerHeight;
        var candidateRect = candidate.getBoundingClientRect();
        for (var _i = 0, potentialMaskData_1 = potentialMaskData; _i < potentialMaskData_1.length; _i++) {
            var maskData = potentialMaskData_1[_i];
            if (!maskContentTest(maskData.mask)) {
                subroutine_checkMaskData_returnValueBuffer = false;
                break subroutine_checkMaskData;
            }
            var _b = candidate.getBoundingClientRect(), left = _b.left, right = _b.right, top_1 = _b.top, bottom = _b.bottom;
            if ((numsAreClose(candidateRect.top, top_1, 1) &&
                numsAreClose(candidateRect.left, left, 1) &&
                numsAreClose(candidateRect.bottom, bottom, 1) &&
                numsAreClose(candidateRect.right, right, 1)) || rectAlmostCoversView(candidateRect, w, h)) {
                // All good
            }
            else {
                subroutine_checkMaskData_returnValueBuffer = false;
                break subroutine_checkMaskData;
            }
        }
        // All good
    }
    if (subroutine_checkMaskData_returnValueBuffer) {
        // Neutralize masks
        for (var _c = 0, potentialMaskData_2 = potentialMaskData; _c < potentialMaskData_2.length; _c++) {
            var maskData = potentialMaskData_2[_c];
            preventPointerEvent(maskData.maskRoot);
        }
        var args = initMouseEventArgs.map(function (prop) { return currentEvent[prop]; });
        mainFrameMessagHandler.dispatchMouseEventOnTarget(args, candidate);
    }
} : function () { };
// This can be made less repetitive by using generator functions, but since we have to support IE..
function examineEventPath(path) {
    var maskRoot;
    var hasArtificialStackingContextRoot = false;
    var info;
    for (var i = 0, l = path.length; i < l; i++) {
        var el = path[i];
        if (!isElement(el)) {
            break;
        }
        if (!info || !info.hasDefaultEventHandler) {
            info = getDefaultEventHandlerTarget(el);
        }
        if (!hasArtificialStackingContextRoot && isArtificialStackingContextRoot(el)) {
            hasArtificialStackingContextRoot = true;
            if (maskContentTest(path[0])) {
                maskRoot = el;
            }
        }
    }
    info.maskRoot = maskRoot;
    return info;
}
function examineBubblingPath(el) {
    var maskRoot;
    var hasArtificialStackingContextRoot = false;
    var info;
    var root = el;
    while (el) {
        if (!isElement(el)) {
            break;
        }
        if (!info || !info.hasDefaultEventHandler) {
            info = getDefaultEventHandlerTarget(el);
        }
        if (!hasArtificialStackingContextRoot && isArtificialStackingContextRoot(el)) {
            hasArtificialStackingContextRoot = true;
            if (maskContentTest(root)) {
                maskRoot = el;
            }
        }
        el = el.parentElement;
    }
    info.maskRoot = maskRoot;
    return info;
}
function getDefaultEventHandlerTarget(el) {
    var hasDefaultEventHandler = false;
    var defaultEventHandlerTarget = null;
    var target = closest(el, 'iframe,input,a,area,button,[onclick],[onmousedown],[onmouseup]');
    if (target) {
        hasDefaultEventHandler = true;
        var tagName = getTagName(target);
        if (tagName === 'A' || tagName === 'AREA') {
            defaultEventHandlerTarget = target.href;
        }
    }
    return { hasDefaultEventHandler: hasDefaultEventHandler, defaultEventHandlerTarget: defaultEventHandlerTarget };
}
var preventPointerEvent = function (el) {
    if (!isHTMLElement(el)) {
        return;
    }
    el.style.setProperty('display', "none", important);
    el.style.setProperty('pointer-events', "none", important);
};
var important = 'important';
var examineTarget$1 = connect(examineTarget, 'Examining Target');
var mainFrameMessagHandler;
function installDispatchMouseEventMessageTransferrer(messageHub) {
    var handler = new DispatchMouseEventMessageHandler(messageHub);
    messageHub.on(1 /* DISPATCH_MOUSE_EVENT */, handler);
    if (messageHub === adguard.messageHub) {
        mainFrameMessagHandler = handler;
    }
}
var DispatchMouseEventMessageHandler = /** @class */ (function () {
    function DispatchMouseEventMessageHandler(hub) {
        this.hub = hub;
        this.pressed = false;
    }
    DispatchMouseEventMessageHandler.prototype.handleMessage = function (initMouseEventArgs, source) {
        var clientX = initMouseEventArgs[7];
        var clientY = initMouseEventArgs[8];
        var target = this.hub.hostWindow.document.elementFromPoint(clientX, clientY);
        this.dispatchMouseEventOnTarget(initMouseEventArgs, target);
    };
    DispatchMouseEventMessageHandler.prototype.dispatchMouseEventOnTarget = function (args, target) {
        if (isIFrame(target)) {
            var rect = target.getBoundingClientRect();
            args[7] -= rect.left;
            args[8] -= rect.top;
            args[3] = null; // Window object cannot be cloned
            this.hub.trigger(1 /* DISPATCH_MOUSE_EVENT */, args, getContentWindow.call(target));
        }
        else {
            this.performClickOnTarget(target);
        }
    };
    DispatchMouseEventMessageHandler.prototype.performClickOnTarget = function (target) {
        var _this = this;
        // The purpose of this is to prevent triggering click for both `mousedown` and `click`,
        // or `mousedown` and `mouseup`.
        if (this.pressed) {
            return;
        }
        this.pressed = true;
        setTimeout(function () {
            _this.pressed = false;
        }, 100);
        // Using click(). Manually dispatching a cloned event may not trigger an intended behavior.
        // For example, when a cloned mousedown event is dispatched to a target and a real mouseup
        // event is dispatched to the target, it won't cause a `click` event.
        target.click();
    };
    return DispatchMouseEventMessageHandler;
}());
var initMouseEventArgs = 'type,canBubble,cancelable,view,detail,screenX,screenY,clientX,clientY,ctrlKey,altKey,shiftKey,metaKey,button,relatedTarget'.split(',');

/**
 * Certain pop-up or pop-under scripts creates a transparent anchor covering the entire page
 * on user action. This observer detects it and neutralizes it.
 */
var OverlayAnchorObserver = /** @class */ (function () {
    // within 200 ms after each of user click
    function OverlayAnchorObserver() {
        var _this = this;
        this.lastFired = 0;
        this.callbackTimer = -1;
        this.callback = function (mutations, observer) {
            _this.lastFired = getTime();
            _this.callbackTimer = -1;
            var el = OverlayAnchorObserver.hitTest();
            if (el) {
                OverlayAnchorObserver.preventPointerEventIfOverlayAnchor(el);
            }
        };
        this.clicked = false;
        this.throttledCallback = function (mutations, observer) {
            if (!_this.clicked) {
                return;
            }
            var time = getTime() - _this.lastFired;
            if (_this.callbackTimer !== -1) {
                return;
            }
            if (time > OverlayAnchorObserver.THROTTLE_TIME) {
                _this.callback(mutations, observer);
            }
            else {
                _this.callbackTimer = setTimeout(function () {
                    _this.callback(mutations, observer);
                }, OverlayAnchorObserver.THROTTLE_TIME - time);
            }
        };
        window.addEventListener('mousedown', function (evt) {
            if (evt.isTrusted) {
                _this.clicked = true;
                clearTimeout(_this.clickTimer);
                _this.clickTimer = setTimeout(function () {
                    _this.clicked = false;
                }, OverlayAnchorObserver.OBSERVE_DURATION_AFTER_CLICK);
            }
        }, true);
        if (MO) {
            this.observer = new MO(this.throttledCallback);
            this.observer.observe(document.documentElement, OverlayAnchorObserver.option);
        }
    }
    OverlayAnchorObserver.hitTest = function () {
        var w = window.innerWidth, h = window.innerHeight;
        var el = document.elementFromPoint(w >> 1, h >> 1);
        return el;
    };
    OverlayAnchorObserver.preventPointerEventIfOverlayAnchor = function (el) {
        if (isAnchor(el) && maybeOverlay(el)) {
            print('Found an overlay Anchor, processing it...');
            preventPointerEvent(el);
            return true;
        }
        return false;
    };
    OverlayAnchorObserver.THROTTLE_TIME = 50;
    OverlayAnchorObserver.option = {
        childList: true,
        subtree: true
    };
    OverlayAnchorObserver.OBSERVE_DURATION_AFTER_CLICK = 200; // It react to overlay anchor creation
    return OverlayAnchorObserver;
}());
window.addEventListener('DOMContentLoaded', function () {
    new OverlayAnchorObserver();
});

var TimelineEvent = /** @class */ (function () {
    function TimelineEvent($type, $name, $data) {
        this.$type = $type;
        this.$name = $name;
        this.$data = $data;
        this.$timeStamp = getTime();
    }
    return TimelineEvent;
}());

var reCommonProtocol = /^http/;
/**
 * Parses a url and returns 3 strings.
 * The first string is a `displayUrl`, which will be used to show as
 * a shortened url. The second string is a `canonicalUrl`, which is used to match against whitelist data in storage.
 * The third string is a full absolute url.
 */
var createUrl = function (href) {
    href = convertToString(href);
    var location = createLocation(href);
    var displayUrl, canonicalUrl;
    var protocol = location.protocol;
    if (reCommonProtocol.test(protocol)) {
        displayUrl = location.href.slice(protocol.length + 2);
        canonicalUrl = location.hostname;
    }
    else {
        displayUrl = href;
        var i = href.indexOf(',');
        canonicalUrl = i === -1 ? href : href.slice(0, i);
    }
    return [displayUrl, canonicalUrl, location.href];
};
/**
 * There are certain browser quirks regarding how they treat non-string values
 * provided as arguments of `window.open`, and we can't rely on third-party scripts
 * playing nicely with it.
 * undefined --> 'about:blank'
 * null --> 'about:blank', except for Firefox, in which it is converted to 'null'.
 * false --> 'about:blank', except for Edge, in which it is converted to 'false'.
 * These behaviors are different from how anchor tag's href attributes behaves with non-string values.
 */
var convertToString = function (href) {
    if (typeof href !== 'string') {
        if (href instanceof Object) {
            href = String(href);
        }
        else {
            href = '';
        }
    }
    return href;
};
var ABOUT_PROTOCOL$1 = 'about:';
/**
 * Creates an object that implements properties of Location api.
 * It resolves the provided href within a context of a current browsing context.
 */
var createLocation = function (href) {
    var anchor = document.createElement('a');
    anchor.href = href;
    // https://gist.github.com/disnet/289f113e368f1bfb06f3
    if (anchor.host == "") {
        anchor.href = anchor.href;
    }
    return anchor;
};
/**
 * Determines whether 2 contexts A and B are in the same origin.
 * @param url_A absolute or relative url of the context A
 * @param location_B location object of the context B
 * @param domain_B `document.domain` of the context B
 */
function isSameOrigin(url_A, location_B, domain_B) {
    var location_A = createLocation(url_A);
    if (location_A.protocol === 'javascript:' || location_A.href === 'about:blank') {
        return true;
    }
    if (location_A.protocol === 'data:') {
        return false;
    }
    return location_A.hostname === domain_B && location_A.port === location_B.port && location_A.protocol === location_B.protocol;
}

var mockObject = function (orig, mocked) {
    mocked = mocked || {};
    for (var prop in orig) {
        var desc = getOwnPropertyDescriptor(orig, prop);
        if (desc) {
            switch (typeof desc.value) {
                case 'undefined':
                    break;
                case 'object':
                    mocked[prop] = {};
                    break;
                case 'function':
                    mocked[prop] = function () { return true; };
                    break;
                default:
                    mocked[prop] = orig[prop];
            }
        }
    }
    return mocked;
};
var hrefDesc = getOwnPropertyDescriptor(HTMLAnchorElement.prototype, 'href');
var mockedWindowCollection = new wm$1();
var mockWindow = function (href, name, proxyService) {
    var win, doc;
    win = mockObject(window);
    mockObject(Window.prototype, win);
    doc = mockObject(document);
    mockObject(Document.prototype, doc);
    win['opener'] = window;
    win['closed'] = false;
    win['name'] = name;
    win['document'] = doc;
    doc['open'] = function () { return this; };
    doc['write'] = function () { };
    doc['writeln'] = function () { };
    doc['close'] = function () { };
    var loc = mockLocation(href, proxyService);
    var locDesc = {
        get: function () { return loc; },
        set: function () { },
        configurable: true
    };
    defineProperty$1(win, _location, locDesc);
    defineProperty$1(doc, _location, locDesc);
    mockedWindowCollection.set(win, true);
    return win;
};
var mockLocation = function (href, proxyService) {
    var a = createLocation(href);
    a[_assign] = a[_replace] = hrefDesc.set;
    defineProperty$1(a, _href, hrefDesc);
    return a;
};
var _location = 'location';
var _assign = 'assign';
var _replace = 'replace';
var _href = 'href';

var LoggedProxyService = /** @class */ (function () {
    function LoggedProxyService(timeline, framePosition) {
        this.timeline = timeline;
        this.framePosition = framePosition;
    }
    LoggedProxyService.prototype.makeLoggedFunctionWrapper = function (orig, type, name, applyHandler, option) {
        var _this = this;
        if (applyHandler === void 0) { applyHandler = defaultApplyHandler; }
        return makeSafeFunctionWrapper(orig, function (execCtxt, _arguments) {
            var context = {};
            var thisArg = execCtxt.thisArg;
            var data;
            if (typeof option == 'undefined' || option(orig, thisArg, _arguments)) {
                data = {
                    thisOrReceiver: thisArg,
                    arguments: _arguments,
                    externalContext: context
                };
            }
            // Must register the event to a timeline after invoking the applyHandler.
            var ret = applyHandler(execCtxt, _arguments, context);
            data && _this.timeline.registerEvent(new TimelineEvent(type, name, data), _this.framePosition);
            return ret;
        });
    };
    LoggedProxyService.prototype.wrapMethod = function (obj, prop, applyHandler, option) {
        if (obj.hasOwnProperty(prop)) {
            obj[prop] = this.makeLoggedFunctionWrapper(obj[prop], 1 /* APPLY */, prop, applyHandler, option);
        }
    };
    LoggedProxyService.prototype.wrapAccessor = function (obj, prop, getterApplyHandler, setterApplyHandler, option) {
        var desc = getOwnPropertyDescriptor(obj, prop);
        if (desc && desc.get && desc.configurable) {
            var getter = this.makeLoggedFunctionWrapper(desc.get, 2 /* GET */, prop, getterApplyHandler, option);
            var setter;
            if (desc.set) {
                setter = this.makeLoggedFunctionWrapper(desc.set, 3 /* SET */, prop, setterApplyHandler, option);
            }
            defineProperty$1(obj, prop, {
                get: getter,
                set: setter,
                configurable: true,
                enumerable: desc.enumerable
            });
        }
    };
    /**
     * Below methods are used only for `makeObjectProxy` method. For builds with `NO_PROXY`, they
     * are not used by any other code, so it is stripped out in those builds.
     */
    LoggedProxyService.prototype.get = function (target, prop, receiver) {
        var _receiver = proxyToReal.get(receiver) || receiver;
        var data = { thisOrReceiver: _receiver };
        this.timeline.registerEvent(new TimelineEvent(2 /* GET */, prop, data), this.framePosition);
        var value = reflectNamespace.reflectGet(target, prop, _receiver);
        if (isNativeFn(value)) {
            return makeFunctionWrapper(value, invokeWithUnproxiedThis);
        }
        else if ((prop === 'location' && mockedWindowCollection.get(target)) ||
            (isLocation(value) || isWindow(value))) {
            // We deep-proxy such objects.
            // Such `value` objects won't be used as arguments of built-in functions, which may
            // depend on internal slots of its arguments.
            // For instance, `createNodeIterator` does not work if its first arguments is a proxied `Node` instance.
            // Fix https://github.com/AdguardTeam/PopupBlocker/issues/52
            // We should not deep-proxy when it is impossible to return proxy
            // due to invariants imposed to `Proxy`.
            // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
            var desc = reflectNamespace.reflectGetOwnProperty(target, prop);
            if (desc && desc.writable === false && desc.configurable === false) {
                return value;
            }
            return this.makeObjectProxy(value);
        }
        else {
            return value;
        }
    };
    LoggedProxyService.prototype.set = function (target, prop, value, receiver) {
        var _receiver = proxyToReal.get(receiver) || receiver;
        var data = {
            thisOrReceiver: _receiver,
            arguments: [value]
        };
        this.timeline.registerEvent(new TimelineEvent(3 /* SET */, prop, data), this.framePosition);
        return reflectNamespace.reflectSet(target, prop, value, _receiver);
    };
    LoggedProxyService.prototype.makeObjectProxy = function (obj) {
        if (!use_proxy || obj === null || typeof obj !== 'object') {
            return obj;
        }
        var proxy = realToProxy.get(obj);
        if (proxy) {
            return proxy;
        }
        proxy = new ProxyCtor(obj, this);
        realToProxy.set(obj, proxy);
        proxyToReal.set(proxy, obj);
        return proxy;
    };
    return LoggedProxyService;
}());

/**
 * If an empty iframe which does not have an associacted http request tries to open a popup
 * within a time specified by this constant, it will be blocked.
 */
var TIME_MINIMUM_BEFORE_POPUP = 200;
var createOpen = function (index, events) {
    print('index:', index);
    var evt = events[index][0];
    if (evt.$type == 0 /* CREATE */ && getTime() - evt.$timeStamp < TIME_MINIMUM_BEFORE_POPUP) {
        print("time difference is less than a threshold");
        /**
         * A test here is meant to block attempts to call window.open from iframes which
         * was created later than 200 milliseconds ago. Such techniques are mostly used
         * by popup/popunder scripts on Firefox.
         *
         * In an issue https://github.com/AdguardTeam/PopupBlocker/issues/63, a pop-up
         * window of Google Hangout is created with chrome-extension://... url, and it
         * contains an iframe having domain hangouts.google.com, and inside it it immediately
         * calls window.open with empty url in order to obtain reference to certain browsing
         * context.
         *
         * A delicate issue revealed by https://github.com/AdguardTeam/PopupBlocker/issues/98
         * is that such a meant-to-be empty iframe can have non-empty `location` object.
         * This is caused by `document.open`, which is in effect identical to performing another
         * navigation, i.e. replacing associated `document` object, setting location from
         * initiating origin, etc. I refer to
         * {@link https://bugs.chromium.org/p/chromium/issues/detail?id=742049} for more info.
         *
         * Therefore, we take advantage of `performance.timing` api to determine whether the
         * empty iframe has an associated HTTP request.
         */
        var browsingContext = evt.$data.thisOrReceiver;
        print("testing context is: ", browsingContext);
        var isSameOriginChildContext = browsingContext.frameElement !== null;
        if (isSameOriginChildContext) {
            var timing = browsingContext.performance.timing;
            var fetchStart = timing.fetchStart, responseEnd = timing.responseEnd;
            if (fetchStart === 0 || fetchStart === responseEnd) {
                return false;
            }
        }
    }
    return true;
};
var createOpen$1 = connect(createOpen, 'Performing create test');

var aboutBlank = function (index, events) {
    // if there is a blocked popup within 100 ms, do not allow opening popup with url about:blank.
    // It is a common technique used by popunder scripts on FF to regain focus of the current window.
    var latestOpenEvent = events[index][events[index].length - 1];
    var now = latestOpenEvent.$timeStamp;
    if (latestOpenEvent.$type === 1 /* APPLY */ && latestOpenEvent.$name === 'open' && isEmptyUrl(convertToString(latestOpenEvent.$data.arguments[0]))) {
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
                    if (event_1.$data.externalContext.mocked) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
};
var aboutBlank$1 = connect(aboutBlank, 'Performing aboutBlank test');

/**
 * If a popup/popunder script tries to navigate a popup window to a target a link on which
 * a user has clicked within an interval specified by this constant, it will abort script execution.
 */
var NAVIGATION_TIMING_THRESOLD = 200;
var navigatePopupToItself = function (index, events, incoming) {
    var $type = incoming.$type;
    var $name = incoming.$name;
    if ((($name === 'assign' || $name === 'replace') && $type === 1 /* APPLY */) ||
        (($name === 'location' || $name === 'href') && $type === 3 /* SET */)) {
        var currentHref = location.href; // ToDo: Consider making this work on empty iframes
        var incomingData = incoming.$data;
        var newLocation = String(incomingData.arguments[0]);
        var thisArg = incomingData.thisOrReceiver;
        if (newLocation === currentHref) {
            // Performs a check that it is a modification of a mocked object.
            // Non-determinism here is inevitable, due to our decoupled approach in timeline implementation.
            // This may be improved in future.
            if ((incoming.$name === 'location' && !isWindow(thisArg)) ||
                !isLocation(thisArg)) {
                print('navigatePopupToItself - tried to navigate a blocked popup to itself');
                abort();
            }
        }
        // Look up a recent event record for a blocked popup
        var currentFrameRecords = events[index];
        var l = currentFrameRecords.length;
        while (l--) {
            var evt = currentFrameRecords[l];
            if (incoming.$timeStamp - evt.$timeStamp > NAVIGATION_TIMING_THRESOLD) {
                // Do not lookup too old event
                break;
            }
            var context_1 = evt.$data.externalContext; // supposedly
            if (context_1 && context_1.mocked &&
                context_1.defaultEventHandlerTarget === newLocation) {
                print('navigatePopupToItself - tried to navigate a blocked popup to a target of a recently blocked popup initiator');
                abort();
            }
        }
    }
    return true;
};

var beforeTest = [createOpen$1, aboutBlank$1];
var afterTest = [navigatePopupToItself];
var EVENT_RETENTION_LENGTH = 5000;
var Timeline = /** @class */ (function () {
    function Timeline() {
        this.events = [];
        this.isRecording = false;
    }
    /**
     * When an event is registered, it performs some checks by calling functions of type `condition`
     * which accepts an existing events as a first argument, and an incoming event as a second argument.
     * An object at which the event is happened is included in the event as a `data` property,
     * and such functions can act on it appropriately, for example, it can close a popup window.
     */
    Timeline.prototype.registerEvent = function (event, index) {
        if (this.isRecording) {
            var name_1 = event.$name ? event.$name.toString() : '';
            print("Timeline.registerEvent: " + event.$type + " " + name_1, event.$data);
        }
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
    Timeline.prototype.onNewFrame = function (window) {
        var pos = this.events.push([]) - 1;
        // Registers a unique event when a frame is first created.
        // It passes the `window` object of the frame as a value of `$data` property.
        this.registerEvent(new TimelineEvent(0 /* CREATE */, undefined, {
            thisOrReceiver: window
        }), pos);
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
    Timeline.prototype['startRecording'] = function () {
        this.isRecording = true;
    };
    /**
     * Returns an array. Its elements corresponds to frames to which the current window
     * has access, and the first element corresponds to the current window.
     */
    Timeline.prototype['takeRecords'] = function () {
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
var timeline = new Timeline();
// These are called from the outside of the code, so we have to make sure that call structures of those are not modified.
// It is removed in minified builds, see the gulpfile.
/** @suppress {uselessCode} */
function cc_export() {
    ;
}
cc_export();
window['__t'] = timeline;

var CurrentMouseEvent = /** @class */ (function () {
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
 * @fileoverview Current popup detection mechanism relies heavily on `Event#currentTarget`,
 * and some JS frameworks that use event delegation tend to hide event listeners' intended target.
 * For popular frameworks among such, we attempt to utilize frameworks' specifics to provide
 * a way to retrieve an intended target, or at least detect it in order to reduce false-positives.
 * Such workarounds are not very robust, hence 'attempt', but it will still provide huge benefit to users.
 */
/**
 * The above was not enough for many cases, mostly because event handlers can be attached in
 * strict context and Function.arguments can be mutated in function calls.
 *
 * Below we patch jQuery internals to create a mapping of native events and jQuery events.
 * jQuery sets `currentTarget` property on jQuery event instances while triggering event handlers.
 */
var JQueryEventStack$1 = /** @class */ (function () {
    function JQueryEventStack(jQuery) {
        var _this = this;
        this.jQuery = jQuery;
        this.eventMap = new wm$1();
        this.eventStack = [];
        /**
         * Wraps jQuery.event.dispatch.
         * It is used in jQuery to call event handlers attached via $(..).on and such,
         * in case of native events and $(..).trigger().
         */
        this.dispatchApplyHandler = function (ctxt, _arguments) {
            var event = _arguments[0];
            _this.eventStack.push(event);
            try {
                return ctxt.invokeTarget(_arguments);
            }
            finally {
                // Make sure that the eventStack is cleared up even if a dispatching fails.
                _this.eventStack.pop();
            }
        };
        /**
         * Wraps jQuery.event.fix
         */
        this.fixApplyHandler = function (ctxt, _arguments) {
            var event = _arguments[0];
            var ret = ctxt.invokeTarget(_arguments);
            if (_this.isNativeEvent(event)) {
                if ((isMouseEvent(event) && isClickEvent(event)) || isTouchEvent(event)) {
                    _this.eventMap.set(event, ret);
                }
            }
            return ret;
        };
    }
    JQueryEventStack.initialize = function () {
        // Attempts to patch before any other page's click event handler is executed.
        window.addEventListener('mousedown', JQueryEventStack.attemptPatch, true);
        window.addEventListener('touchstart', JQueryEventStack.attemptPatch, true);
    };
    JQueryEventStack.getCurrentJQueryTarget = function (event) {
        var jQueries = JQueryEventStack.jQueries;
        for (var i = 0, l = jQueries.length; i < l; i++) {
            var jQuery_1 = jQueries[i];
            var stack = JQueryEventStack.jqToStack.get(jQuery_1);
            if (isUndef(stack)) {
                continue;
            }
            var currentTarget = stack.getNestedTarget(event);
            if (!currentTarget) {
                continue;
            }
            return currentTarget;
        }
    };
    JQueryEventStack.attemptPatch = function () {
        var jQuery = JQueryEventStack.detectionHeuristic();
        if (isUndef(jQuery)) {
            return;
        }
        if (JQueryEventStack.jQueries.indexOf(jQuery) !== -1) {
            return;
        }
        var eventMap = new wm$1();
        JQueryEventStack.jQueries.push(jQuery);
        JQueryEventStack.jqToStack.set(jQuery, new JQueryEventStack(jQuery).wrap());
    };
    JQueryEventStack.detectionHeuristic = function () {
        var jQuery = window['jQuery'] || window['$'];
        if (typeof jQuery !== 'function') {
            return;
        }
        if (!('noConflict' in jQuery)) {
            return;
        }
        // Test for private property
        if (!('_data' in jQuery)) {
            return;
        }
        return jQuery;
    };
    JQueryEventStack.prototype.isNativeEvent = function (event) {
        return event && typeof event === 'object' && !event[this.jQuery.expando];
    };
    JQueryEventStack.prototype.getRelatedJQueryEvent = function (event) {
        return this.eventMap.get(event);
    };
    JQueryEventStack.noConflictApplyHandler = function (ctxt, _arguments) {
        var deep = _arguments[0];
        ctxt.invokeTarget(_arguments);
        if (deep === true) {
            // Patch another jQuery instance exposed to window.jQuery.
            JQueryEventStack.attemptPatch();
        }
    };
    JQueryEventStack.prototype.wrap = function () {
        var jQuery = this.jQuery;
        wrapMethod(jQuery.event, 'dispatch', this.dispatchApplyHandler);
        wrapMethod(jQuery.event, 'fix', this.fixApplyHandler);
        wrapMethod(jQuery, 'noConflict', JQueryEventStack.noConflictApplyHandler);
        return this;
    };
    /**
     * Performs a smart detection of `currentTarget`.
     * Getting it from the current `window.event`'s related jQuery.Event is not sufficient;
     * See {@link https://github.com/AdguardTeam/PopupBlocker/issues/90}.
     *
     * This is a heuristic to determine an 'intended target' that is useful in detection of
     * unwanted popups; It does not claim to be a perfect solution.
     */
    JQueryEventStack.prototype.getNestedTarget = function (event) {
        var eventStack = this.eventStack;
        if (eventStack.length === 0) {
            return;
        }
        // The root event must be of related to provided event.
        var root = this.getRelatedJQueryEvent(event);
        if (eventStack.indexOf(event) === -1 && eventStack.indexOf(root) === -1) {
            return;
        }
        /********************************************************************************************
           
            If there are remaining events in the stack, and the next nested event is "related"
            to the current event, we take it as a "genuine" event that is eligible to extract
            currentTarget information.
            Why test "related"ness? Suppose a third-party script adds event listeners like below:

              $(document).on('click', () => { $(hiddenElement).trigger('click'); });
              $(hiddenElement).on('click', () => { openPopup(); } );

            We need to take `document` as a "genuine" target in such cases. As such,
            despite some theoretical possibilities, we take a leap of faith "that only real-world
            re-triggering that preserves the intention of user input are those which triggers
            event on the target itself again or on its descendent nodes".

        **/
        var current = root;
        for (var i = 1, l = eventStack.length; i < l; i++) {
            var next = eventStack[i];
            // prev event is related to next event
            // only if next.target contains current.target.
            var nextTarget = next.target;
            if (isNode(nextTarget)) {
                if (targetsAreChainable(current.target, nextTarget)) {
                    current = this.isNativeEvent(next) ? this.getRelatedJQueryEvent(next) : next;
                    continue;
                }
                else {
                    break;
                }
            }
            else if (isWindow(nextTarget)) {
                return nextTarget;
            }
            else {
                // If a target of a jQuery event is not a node nor window,
                // it is not what we are expecting for.
                return;
            }
        }
        return current.currentTarget;
    };
    JQueryEventStack.jQueries = [];
    JQueryEventStack.jqToStack = new wm$1();
    return JQueryEventStack;
}());
JQueryEventStack$1.initialize();
var getCurrentJQueryTarget = JQueryEventStack$1.getCurrentJQueryTarget;
/**
 * React production build by default attaches an event listener to `document`
 * and processes all events in its internel 'event hub'. It should be possible
 * to retrieve information about the intended target component or target element
 * technically, but for now, we instead fallback to allowing events whose `currentTarget`
 * is `document`. It needs to be improved if it causes missed popups on websites
 * which use react and popups at the same time, or it is challenged by popup scripts.
 */
// When `window.__REACT_DEVTOOLS_GLOBAL_HOOK__` property exists, react will access and call
// some of its methods. We use it as a hack to detect react instances.
// We can always harden this by replicating the `hook` object here, at a cost of maintainance burden.
function isInOfficialDevtoolsScript() {
    if (document.head) {
        return false;
    }
    var script = document.currentScript;
    if (!script) {
        return false;
    }
    var textContent = script.textContent;
    // https://github.com/facebook/react-devtools/blob/master/backend/installGlobalHook.js#L147
    if (textContent.indexOf('^_^') !== -1) {
        return true;
    }
    return false;
}
var HOOK_PROPERTY_NAME = '__REACT_DEVTOOLS_GLOBAL_HOOK__';
var accessedReactInternals = false;
if (!hasOwnProperty.call(window, HOOK_PROPERTY_NAME)) {
    var tempValue_1 = {
        // Create a dummy function for preact compatibility
        // https://github.com/AdguardTeam/PopupBlocker/issues/119
        "inject": function () { }
    }; // to be used as window.__REACT_DEVTOOLS_GLOBAL_HOOK__
    defineProperty$1(tempValue_1, 'isDisabled', {
        get: function () {
            accessedReactInternals = true;
            // Signals that a devtools is disabled, to minimize possible breakages.
            // https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberDevToolsHook.js#L40
            return true;
        },
        set: function () { }
    });
    defineProperty$1(window, HOOK_PROPERTY_NAME, {
        get: function () {
            if (isInOfficialDevtoolsScript()) {
                return undefined; // So that it re-defines the property
            }
            return tempValue_1;
        },
        set: function (i) { },
        configurable: true // So that react-devtools can re-define it
    });
}
var reactRootSelector = '[data-reactroot]';
var reactIdSelector = '[data-reactid]';
function isReactInstancePresent() {
    if (!!document.querySelector(reactRootSelector) || !!document.querySelector(reactIdSelector)) {
        return true;
    }
    if (accessedReactInternals) {
        return true;
    }
    // Otherwise, react-devtools could have overridden the hook.
    var hook = window[HOOK_PROPERTY_NAME];
    if (typeof hook !== 'object') {
        return false;
    }
    var _renderers = hook["_renderers"];
    if (typeof _renderers !== 'object' || _renderers === null) {
        return false;
    }
    if (objectKeys(_renderers).length === 0) {
        return false;
    }
    return true;
}
/**
 * https://github.com/google/jsaction
 */
function jsActionTarget(event) {
    var target = event.target;
    if (isElement(target)) {
        var type = event.type;
        var possibleTarget = closest(target, "[jsaction*=\"" + type + ":\"]");
        if (possibleTarget && possibleTarget.hasOwnProperty('__jsaction')) {
            var action = possibleTarget['__jsaction'];
            if (action.hasOwnProperty(type)) {
                return possibleTarget;
            }
        }
    }
}
var reGtmWindowName = /^gtm\_autoEvent/;
var gtmScriptTagSelector = 'script[src*="googletagmanager.com/gtm.js"]';
var defaultGtmVariableName = 'dataLayer';
var reGTMVariableName = /[\?&]l=([^&]*)(?:&|$)/;
var gtmLinkClickEventName = 'gtm.linkClick';
/**
 * Google Tag Manager can be configured to fire tags upon link clicks, and in certian cases,
 * gtm script calls `window.open` to simulate a click on an anchor tag.
 * such call occurs inside of an event handler attached to `document`, so it is considered
 * suspicious by `verifyEvent`.
 * This function performs a minimal check of whether the `open` call is triggered by gtm.
 * See: https://github.com/AdguardTeam/PopupBlocker/issues/36
 */
function isGtmSimulatedAnchorClick(event, windowName) {
    if (!reGtmWindowName.test(windowName)) {
        return false;
    }
    if (event.eventPhase !== 3 /* Event.BUBBLING_PHASE */) {
        return false;
    }
    // Locate googletagManager script
    var scriptTags = document.querySelectorAll(gtmScriptTagSelector);
    var l = scriptTags.length;
    if (l === 0) {
        return false;
    }
    while (l--) {
        var scriptTag = scriptTags[l];
        var src = scriptTag.src;
        var gtmVariableName = defaultGtmVariableName;
        var match = reGTMVariableName.exec(src);
        if (match) {
            gtmVariableName = match[1];
        }
        var dataLayer = window[gtmVariableName];
        if (!dataLayer) {
            continue;
        }
        var latestEvent = dataLayer[dataLayer.length - 1];
        if (latestEvent && latestEvent.event == gtmLinkClickEventName) {
            return true;
        }
    }
    return false;
}

/**
 * On IE 10 and lower, window.event is a `MSEventObj` instance which does not implement `target` property.
 * We use a polyfill for such cases.
 */
var supported = 'event' in window && (!('documentMode' in document) || (document.documentMode === 11));
var currentMouseEvent;
if (!supported) {
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
    if (supported) {
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
            var touched = new wm$1();
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
var verifyEvent = connect(function (event) {
    if (event) {
        if ((!isMouseEvent(event) || !isClickEvent(event)) && !isTouchEvent(event)) {
            return true;
        }
        var currentTarget = event.currentTarget;
        if (currentTarget) {
            print('Event is:', event);
            print('currentTarget is: ', currentTarget);
            if (eventTargetIsRootNode(currentTarget)) {
                var eventPhase = event.eventPhase;
                print('Phase is: ' + eventPhase);
                // Workaround for jsaction
                var maybeJsActionTarget = jsActionTarget(event);
                if (maybeJsActionTarget) {
                    print('maybeJsActionTarget');
                    if (eventTargetIsRootNode(maybeJsActionTarget)) {
                        return false;
                    }
                    else {
                        print('jsActionTarget is not a root');
                        return true;
                    }
                }
                if (eventPhase === 1 /* Event.CAPTURING_PHASE */ || eventPhase === 2 /* Event.AT_TARGET */) {
                    print('VerifyEvent - the current event handler is suspicious, for the current target is either window, document, html, or body.');
                    return false;
                }
                else {
                    print('VerifyEvent - the current target is document/html/body, but the event is in a bubbling phase.');
                    // Workaround for jQuery
                    var jQueryTarget = getCurrentJQueryTarget(event);
                    if (jQueryTarget) {
                        print('jQueryTarget exists: ', jQueryTarget);
                        // Performs the check with jQueryTarget again.
                        if (eventTargetIsRootNode(jQueryTarget) || (isElement(jQueryTarget) && maybeOverlay(jQueryTarget))) {
                            return false;
                        }
                    }
                    else if (!isReactInstancePresent() || (isNode(currentTarget) && getTagName(currentTarget) !== '#DOCUMENT')) {
                        // Workaround for React
                        return false;
                    }
                }
                // When an overlay is being used, checking for useCapture is not necessary.
            }
            else if (isElement(currentTarget) && maybeOverlay(currentTarget)) {
                print('VerifyEvent - the current event handler is suspicious, for the current target looks like an artificial overlay.');
                return false;
            }
        }
    }
    return true;
}, 'Verifying event', function () { return arguments[0]; });

/**
 * @fileoverview Certain popunder scripts exploits chrome pdf plugin to gain focus of a window.
 * The purpose of this mutation observer is to detect an insertion of pdf document during a short time
 * after a popup is blocked, and neutralize it.
 * Without this, a prompt window "Please wait..." can be displayed. This can also be prevented by
 * aborting a popunder script's execution, but I suppose this is a more gentle way.
 */
var PdfObjectObserver = /** @class */ (function () {
    function PdfObjectObserver() {
        this.lastActivated = 0;
        this.callback = connect(function (mutations, observer) {
            print('mutations:', mutations);
            var i = mutations.length;
            while (i--) {
                var mutation = mutations[i];
                var addedNodes = mutation.addedNodes;
                if (addedNodes) {
                    var j = addedNodes.length;
                    while (j-- > 0) {
                        var addedNode = addedNodes[j];
                        if (isElement(addedNode)) {
                            var objectNodes = addedNode.querySelectorAll(PdfObjectObserver.pdfObjectSelector);
                            if (objectNodes) {
                                var k = objectNodes.length;
                                while (k-- > 0) {
                                    var objectNode = objectNodes[k];
                                    PdfObjectObserver.neutralizeDummyPdf(objectNode);
                                }
                            }
                        }
                    }
                }
            }
        }, 'pdfObjectObserver callback fired');
        if (MO)
            this.observer = new MO(this.callback);
    }
    PdfObjectObserver.prototype.$start = function () {
        var _this = this;
        if (this.observer && this.lastActivated === 0) {
            var docEl = document.documentElement;
            this.observer.observe(docEl, PdfObjectObserver.option);
            print('MO started at ' + getTime());
            this.lastActivated = getTime();
        }
        setTimeout(function () {
            print('MO stopped at ' + getTime());
            _this.stop();
        }, PdfObjectObserver.OBSERVE_TIME);
    };
    PdfObjectObserver.prototype.stop = function () {
        if (this.observer && this.lastActivated !== 0) {
            this.observer.disconnect();
            this.lastActivated = 0;
        }
    };
    PdfObjectObserver.OBSERVE_TIME = 500;
    PdfObjectObserver.pdfObjectSelector = 'object[data^="data:application/pdf"]';
    PdfObjectObserver.option = {
        childList: true,
        subtree: true
    };
    PdfObjectObserver.neutralizeDummyPdf = function (el) {
        el.removeAttribute('data');
    };
    return PdfObjectObserver;
}());
var pdfObjObserver = new PdfObjectObserver();

function onBlocked(popup_url, currentEvent, popupContext) {
    if (!adguard.contentScriptApiFacade.originIsSilenced()) {
        adguard.messageHub.trigger(0 /* SHOW_NOTIFICATION */, {
            orig_domain: adguard.contentScriptApiFacade.domain,
            popup_url: popup_url
        }, adguard.messageHub.parent);
    } // Otherwise, we silently block popups
    pdfObjObserver.$start();
    if (currentEvent) {
        examineTarget$1(currentEvent, popup_url, popupContext);
    }
}
function installAlertMessageTransferrer(messageHub) {
    var handler = messageHub.isTop ? {
        handleMessage: function (data) {
            adguard.contentScriptApiFacade.showAlert(data.orig_domain, data.popup_url);
        }
    } : new FrameAlertMessageHandler(messageHub);
    messageHub.on(0 /* SHOW_NOTIFICATION */, handler);
}
var FrameAlertMessageHandler = /** @class */ (function () {
    function FrameAlertMessageHandler(messageHub) {
        this.messageHub = messageHub;
    }
    FrameAlertMessageHandler.prototype.handleMessage = function (data, source) {
        this.messageHub.trigger(0 /* SHOW_NOTIFICATION */, data, this.messageHub.parent);
    };
    return FrameAlertMessageHandler;
}());

function wrapOpen(window, proxyService) {
    var openVerifiedWindow = function (execContext, _arguments, externalContext) {
        if (adguard.contentScriptApiFacade.originIsWhitelisted()) {
            return execContext.invokeTarget(_arguments);
        }
        var targetHref = _arguments[0];
        call('Called window.open with url ' + targetHref);
        var url = createUrl(targetHref);
        var destDomain = url[1];
        if (adguard.contentScriptApiFacade.originIsWhitelisted(destDomain)) {
            print("The domain " + destDomain + " is in whitelist.");
            return execContext.invokeTarget(_arguments);
        }
        var currentEvent = retrieveEvent();
        var win;
        verification: {
            var passed = verifyEvent(currentEvent);
            if (!passed) {
                if (!isGtmSimulatedAnchorClick(currentEvent, _arguments[1])) {
                    break verification;
                }
            }
            print('event verified, inquiring event timeline..');
            if (!timeline.canOpenPopup(proxyService.framePosition)) {
                print('canOpenPopup returned false');
                break verification;
            }
            print('calling original window.open...');
            win = execContext.invokeTarget(_arguments);
            win = proxyService.makeObjectProxy(win);
            callEnd();
            return win;
        }
        externalContext.mocked = true;
        onBlocked(url[2], currentEvent, externalContext);
        print('mock a window object');
        // Return a mock window object, in order to ensure that the page's own script does not accidentally throw TypeErrors.
        win = mockWindow(_arguments[0], _arguments[1], proxyService);
        win = proxyService.makeObjectProxy(win);
        callEnd();
        return win;
    };
    proxyService.wrapMethod(window, 'open', openVerifiedWindow);
    proxyService.wrapMethod(window.Window.prototype, 'open', openVerifiedWindow); // for IE
}

var clickVerified = function (execContext, _arguments) {
    var _this = execContext.thisArg;
    if (isAnchor(_this)) {
        print('click() was called on an anchor tag', _this);
        if (adguard.contentScriptApiFacade.originIsWhitelisted()) {
            return execContext.invokeTarget(_arguments);
        }
        // Checks if an url is in a whitelist
        var url = createUrl(_this.href);
        var destDomain = url[1];
        if (adguard.contentScriptApiFacade.originIsWhitelisted(destDomain)) {
            print("The domain " + destDomain + " is in whitelist.");
            return execContext.invokeTarget(_arguments);
        }
        var currentEvent = retrieveEvent();
        if (!verifyEvent(currentEvent)) {
            print('It did not pass the test, not clicking element');
            onBlocked(url[2], currentEvent);
            return;
        }
    }
    return execContext.invokeTarget(_arguments);
};
function wrapClick(window, proxyService) {
    proxyService.wrapMethod(window.HTMLElement.prototype, 'click', connect(clickVerified, 'Verifying click'));
}

var dispatchVerifiedEvent = function (execContext, _arguments) {
    var _this = execContext.thisArg;
    var evt = _arguments[0];
    if (isMouseEvent(evt) && isClickEvent(evt) && isNode(_this) && isAnchor(_this) && !evt.isTrusted) {
        call('It is a MouseEvent on an anchor tag.');
        print('dispatched event is:', evt);
        if (adguard.contentScriptApiFacade.originIsWhitelisted()) {
            return execContext.invokeTarget(_arguments);
        }
        // Checks if an url is in a whitelist
        var url = createUrl(_this.href);
        var destDomain = url[1];
        if (adguard.contentScriptApiFacade.originIsWhitelisted(destDomain)) {
            print("The domain " + destDomain + " is in whitelist.");
            return execContext.invokeTarget(_arguments);
        }
        var currentEvent = retrieveEvent();
        if (!verifyEvent(currentEvent)) {
            // Before blocking an artificial click, we perform another check:
            // Page's script may try to re-dispatch certain events inside of
            // its handlers. In such case, targets of each events will be closely related,
            // and we allow such cases.
            // In case of popup/popunder scripts, the target of an event to be dispatched
            // is normally an anchor tag that is just created or is detached to the document.
            // See: https://github.com/AdguardTeam/PopupBlocker/issues/49
            // This logic is separated out in shared/dom.ts.
            var currentTarget = currentEvent.target;
            if (!isNode(currentTarget) || !isNode(_this) || !targetsAreChainable(currentTarget, _this)) {
                print('It did not pass the test, not dispatching event');
                onBlocked(url[2], currentEvent);
                callEnd();
                return false;
            }
            print("dispatched event's target is chainable with the original target.");
        }
        print("It passed the test");
        callEnd();
    }
    return execContext.invokeTarget(_arguments);
};
var logUIEventOnly = function (target, _this, _arguments) {
    var evt = _arguments[0];
    return isUIEvent(evt);
};
function wrapDispatchEvent(window, proxyService) {
    var eventTargetCtor = window.EventTarget || window.Node;
    proxyService.wrapMethod(eventTargetCtor.prototype, 'dispatchEvent', dispatchVerifiedEvent, logUIEventOnly);
}

function wrapIFrameSrc(window, proxyService) {
    var iframePType = window.HTMLIFrameElement.prototype;
    proxyService.wrapAccessor(iframePType, 'src'); // logging only
    proxyService.wrapAccessor(iframePType, 'srcdoc');
}

/**
 * This is DEV version only.
 */
function wrapObjectData(window, proxyService) {
    proxyService.wrapAccessor(window.HTMLObjectElement.prototype, 'data');
}

/**
 * DEV channel only
 */
function wrapDocumentWrite(window, proxyService) {
    var documentPrototype = window.Document.prototype;
    proxyService.wrapMethod(documentPrototype, 'write');
    proxyService.wrapMethod(documentPrototype, 'writeIn');
}

var allowVerifiedCall = function (execContext, _arguments) {
    var _this = execContext.thisArg;
    var currentEvent = retrieveEvent();
    if (isMouseEvent(_this)) {
        if (_this === currentEvent) {
            if (currentEvent.eventPhase === 1 && !verifyEvent(currentEvent)) {
                print('Not allowing');
                return;
            }
        }
    }
    return execContext.invokeTarget(_arguments);
};
function wrapPreventDefault(window, proxyService) {
    proxyService.wrapMethod(window.Event.prototype, 'preventDefault', connect(allowVerifiedCall, 'Performing verification on preventDefault..', function () {
        return isMouseEvent(arguments[1]);
    }));
}

var ChildContextInjector = /** @class */ (function () {
    function ChildContextInjector($window, proxyService, instanceID) {
        this.$window = $window;
        this.proxyService = proxyService;
        this.instanceID = instanceID;
        this.callbacks = [];
        this.onFrameLoad = functionBind.call(this.onFrameLoad, this);
        this.processChildOnContentAccess = functionBind.call(this.processChildOnContentAccess, this);
        // Initialize
        var iframePType = $window.HTMLIFrameElement.prototype;
        this.frameToDocument = new wm$1();
        proxyService.wrapAccessor(iframePType, 'contentWindow', this.processChildOnContentAccess);
        proxyService.wrapAccessor(iframePType, 'contentDocument', this.processChildOnContentAccess);
        this.observeChildFrames($window);
    }
    ChildContextInjector.prototype.observeChildFrames = function (window) {
        var _this = this;
        if (!MO$2) {
            return;
        }
        if (!this.childFrameObserver) {
            this.childFrameObserver = new MO$2(function (mutations) {
                for (var i = 0, j = mutations.length; i < j; i++) {
                    var mutation = mutations[i];
                    var addedNodes = mutation.addedNodes;
                    for (var k = 0, l = addedNodes.length; k < l; k++) {
                        var addedNode = addedNodes[k];
                        if (isIFrame(addedNode)) {
                            _this.processChildFrameIfNew(addedNode);
                        }
                        else if (isElement(addedNode)) {
                            var iframes = addedNode.getElementsByTagName('IFRAME');
                            for (var m = 0, n = iframes.length; m < n; m++) {
                                var iframe = iframes[m];
                                _this.processChildFrameIfNew(iframe);
                            }
                        }
                    }
                }
            });
        }
        this.childFrameObserver.observe(window.document.documentElement, {
            childList: true,
            subtree: true
        });
    };
    ChildContextInjector.prototype.processChildFrameIfNew = function (iframe) {
        var prevDoc = this.frameToDocument.get(iframe);
        if (!isUndef(prevDoc)) {
            // We've already processed this frame, returning.
            return;
        }
        // New iframe element
        print("ChildContextInjector: attaching an event listener to a first met frame");
        iframe.addEventListener('load', this.onFrameLoad);
        try {
            var contentWin = getContentWindow.call(iframe);
            if (contentWin.location.protocol === ABOUT_PROTOCOL$1) {
                print("ChildContextInjector: new child context encountered.", iframe.outerHTML);
                this.frameToDocument.set(iframe, contentWin.document);
                this.processChildWindow(contentWin);
                /**
                 * {@link https://dev.w3.org/html5/spec-preview/history.html#navigate}
                 *
                 *    First, a new Window object must be created and associated with the Document, with one exception:
                 *    if the browsing context's only entry in its session history is the about:blank Document that was
                 *    added when the browsing context was created, and navigation is occurring with replacement enabled,
                 *    and that Document has the same origin as the new Document, then the Window object of that Document
                 *    must be used instead, and the document attribute of the Window object must be changed to point to
                 *    the new Document instead.
                 *
                 * This exception clause is applied when there is an iframe whose src attribute is set to be same-origin,
                 * and its `contentWindow` is accessed after the iframe is attached to the document very quickly,
                 * either synchronously or in the next microtask queue.
                 * Note that, how such uninitialized empty frames' origins are treated can be browser-dependent.
                 * In such cases, the `Window` object will reused by the newly loaded document, so we set a global flag
                 * in order to prevent userscripts loaded to the document from running, to avoid overriding DOM Apis
                 * twice.
                 */
                var src = iframe.src;
                if (src && this.instanceID && isSameOrigin(src, this.$window.location, this.$window.document.domain)) {
                    print("ChildContextInjector: setting a global flag");
                    ChildContextInjector.setNonEnumerableValue(contentWin, this.instanceID, undefined);
                }
            }
        }
        catch (e) {
            print('Processing a child frame has failed, due to an error:', e);
            this.frameToDocument.set(iframe, null);
        }
    };
    ChildContextInjector.prototype.processChildOnContentAccess = function (ctxt, _arguments) {
        var iframe = ctxt.thisArg;
        this.processChildFrameIfNew(iframe);
        return this.proxyService.makeObjectProxy(ctxt.invokeTarget(_arguments));
    };
    /**
     * This should be called when we are sure that `childWindow` is not subject to
     * CORS restrictions.
     */
    ChildContextInjector.prototype.processChildWindow = function (childWindow) {
        var callbacks = this.callbacks;
        for (var i = 0, l = callbacks.length; i < l; i++) {
            callbacks[i](childWindow);
        }
    };
    ChildContextInjector.prototype.onFrameLoad = function (evt) {
        var iframe = evt.target;
        try {
            var document_1 = getContentDocument.call(iframe);
            // If a loaded document has empty location, and it is different from the previous document,
            // We execute the callback again.
            if (document_1.location.protocol === ABOUT_PROTOCOL$1 && this.frameToDocument.get(iframe) !== document_1) {
                print("ChildContextInjector: a content of an empty iframe has changed.");
                this.frameToDocument.set(iframe, document_1);
                this.processChildWindow(document_1.defaultView);
            }
        }
        catch (e) {
            this.frameToDocument.set(iframe, null);
        }
    };
    ChildContextInjector.setNonEnumerableValue = function (owner, prop, value) {
        defineProperty$1(owner, prop, {
            value: value,
            configurable: true
        });
    };
    ChildContextInjector.prototype.registerCallback = function (callback) {
        this.callbacks.push(callback);
    };
    return ChildContextInjector;
}());

var InterContextMessageHub = /** @class */ (function () {
    function InterContextMessageHub(window, parentInstance) {
        var _this = this;
        this.typeHandlerMap = [];
        this.hostWindow = window;
        var supported = this.supported = nativeWeakMapSupport;
        var parent = this.parent = window.parent;
        var isTop = this.isTop = window.top === window;
        if (supported) {
            this.framePortMap = new WeakMap();
            // Listens for handshake messages
            window.addEventListener('message', function (evt) {
                _this.handshake(evt);
            });
            // Passes message port to parent context.
            if (parentInstance) {
                print('MessageHub: registering to parent instance directly..');
                var channel = new MessageChannelCtor(); // Always use API from a 'stable' frame.
                parentInstance.registerChildPort(window, channel.port1);
                this.registerChildPort(parentInstance.hostWindow, channel.port2);
            }
            if (!isTop && (!parentInstance || parentInstance.hostWindow !== parent)) {
                print("MessageHub: sending message from " + window.location.href + " to parent...");
                var channel = new MessageChannelCtor();
                parent.postMessage(InterContextMessageHub.MAGIC, '*', [channel.port1]);
                this.registerChildPort(parent, channel.port2);
            }
        }
    }
    InterContextMessageHub.prototype.handshake = function (evt) {
        if (evt.data !== InterContextMessageHub.MAGIC) {
            // `MAGIC` indicates that this message is sent by the popupblocker from the child frame.
            return;
        }
        var source = getMessageSource.call(evt);
        // From now on, propagation of event must be stopped.
        receivePort: {
            if (isUndef(source)) {
                // evt.source can be undefiend when an iframe has been removed from the document before the message is received.
                break receivePort;
            }
            if (this.framePortMap.has(source)) {
                var frameData = this.framePortMap.get(source);
                if (frameData.locationObject === source.location) {
                    print("Received a port from a frame that we already met. This could be a bug");
                    // log.debuggerPause();
                    break receivePort;
                }
                print("Received a port from a known frame, but location object has updated");
                // Such frames have already sent its message port, we do not accept additional ports.
            }
            // log.print('received a message from:', evt.source);
            var port = evt.ports[0]; // This is a port that a child frame sent.
            this.registerChildPort(source, port);
        }
        evt.stopImmediatePropagation();
        evt.preventDefault();
    };
    InterContextMessageHub.prototype.registerChildPort = function (child, port) {
        var _this = this;
        port.onmessage = function (evt) {
            print('MesageHub: received a message from a port');
            _this.onMessage(evt);
        };
        this.framePortMap.set(child, {
            messagePort: port,
            locationObject: child.location
        });
    };
    InterContextMessageHub.prototype.onMessage = function (evt) {
        var data = evt.data;
        this.triggerHandlers(data.$type, data.$data, getMessageSource.call(evt));
    };
    InterContextMessageHub.prototype.triggerHandlers = function (type, data, source) {
        var messageHandler = this.typeHandlerMap[type];
        if (messageHandler) {
            messageHandler.handleMessage(data, source);
        }
    };
    InterContextMessageHub.prototype.on = function (type, messageHandler) {
        if (!isUndef(this.typeHandlerMap[type])) {
            throwMessage('Tried to re-assign a callback for an event type', 2);
        }
        this.typeHandlerMap[type] = messageHandler;
    };
    InterContextMessageHub.prototype.trigger = function (type, data, target, transferList) {
        if (target === this.hostWindow) {
            this.triggerHandlers(type, data, this.hostWindow);
        }
        if (!this.supported) {
            // if WeakMap is not supported, this method will only work when
            // the target is the same browsing context.
            return;
        }
        var frameData = this.framePortMap.get(target);
        if (!frameData) {
            return;
        }
        var port = frameData.messagePort;
        var msgData = {
            $type: type,
            $data: data
        };
        print('MesageHub: sending a message to a port');
        port.postMessage(msgData, transferList);
    };
    InterContextMessageHub.MAGIC = 'pb_handshake';
    return InterContextMessageHub;
}());

function main(window, globalKey) {
    if (window.hasOwnProperty(globalKey)) {
        delete window[globalKey];
        return;
    }
    else {
        var initProxy_1 = function (window) {
            $apply(window);
            var framePosition = timeline.onNewFrame(window); // Will be `0` for main fame
            var loggedProxyService = new LoggedProxyService(timeline, framePosition);
            wrapOpen(window, loggedProxyService);
            wrapClick(window, loggedProxyService);
            wrapDispatchEvent(window, loggedProxyService);
            wrapIFrameSrc(window, loggedProxyService);
            wrapObjectData(window, loggedProxyService);
            wrapDocumentWrite(window, loggedProxyService);
            wrapPreventDefault(window, loggedProxyService);
            var injector = new ChildContextInjector(window, loggedProxyService, globalKey);
            injector.registerCallback(initProxy_1);
            injector.registerCallback(initMsgHubInIframe_1);
        };
        var initMsgHub = function (window) {
            adguard.messageHub = new InterContextMessageHub(window);
            installAlertMessageTransferrer(adguard.messageHub);
            installDispatchMouseEventMessageTransferrer(adguard.messageHub);
        };
        var initMsgHubInIframe_1 = function (window) {
            var messageHub = new InterContextMessageHub(window, adguard.messageHub);
            installAlertMessageTransferrer(messageHub);
            installDispatchMouseEventMessageTransferrer(messageHub);
        };
        initProxy_1(window);
        initMsgHub(window);
    }
}

adguard.contentScriptApiFacade = window[CONTENT_SCRIPT_KEY];
var instanceID = adguard.contentScriptApiFacade.getInstanceID();
main(window, instanceID);

}());
};
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
        href === 'https://popupblocker.adguard.com/options.html';
}
if (isOptionsPage()) {
    win["GM_getValue"] = exportFunction(GM_getValue, unsafeWindow);
    win["GM_setValue"] = exportFunction(GM_setValue, unsafeWindow);
    win["GM_listValues"] = exportFunction(GM_listValues, unsafeWindow);
}

}());
