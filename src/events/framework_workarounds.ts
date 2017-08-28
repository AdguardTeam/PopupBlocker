/**
 * @fileoverview Current popup detection mechanism relies heavily on `Event#currentTarget`,
 * and some JS frameworks that use event delegation tend to hide event listeners' intended target.
 * For popular frameworks among such, we attempt to utilize frameworks' specifics to provide
 * a way to retrieve an intended target, or at least detect it in order to reduce false-positives.
 * Such workarounds are not very robust, hence 'attempt', but it will still provide huge benefit to users.
 */

const _data = '_data', originalEvent = 'originalEvent', selector = 'selector';
/**
 * A function to retrieve target selectors from jQuery event delegation mechanism.
 * When an event handler is bound with jQuery like this:
 * `$('html').on('click', '.open-newtab', function(evt) { ... })`
 * inside of the event handler function, `evt.currentTarget` will be `document.documentElement`.
 * When this function is called with `evt`, it will return `'.open-newtab'`, and from this we know that
 * the event handler is not supposed to be called when user clicks anywhere.
 * 
 * It makes use of an undocumented static method `_data` of `jQuery`. It has existed for a long time
 * and not likely to be removed in a near future according to https://github.com/jquery/jquery/issues/2583.
 * @param event 
 */
export function getSelectorFromCurrentjQueryEventHandler(event:Event):string|undefined {
    let jQuery:JQueryStatic = window['jQuery'] || window['$'];
    if (!jQuery || !jQuery[_data]) { return; }
    let current = event.currentTarget;
    let type = event.type;
    let eventsData = jQuery[_data](current, 'events');
    if (!eventsData) { return; }
    let registeredHandlers = eventsData[type];
    if (!registeredHandlers) { return; }
    let handlerObj;
    for (let i = 0, l = registeredHandlers.length; i < l; i++) {
        if (handlerObj = registeredHandlers[i]) {
            let handler = handlerObj.handler;
            let args = handler.arguments; // Using Function.arguments, so it may not work on handlers that are nested in call stack
            if (args !== null && args[0] && args[0].originalEvent === event) {
                return handlerObj[selector];
            }
        }
    }
}

// These are type declarations for jQuery only for the parts we need to access.
declare interface JQueryEvent {
    originalEvent:Event
}

declare interface JQueryHandlerObj {
    handler:(evt:JQueryEvent)=>any,
    selector:string
}

declare interface JQueryStatic {
    _data:(elem:EventTarget, name:string, value?:any)=>{[id:string]:JQueryHandlerObj[]}
}

declare const jQuery:JQueryStatic;
declare const $:JQueryStatic;

/**
 * React production build by default attaches an event listener to `document`
 * and processes all events in its internel 'event hub'. It should be possible
 * to retrieve information about the intended target component or target element
 * technically, but for now, we instead fallback to allowing events whose `currentTarget`
 * is `document`. It needs to be improved if it causes missed popups on websites
 * which use react and popups at the same time, or it is challenged by popup scripts.
 */
const reactRootSelector = '[data-reactroot]';
export function isReactInstancePresent():boolean {
    return !!document.querySelector(reactRootSelector);
}
