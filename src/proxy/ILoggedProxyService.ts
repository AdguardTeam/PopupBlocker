import IProxyService, { ApplyHandler } from './IProxyService';

/**
 * LoggedProxyService is a ProxyService that logs events to an associated `Timeline` instance
 * whenever a wrapped method or accessor functions are called.
 * In `wrapMethod` and `wrapAccessor` call signatures, they accept an additional parameter
 * of type `ApplyOption` that can be used to filter out some of logged events.
 */
export default interface ILoggedProxyService extends IProxyService {
    /**
     * @param option When provided, a boolean value returned from this function will be used
     * to determine whether a call event has to be reported to `Timeline` or not.
     */
    wrapMethod<T, R>(obj, prop:string, applyHandler?:ApplyHandler<T, R>, option?:ApplyOption<T>):void
    /**
     * @param option Same as `wrapMethod`.
     */
    wrapAccessor<T, R>(
        obj,
        prop:string,
        getterApplyHandler?:ApplyHandler<T, R>,
        setterApplyHandler?:ApplyHandler<T, R>,
        option?:ApplyOption<T>
    ):void
    /**
     * `framePosition` is used in reporting events to `Timeline` to indicate on which frame
     * the event belongs to.
     * This is exposed to a public property just to be used as a convenient way of
     * retrieving the information from `applyHandler` implementations fed to `wrapMethod`
     * and `wrapAccessor`.
     */
    readonly framePosition:number
}

export type ApplyOption<T> = (target:Function, _this:T, _arguments:IArguments | any[]) => boolean;
