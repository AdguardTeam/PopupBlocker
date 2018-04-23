declare module 'goog:popupblockerUI' {
    namespace popupblockerUI {
        export function head(param:any):string;
        export function content(param:any):string;
    }
    export default popupblockerUI;
}

declare module 'goog:popupblockerOptionsUI' {
    namespace popupblockerOptionsUI {
        export function outer():string;
        export function modal():string;
        export function content(param:any):string;
    }
    export default popupblockerOptionsUI;
}

declare module 'goog:popupblockerUserscriptOptionsUI' {
    namespace popupblockerUserscriptOptionsUI {
        export function title():string;
        export function loading_subtitle():string;
        export function footer():string;
        export function noinstalled():string;
    }
    export default popupblockerUserscriptOptionsUI;
}

declare module 'goog:popupblockerNotificationUI' {
    namespace popupblockerNotificationUI {
        export function toast(param:any):string;
    }
    export default popupblockerNotificationUI;
}