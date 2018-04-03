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
        export function content(param:any):string;
    }
    export default popupblockerOptionsUI;
}

declare module 'goog:popupblockerNotificationUI' {
    namespace popupblockerNotificationUI {
        export function toast(param:any):string;
    }
    export default popupblockerNotificationUI;
}