(function () {
/**
 * @fileoverview Logging functions to be used in dev channel. Function bodies are enclosed with preprocess
 * directives in order to ensure that these are stripped out by minifier in beta and release channels.
 */




/**
 * Accepts a function, and returns a wrapped function that calls `call` and `callEnd`
 * automatically before and after invoking the function, respectively.
 * @param fn A function to wrap
 * @param message
 * @param cond optional argument, the function argument will be passed to `cond` function, and
 * its return value will determine whether to call `call` and `callEnd`.
 */
function connect(fn, message, cond) {
    return fn;
}
function throwMessage(thrown, code) {
    throw code;
}

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
        return true;
    }
})();
// To be used in AudioBufferCache

var wm$1 = nativeWeakMapSupport ? WeakMap : WeakMapPolyfill;

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
            var md = getLatest(mousedownQueue);
            var mu = getLatest(mouseupQueue);
            var cl = getLatest(clickQueue);
            var evt = [cl, md, mu].sort(compareTimestamp)[0];
            return evt;
        };
    }
    return CurrentMouseEvent;
}());

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

var defineProperty$1 = Object.defineProperty;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;



var objectKeys = Object.keys;
var hasOwnProperty = Object.prototype.hasOwnProperty;

var functionApply = Function.prototype.apply;
var functionCall = Function.prototype.call;
var functionBind = Function.prototype.bind;


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


var setTimeout$1 = window.setTimeout.bind(window);



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

var proxyToReal = new wm$1();
var realToProxy = new wm$1();
/**
 * An apply handler to make invoke handler.
 */

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
/**
 * Google Tag Manager can be configured to fire tags upon link clicks, and in certian cases,
 * gtm script calls `window.open` to simulate a click on an anchor tag.
 * such call occurs inside of an event handler attached to `document`, so it is considered
 * suspicious by `verifyEvent`.
 * This function performs a minimal check of whether the `open` call is triggered by gtm.
 * See: https://github.com/AdguardTeam/PopupBlocker/issues/36
 */

/**
 * On IE 10 and lower, window.event is a `MSEventObj` instance which does not implement `target` property.
 * We use a polyfill for such cases.
 */
var supported = 'event' in window && (!('documentMode' in document) || (document.documentMode === 11));
var currentMouseEvent;
if (!supported) {
    currentMouseEvent = (new CurrentMouseEvent()).getCurrentMouseEvent;
}
else {
    
}
/**
 * Gets the event that is being currently handled.
 * @suppress {es5Strict}
 */
function retrieveEvent() {
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
        try {
            var caller = arguments.callee;
            var touched = new wm$1();
            while (caller.caller) {
                caller = caller.caller;
                if (touched.has(caller)) {
                    throw null;
                }
                touched.set(caller, true);
            }
            if (caller.arguments && caller.arguments[0] && 'target' in caller.arguments[0]) {
                currentEvent = caller.arguments[0];
                
            }
            else {
                
            }
        }
        catch (e) {
            
        }
    }
    else {
        
    }
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
            if (eventTargetIsRootNode(currentTarget)) {
                var eventPhase = event.eventPhase;
                var maybeJsActionTarget = jsActionTarget(event);
                if (maybeJsActionTarget) {
                    if (eventTargetIsRootNode(maybeJsActionTarget)) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
                if (eventPhase === 1 /* Event.CAPTURING_PHASE */ || eventPhase === 2 /* Event.AT_TARGET */) {
                    return false;
                }
                else {
                    var jQueryTarget = getCurrentJQueryTarget(event);
                    if (jQueryTarget) {
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
                return false;
            }
        }
    }
    return true;
}, 'Verifying event', function () { return arguments[0]; });

