import { ApplyHandler } from "./IProxyService";
import ILoggedProxyService, { ApplyOption } from './ILoggedProxyService'
import * as ProxyService from './ProxyService';
import Timeline from "../timeline/index";
import { TLEventType, TimelineEvent } from "../timeline/event";
import { defineProperty, ProxyCtor, reflectNamespace, getOwnPropertyDescriptor } from "../shared/protected_api";
import { isWindow, isLocation } from '../shared/instanceof';

// @ifndef NO_PROXY
import { mockedWindowCollection } from '../mock_window';
// @endif

// Below is prefered than writing:
//    class LoggedProxyService implements ILoggedProxyService, ProxyHandler<any>
// https://github.com/ag-grid/ag-grid/issues/1708#issuecomment-312780483
export default interface LoggedProxyService extends ProxyHandler<any> { }
export default class LoggedProxyService implements ILoggedProxyService {
    constructor(
        private timeline:Timeline,
        public framePosition:number
    ) { }
    private makeLoggedFunctionWrapper<T,R>(
        orig:(this:T,...args)=>R,
        type:TLEventType,
        name:PropertyKey,
        applyHandler:ApplyHandler<T,R> = ProxyService.defaultApplyHandler,
        option?:ApplyOption<T>
    ):(this:T,...args)=>R {
        return ProxyService.makeSafeFunctionWrapper<T,R>(orig, (execCtxt, _arguments) => {
            let context = {};
            let thisArg = execCtxt.thisArg;
            if (typeof option == 'undefined' || (<ApplyOption<T>>option)(orig, thisArg, _arguments)) {
                let data = {
                    this: thisArg,
                    arguments: _arguments,
                    context: context
                };
                this.timeline.registerEvent(new TimelineEvent(type, name, data), this.framePosition);
            }
            return applyHandler(execCtxt, _arguments, context);
        });
    }
    wrapMethod<T,R>(obj, prop:string, applyHandler?:ApplyHandler<T,R>, option?:ApplyOption<T>) {
        if (obj.hasOwnProperty(prop)) {
            obj[prop] = this.makeLoggedFunctionWrapper(obj[prop], TLEventType.APPLY, prop, applyHandler, option);
        }
    }
    wrapAccessor<T,R>(obj, prop:string, getterApplyHandler?:ApplyHandler<T,R>, setterApplyHandler?:ApplyHandler<T,R>, option?:ApplyOption<T>):void {
        const desc = getOwnPropertyDescriptor(obj, prop);
        if (desc && desc.get && desc.configurable) {
            var getter = this.makeLoggedFunctionWrapper(desc.get, TLEventType.GET, prop, getterApplyHandler, option);
            var setter;
            if (desc.set) { setter = this.makeLoggedFunctionWrapper<T,void>(desc.set, TLEventType.SET, prop, setterApplyHandler, option); }
            defineProperty(obj, prop, {
                get: getter,
                set: setter,
                configurable: true,
                enumerable: desc.enumerable
            });
        }
    }
    /**
     * Below methods are used only for `makeObjectProxy` method. For builds with `NO_PROXY`, they
     * are not used by any other code, so it is stripped out in those builds.
     */
    // @ifndef NO_PROXY
    get(target, prop:PropertyKey, receiver) {
        let _receiver = ProxyService.proxyToReal.get(receiver) || receiver;
        this.timeline.registerEvent(
            new TimelineEvent(TLEventType.GET, prop, _receiver),
            this.framePosition
        );
        var value = reflectNamespace.reflectGet(target, prop, _receiver);
        if (ProxyService.isNativeFn(value)) {
            return ProxyService.makeFunctionWrapper(value, ProxyService.invokeWithUnproxiedThis);
        } else if (
            // @ifndef NO_PROXY
            (prop === 'location' && mockedWindowCollection.get(target)) ||
            // @endif
            (isLocation(value) || isWindow(value))
        ) {
            // We deep-proxy such objects.
            // Such `value` objects won't be used as arguments of built-in functions, which may
            // depend on internal slots of its arguments.
            // For instance, `createNodeIterator` does not work if its first arguments is a proxied `Node` instance.
    
            // Fix https://github.com/AdguardTeam/PopupBlocker/issues/52
            // We should not deep-proxy when it is impossible to return proxy
            // due to invariants imposed to `Proxy`.
            // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
            let desc = reflectNamespace.reflectGetOwnProperty(target, prop);
            if (desc && desc.writable === false && desc.configurable === false) {
                return value;
            }
            return this.makeObjectProxy(value);
        } else {
            return value;
        }
    }
    set(target, prop:PropertyKey, value, receiver) {
        let _receiver = ProxyService.proxyToReal.get(receiver) || receiver;
        let data = {
            this: _receiver,
            arguments: [value]
        };
        this.timeline.registerEvent(
            new TimelineEvent(TLEventType.SET, prop, data),
            this.framePosition
        );
        return reflectNamespace.reflectSet(target, prop, value, _receiver);
    }
    // @endif
    makeObjectProxy<T extends object>(obj:T):T {
        if (!ProxyService.use_proxy || obj === null || typeof obj !== 'object') { return obj; }
        let proxy = ProxyService.realToProxy.get(obj);
        if (proxy) { return proxy; }
        proxy = new ProxyCtor(obj, this);
        ProxyService.realToProxy.set(obj, proxy);
        ProxyService.proxyToReal.set(proxy, obj);
        return proxy;
    }
}
