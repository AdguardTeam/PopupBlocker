export default interface IProxyService {
    /**
     * These are the most used method of the ProxyService. It internally calls makeFunctionWrapper
     * to re-define a property owned by obj.
     */
    wrapMethod<T, R>(obj:T, prop:PropertyKey, applyHandler?:ApplyHandler<T, R>):void
    wrapAccessor<T, R>(
        obj:T,
        prop:PropertyKey,
        getterApplyHandler?:ApplyHandler<T, R>,
        setterApplyHandler?:ApplyHandler<T, any>
    )
    makeObjectProxy<T extends object>(obj:T):T
}

export interface IWrappedExecutionContext<T, R> {
    readonly thisArg:T
    /**
     * @param thisArg was made optional just because it is identical to this.thisArg in most of cases.
     */
    invokeTarget(args:IArguments, thisArg?:T):R
}

export type ApplyHandler<T, R, C=never> = (
    ctxt:IWrappedExecutionContext<T, R>,
    _arguments:IArguments,
    externalContext?:C
) => R;
