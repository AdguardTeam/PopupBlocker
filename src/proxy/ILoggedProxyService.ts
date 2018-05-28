import IProxyService, { ApplyHandler } from './IProxyService' ;

export default interface ILoggedProxyService extends IProxyService {
    wrapMethod<T,R>(obj, prop:string, applyHandler?:ApplyHandler<T,R>, option?:ApplyOption<T>):void
    wrapAccessor<T,R>(obj, prop:string, getterApplyHandler?:ApplyHandler<T,R>, setterApplyHandler?:ApplyHandler<T,R>, option?:ApplyOption<T>):void
    readonly framePosition:number
}

export type ApplyOption<T> = (target:Function, _this:T, _arguments:IArguments|any[]) => boolean;