/// <reference path="../../node_modules/@types/mocha/index.d.ts"/>
/// <reference path="../../node_modules/@types/chai/index.d.ts"/>
var expect = chai.expect;
var getEvt = function () {
    var evt = window.event = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
    return evt;
};
describe('retrieveEvent', function () {
    it('returns window.event if available', function () {
        if ('event' in window) {
            var desc = Object.getOwnPropertyDescriptor(window, 'event');
            if (desc && desc.set) {
                var evt = window.event = getEvt();
                expect(retrieveEvent()).to.be.equal(evt);
                window.event = undefined;
            }
        }
    });
    it('retrieves value from the call stack when window.event is unavailable', function (done) {
        var evt = window.event = getEvt();
        var retrieved;
        setTimeout(function () {
            window.event = undefined;
            retrieved = retrieveEvent();
            expect(retrieved).to.be.equal(evt);
            done();
        }.bind(null, evt), 100);
    });
});
describe('verifyEvent', function () {
    it('returns true for non-dispatched events', function () {
        var evt = window.event = getEvt();
        expect(verifyEvent(evt)).to.be.true;
    });
    it('returns false for events of which currentTarget is document', function () {
        var evt = getEvt();
        document.addEventListener('click', function (evt) {
            expect(verifyEvent(evt)).to.be.false;
        });
        document.dispatchEvent(evt);
    });
});

/// <reference path="../../node_modules/@types/mocha/index.d.ts"/>
/// <reference path="../../node_modules/@types/chai/index.d.ts"/>
var expect$1 = chai.expect;
describe('maybeOverlay', function () {
    it('detects position:absolute;left:0;top:0;width:100%;height:100%;z-index:2147483647', function () {
        var el = document.createElement('div');
        el.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;z-index:2147483647';
        document.body.appendChild(el);
        expect$1(maybeOverlay(el)).to.be.true;
        document.body.removeChild(el);
    });
});

