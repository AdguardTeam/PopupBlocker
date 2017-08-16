const SupportedLocales = {
    "en": "RESOURCE:EN_TRANSLATIONS"
};

let currentLocale = null;
if (typeof AdguardSettings !== 'undefined') {
    var locale = AdguardSettings.locale;
    if (SupportedLocales[locale]) {
        currentLocale = locale;
    }
}
if (!currentLocale) {
    currentLocale = 'en';
}

const getMessage = (messageId:string):string => {
    let message = SupportedLocales[currentLocale][messageId];
    // @ifdef DEBUG
    if (!message) { throw messageId + ' not localized'; }
    // @endif
    return message['message'];
};

type stringmap = {
    [id:string]:string
};

// Marks start of placeholders, ${...} or <.../>.
const rePhStart = /(?:\${|<)/;
function parseMessage(message:string, context:stringmap):(string|number)[] {
    const res:(string|number)[] = [];
    let text:string = '';
    let match:RegExpMatchArray;
    let ind:number, i:number;
    while (message) {
        match = rePhStart.exec(message);
        if (!match) {
            text += message;
            res.push(text);
            return res;
        } else {
            ind = match.index;
            text += message.substr(0, ind);
            if (match[0].charCodeAt(0) === 36 /* $ */) {
                ind += 2;
                i = message.indexOf('}', ind);
                let messageId = message.slice(ind, i);
                let rep = context[messageId];
                if (rep) { text += rep; }
                message = message.slice(i + 1);
            } else {
                ind++;
                i = message.indexOf('/>', ind);
                res.push(text);
                text = '';
                let num = message.charCodeAt(ind) - 48; // parseInt(*, 10)
                res.push(num);
                message = message.slice(i + 2);
            }
        }
    }
    if (text) { res.push(text); }
    return res;
}

export default function translate(root:Element, context:stringmap) {
    const nodeIterator = document.createNodeIterator(root, NodeFilter.SHOW_COMMENT);
    let current:Node;
    let val:string;
    while (current = nodeIterator.nextNode()) {
        val = current.nodeValue;
        if (/^i18n:/.test(val)) {
            val = val.slice(5);
            let message = getMessage(val);
            let parsed = parseMessage(message, context);
            let pr:Element = <Element><any>current.parentNode;
            if (parsed.length === 1) {
                pr.insertBefore(document.createTextNode(<string>parsed[0]), current);
                pr.removeChild(current);
            } else {
                parsed.map((el) => {
                    if (typeof el == 'number') {
                        return nthElemSib(current, el);
                    } else {
                        return document.createTextNode(el);
                    }
                }).forEach((el) => {
                    pr.insertBefore(el, current);
                });
                pr.removeChild(current);
            }
        }
    }
}

function nthElemSib(node:Node, index:number) {
    let el = node;
    while (index-- >= 0) { el = el['nextElementSibling']; }
    return el;
}
