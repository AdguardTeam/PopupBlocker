import { isUndef } from "../../shared/instanceof";

export function trustedEventListener(listener:(evt?:UIEvent)=>void, __this:object):(evt?:UIEvent)=>void {
    return (evt:UIEvent) => {
        if (!evt || evt.isTrusted) {
            listener.call(__this, evt);
            evt && evt.preventDefault();
        }
    };
}

export function getByClsName(className:string, element:Element|Document = document) {
    return element.getElementsByClassName(className);
}

export function concatStyle(style:string[], important:boolean):string {
    let cssText = '';
    for (let i = 0, l = style.length; i < l; i++) {
        cssText += style[i] + ':' + style[++i];
        if (important) { cssText += '!important' }
        cssText += ';';
    }
    return cssText;
}

let safeDoc:HTMLDocument
export function getSafeDocument():HTMLDocument {
    if (isUndef(safeDoc)) {
        safeDoc = document.implementation.createHTMLDocument('');
    }
    return safeDoc;
}