/// <reference path="../../node_modules/@types/mocha/index.d.ts"/>
/// <reference path="../../node_modules/@types/chai/index.d.ts"/>
var currentEvent = (new CurrentMouseEvent()).getCurrentMouseEvent;
var expect$2 = chai.expect;
var getEvt$1 = function (type) {
    var evt = window.event = document.createEvent("MouseEvents");
    evt.initMouseEvent(type, true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
    return evt;
};
var types = ['mousedown', 'mouseup', 'click'];
// Gets a random mouseevent type.
var getType = function () {
    return types[Math.floor(Math.random() * 3)];
};
describe('CurrentMouseEvent', function () {
    it('retrieves a current mouse event in multiple nested event handlers', function (done) {
        this.timeout(5000);
        var LIMIT = 1000;
        var counter = 0;
        var pr = typeof Promise !== 'undefined' ? Promise : { resolve: function () { return ({ then: function (fn) { fn(); } }); } };
        var getRndEvt = function () {
            var evt = getEvt$1(getType());
            evt["counter"] = counter;
            return evt;
        };
        var callback = function (evt) {
            counter++;
            // Tests whether currentEvent returns the right event.
            var retrieved = currentEvent();
            expect$2(retrieved).to.equal(evt);
            if (counter < LIMIT) {
                switch (counter % 7) {
                    case 0:
                        setTimeout(document.body.dispatchEvent(getRndEvt()));
                        break;
                    case 1:
                        pr.resolve().then(function () { document.body.dispatchEvent(getRndEvt()); });
                        break;
                    case 2:
                    case 3:
                    case 4:
                        document.body.dispatchEvent(getRndEvt());
                        break;
                }
            }
            // Occasionally stops bubbling.
            switch (counter % 10) {
                case 0:
                    evt.stopPropagation();
                    break;
                case 1:
                    evt.stopImmediatePropagation();
                    break;
                case 2:
                    evt.cancelBubble = true;
                    break;
            }
        };
        document.addEventListener('mousedown', callback);
        document.addEventListener('mousedown', callback, true);
        document.body.addEventListener('mousedown', callback);
        document.addEventListener('mouseup', callback);
        document.addEventListener('mouseup', callback, true);
        document.body.addEventListener('mouseup', callback);
        document.addEventListener('click', callback);
        document.addEventListener('click', callback, true);
        document.body.addEventListener('click', callback);
        document.body.dispatchEvent(getRndEvt());
        setTimeout(function () {
            setTimeout(function () {
                setTimeout(function () {
                    setTimeout(function () {
                        setTimeout(function () {
                            console.log("dispatched total " + counter + " events");
                            done();
                        }, 500);
                    });
                });
            });
        });
    });
});

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













function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

/// <reference path="../../node_modules/@types/mocha/index.d.ts"/>
/// <reference path="../../node_modules/@types/chai/index.d.ts"/>
// JQueryEventStack is initialized in the module.
var expect$3 = chai.expect;
describe('JQueryEventStack', function () {
    return __awaiter(this, void 0, void 0, function () {
        // Test implementations
        function testOnJQuery(jQuery, prev) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            describe("jQuery " + jQuery.version, function () {
                                before(function (done) {
                                    this.timeout(10000);
                                    // Run tests after `prev` test ends.
                                    prev.then(function () {
                                        // Check that the jQuery currently loaded has the expected version.
                                        expect$3($.fn.jquery).to.equal(jQuery.version);
                                        done();
                                    });
                                });
                                it("detects simple target in " + jQuery.version, function (done) {
                                    $('#JQueryTestRoot').one('click', function (evt) {
                                        var expected = JQueryTestRoot;
                                        var got = JQueryEventStack$1.getCurrentJQueryTarget(window.event);
                                        expect$3(got).to.equal(expected);
                                        done();
                                    });
                                    $('#JQueryTestRoot').click();
                                });
                                it("detects delegated target in " + jQuery.version, function (done) {
                                    $(document).one('click', '#JQueryTestRoot', function (evt) {
                                        var expected = JQueryTestRoot;
                                        var got = JQueryEventStack$1.getCurrentJQueryTarget(window.event);
                                        expect$3(got).to.equal(expected);
                                        done();
                                    });
                                    $('#JQueryTestRoot').click();
                                });
                                it("detects nested delegated target in " + jQuery.version, function (done) {
                                    $(document).one('click', function (evt) {
                                        var target = evt.target;
                                        $(target).trigger('CustomClick_1');
                                    });
                                    $(document).one('CustomClick_1', 'body', function (evt) {
                                        var target = evt.target;
                                        $(target).trigger('CustomClick_2');
                                    });
                                    $('#JQueryTestRoot').one('CustomClick_2', function (evt) {
                                        var expected = JQueryTestRoot;
                                        var got = JQueryEventStack$1.getCurrentJQueryTarget(window.event);
                                        expect$3(got).to.equal(expected);
                                        done();
                                    });
                                    $('#JQueryTestRoot').click();
                                });
                                it("ignores jumps in delgated targets " + jQuery.version, function (done) {
                                    $(document).one('click', function (evt) {
                                        var target = evt.target;
                                        $(target).trigger('CustomClick_1');
                                    });
                                    $(document).one('CustomClick_1', 'body', function (evt) {
                                        var target = evt.target;
                                        $(target).trigger('CustomClick_2');
                                    });
                                    $('#JQueryTestRoot').one('CustomClick_2', function (evt) {
                                        $('head').trigger('CustomClick_3');
                                    });
                                    $('head').one('CustomClick_3', function (evt) {
                                        var expected = JQueryTestRoot;
                                        var got = JQueryEventStack$1.getCurrentJQueryTarget(window.event);
                                        expect$3(got).to.equal(expected);
                                        done();
                                    });
                                    $('#JQueryTestRoot').click();
                                });
                                it("works in a nested dispatch task " + jQuery.version, function (done) {
                                    $(document).one('click', '#JQueryTestRoot', function (evt) {
                                        $(document).one('click', '#JQueryTestRoot', function (evt) {
                                            var expected = JQueryTestRoot;
                                            var got = JQueryEventStack$1.getCurrentJQueryTarget(window.event);
                                            expect$3(got).to.equal(expected);
                                            done();
                                        });
                                        var target = evt.target;
                                        target.click();
                                    });
                                });
                                after(function () {
                                    $.noConflict(true); // Expose the previously-loaded jQuery to the global scope 
                                    // for the next test. 
                                    resolve();
                                });
                            });
                        })];
                });
            });
        }
        var JQueryTestRoot, jQueryVersions, tests, prev, _i, jQueryVersions_1, jQuery_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    JQueryTestRoot = window['JQueryTestRoot'];
                    jQueryVersions = [
                        { version: '3.3.1', url: 'https://code.jquery.com/jquery-3.3.1.min.js' },
                        { version: '2.2.4', url: 'https://code.jquery.com/jquery-2.2.4.min.js' },
                        { version: '1.12.4', url: 'https://code.jquery.com/jquery-1.12.4.min.js' }
                    ];
                    tests = [];
                    prev = Promise.resolve();
                    // Test for the lastly loaded jQuery, then test for the previous one by executing
                    // $.noConflict(true), and so on.
                    for (_i = 0, jQueryVersions_1 = jQueryVersions; _i < jQueryVersions_1.length; _i++) {
                        jQuery_1 = jQueryVersions_1[_i];
                        tests.push(prev = testOnJQuery(jQuery_1, prev));
                    }
                    document.body.click(); // So that JQueryEventStack patches the initial jQuery.
                    // Run tests
                    return [4 /*yield*/, Promise.all(tests)];
                case 1:
                    // Run tests
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});

