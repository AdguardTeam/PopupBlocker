/**
 * @fileoverview Current popup detection mechanism relies heavily on `Event#currentTarget`,
 * and some JS frameworks that use event delegation tend to hide event listeners' intended target.
 * For popular frameworks among such, we attempt to utilize frameworks' specifics to provide
 * a way to retrieve an intended target, or at least detect it in order to reduce false-positives.
 * Such workarounds are not very robust, hence 'attempt', but it will still provide huge benefit to users.
 */

import { closest, targetsAreChainable } from '../shared/dom';
import { isElement, isMouseEvent, isNode, isWindow, isUndef, isClickEvent, isTouchEvent } from '../shared/instanceof';
import WeakMap from '../shared/WeakMap';
import { ApplyHandler, IWrappedExecutionContext } from '../proxy/IProxyService';
import * as ProxyService from '../proxy/ProxyService';
import { defineProperty, hasOwnProperty, objectKeys } from '../shared/protected_api';
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
export class JQueryEventStack {

    static initialize() {
        // Attempts to patch before any other page's click event handler is executed.
        window.addEventListener('mousedown', JQueryEventStack.attemptPatch, true);
        window.addEventListener('touchstart', JQueryEventStack.attemptPatch, true)
    }

    static getCurrentJQueryTarget(event:MouseEvent|TouchEvent):EventTarget {
        let jQueries = JQueryEventStack.jQueries;
        for (let i = 0, l = jQueries.length; i < l; i++) {
            let jQuery = jQueries[i];
            let stack = JQueryEventStack.jqToStack.get(jQuery);
            if (isUndef(stack)) { continue; }
            let currentTarget = stack.getNestedTarget(event);
            if (!currentTarget) { continue; }
            return currentTarget;
        }
    }

    private static jQueries:JQueryStatic[] = [];
    private static jqToStack:IWeakMap<JQueryStatic,JQueryEventStack> = new WeakMap();

    private static attemptPatch() {
        let jQuery = JQueryEventStack.detectionHeuristic();
        if (isUndef(jQuery)) { return; }
        if (JQueryEventStack.jQueries.indexOf(jQuery) !== -1) { /* Already patched */ return; }

        let eventMap:IWeakMap<Event,JQueryEvent> = new WeakMap();

        JQueryEventStack.jQueries.push(jQuery);
        JQueryEventStack.jqToStack.set(jQuery, new JQueryEventStack(jQuery).wrap());
    }

    private static detectionHeuristic():JQueryStatic {
        let jQuery = window['jQuery'] || window['$'];
        if (typeof jQuery !== 'function' ) { return; }
        if (!('noConflict' in jQuery)) { return; }
        // Test for private property
        if (!('_data' in jQuery)) { return; }
        return <JQueryStatic>jQuery;
    }

    constructor(
        private jQuery:JQueryStatic
    ) { }

    private eventMap:IWeakMap<Event,JQueryEvent> = new WeakMap();
    private eventStack:(Event|JQueryEvent)[] = [];

    private isNativeEvent(event:Event|JQueryEvent):event is Event {
        return event && typeof event === 'object' && !event[this.jQuery.expando];
    }
    private getRelatedJQueryEvent(event:Event):JQueryEvent {
        return this.eventMap.get(event);
    }
    /**
     * Wraps jQuery.event.dispatch.
     * It is used in jQuery to call event handlers attached via $(..).on and such,
     * in case of native events and $(..).trigger().
     */
    private dispatchApplyHandler:ApplyHandler<any,any> = (ctxt, _arguments) => {
        let event:Event|JQueryEvent = _arguments[0];
        this.eventStack.push(event);
        try {
            return ctxt.invokeTarget(_arguments);
        } finally {
            // Make sure that the eventStack is cleared up even if a dispatching fails.
            this.eventStack.pop();
        }
    }
    /**
     * Wraps jQuery.event.fix
     */
    private fixApplyHandler:ApplyHandler<any,any> = (ctxt, _arguments) => {
        let event:Event|JQueryEvent = _arguments[0];
        let ret:JQueryEvent = ctxt.invokeTarget(_arguments);
        if (this.isNativeEvent(event)) {
            if ((isMouseEvent(event) && isClickEvent(event)) || isTouchEvent(event)) {
                this.eventMap.set(<Event>event, ret);
            }
        }
        return ret;
    }
    private static noConflictApplyHandler(ctxt:IWrappedExecutionContext<any,void>,_arguments:IArguments) {
        let deep = _arguments[0];
        ctxt.invokeTarget(_arguments);
        if (deep === true) {
            // Patch another jQuery instance exposed to window.jQuery.
            JQueryEventStack.attemptPatch();
        }
    }

