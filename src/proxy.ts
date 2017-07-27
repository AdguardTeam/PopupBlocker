import { timeline, TimelineEvent } from './timeline';
import WeakMap from './weakmap';

const supported = typeof Proxy !== 'undefined';

// Lodash isNative
const reRegExpChar = /[\\^$.*+?()[\]{}|]/g
const reIsNative = RegExp('^' + Function.prototype.toString.call(Object.prototype.hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

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
    return typeof fn == 'function' && reIsNative.test(<string><any>fn);
}

const proxyToReal = new WeakMap();

const _bind = Function.prototype.bind;
const _apply = Function.prototype.apply;
const _call = Function.prototype.call;    

/**
 * An apply handler to be used to proxy Function#(bind, apply, call) methods.
 * @param target Must be one of Function#(bind, apply, call).
 * @param thisArg A function which called (bind, apply, call).
 * @param argsList
 */
function applyWithUnproxiedThis(target:Function, thisArg:Function, argsList:IArguments|any[]) {
    // Convert argsList[0] to its unproxied version
    // When it is kind of object which may depend on its internal slot
    if (isNativeFn(thisArg) && thisArg !== _bind && thisArg !== _apply && thisArg !== _call) {
        // Function#(bind, apply, call) does not depend on the target's internal slots.
        // In (Function.prototype.call).apply(Function.prototype.toString, open)
        // we should not convert Function.prototype.toString to the original function.
        var thisOfReceiver = argsList[0];
        var unproxied = proxyToReal.get(thisOfReceiver);
        if (unproxied) { argsList[0] = unproxied; }
    }
    return Reflect.apply(target, thisArg, argsList);
};

/**
 * An apply handler to make invoke handler.
 */
function invokeWithUnproxiedThis(target, thisArg:Function, argsList:IArguments|any[]) {
    let unproxied = proxyToReal.get(thisArg);
    if (typeof unproxied == 'undefined') { unproxied = thisArg; }
    return Reflect.apply(target, unproxied, argsList);
};

export function makeObjectProxy(obj) {
    if (supported) {
        var proxy = new Proxy(obj, {
            get: function(target, prop, receiver) {
                timeline.registerEvent(new TimelineEvent('get', receiver));
                var value = Reflect.get(target, prop, receiver);
                if (isNativeFn(value)) {
                    return new Proxy(value, {
                        apply: invokeWithUnproxiedThis
                    });
                } else {
                    return value;
                }
            },
            set: function(target, prop, value, receiver) {
                timeline.registerEvent(new TimelineEvent('set', receiver));
                return Reflect.set(target, prop, value, receiver);
            }
        });
        proxyToReal.set(proxy, obj);
        return proxy;
    } else {
        return obj;
    }
}

export type ApplyHandler = (target:Function, _this:any, _arguments:IArguments|any[]) => any;

const defaultApplyHandler = supported ? Reflect.apply : (_target, _this, _arguments) => (_target.apply(_this, _arguments));

/**
 * 
 * @param {boolean=} excludeLog 
 */
function makeFunctionWrapper(orig:Function, applyHandler:ApplyHandler, excludeLog?:boolean) {
    applyHandler = applyHandler || defaultApplyHandler;
    var wrapped;
    if (supported) {
        if (excludeLog) {
            wrapped = new Proxy(orig, { apply: applyHandler });
        } else {
            wrapped = new Proxy(orig, {
                apply: function(target, thisArg, argsList) {
                    timeline.registerEvent(new TimelineEvent('apply', {
                        this: thisArg,
                        arguments: argsList
                    }));
                    return applyHandler(target, thisArg, argsList);
                }
            });
        }
    } else {
        if (excludeLog) {
            wrapped = function() { return applyHandler(orig, this, arguments); };
        } else {
            wrapped = function() {
                timeline.registerEvent(new TimelineEvent('apply', {
                    this: this,
                    arguments: arguments
                }));
                return applyHandler(orig, this, arguments);
            };
        }
    }
    proxyToReal.set(wrapped, orig);
    return wrapped;
}

/** 
 * @param {boolean=} excludeLog 
 */
export function wrapMethod(obj, prop:string, applyHandler:ApplyHandler, excludeLog?:boolean) {
    if (obj.hasOwnProperty(prop)) {
        obj[prop] = makeFunctionWrapper(obj[prop], applyHandler, excludeLog);
    }
}

/**
 * @param {Function=} getterApplyHandler 
 * @param {Function=} setterApplyHandler 
 */
export function wrapAccessor(obj, prop:string, getterApplyHandler?:ApplyHandler, setterApplyHandler?:ApplyHandler) {
    var desc = Object.getOwnPropertyDescriptor(obj, prop);
    if (desc && desc.get && desc.configurable) {
        var getter = makeFunctionWrapper(desc.get, getterApplyHandler);
        var setter;
        if (desc.set) { setter = makeFunctionWrapper(desc.set, setterApplyHandler); }
        Object.defineProperty(obj, prop, {
            get: getter,
            set: setter,
            configurable: true,
            enumerable: desc.enumerable
        });
    }
}

if (supported) {
    wrapMethod(Function.prototype, 'bind', applyWithUnproxiedThis, true);
    wrapMethod(Function.prototype, 'apply', applyWithUnproxiedThis, true);
    wrapMethod(Function.prototype, 'call', applyWithUnproxiedThis, true);

    wrapMethod(Function.prototype, 'toString', invokeWithUnproxiedThis, true);
    wrapMethod(Function.prototype, 'toSource', invokeWithUnproxiedThis, true);
}
