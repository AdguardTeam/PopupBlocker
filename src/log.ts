// @ifdef DEBUG
import { getTime } from './timeline/index';

let prefix = '';
let win = window;
while (win.parent !== win) {
    win = win.parent;
    prefix += '-- ';
}
let loc = location.href;
let suffix = `    (at ${loc})`;
// @endif

export function call(msg: string): void {
    // @ifdef DEBUG
    console.group(prefix + msg + suffix);
    // @endif
}

export function callEnd (): void {
    // @ifdef DEBUG
    console.groupEnd();
    // @endif
}

/**
 * @param {*=} obj
 */
export function print(str: string, obj?): void {
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


export function connect(fn, message:string) {
    // @ifdef DEBUG
    return function () {
        call(message);
        let ret = fn.apply(this, arguments);
        callEnd();
        return ret;
    };
    // @endif
    // @ifndef DEBUG
    return fn;
    // @endif
}