    private wrap():this {
        let jQuery = this.jQuery;
        ProxyService.wrapMethod(jQuery.event, 'dispatch', this.dispatchApplyHandler);
        ProxyService.wrapMethod(jQuery.event, 'fix', this.fixApplyHandler);
        ProxyService.wrapMethod(jQuery, 'noConflict', JQueryEventStack.noConflictApplyHandler);
        return this;
    }

    /**
     * Performs a smart detection of `currentTarget`.
     * Getting it from the current `window.event`'s related jQuery.Event is not sufficient;
     * See {@link https://github.com/AdguardTeam/PopupBlocker/issues/90}.
     * 
     * This is a heuristic to determine an 'intended target' that is useful in detection of
     * unwanted popups; It does not claim to be a perfect solution.
     */
    private getNestedTarget(event:MouseEvent|TouchEvent):EventTarget {
        let eventStack = this.eventStack;

        if (eventStack.length === 0) { return; }

        // The root event must be of related to provided event.
        let root = this.getRelatedJQueryEvent(event);
        if (eventStack[0] !== event && eventStack[0] !== root) { return; }

        /********************************************************************************************
           
            If there are remaining events in the stack, and the next nested event is "related"
            to the current event, we take it as a "genuine" event that is eligible to extract
            currentTarget information.
            Why test "related"ness? Suppose a third-party script adds event listeners like below:

              $(document).on('click', () => { $(hiddenElement).trigger('click'); });
              $(hiddenElement).on('click', () => { openPopup(); } );

            We need to take `document` as a "genuine" target in such cases. As such, 
            despite some theoretical possibilities, we take a leap of faith "that only real-world
            re-triggering that preserves the intention of user input are those which triggers
            event on the target itself again or on its descendent nodes".

        **/
        let current:JQueryEvent = root;

        for (let i = 1, l = eventStack.length; i < l; i++) {
            let next = eventStack[i];
            // prev event is related to next event
            // only if next.target contains current.target.
            let nextTarget = next.target;

            if (isNode(nextTarget)) {
                if (targetsAreChainable(<Node>current.target, nextTarget)) {
                    current = this.isNativeEvent(next) ? this.getRelatedJQueryEvent(next) : next;
                    continue;
                } else {
                    break;
                }
            } else if (isWindow(nextTarget)) {
                return nextTarget;
            } else {
                // If a target of a jQuery event is not a node nor window,
                // it is not what we are expecting for.
                return;
            }
        }

        return current.currentTarget;
    }
}

JQueryEventStack.initialize();

export const getCurrentJQueryTarget = JQueryEventStack.getCurrentJQueryTarget;

// These are type declarations for jQuery only for the parts we need to access.

declare interface JQueryEvent {
    originalEvent:Event
    target:EventTarget
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

if (!hasOwnProperty.call(window, HOOK_PROPERTY_NAME)) {
    let tempValue = {
        // Create a dummy function for preact compatibility
        // https://github.com/AdguardTeam/PopupBlocker/issues/119
        "inject": function() { }
    }; // to be used as window.__REACT_DEVTOOLS_GLOBAL_HOOK__
    defineProperty(tempValue, 'isDisabled', {
        get: function() {
            accessedReactInternals = true;
            // Signals that a devtools is disabled, to minimize possible breakages.
            // https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberDevToolsHook.js#L40
            return true;
        },
        set: function() { }
    });
    defineProperty(window, HOOK_PROPERTY_NAME, {
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
    let hook = window[HOOK_PROPERTY_NAME];
    if (typeof hook !== 'object') { return false; }
    let _renderers = hook["_renderers"];
    if (typeof _renderers !== 'object' || _renderers === null) { return false; }
    if (objectKeys(_renderers).length === 0) { return false; }
    return true;
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
