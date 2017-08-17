(function () {
function call(msg) {
}
function callEnd() {
}
function print(str, obj) {
}
function connect(fn, message) {
    return fn;
}

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
            var parent = win.parent;
            if (parent === win) {
                break;
            }
            win = parent;
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
                    throw null;
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
describe('maybeOverlay', function () {
    it('detects position:absolute;left:0;top:0;width:100%;height:100%;z-index:2147483647', function () {
        var el = document.createElement('div');
        el.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;z-index:2147483647';
        document.body.appendChild(el);
        expect(maybeOverlay(el)).to.be.true;
        document.body.removeChild(el);
    });
});

var currentEvent = (new CurrentMouseEvent()).getCurrentMouseEvent;
var expect$1 = chai.expect;
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
        var callback = function (evt) {
            counter++;
            // Tests whether currentEvent returns the right event.
            var retrieved = currentEvent();
            expect$1(retrieved).to.equal(evt);
            if (counter < LIMIT) {
                switch (counter % 7) {
                    case 0:
                        setTimeout(document.body.dispatchEvent(getEvt$1(getType())));
                        break;
                    case 1:
                        pr.resolve().then(function () { document.body.dispatchEvent(getEvt$1(getType())); });
                        break;
                    case 2:
                    case 3:
                    case 4:
                        document.body.dispatchEvent(getEvt$1(getType()));
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
        document.body.dispatchEvent(getEvt$1(getType()));
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

var getTime = 'now' in performance ? function () {
    return performance.timing.navigationStart + performance.now();
} : function () {
    return (new Date()).getTime();
};

var TLEventType;
(function (TLEventType) {
    TLEventType[TLEventType["CREATE"] = 0] = "CREATE";
    TLEventType[TLEventType["APPLY"] = 1] = "APPLY";
    TLEventType[TLEventType["GET"] = 2] = "GET";
    TLEventType[TLEventType["SET"] = 3] = "SET";
})(TLEventType || (TLEventType = {}));

var TimelineEvent = (function () {
    function TimelineEvent($type, $name, $data) {
        this.$type = $type;
        this.$name = $name;
        this.$data = $data;
        this.$timeStamp = getTime();
    }
    return TimelineEvent;
}());

var createOpen = function (index, events) {
    print('index:', index);
    var evt = events[index][0];
    if (evt.$type == TLEventType.CREATE && getTime() - evt.$timeStamp < 200) {
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
    if (latestOpenEvent.$type === TLEventType.APPLY && latestOpenEvent.$name === 'open' && latestOpenEvent.$data.arguments[0] == 'about:blank') {
        print('The latest event is open(\'about:blank\')');
        var l = events.length;
        while (l-- > 0) {
            var frameEvents = events[l];
            var k = frameEvents.length;
            while (k-- > 0) {
                var event = frameEvents[k];
                if (now - event.$timeStamp > 200) {
                    break;
                }
                if (event.$name === 'open' && event.$type === TLEventType.APPLY) {
                    if (event.$data.context['mocked']) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
};
var aboutBlank$1 = connect(aboutBlank, 'Performing aboutBlank test');

var beforeTest = [createOpen$1, aboutBlank$1];
var afterTest = [];
var EVENT_RETENTION_LENGTH = 5000;
var Timeline = (function () {
    function Timeline() {
        this.events = [[]];
        this.isRecording = false;
        // Registers a unique event when it is first created.
        this.registerEvent(new TimelineEvent(TLEventType.CREATE, undefined, undefined), 0);
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
            var name = event.$name ? event.$name.toString() : '';
            print("Timeline.registerEvent: " + event.$type + " " + name, event.$data);
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
        this.registerEvent(new TimelineEvent(TLEventType.CREATE, undefined, undefined), pos);
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
var timeline = typeof KEY === 'string' ? window.parent[KEY][2] : new Timeline();
var position = typeof KEY === 'string' ? timeline.onNewFrame() : 0;
// These are called from the outside of the code, so we have to make sure that call structures of those are not modified.
// It is removed in minified builds, see the gulpfile.
window['__t'] = timeline;

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

var supported$1 = false;
supported$1 = typeof Proxy !== 'undefined';
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
if (supported$1) {
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
var expose = function (key) { window[key] = [proxyToReal, realToProxy, timeline, bridge$1]; };
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
    return supported$1 ? _reflect(target, unproxied, _arguments) : target.apply(unproxied, _arguments);
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
    if (obj === null || typeof obj !== 'object' || !supported$1) {
        return obj;
    }
    var proxy = realToProxy.get(obj);
    if (proxy) {
        return proxy;
    }
    proxy = new Proxy(obj, {
        get: function (target, prop, receiver) {
            var _receiver = proxyToReal.get(receiver) || receiver;
            timeline.registerEvent(new TimelineEvent(TLEventType.GET, prop, _receiver), position);
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
            timeline.registerEvent(new TimelineEvent(TLEventType.SET, prop, _receiver), position);
            return Reflect.set(target, prop, value, _receiver);
        }
    });
    realToProxy.set(obj, proxy);
    proxyToReal.set(proxy, obj);
    return proxy;
}
var defaultApplyHandler = supported$1 ? _reflect : function (_target, _this, _arguments) { return (_target.apply(_this, _arguments)); };
function makeFunctionWrapper(orig, applyHandler) {
    var wrapped;
    var proxy = realToProxy.get(orig);
    if (proxy) {
        return proxy;
    }
    if (supported$1) {
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
            timeline.registerEvent(new TimelineEvent(type, name, data), position);
        }
        return applyHandler(target, _this, _arguments, context);
    });
}
function wrapMethod(obj, prop, applyHandler, option) {
    if (obj.hasOwnProperty(prop)) {
        obj[prop] = makeLoggedFunctionWrapper(obj[prop], TLEventType.APPLY, prop, applyHandler, option);
    }
}
function wrapAccessor(obj, prop, getterApplyHandler, setterApplyHandler, option) {
    var desc = Object.getOwnPropertyDescriptor(obj, prop);
    if (desc && desc.get && desc.configurable) {
        var getter = makeLoggedFunctionWrapper(desc.get, TLEventType.GET, prop, getterApplyHandler, option);
        var setter;
        if (desc.set) {
            setter = makeLoggedFunctionWrapper(desc.set, TLEventType.SET, prop, setterApplyHandler, option);
        }
        Object.defineProperty(obj, prop, {
            get: getter,
            set: setter,
            configurable: true,
            enumerable: desc.enumerable
        });
    }
}
if (supported$1) {
    wrapMethod(Function.prototype, 'bind', applyWithUnproxiedThis, false);
    wrapMethod(Function.prototype, 'apply', applyWithUnproxiedThis, false);
    wrapMethod(Function.prototype, 'call', applyWithUnproxiedThis, false);
    wrapMethod(Reflect, 'apply', reflectWithUnproxiedThis, false);
    wrapAccessor(MessageEvent.prototype, 'source', proxifyReturn, undefined, false);
}
wrapMethod(Function.prototype, 'toString', invokeWithUnproxiedThis, false);
wrapMethod(Function.prototype, 'toSource', invokeWithUnproxiedThis, false);

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
var getContentWindow = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow').get;
var applyPopupBlockerOnGet = function (_get, _this) {
    if (!processed.has(_this)) {
        call('getContent');
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
            callEnd();
        }
    }
    return makeObjectProxy(_get.call(_this));
};
wrapAccessor(HTMLIFrameElement.prototype, 'contentWindow', applyPopupBlockerOnGet);
wrapAccessor(HTMLIFrameElement.prototype, 'contentDocument', applyPopupBlockerOnGet);

/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />
var expect$2 = chai.expect;
describe('HTMLIFrameElement#src', function () {
    it('should log when an iframe\'s contentDocument property is accessed', function () {
        var ifr = document.createElement('iframe');
        ifr.style.cssText = 'display:none;';
        document.body.appendChild(ifr);
        if (!('location' in ifr.contentDocument)) {
            throw new Error();
        }
        var records = timeline.takeRecords()[0];
        var lastEvent = records[records.length - 1];
        document.body.removeChild(ifr);
        expect$2(lastEvent.$type).to.equal(TLEventType.GET);
    });
});

/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />
var expect$3 = chai.expect;
describe('Timeline', function () {
    it('should log when it is first created', function () {
        var records = timeline.takeRecords();
        var firstEvent = timeline.takeRecords()[0][0];
        expect$3(firstEvent.$type).to.equal(TLEventType.CREATE);
    });
});

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

var expect$4 = chai.expect;
describe('Localization', function () {
    describe('parseMessage', function () {
        var context = {
            "key1": "value1",
            "key2": "value2"
        };
        it('preserves plain texts', function () {
            var input = 'This is a plain text';
            var parsed = parseMessage(input, context);
            expect$4(parsed).to.eql(['This is a plain text']);
        });
        it('replaces string references of a form ${...}', function () {
            var input = '${key1}';
            var parsed = parseMessage(input, context);
            expect$4(parsed).to.eql(['value1']);
        });
        it('parses html node references <0/>, <1/>, ... to a single-digit number', function () {
            var input = '<4/><0/><3/><1/><2/>';
            var parsed = parseMessage(input, context);
            expect$4(parsed).to.eql([4, 0, 3, 1, 2]);
        });
        it('parses the node index from the first character of node references', function () {
            var input = '<0:a node/><1_another_node/><2{YetAnotherNode}/>';
            var parsed = parseMessage(input, context);
            expect$4(parsed).to.eql([0, 1, 2]);
        });
        it('concatenates string references with plain texts', function () {
            var input = 'The string ${key1} is a value of key1';
            var parsed = parseMessage(input, context);
            expect$4(parsed).to.eql(['The string value1 is a value of key1']);
        });
        it('parses a reference to an html node as a separate array element', function () {
            var input = 'There are <1_some/> <0_links/> in the middle of a text';
            var parsed = parseMessage(input, context);
            expect$4(parsed).to.eql(['There are ', 1, ' ', 0, ' in the middle of a text']);
        });
        it('parses a combination of html node references and string references', function () {
            var input = 'a${key2}b<2/>c${key1}<1/>d<0/>';
            var parsed = parseMessage(input, context);
            expect$4(parsed).to.eql(['avalue2b', 2, 'cvalue1', 1, 'd', 0]);
        });
    });
    describe('translate', function () {
        var context = {
            "key1": "value1",
            "key2": "value2"
        };
        SupportedLocales["en"] = {
            'phrase1': {
                'message': 'a<2/>b<1/>c<0/>'
            },
            'phrase2': {
                'message': 'd<1/>e<0/>f'
            },
            'phrase3': {
                'message': 'g${key1}<2/>h<0/>${key2}i<1/>'
            }
        };
        it('transforms html as expected', function () {
            var logPerf = 'now' in performance;
            var before = logPerf ? performance.now() : 0;
            translate(translateTestRoot, context);
            var after = logPerf ? performance.now() : 0;
            console.log("translate call ended in " + (after - before) + " milliseconds.");
            /*******************************************************

                Initial html:

                <div id="translateTestRoot">
                    <!--i18n:phrase1-->
                    <div id='0'>
                        <div id='0-0'></div>
                        <!--i18n:phrase2-->
                        <div id='0-1'></div>
                        <div id='0-2'></div>
                    </div>
                    <div id='1'></div>
                    <div id='2'></div>
                    <!--i18n:phrase3-->
                    <div id='3'></div>
                    <div id='4'></div>
                    <div id='5'></div>
                </div>
                
                Expected html after translation:

                <div id="translateTestRoot">
                    a
                    <div id='2'></div>
                    b
                    <div id='1'></div>
                    c
                    <div id='0'>
                        <div id='0-0'></div>
                        d
                        <div id='0-2'></div>
                        e
                        <div id='0-1'></div>
                        f
                    </div>
                    gvalue1
                    <div id='5'></div>
                    h
                    <div id='3'></div>
                    value2i
                    <div id='4'></div>
                </div>

            **/
            var filter = function (el) {
                if (el.nodeType === Node.TEXT_NODE && el.nodeValue.trim().length === 0) {
                    return NodeFilter.FILTER_SKIP;
                }
                return NodeFilter.FILTER_ACCEPT;
            };
            var iterator = document.createNodeIterator(translateTestRoot, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, ('documentMode' in document ? filter : { acceptNode: filter }), false); // IE accepts a different type of `NodeFilter` arguments.
            var current;
            var res = [];
            while (current = iterator.nextNode()) {
                switch (current.nodeType) {
                    case Node.TEXT_NODE:
                        res.push(current.nodeValue.trim());
                        break;
                    case Node.ELEMENT_NODE:
                        res.push(current['id']);
                }
            }
            expect$4(res).to.eql('translateTestRoot,a,2,b,1,c,0,0-0,d,0-2,e,0-1,f,gvalue1,5,h,3,value2i,4'.split(','));
        });
    });
});

}());
