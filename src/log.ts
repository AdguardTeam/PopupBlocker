// @ifdef DEBUG
import getTime from './timeline/time';

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

export function connect<T extends (...args)=>any>(fn:T, message:string):T {
    // @ifdef DEBUG
    return <T>function () {
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
