import { timeline, position } from './timeline/index';
import { TimelineEvent, TLEventType } from './timeline/event';
import WeakMap from './weakmap';
import bridge from './bridge';

let supported = false;
// @ifndef NO_PROXY
supported = typeof Proxy !== 'undefined';
// @endif
/**
 * Why not use Proxy on production version?
 * Using proxy instead of an original object in some places require overriding Function#bind,apply,call,
 * and replacing such native codes into js implies serious performance effects on codes completely unrelated to popups.
 */

const _bind = Function.prototype.bind;
const _apply = Function.prototype.apply;
const _call = Function.prototype.call;

const _toStringFn = Function.prototype.toString;

let _reflect;
if (supported) { _reflect = Reflect.apply; }

// Lodash isNative
const reRegExpChar = /[\\^$.*+?()[\]{}|]/g
const reIsNative = new RegExp('^' + _toStringFn.call(Object.prototype.hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

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
const isNativeFn = function (fn:Function):boolean {
    if (typeof fn !== 'function') { return false; }
    let tostr;
    try {
        tostr = _reflect(_toStringFn, fn, []);
    } catch(e) {
        // The above block throws if `fn` is a Proxy constructed over a function, from a third-party code.
        // Such a proxy is still callable, so Function.prototype.(bind,apply,call) may be invoked on it.
        // It is a common practice to bind the correct `this` to methods, so we try in that way.
        try {
            tostr = fn.toString();
        } catch(e) {
            // In this case, we bail out, hoping for a third-party code does not mess with internal slots.
            return false;
        }
    }
    return reIsNative.test(tostr);
}

// See HTMLIFrame.ts
const proxyToReal = typeof KEY === 'string' ? window.parent[KEY][0] : new WeakMap();
const realToProxy = typeof KEY === 'string' ? window.parent[KEY][1] : new WeakMap();

export const expose = (key:PropertyKey) => { window[key] = [proxyToReal, realToProxy, timeline, bridge]; };
export const unexpose = (key:PropertyKey) => { delete window[key]; };

export type ApplyHandler = (target:Function, _this:any, _arguments:IArguments|any[], context?:any) => any;
export type ApplyOption = (target:Function, _this:any, _arguments:IArguments|any[]) => boolean;

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
const applyWithUnproxiedThis:ApplyHandler = (target, _this:Function, _arguments) => {
    // Convert _arguments[0] to its unproxied version
    // When it is kind of object which may depend on its internal slot
    let _caller = proxyToReal.get(_this) || _this;
    if (isNativeFn(_caller) && _caller !== _bind && _caller !== _apply && _caller !== _call) {
        // Function#(bind, apply, call) does not depend on the target's internal slots,
        // In (Function.prototype.call).apply(Function.prototype.toString, open)
        // we should not convert Function.prototype.toString to the original function.
        var thisOfReceiver = _arguments[0];
        var unproxied = proxyToReal.get(thisOfReceiver);
        if (unproxied) { _arguments[0] = unproxied; }
    }
    return _reflect(target, _this, _arguments);
};

/**
 * An apply handler to make Reflect.apply handler
 * Reflect.apply(EventTarget.prototype.addEventListener, proxideWindow, ['click', function(){}])
 */
const reflectWithUnproxiedThis:ApplyHandler = (target, _this, _arguments) => {
    let appliedFn = _arguments[0];
    appliedFn = proxyToReal.get(appliedFn) || appliedFn;
    if (isNativeFn(appliedFn) && appliedFn !== _bind && appliedFn !== _apply && appliedFn !== _call) {
        let thisOfAppliedFn = _arguments[1];
        let unproxied = proxyToReal.get(thisOfAppliedFn);
        if (unproxied) { _arguments[1] = unproxied; }
    }
    return _reflect(target, _this, _arguments);
};

/**
 * An apply handler to make invoke handler.
 */
const invokeWithUnproxiedThis:ApplyHandler = (target, _this:Function, _arguments) => {
    let unproxied = proxyToReal.get(_this);
    if (typeof unproxied == 'undefined') { unproxied = _this; }
    return supported ? _reflect(target, unproxied, _arguments) : target.apply(unproxied, _arguments);
};

/**
 * An apply handler to be used for MessageEvent.prototype.source.
 */
const proxifyReturn:ApplyHandler = (target, _this, _arguments) => {
    let ret = _reflect(target, _this, _arguments);
    let proxy = realToProxy.get(ret);
    if (proxy) { ret = proxy; }
    return ret;
};

const reportGetToTL = (target, prop:PropertyKey, receiver) => {
    let _receiver = proxyToReal.get(receiver) || receiver;
    timeline.registerEvent(new TimelineEvent(TLEventType.GET, prop, _receiver), position);
    var value = Reflect.get(target, prop, _receiver);
    if (isNativeFn(value)) {
        return makeFunctionWrapper(value, invokeWithUnproxiedThis);
    } else {
        return value;
    }
};

const reportSetToTL = (target, prop:PropertyKey, value, receiver) => {
    let _receiver = proxyToReal.get(receiver) || receiver;
    let data = {
        this: _receiver,
        arguments: [value]
    };
    timeline.registerEvent(new TimelineEvent(TLEventType.SET, prop, data), position);
    return Reflect.set(target, prop, value, _receiver);
};

export function makeObjectProxy(obj) {
    if ( obj === null || typeof obj !== 'object' || !supported) { return obj; }
    let proxy = realToProxy.get(obj);
    if (proxy) { return proxy; }
    proxy = new Proxy(obj, {
        get: reportGetToTL, // Avoid creating the same function many times
        set: reportSetToTL
    });
    realToProxy.set(obj, proxy);
    proxyToReal.set(proxy, obj);
    return proxy;
}

const defaultApplyHandler:ApplyHandler = supported ? _reflect : (_target, _this, _arguments) => (_target.apply(_this, _arguments));
const defaultOption = () => (true);

function makeFunctionWrapper(orig:Function, applyHandler:ApplyHandler) {
    let wrapped;
    let proxy = realToProxy.get(orig);
    if (proxy) { return proxy; }
    if (supported) {
        wrapped = new Proxy(orig, { apply: applyHandler });
    } else {
        wrapped = function() { return applyHandler(orig, this, arguments); };
        copyProperty(orig, wrapped, 'name');
        copyProperty(orig, wrapped, 'length');
    }
    proxyToReal.set(wrapped, orig);
    realToProxy.set(orig, wrapped);
    return wrapped;
}

function copyProperty(orig, wrapped, prop) {
    let desc = Object.getOwnPropertyDescriptor(orig, prop);
    if (desc && desc.configurable) {
        desc.value = orig[prop];
        Object.defineProperty(wrapped, prop, desc);
    }
}

/**
 * @param option Can be a boolean 'false' to disable logging, or can be a function which accepts the same type 
 * of params as ApplyHandler and returns booleans which indicates whether to log it or not.
 */
function makeLoggedFunctionWrapper(orig:Function, type:TLEventType, name:PropertyKey, applyHandler?:ApplyHandler, option?:boolean|ApplyOption) {
    applyHandler = applyHandler || defaultApplyHandler!;
    if (option === false) {
        return makeFunctionWrapper(orig, applyHandler);
    }
    return makeFunctionWrapper(orig, function(target, _this, _arguments) {
        let context = {};
        if (typeof option == 'undefined' || (<ApplyOption>option)(target, _this, _arguments)) {
            let data = {
                this: _this,
                arguments: _arguments,
                context: context
            };
            timeline.registerEvent(new TimelineEvent(type, name, data), position);
        }
        return applyHandler(target, _this, _arguments, context);
    });
}

export function wrapMethod(obj, prop:string, applyHandler?:ApplyHandler, option?:boolean|ApplyOption) {
    if (obj.hasOwnProperty(prop)) {
        obj[prop] = makeLoggedFunctionWrapper(obj[prop], TLEventType.APPLY, prop, applyHandler, option);
    }
}

export function wrapAccessor(obj, prop:string, getterApplyHandler?:ApplyHandler, setterApplyHandler?:ApplyHandler, option?:boolean|ApplyOption) {
    var desc = Object.getOwnPropertyDescriptor(obj, prop);
    if (desc && desc.get && desc.configurable) {
        var getter = makeLoggedFunctionWrapper(desc.get, TLEventType.GET, prop, getterApplyHandler, option);
        var setter;
        if (desc.set) { setter = makeLoggedFunctionWrapper(desc.set, TLEventType.SET, prop, setterApplyHandler, option); }
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