var getTime = 'now' in performance ? function () {
    return performance.timing.navigationStart + performance.now();
} : Date.now;

/**
 * If an empty iframe which does not have an associacted http request tries to open a popup
 * within a time specified by this constant, it will be blocked.
 */
var TIME_MINIMUM_BEFORE_POPUP = 200;
var createOpen = function (index, events) {
    var evt = events[index][0];
    if (evt.$type == 0 /* CREATE */ && getTime() - evt.$timeStamp < TIME_MINIMUM_BEFORE_POPUP) {
        var browsingContext = evt.$data.thisOrReceiver;
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

var aboutBlank = function (index, events) {
    // if there is a blocked popup within 100 ms, do not allow opening popup with url about:blank.
    // It is a common technique used by popunder scripts on FF to regain focus of the current window.
    var latestOpenEvent = events[index][events[index].length - 1];
    var now = latestOpenEvent.$timeStamp;
    if (latestOpenEvent.$type === 1 /* APPLY */ && latestOpenEvent.$name === 'open' && isEmptyUrl(convertToString(latestOpenEvent.$data.arguments[0]))) {
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
 * @fileoverview Global namespace to be used throughout the page script.
 */
var adguard = {};

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
    MAGIC = Math.random().toString(36).substr(7);
    console.warn(adguard.contentScriptApiFacade.$getMessage('aborted_popunder_execution'));
    throw new ProxyServiceExternalError(MAGIC);
}

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
                abort();
            }
        }
    }
    return true;
};

var TimelineEvent = /** @class */ (function () {
    function TimelineEvent($type, $name, $data) {
        this.$type = $type;
        this.$name = $name;
        this.$data = $data;
        this.$timeStamp = getTime();
    }
    return TimelineEvent;
}());

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
        var i = beforeTest.length;
        while (i--) {
            if (!beforeTest[i](index, this.events)) {
                return false;
            }
        }
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
    "REMOVE_START";
    window['registerEvent'] = timeline.registerEvent;
    window['canOpenPopup'] = timeline.canOpenPopup;
    window['onNewFrame'] = timeline.onNewFrame;
    "REMOVE_END";
}
cc_export();
window['__t'] = timeline;

/// <reference path="../../node_modules/@types/mocha/index.d.ts"/>
/// <reference path="../../node_modules/@types/chai/index.d.ts"/>
var expect$4 = chai.expect;
describe('Timeline', function () {
    it('records must be empty when it is first created', function () {
        var records = timeline.takeRecords();
        expect$4(records.length).to.equal(0);
    });
    it('should log when Timeline#onNewFrame is called first', function () {
        timeline.onNewFrame(window);
        var firstEvent = timeline.takeRecords()[0][0];
        expect$4(firstEvent.$type).to.equal(0 /* CREATE */);
    });
});

