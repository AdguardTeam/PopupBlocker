import { isWindow, isLocation } from '../shared/instanceof';
import WeakMap from '../shared/WeakMap';
import {
    defineProperty,
    functionBind as _bind,
    functionApply as _apply,
    functionCall as _call,
    functionToString as _toStringFn,
    regexpExec as _exec,
    hasOwnProperty,
    reflectNamespace,
    ProxyCtor,
    getOwnPropertyDescriptor,
    captureStackTrace
} from '../shared/protected_api'
import { IWrappedExecutionContext, ApplyHandler } from './IProxyService';
import * as debug from '../shared/debug';

export let use_proxy = false;
// @ifndef NO_PROXY
use_proxy = typeof ProxyCtor !== 'undefined';
// @endif
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
export const _reflect = ProxyCtor ?
    reflectNamespace.reflectApply :
    (function() {
        /**
         * It is not possible to emulate `Reflect.apply` simply with references to `Function#apply`
         * and such.
         * Instead, we create a random property key, and attach `Function#call` as a
         * non-writable non-enumerable non-configurable property of `Function#apply` and use it
         * to call `Function.prototype.apply.call`.
         * @todo make this success deterministically
         */
        let PRIVATE_PROPERTY:number;
        do {
            PRIVATE_PROPERTY = Math.random();
        } while (PRIVATE_PROPERTY in _apply)
        defineProperty(_apply, PRIVATE_PROPERTY, { value: _call });
        return (target, thisArg, args) => {
            return _apply[PRIVATE_PROPERTY](target, thisArg, args);
        };
    })();

