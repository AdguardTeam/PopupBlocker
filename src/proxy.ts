import { timeline, TimelineEvent } from './timeline/index';
import WeakMap from './weakmap';

const supported = typeof Proxy !== 'undefined';
const _bind = Function.prototype.bind;
const _apply = Function.prototype.apply;
const _call = Function.prototype.call;
const _reflect = Reflect.apply;
const _toStringFn = Function.prototype.toString;

// Lodash isNative
const reRegExpChar = /[\\^$.*+?()[\]{}|]/g
const reIsNative = RegExp('^' + _toStringFn.call(Object.prototype.hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

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
    return typeof fn == 'function' && reIsNative.test(_reflect(_toStringFn, fn, []));
}

const proxyToReal = new WeakMap();
const realToProxy = new WeakMap();

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
function applyWithUnproxiedThis(target:Function, _this:Function, _arguments:IArguments|any[]) {
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
function reflectWithUnproxiedThis (target, _this:Function, _arguments:IArguments|any[]) {
    let appliedFn = _arguments[0];
    appliedFn = proxyToReal.get(appliedFn) || appliedFn;
    if (isNativeFn(appliedFn) && appliedFn !== _bind && appliedFn !== _apply && appliedFn !== _call) {
        let thisOfAppliedFn = _arguments[1];
        let unproxied = proxyToReal.get(thisOfAppliedFn);
        if (unproxied) { _arguments[1] = unproxied; }
    }
    return _reflect(target, _this, _arguments);
}

/**
 * An apply handler to make invoke handler.
 */
function invokeWithUnproxiedThis(target, _this:Function, _arguments:IArguments|any[]) {
    let unproxied = proxyToReal.get(_this);
    if (typeof unproxied == 'undefined') { unproxied = _this; }
    return _reflect(target, unproxied, _arguments);
};

export function makeObjectProxy(obj) {
    if (supported) {
        let proxy = realToProxy.get(obj);
        if (proxy) { return proxy; }
        proxy = new Proxy(obj, {
            get: function(target, prop, receiver) {
                let _receiver = proxyToReal.get(receiver) || receiver;
                timeline.registerEvent(new TimelineEvent('get ' + prop.toString(), _receiver));
                var value = Reflect.get(target, prop, _receiver);
                if (isNativeFn(value)) {
                    return new Proxy(value, {
                        apply: invokeWithUnproxiedThis
                    });
                } else {
                    return value;
                }
            },
            set: function(target, prop, value, receiver) {
                let _receiver = proxyToReal.get(receiver) || receiver;
                timeline.registerEvent(new TimelineEvent('set ' + prop.toString(), _receiver));
                return Reflect.set(target, prop, value, _receiver);
            }
        });
        realToProxy.set(obj, proxy);
        proxyToReal.set(proxy, obj);
        return proxy;
    } else {
        return obj;
    }
}

export type ApplyHandler = (target:Function, _this:any, _arguments:IArguments|any[]) => any;
export type ApplyOption = (target:Function, _this:any, _arguments:IArguments|any[]) => boolean;

const defaultApplyHandler = supported ? _reflect : (_target, _this, _arguments) => (_target.apply(_this, _arguments));

function makeFunctionWrapper(orig:Function, applyHandler:ApplyHandler) {
    let wrapped;
    if (supported) {
        wrapped = new Proxy(orig, { apply: applyHandler });
    } else {
        wrapped = function() { return applyHandler(orig, this, arguments); };
    }
    proxyToReal.set(wrapped, orig);
    return wrapped;
}

/**
 * @param {Function=} applyHandler 
 * @param {Function=} option 
 */
function makeLoggedFunctionWrapper(orig:Function, applyHandler?:ApplyHandler, option?:ApplyOption) {
    applyHandler = applyHandler || defaultApplyHandler;
    return makeFunctionWrapper(orig, function(target, _this, _arguments) {
        if (!option || option(target, _this, _arguments)) {
            timeline.registerEvent(new TimelineEvent('apply ' + orig.name, {
                this: _this,
                arguments: _arguments
            }));
        }
        return applyHandler(target, _this, _arguments);
    });
}

/** 
 * @param {Function=} applyHandler
 * @param {Function=} option
 */
export function wrapMethod(obj, prop:string, applyHandler?:ApplyHandler, option?:ApplyOption) {
    if (obj.hasOwnProperty(prop)) {
        obj[prop] = makeLoggedFunctionWrapper(obj[prop], applyHandler, option);
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

/**
 * Wrap method without logging
 */
function _wrap(obj, prop:string, applyHandler:ApplyHandler) {
    if (obj.hasOwnProperty(prop)) {
        obj[prop] = makeFunctionWrapper(obj[prop], applyHandler);
    }
}

if (supported) {
    _wrap(Function.prototype, 'bind', applyWithUnproxiedThis);
    _wrap(Function.prototype, 'apply', applyWithUnproxiedThis);
    _wrap(Function.prototype, 'call', applyWithUnproxiedThis);

    _wrap(Function.prototype, 'toString', invokeWithUnproxiedThis);
    _wrap(Function.prototype, 'toSource', invokeWithUnproxiedThis);

    _wrap(Reflect, 'apply', reflectWithUnproxiedThis);
}
