import * as log from '../shared/log';
import WeakMap from '../weakmap';
import CurrentMouseEvent from './current_mouse_event';
import { maybeOverlay } from './element_tests';
import { getSelectorFromCurrentjQueryEventHandler, isReactInstancePresent } from './framework_workarounds';
import { isNode } from '../shared/instanceof';

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

const windowToString = window.toString();
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
            let tagName = isNode(currentTarget) && currentTarget.nodeName.toLowerCase();
            if (Object.prototype.toString.call(currentTarget) === '[object Window]' || tagName == '#document' || tagName == 'html' || tagName == 'body') {
                let eventPhase = event.eventPhase;
                log.print('Phase is: ' + eventPhase);
                if (eventPhase === 1 /* Event.CAPTURING_PHASE */|| eventPhase === 2 /* Event.AT_TARGET */) {
                    log.print('VerifyEvent - the current event handler is suspicious, for the current target is either window, document, html, or body.');
                    return false;
                } else {
                    log.print('VerifyEvent - the current target is document/html/body, but the event is in a bubbling phase.');
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
    return true;
}, 'Verifying event', function() { return arguments[0] });

export function verifyCurrentEvent():boolean {
    return verifyEvent(retrieveEvent());
}
