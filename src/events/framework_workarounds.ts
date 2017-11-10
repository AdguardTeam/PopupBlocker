/**
 * @fileoverview Current popup detection mechanism relies heavily on `Event#currentTarget`,
 * and some JS frameworks that use event delegation tend to hide event listeners' intended target.
 * For popular frameworks among such, we attempt to utilize frameworks' specifics to provide
 * a way to retrieve an intended target, or at least detect it in order to reduce false-positives.
 * Such workarounds are not very robust, hence 'attempt', but it will still provide huge benefit to users.
 */

import { closest } from '../shared/dom';
import { isElement } from '../shared/instanceof';

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
            try {
                // Using Function.arguments, so it may not work on handlers that are nested in call stack
                let args = handler.arguments;
                if (args !== null && args[0] && args[0].originalEvent === event) {
                    return handlerObj[selector];
                }
            } catch(e) {
                continue;
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
const reactIdSelector = '[data-reactid]';
export function isReactInstancePresent():boolean {
    return !!document.querySelector(reactRootSelector) || !!document.querySelector(reactIdSelector);
}

/**
 * https://github.com/google/jsaction
 */
export function jsActionTarget(event:Event):EventTarget {
    let target = event.target;
    if (isElement(target)) {
        let type = event.type;
        let possibleTarget = closest(target, `[jsaction*="${type}:"]`);
        if (possibleTarget && possibleTarget.hasOwnProperty('__jsaction')) {
            let action = (<JsActionNode><any>possibleTarget)['__jsaction'];
            if (action.hasOwnProperty(type)) {
                return possibleTarget;
            }
        }
    }
}

declare interface JsActionNode extends Node {
    __jsaction?:{
        [id:string]:string
    }
}

const reGtmWindowName = /^gtm\_autoEvent/
const gtmScriptTagSelector = 'script[src*="googletagmanager.com/gtm.js"]';
const defaultGtmVariableName = 'dataLayer';
const reGTMVariableName = /[\?&]l=([^&]*)(?:&|$)/;
const gtmLinkClickEventName = 'gtm.linkClick';

/**
 * Google Tag Manager can be configured to fire tags upon link clicks, and in certian cases,
 * gtm script calls `window.open` to simulate a click on an anchor tag.
 * such call occurs inside of an event handler attached to `document`, so it is considered
 * suspicious by `verifyEvent`.
 * This function performs a minimal check of whether the `open` call is triggered by gtm.
 * See: https://github.com/AdguardTeam/PopupBlocker/issues/36
 */
export function isGtmSimulatedAnchorClick(event:Event, windowName:string):boolean {
    if (!reGtmWindowName.test(windowName)) { return false; }
    if (event.eventPhase !== 3 /* Event.BUBBLING_PHASE */) { return false; }
    // Locate googletagManager script
    let scriptTags = <NodeListOf<HTMLScriptElement>>document.querySelectorAll(gtmScriptTagSelector);
    let l = scriptTags.length;

    if (l === 0) { return false; }

    while (l--) {
        let scriptTag = scriptTags[l];
        let src = scriptTag.src;
        let gtmVariableName = defaultGtmVariableName;
        let match = reGTMVariableName.exec(src);
        if (match) {
            gtmVariableName = match[1];
        }

        let dataLayer = <GtmDataLayerEvent[]>window[gtmVariableName];
        if (!dataLayer) { continue; }

        let latestEvent = dataLayer[dataLayer.length - 1];
        if (latestEvent && latestEvent.event == gtmLinkClickEventName) {
            return true;
        }
    }
    return false;
}

declare interface GtmDataLayerEvent {
    event:string
}
