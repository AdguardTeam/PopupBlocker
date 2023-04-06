/* eslint-disable no-console, prefer-rest-params */
/**
 * @fileoverview Logging functions to be used in dev channel.
 */

// TODO make preprocessor plugin to cut these from beta and release builds
// this file should be restored to named exports
// https://bit.adguard.com/projects/EXTENSIONS/repos/popup-blocker/pull-requests/123/diff#src/shared/debug.ts

import { getTime } from './time';

export const log = (() => {
    let prefix = '';
    let win = window;
    while (win.parent !== win) {
        // @ts-ignore
        win = win.parent;
        prefix += '-- ';
    }
    const loc = window.location.href;
    const suffix = `    (at ${loc})`;
    let depth = 0;

    function call(msg:string) {
        depth += 1;
        console.group(prefix + msg + suffix);
    }

    function callEnd() {
        depth -= 1;
        console.groupEnd();
    }

    function closeAllGroup() {
        while (depth > 0) {
            console.groupEnd();
            depth -= 1;
        }
    }

    function print(str:string, obj?):void {
        const date = getTime().toFixed(3);
        let indent = 10 - date.length;
        if (indent < 0) {
            indent = 0;
        }
        let indentstr = '';
        // eslint-disable-next-line no-plusplus
        while (indent-- > 0) { indentstr += ' '; }
        console.log(`${prefix}[${indentstr}${date}]: ${str}${suffix}`);
        if (obj !== undefined) {
            console.log(`${prefix}=============================`);
            try {
                console.log(obj);
            } catch (e) {
                /**
                 * According to testing, Edge 41.16299 throws some errors
                 * while printing some `Proxy` objects in console, such as
                 * new Proxy(window, { get: Reflect.get }).
                 * Strangely, just having a try-catch block enclosing it prevents errors.
                 */
                console.log('Object not printed due to an error');
            }
            console.log(`${prefix}=============================`);
        }
    }

    /**
     * Accepts a function, and returns a wrapped function that calls `call` and `callEnd`
     * automatically before and after invoking the function, respectively.
     * @param fn A function to wrap
     * @param message
     * @param cond optional argument, the function argument will be passed to `cond` function, and
     * its return value will determine whether to call `call` and `callEnd`.
     */
    type ArbitraryFunc = (...args)=>any;
    type ConditionFunc = (this: null)=>boolean;
    type IConnect = <T extends ArbitraryFunc>(fn: T, message: string, cond?: ConditionFunc) => T;

    const connect: IConnect = <T>(fn, message, cond) => <T> function () {
        // eslint-disable-next-line prefer-spread
        const shouldLog = cond ? cond.apply(null, arguments) : true;
        if (shouldLog) { call(message); }
        const ret = fn.apply(this, arguments);
        if (shouldLog) {
            callEnd();
        }
        return ret;
    };

    const connectSimplified: IConnect = (fn) => fn;

    function throwMessage(thrown: any): never {
        throw thrown;
    }

    function throwMessageSimplified(thrown: any, code: number): never {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw code;
    }

    // Debug api is only required in DEBUG mode
    if (DEBUG) {
        return {
            call,
            callEnd,
            closeAllGroup,
            print,
            connect,
            throwMessage,
        };
    }

    // For beta and release builds simple debug methods are stubbed,
    // connect() and throwMessage() methods are simplified
    const noopFunc = (): any => {};
    return {
        call: noopFunc,
        callEnd: noopFunc,
        closeAllGroup: noopFunc,
        print: noopFunc,
        connect: connectSimplified,
        throwMessage: throwMessageSimplified,
    };
})();
