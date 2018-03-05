/**
 * @fileoverview Current popup detection mechanism relies heavily on `Event#currentTarget`,
 * and some JS frameworks that use event delegation tend to hide event listeners' intended target.
 * For popular frameworks among such, we attempt to utilize frameworks' specifics to provide
 * a way to retrieve an intended target, or at least detect it in order to reduce false-positives.
 * Such workarounds are not very robust, hence 'attempt', but it will still provide huge benefit to users.
 */

import { closest } from '../shared/dom';
import { isElement, isMouseEvent } from '../shared/instanceof';
import WeakMap from '../shared/WeakMap';

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

/**
 * The above was not enough for many cases, mostly because event handlers can be attached in
 * strict context and Function.arguments can be mutated in function calls.
 * 
 * Below we patch jQuery internals to create a mapping of native events and jQuery events.
 * jQuery sets `currentTarget` property on jQuery event instances while triggering event handlers. 
 */
const jQueries:JQueryStatic[] = [];
const jQueryToEventMap:IWeakMap<JQueryStatic, IWeakMap<Event, JQueryEvent>> = new WeakMap();

import { wrapMethod, defaultApplyHandler } from '../proxy';

function patchJQueryEvent() {
    let jQuery:JQueryStatic = window['jQuery'] || window['$'];
    
    if (typeof jQuery !== 'function' ) { return; }
    if (!('noConflict' in jQuery)) { return; }

    if (jQueries.indexOf(jQuery) !== -1) {
        // Already patched
        return;
    }

    let eventMap:IWeakMap<Event,JQueryEvent> = new WeakMap();

    jQueries.push(jQuery);
    jQueryToEventMap.set(jQuery, eventMap);

    const isNativeEvent = (event:Event|JQueryEvent):event is Event => {
        return !event[jQuery.expando];
    };

    /**
     * Notes on implementation:
     *  1. In order to minimize detection surface, we use `wrapMethod` instead of simply re-assigning properties.
     *  2. Always use `orig` and do not implement the patch in your own; intended behavior of such methods
     *     can be drastically different across jQuery versions.
     */
    wrapMethod(jQuery.event, 'fix', (orig, _this, _arguments) => {
        let originalEvent:Event|JQueryEvent = _arguments[0];
        let ret:JQueryEvent = defaultApplyHandler(orig, _this, _arguments);
        if (isNativeEvent(originalEvent) && isMouseEvent(originalEvent)) {
            eventMap.set(<Event>originalEvent, ret);
        }
        return ret;
    }, false);

    wrapMethod(jQuery.event, 'dispatch', (orig, _this, _arguments) => {
        let nativeEvent:Event|JQueryEvent = _arguments[0];
        let ret = defaultApplyHandler(orig, _this, _arguments);
        if (isNativeEvent(nativeEvent) && isMouseEvent(nativeEvent)) {
            // jQuery does not clear up `currentTarget` property of their event instances
            // after dispatching is finished.            
            let jQueryEvent = getJQueryEvent(nativeEvent, jQuery);
            jQueryEvent.currentTarget = null;
        }
        return ret;
    }, false);

    wrapMethod(jQuery, 'noConflict', noConflictApplyHandler, false);
}

function noConflictApplyHandler(orig:Function, _this, _arguments:any[]|IArguments) {
    let deep = _arguments[0];
    let ret = defaultApplyHandler(orig, _this, _arguments);
    if (deep === true) {
        // Patch another jQuery instance exposed to window.jQuery.
        patchJQueryEvent();
    }
}

/**
 * Attempts to patch before any other page's click event handler is executed.
 */
window.addEventListener('click', patchJQueryEvent, true);

function getJQueryEvent(event:Event, jQuery:JQueryStatic):JQueryEvent {
    return jQueryToEventMap.get(jQuery).get(event);
}

export function getCurrentJQueryTarget(event:Event):EventTarget {
    for (let i = 0, l = jQueries.length; i < l; i++) {
        let jQuery = jQueries[i];
        let jQueryEvent = getJQueryEvent(event, jQuery);
        if (typeof jQueryEvent !== 'object') { continue; }
        if (!jQueryEvent.currentTarget) { continue; }
        return jQueryEvent.currentTarget;
    }
}


// These are type declarations for jQuery only for the parts we need to access.

declare interface JQueryEvent {
    originalEvent:Event
    currentTarget:EventTarget
}

declare interface JQueryEventCtor {
    (event:Event|JQueryEvent):JQueryEvent 
    new(event:Event|JQueryEvent):JQueryEvent
}

declare interface JQueryHandlerObj {
    handler:(evt:JQueryEvent)=>any,
    selector:string
}

declare interface JQueryStatic {
    _data:(elem:EventTarget, name:string, value?:any)=>{[id:string]:JQueryHandlerObj[]}
    event: {
        special:stringmap<{
            postDispatch:(event:JQueryEvent)=>void
        }>,
        fix:(event:Event|JQueryEvent)=>JQueryEvent
    }
    Event:JQueryEventCtor
    readonly expando:string
    noConflict:(deep?:boolean)=>JQueryStatic
    (...args):any
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

// When `window.__REACT_DEVTOOLS_GLOBAL_HOOK__` property exists, react will access and call
// some of its methods. We use it as a hack to detect react instances.
// We can always harden this by replicating the `hook` object here, at a cost of maintainance burden.
function isInOfficialDevtoolsScript():boolean {
    if (document.head) { return false; }
    let script = document.currentScript;
    if (!script) { return false; }
    let textContent = script.textContent;
    // https://github.com/facebook/react-devtools/blob/master/backend/installGlobalHook.js#L147
    if (textContent.indexOf('^_^') !== -1) { return true; }
    return false;
}

const HOOK_PROPERTY_NAME = '__REACT_DEVTOOLS_GLOBAL_HOOK__';

let accessedReactInternals = false;

if (!Object.prototype.hasOwnProperty.call(window, HOOK_PROPERTY_NAME)) {
    let tempValue = {}; // to be used as window.__REACT_DEVTOOLS_GLOBAL_HOOK__
    Object.defineProperty(tempValue, 'isDisabled', {
        get: function() {
            accessedReactInternals = true;
            // Signals that a devtools is disabled, to minimize possible breakages.
            // https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberDevToolsHook.js#L40
            return true;
        },
        set: function() { }
    });
    Object.defineProperty(window, HOOK_PROPERTY_NAME, {
        get: function() {
            if (isInOfficialDevtoolsScript()) {
                return undefined; // So that it re-defines the property
            }
            return tempValue;
        },
        set: function(i) { /* Ignored */ },
        configurable: true // So that react-devtools can re-define it
    });
}

const reactRootSelector = '[data-reactroot]';
const reactIdSelector = '[data-reactid]';
export function isReactInstancePresent():boolean {
    if (!!document.querySelector(reactRootSelector) || !!document.querySelector(reactIdSelector)) { return true; }
    if (accessedReactInternals) { return true; }
    // Otherwise, react-devtools could have overridden the hook.
    if (typeof window[HOOK_PROPERTY_NAME] === 'object' && Object.keys(window[HOOK_PROPERTY_NAME]["_renderers"]).length !== 0) {
        return true;
    }
    return false;
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
