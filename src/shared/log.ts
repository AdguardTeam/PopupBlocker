/**
 * @fileoverview Logging functions to be used in dev channel. Function bodies are enclosed with preprocess
 * directives in order to ensure that these are stripped out by minifier in beta and release channels.
 */

// @ifdef DEBUG
import getTime from './time';

let prefix = '';
let win = window;
while (win.parent !== win) {
    win = win.parent;
    prefix += '-- ';
}
let loc = location.href;
let suffix = `    (at ${loc})`;
let depth = 0;
// @endif

export function call(msg:string) {
    // @ifdef DEBUG
    depth++;
    console.group(prefix + msg + suffix);
    // @endif
}

export function callEnd() {
    // @ifdef DEBUG
    depth--;
    console.groupEnd();
    // @endif
}

export function closeAllGroup() {
    // @ifdef DEBUG
    while (depth > 0) {
        console.groupEnd();
        depth--;
    }
    // @endif
}

export function print(str:string, obj?):void {
    // @ifdef DEBUG
    let date = getTime().toFixed(3);
    let indent = 10 - date.length;
    if (indent < 0) { indent =0; }
    let indentstr = '';
    while (indent-- > 0) { indentstr += ' '; }
    console.log(prefix + `[${indentstr}${date}]: ${str}${suffix}`);
    if (obj !== undefined) {
        console.log(prefix + '=============================');
        console.log(obj);
        console.log(prefix + '=============================');
    }
    // @endif
}

/**
 * Accepts a function, and returns a wrapped function that calls `call` and `callEnd`
 * automatically before and after invoking the function, respectively.
 * @param fn A function to wrap
 * @param message 
 * @param cond optional argument, the function argument will be passed to `cond` function, and
 * its return value will determine whether to call `call` and `callEnd`.
 */
export function connect<T extends (...args)=>any>(fn:T, message:string, cond?:(this:null)=>boolean):T {
    // @ifdef DEBUG
    return <T>function () {
        let shouldLog = cond ? cond.apply(null, arguments) : true;
        if (shouldLog) { call(message); }
        let ret = fn.apply(this, arguments);
        if (shouldLog) { callEnd(); }
        return ret;
    };
    // @endif
    // @ifndef DEBUG
    return fn;
    // @endif
}