// Lodash isNative
const reRegExpChar = /[\\^$.*+?()[\]{}|]/g
const reIsNative = new RegExp('^' + _toStringFn.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

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
export const isNativeFn = function (fn:Function):boolean {
    if (typeof fn !== 'function') { return false; }

    if (fn === _bind || fn === _call || fn === _apply || fn === _toStringFn || fn === _exec) {
        // This is our assumption. If, for example, another browser extension modifies them before us,
        // It is their responsibility to do so transparently.
        return true;
    }

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
    return _reflect(_exec, reIsNative, [tostr]) !== null;
}

export const proxyToReal = new WeakMap();
export const realToProxy = new WeakMap();

export type RawApplyHandler<T,R> = (target:Function, _this:T, _arguments:IArguments|any[], context?:any) => R;

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
const applyWithUnproxiedThis:RawApplyHandler<Function,any> = (target, _this, _arguments) => {
    // Convert _arguments[0] to its unproxied version
    // When it is kind of object which may depend on its internal slot
    let _caller = proxyToReal.get(_this) || _this;
    if (_caller !== _bind && _caller !== _apply && _caller !== _call && isNativeFn(_caller) ) {
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
const reflectWithUnproxiedThis:RawApplyHandler<Function,any> = (target, _this, _arguments) => {
    let appliedFn = _arguments[0];
    appliedFn = proxyToReal.get(appliedFn) || appliedFn;
    if (appliedFn !== _bind && appliedFn !== _apply && appliedFn !== _call && isNativeFn(appliedFn) ) {
        let thisOfAppliedFn = _arguments[1];
        let unproxied = proxyToReal.get(thisOfAppliedFn);
        if (unproxied) { _arguments[1] = unproxied; }
    }
    return _reflect(target, _this, _arguments);
};

/**
 * An apply handler to make invoke handler.
 */
export const invokeWithUnproxiedThis:RawApplyHandler<Function,any> = (target, _this, _arguments) => {
    let unproxied = proxyToReal.get(_this);
    if (typeof unproxied == 'undefined') { unproxied = _this; }
    return use_proxy ? _reflect(target, unproxied, _arguments) : target.apply(unproxied, _arguments);
};

/**
 * An apply handler to be used for MessageEvent.prototype.source.
 */
const proxifyReturn:RawApplyHandler<any,any> = (target, _this, _arguments) => {
    let ret = _reflect(target, _this, _arguments);
    let proxy = realToProxy.get(ret);
    if (proxy) { ret = proxy; }
    return ret;
};

export function makeFunctionWrapper<T,R>(orig:(this:T,...args)=>R, applyHandler:RawApplyHandler<T,R>):(this:T,...args)=>R {
    let wrapped;
    let proxy = realToProxy.get(orig);
    if (proxy) { return proxy; }
    if (use_proxy) {
        wrapped = new ProxyCtor(orig, { apply: applyHandler });
    } else {
        wrapped = function() { return applyHandler(orig, this, arguments); };
        copyProperty(orig, wrapped, 'name');
        copyProperty(orig, wrapped, 'length');
    }
    proxyToReal.set(wrapped, orig);
    realToProxy.set(orig, wrapped);
    return wrapped;
}

function copyProperty(orig, wrapped, prop:PropertyKey) {
    let desc = getOwnPropertyDescriptor(orig, prop);
    if (desc && desc.configurable) {
        desc.value = orig[prop];
        defineProperty(wrapped, prop, desc);
    }
}

function _wrapMethod(obj, prop:string, applyHandler?:RawApplyHandler<Function,any>) {
    if (obj.hasOwnProperty(prop)) {
        obj[prop] = makeFunctionWrapper(obj[prop], applyHandler);
    }
}

function _wrapAccessor(obj, prop:string, getterApplyHandler?:RawApplyHandler<Function,any>, setterApplyHandler?:RawApplyHandler<Function,any>):void {
    const desc = getOwnPropertyDescriptor(obj, prop);
    if (desc && desc.get && desc.configurable) {
        var getter = makeFunctionWrapper(desc.get, getterApplyHandler);
        var setter;
        if (desc.set) { setter = makeFunctionWrapper(desc.set, setterApplyHandler); }
        defineProperty(obj, prop, {
            get: getter,
            set: setter,
            configurable: true,
            enumerable: desc.enumerable
        });
    }
}

export function $apply(window:Window) {
    const functionPrototype = window.Function.prototype;
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

export class ProxyServiceExternalError {
    constructor(
        public original:any
    ) {  }
}

/**
 * Internal errors shall not be re-thrown and will be reported in dev versions.
 */
function reportIfInternalError(error, target):error is ProxyServiceExternalError {
    if (error instanceof ProxyServiceExternalError) { return true; }
    debug.print(`Internal error from proxyService:`, error);
    debug.print(`from a target:`, target);
    return false;
}

/**
 * This addresses {@link https://github.com/AdguardTeam/PopupBlocker/issues/91}
 */
class WrappedExecutionContext<T,R> implements IWrappedExecutionContext<T,R> {
    public originalInvoked = false // friend class ProxyService
    constructor(
        private orig:any,
        public thisArg:T,
        private wrapper
    ) {
        // Can't use this.invokeTarget = this.invokeTarget.bind(this); as it accesses unsafe functions.
        this.invokeTarget = _reflect(_bind, this.invokeTarget, [this]);
    }
    // Throws ProxyServiceExternalError
    invokeTarget(args:IArguments, thisArg:T = this.thisArg):R {
        if (this.originalInvoked) {
            debug.throwMessage("A wrapped target was invoked more than once.", 1);
        }
        this.originalInvoked = true;
        try {
            // Calls `this.orig`, using Reflect.apply when supported.
            return _reflect(this.orig, thisArg, args);
        } catch (e) {
            // Errors thrown from target functions are re-thrown.
            if (captureStackTrace) {
                // When possible, strip out inner functions from stack trace
                try {
                    captureStackTrace(e, this.wrapper);
                } catch(e) {
                    // `e` thrown from this.orig may not be an instance of error
                    // and in such caes captureStackTrace will throw.
                }
                
            }
            throw new ProxyServiceExternalError(e);
        }
    }
}

export const defaultApplyHandler = <T,R>(ctxt:IWrappedExecutionContext<T,R>, args:IArguments):R => {
    return ctxt.invokeTarget(args);
}

export function makeSafeFunctionWrapper<T,R>(orig:(this:T,...args)=>R, applyHandler:ApplyHandler<T,R> = defaultApplyHandler):(this:T,...args)=>R {
    let wrapped;
    const rawApplyHandler = (orig, _this, _arguments) => {
        const context:WrappedExecutionContext<any,any> = new WrappedExecutionContext<any,any>(orig, _this, wrapped);
        try {
            return applyHandler(context, _arguments);
        } catch (error)  {
            if (!context.originalInvoked) {
                reportIfInternalError(error, orig); // e cannot be an external error.
                try {
                    return context.invokeTarget(_arguments);
                } catch (e) {
                    error = e;
                }
            }
            if (reportIfInternalError(error, orig)) {
                // Re-throws an external error.
                throw error.original;
            }
        }
    }
    wrapped = makeFunctionWrapper(orig, rawApplyHandler);
    return wrapped;
}

export function wrapMethod(obj, prop:string, applyHandler?:ApplyHandler<Function,any>) {
    if (obj.hasOwnProperty(prop)) {
        obj[prop] = makeSafeFunctionWrapper(obj[prop], applyHandler);
    }
}
