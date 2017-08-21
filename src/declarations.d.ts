declare function popupBlocker(window, KEY?:string, option?):any;
declare const KEY:string;
declare const _BRIDGE_KEY:string;

declare function InstallTrigger();

declare function exporter();

interface Bridge {
    domain:string,
    domainOption:DomainOption,
    whitelistedDestinations:string[],
    showAlert:(orig_domain:string, popup_domain:string, isGeneric:boolean)=>void
}

interface DomainOption {
    whitelisted:boolean,
    use_strict:boolean
}

interface PopupNotificationMsgIntf {
    orig_domain:string,
    popup_domain:string,
    isGeneric:boolean
}

// Non-standard DOM apis

interface Document {
    documentMode?: number;
}

interface Event {
    path?: EventTarget[],
    composedPath?:()=>EventTarget[]
}
