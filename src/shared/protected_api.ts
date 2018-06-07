export const defineProperty = Object.defineProperty;
export const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
export const getPrototypeOf = Object.getPrototypeOf;
export const create = Object.create;
export const getOwnPropertyNames = Object.getOwnPropertyNames;
export const objectKeys = Object.keys;
export const hasOwnProperty = Object.prototype.hasOwnProperty;
export const toString = Object.prototype.toString;
export const functionApply = Function.prototype.apply;
export const functionCall = Function.prototype.call;
export const functionBind = Function.prototype.bind;
export const functionToString = Function.prototype.toString;
export const regexpExec = RegExp.prototype.exec;
export const ProxyCtor = window.Proxy;
// Conditional export workaround for tsickle
export const reflectNamespace:{
    reflectGetOwnProperty?:typeof Reflect.getOwnPropertyDescriptor,
    reflectDefineProperty?:typeof Reflect.defineProperty,
    reflectGet?:typeof Reflect.get,
    reflectSet?:typeof Reflect.set,
    reflectDeleteProperty?:typeof Reflect.deleteProperty,
    reflectOwnKeys?:typeof Reflect.ownKeys,
    reflectApply?:typeof Reflect.apply
} = {};
if (ProxyCtor) {
    reflectNamespace.reflectGetOwnProperty = Reflect.getOwnPropertyDescriptor;
    reflectNamespace.reflectDefineProperty = Reflect.defineProperty;
    reflectNamespace.reflectGet = Reflect.get;
    reflectNamespace.reflectSet = Reflect.set;
    reflectNamespace.reflectDeleteProperty = Reflect.deleteProperty;
    reflectNamespace.reflectOwnKeys = Reflect.ownKeys;
    reflectNamespace.reflectApply = Reflect.apply;
}
export const MO = window.MutationObserver || window.WebKitMutationObserver
export const MessageChannelCtor = window.MessageChannel;
export const setTimeout = window.setTimeout.bind(window);
export const getContentWindow = getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow').get;
export const getContentDocument = getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentDocument').get;
export const captureStackTrace = Error.captureStackTrace;
export const noop = () => {};

//

declare global {
    interface Window {
        MutationObserver?:typeof MutationObserver,
        WebKitMutationObserver?:typeof MutationObserver
        Object:typeof Object
        Proxy:typeof Proxy
    }
    interface ErrorConstructor {
        captureStackTrace(err:Error, ctor?:Function):void
    }
}
