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

function call(msg: string): void {
    // @ifdef DEBUG
    console.group(prefix + msg + suffix);
    // @endif
}

function callEnd (): void {
    // @ifdef DEBUG
    console.groupEnd();
    // @endif
}

/**
 * @param {*=} obj
 */
function print(str: string, obj?): void {
    // @ifdef DEBUG
    let date = getTime().toFixed(3);
    let indent = 10 - date.length;
    if (indent < 0) { indent =0; }
    let indentstr = ' '.repeat(indent);
    console.log(prefix + `[${indentstr}${date}]: ${str}${suffix}`);
    if (obj !== undefined) {
        console.log(prefix + '=============================');
        console.log(obj);
        console.log(prefix + '=============================');
    }
    // @endif
}

export {call, callEnd, print};