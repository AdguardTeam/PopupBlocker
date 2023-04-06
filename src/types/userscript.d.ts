/**
 * @fileoverview Includes several type definition of special objects/functions that can be used by userscripts.
 */

// Firefox export helpers

interface DefineAs {
    defineAs:PropertyKey,
}

interface exportFunctionOption {
    defineAs:PropertyKey,
    allowCrossOriginArguments?:boolean
}

interface cloneIntoOption {
    cloneFunctions?:boolean,
    wrapReflectors?:boolean
}

declare function createObjectIn(target:object, option:DefineAs):any;
declare function cloneInto<T extends Object>(obj:T, target:object, option?:cloneIntoOption):T;
declare function exportFunction<T extends (...args)=>any>(fn:T, obj:object, option?:exportFunctionOption):T;

// API specific to AdGuard userscript engine

declare const AdguardSettings:{
    feedbackUrl:string,
    applicationId:string,
    locale:string,
    appVersion:string,
    uniqueName:string,
    version:string,
    sendAnonymousStatistic:string,
    nonce:string
};
