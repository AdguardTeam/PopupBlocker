/* eslint-disable no-underscore-dangle */
import { ApplyHandler } from './IProxyService';
import ILoggedProxyService, { ApplyOption } from './ILoggedProxyService';
import * as ProxyService from './ProxyService';
import Timeline from '../timeline/Timeline';
import {
    TLEventType,
    TimelineEvent,
    TLEventData,
} from '../timeline/TimelineEvent';
import {
    defineProperty,
    ProxyCtor,
    reflectNamespace,
    getOwnPropertyDescriptor,
    isWindow,
    isLocation,
} from '../shared';
import { mockedWindowCollection } from '../mock-window';

export default class LoggedProxyService implements ILoggedProxyService, ProxyHandler<any> {
    constructor(
        private timeline:Timeline,
        public framePosition:number,
    ) { }

    private makeLoggedFunctionWrapper<T, R, C>(
        orig:(this:T, ...args)=>R,
        type:TLEventType,
        name:PropertyKey,
        applyHandler:ApplyHandler<T, R, C> = ProxyService.defaultApplyHandler,
        option?:ApplyOption<T>,
    ):(this:T, ...args)=>R {
        return ProxyService.makeSafeFunctionWrapper<T, R>(orig, (execCtxt, _arguments) => {
            const context = <C>{};
            const { thisArg } = execCtxt;
            let data:TLEventData<C>;
            if (typeof option === 'undefined' || (<ApplyOption<T>>option)(orig, thisArg, _arguments)) {
                data = {
                    thisOrReceiver: thisArg,
                    arguments: _arguments,
                    externalContext: context,
                };
            }
            // Must register the event to a timeline after invoking the applyHandler.
            const ret = applyHandler(execCtxt, _arguments, context);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            data && this.timeline.registerEvent(new TimelineEvent(type, name, data), this.framePosition);
            return ret;
        });
    }

    wrapMethod<T, R, C=never>(obj, prop:string, applyHandler?:ApplyHandler<T, R, C>, option?:ApplyOption<T>) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            // eslint-disable-next-line no-param-reassign
            obj[prop] = this.makeLoggedFunctionWrapper<T, R, C>(
                obj[prop],
                TLEventType.APPLY,
                prop,
                applyHandler,
                option,
            );
        }
    }

    wrapAccessor<T, R, C=never>(
        obj,
        prop:string,
        getterApplyHandler?:ApplyHandler<T, R, C>,
        setterApplyHandler?:ApplyHandler<T, R>,
        option?:ApplyOption<T>,
    ):void {
        const desc = getOwnPropertyDescriptor(obj, prop);
        if (desc && desc.get && desc.configurable) {
            const getter = this.makeLoggedFunctionWrapper(desc.get, TLEventType.GET, prop, getterApplyHandler, option);
            let setter;
            if (desc.set) {
                setter = this.makeLoggedFunctionWrapper<T, void, C>(
                    desc.set,
                    TLEventType.SET,
                    prop,
                    setterApplyHandler,
                    option,
                );
            }
            defineProperty(obj, prop, {
                get: getter,
                set: setter,
                configurable: true,
                enumerable: desc.enumerable,
            });
        }
    }

    /**
     * Below methods are only used in DEBUG mode for `makeObjectProxy` method.
     */
    get(target, prop:PropertyKey, receiver) {
        const _receiver = ProxyService.proxyToReal.get(receiver) || receiver;
        const data:TLEventData = { thisOrReceiver: _receiver };
        this.timeline.registerEvent(
            new TimelineEvent(TLEventType.GET, prop, data),
            this.framePosition,
        );
        const value = reflectNamespace.reflectGet(target, prop, _receiver);
        if (ProxyService.isNativeFn(value)) {
            return ProxyService.makeFunctionWrapper(value, ProxyService.invokeWithUnproxiedThis);
        }
        if ((!NO_PROXY && prop === 'location' && mockedWindowCollection.get(target))
            || (isLocation(value) || isWindow(value))
        ) {
            // TODO make preprocessor plugin to cut these from beta and release builds

            // We deep-proxy such objects.
            // Such `value` objects won't be used as arguments of built-in functions, which may
            // depend on internal slots of its arguments.
            // For instance, `createNodeIterator` does not work if its first arguments is a proxied `Node` instance.

            // Fix https://github.com/AdguardTeam/PopupBlocker/issues/52
            // We should not deep-proxy when it is impossible to return proxy
            // due to invariants imposed to `Proxy`.
            // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
            const desc = reflectNamespace.reflectGetOwnProperty(target, prop);
            if (desc && desc.writable === false && desc.configurable === false) {
                return value;
            }
            return this.makeObjectProxy(value);
        }
        return value;
    }

    set(target, prop:PropertyKey, value, receiver) {
        const _receiver = ProxyService.proxyToReal.get(receiver) || receiver;
        const data:TLEventData = {
            thisOrReceiver: _receiver,
            arguments: [value],
        };
        this.timeline.registerEvent(
            new TimelineEvent(TLEventType.SET, prop, data),
            this.framePosition,
        );
        return reflectNamespace.reflectSet(target, prop, value, _receiver);
    }

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
