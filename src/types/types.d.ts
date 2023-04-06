/**
 * PopupBlocker wraps the page script with a function, in order to run itself in iframes.
 * We declare
 *  - the wrapper function (popupBlocker),
 *  - the function's arguments, which are used as a global variable throughout
 *    the page script.
 *
 * @param CONTENT_SCRIPT_KEY It is used for communication between a userscript and
 * page script injected by the userscript.
 */
declare function popupBlocker(window, CONTENT_SCRIPT_KEY?:string):any;
/**
 * `window[CONTENT_SCRIPT_KEY]` will be contentApiFacade created by content script and
 * passed to page script.
 */
declare const CONTENT_SCRIPT_KEY:string;

interface Window {
    popupBlocker:typeof popupBlocker
}
declare function InstallTrigger();

// Non-standard DOM apis that are not understood by either Typescript or
// Closure Compiler are included here.
interface Document {
    documentMode?: number,
    elementsFromPoint(x:number, y:number):Element[],
    msElementsFromPoint(x:number, y:number):NodeListOf<Element>
}

interface Window {
    Window:typeof Window
    Node:typeof Node
    EventTarget:typeof EventTarget
    HTMLElement:typeof HTMLElement
    HTMLIFrameElement:typeof HTMLIFrameElement
    HTMLFormElement:typeof HTMLFormElement
    HTMLObjectElement:typeof HTMLObjectElement
    Event:typeof Event
    Function:typeof Function
    Reflect:typeof Reflect
    MessageEvent:typeof MessageEvent
    Document:typeof Document
    msCrypto?:Crypto
    MessageChannel:typeof MessageChannel
    XMLHttpRequest: typeof XMLHttpRequest
}

// Workaround for [Symbol.toStringTag] requirement of TS
interface IWeakMap<K extends object, V> {
    delete(key: K): boolean;
    get(key: K): V | undefined;
    has(key: K): boolean;
    set(key: K, value: V): this;
}

interface IWeakMapCtor {
    new (): IWeakMap<object, any>;
    new <K extends object, V>(entries?: [K, V][]): IWeakMap<K, V>;
    readonly prototype: IWeakMap<object, any>;
}

// Misc
type func = (...args)=>any;

interface stringmap<T> {
    [id: string]:T
}

type StringMap = stringmap<string>;

declare const DEBUG: boolean;
declare const RECORD: boolean;
declare const NO_PROXY: boolean;
