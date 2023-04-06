import { isUndef } from '../../shared';

export function trustedEventListener(listener:(evt?:UIEvent)=>void, __this:object):(evt?:UIEvent)=>void {
    return (evt:UIEvent) => {
        if (!evt || evt.isTrusted) {
            listener.call(__this, evt);
            if (evt) {
                evt.preventDefault();
            }
        }
    };
}

export function concatStyle(style:string[], important:boolean):string {
    let cssText = '';
    for (let i = 0, l = style.length; i < l; i += 1) {
        // eslint-disable-next-line no-plusplus
        cssText += `${style[i]}:${style[++i]}`;
        if (important) { cssText += '!important'; }
        cssText += ';';
    }
    return cssText;
}

let safeDoc:Document;
export function getSafeDocument():Document {
    if (isUndef(safeDoc)) {
        safeDoc = document.implementation.createHTMLDocument('');
    }
    return safeDoc;
}
