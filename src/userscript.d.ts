/**
 * @fileoverview Includes several type definition of special objects/functions that can be used by userscripts.
 */

interface DefineAs {
    defineAs:PropertyKey
}

declare function createObjectIn(target:object, option:DefineAs):any;
declare function cloneInto<T extends Object>(obj:T, target:object, option:DefineAs):T;
declare function exportFunction<T extends Function>(fn:T, obj:object, option:DefineAs):T

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
