import * as log from '../shared/log';
import WeakMap from '../weakmap';
import CurrentMouseEvent from './current_mouse_event';
import { maybeOverlay } from './element_tests';

/**
 * On IE 10 and lower, window.event is a `MSEventObj` instance which does not implement `target` property.
 * We use a polyfill for such cases.
 */
const supported = 'event' in window && (!('documentMode' in document) || (document.documentMode === 11));
let currentMouseEvent;

if (!supported) {
    log.print('window.event is not supported.');
    currentMouseEvent = (new CurrentMouseEvent()).getCurrentMouseEvent;
} else {
    log.print('window.event is supported.');
}

/**
 * Gets the event that is being currently handled.
 * @suppress {es5Strict}
 */
export function retrieveEvent():Event {
    log.call('Retrieving event');
    let win = window;
    let currentEvent;
    // @ifndef NO_EVENT
    if (supported) {
        currentEvent = win.event;
        while( !currentEvent ) {
            let parent = win.parent;
            if (parent === win) { break; }
            win = parent;
            try {
                currentEvent = win.event;
            } catch (e) {
                // Cross-origin error
                break;
            }
        }
    } else {
        currentEvent = currentMouseEvent();
    }
    // @endif
    if (!currentEvent) {
        log.print('window.event does not exist, trying to get event from Function.caller');
        try {
            let caller = arguments.callee;
            let touched = new WeakMap();
            while (caller.caller) {
                caller = caller.caller;
                if (touched.has(caller)) {
                    throw /* @ifdef DEBUG */ "Recursion in the call stack"; /* @endif */ /* @ifndef DEBUG */ null; /* @endif */
                }
                touched.set(caller, true);
            }
            log.print('Reached at the top of caller chain.');
            if (caller.arguments && caller.arguments[0] && 'target' in caller.arguments[0]) {
                currentEvent = caller.arguments[0];
                log.print('The function at the bottom of the stack has an expected type. The current event is:', currentEvent);
            } else {
                log.print('The function at the bottom of the call stack does not have an expected type.', caller.arguments[0]);
            }
        } catch (e) {
            log.print('Getting event from Function.caller failed, due to an error:', e);
        }
    } else {
        log.print('window.event exists, of which the value is:', currentEvent);
    }
    log.callEnd();
    return currentEvent;
};

const matches = Element.prototype.matches || Element.prototype.msMatchesSelector;
/**
 * @param event Optional argument, an event to test with. Default value is currentEvent.
 * @return True if the event is legit, false if it is something that we should not allow window.open or dispatchEvent.
 */
export const verifyEvent = log.connect((event?:Event):boolean => {
    if (event) {
        let currentTarget = event.currentTarget;
        if (currentTarget) {
            log.print('Event is:', event);
            log.print('currentTarget is: ', currentTarget);
            if ('nodeName' in currentTarget) {
                let tagName = (<Element>currentTarget).nodeName.toLowerCase();
                if (tagName == '#document' || tagName == 'html' || tagName == 'body') {
                    let eventPhase = event.eventPhase;
                    log.print('Phase is: ' + eventPhase);
                    if (eventPhase === Event.CAPTURING_PHASE || eventPhase === Event.AT_TARGET) {
                        log.print('VerifyEvent - the current event handler is suspicious, for the current target is either document, html, or body.');
                        return false;
                    } else {
                        log.print('VerifyEvent - the current target is document/htmo/body, but the event is in a bubbling phase.');
                        let selector = getSelectorFromCurrentjQueryEventHandler(event);
                        if (selector) {
                            if (matches.call(document.documentElement, selector) || matches.call(document.body, selector)) {
                                return false;
                            }
                        } else if (!isReactInstancePresent() || tagName !== '#document') {
                            return false;
                        }
                    }
                // When an overlay is being used, useCapture is not necessary.
                } else if (maybeOverlay(<Element>currentTarget)) {
                    log.print('VerifyEvent - the current event handler is suspicious, for the current target looks like an artificial overlay.');
                    return false;
                }
            }
        }
    }
    return true;
}, 'Verifying event', function() { return arguments[0] });

export function verifyCurrentEvent():boolean {
    return verifyEvent(retrieveEvent());
}

// jQuery property names
const _data = '_data', originalEvent = 'originalEvent', selector = 'selector';

function getSelectorFromCurrentjQueryEventHandler(event:Event):string {
    let jQuery:JQueryStatic = window['jQuery'] || window['$'];
    if (!jQuery || !jQuery[_data]) { return; }
    let current = event.currentTarget;
    let type = event.type;
    let eventsData = jQuery[_data](current, 'events');
    if (!eventsData) { return; }
    let registeredHandlers = eventsData[type];
    if (!registeredHandlers) { return; }
    let found = false;
    let handlerObj;
    for (let i = 0, l = registeredHandlers.length; i < l; i++) {
        handlerObj = registeredHandlers[i];
        let handler = handlerObj.handler;
        if (handler.arguments !== null) {
            let args = handler.arguments; // Using Function.arguments, so it may not work on handlers that are nested in call stack
            if (args[0] && args[0].originalEvent === event) {
                found = true;
                break;
            }
        }
    }
    if (found) {
        return handlerObj[selector]
    }
}

const reactRootSelector = '[data-reactroot]';
function isReactInstancePresent():boolean {
    return !!document.querySelector(reactRootSelector);
}