/// <reference path="../../node_modules/@types/mocha/index.d.ts"/>
/// <reference path="../../node_modules/@types/chai/index.d.ts"/>
var expect$5 = chai.expect;
describe('createUrl', function () {
    it('returns a domain part only for usual urls', function () {
        var url = 'https://subdomain.domain.com/some/path/and?query=param#and#hash';
        var _a = createUrl(url), displayUrl = _a[0], canonicalUrl = _a[1];
        expect$5(displayUrl).to.equal('subdomain.domain.com/some/path/and?query=param#and#hash');
        expect$5(canonicalUrl).to.equal('subdomain.domain.com');
    });
    it('includes protocol too for non-http, https url schemes', function () {
        var url1 = 'about:blank';
        var _a = createUrl(url1), displayUrl = _a[0], canonicalUrl = _a[1];
        expect$5(displayUrl).to.equal('about:blank');
        expect$5(canonicalUrl).to.equal('about:blank');
        var url2 = 'data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E';
        var _b = createUrl(url2), displayUrl = _b[0], canonicalUrl = _b[1];
        expect$5(displayUrl).to.equal('data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E');
        expect$5(canonicalUrl).to.equal('data:text/html');
    });
});

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

/// <reference path="../../../../node_modules/@types/mocha/index.d.ts"/>
/// <reference path="../../../../node_modules/@types/chai/index.d.ts"/>
var expect$6 = chai.expect;
describe('UserscriptSettingsDao', function () {
    beforeEach(function () {
        // Expose mocked GM_api to the global scope
        var GM_storage = Object.create(null);
        function GM_getValue(key, defaultValue) {
            if (key in GM_storage) {
                return GM_storage[key];
            }
            return defaultValue;
        }
        function GM_setValue(key, value) {
            GM_storage[key] = value;
        }
        function GM_listValues() {
            return Object.keys(GM_storage);
        }
        function GM_deleteValue(key) {
            delete GM_storage[key];
        }
        window['GM_getValue'] = GM_getValue;
        window['GM_setValue'] = GM_setValue;
        window['GM_deleteValue'] = GM_deleteValue;
        window['GM_listValues'] = GM_listValues;
    });
    afterEach(function () {
        // Unexpose GM_api
        delete window['GM_getValue'];
        delete window['GM_setValue'];
        delete window['GM_deleteValue'];
        delete window['GM_listValues'];
    });
    it('It should migrate empty data from 1.* version to an empty data', function () {
        UserscriptSettingsDao.migrateDataIfNeeded();
        var keys = GM_listValues();
        expect$6(keys.length).to.equal(2);
        expect$6(GM_getValue(UserscriptSettingsDao.DATA_VERSION_KEY)).to.equal(String(UserscriptSettingsDao.CURRENT_VERSION));
        expect$6(GM_getValue(UserscriptSettingsDao.WHITELIST)).to.equal('');
    });
    it('It should migrate data from 1.* version properly', function () {
        // Save some ver1-style storage values
        GM_setValue('whitelist', 'domain1.com,domain2.com,sub.domain.com,sub.sub.domain.com');
        GM_setValue('domain1.com', JSON.stringify({ 'whitelisted': true, 'use_strict': false }));
        GM_setValue('domain3.com', JSON.stringify({ 'whitelisted': true, 'use_strict': false }));
        UserscriptSettingsDao.migrateDataIfNeeded();
        expect$6(GM_getValue(UserscriptSettingsDao.DATA_VERSION_KEY)).to.equal(String(UserscriptSettingsDao.CURRENT_VERSION));
        var settingsDao = new UserscriptSettingsDao();
        var expectedToBeWhitelisted = [
            'domain1.com',
            'domain2.com',
            'sub.domain.com',
            'sub.sub.domain.com',
            'domain3.com'
        ];
        expectedToBeWhitelisted.forEach(function (domain) {
            expect$6(settingsDao.getIsWhitelisted(domain)).to.equal(true);
            expect$6(settingsDao.getSourceOption(domain)).to.equal(0 /* NONE */);
        });
    });
});

}());
