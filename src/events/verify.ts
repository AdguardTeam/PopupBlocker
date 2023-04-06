import {
    log,
    isNode,
    isElement,
    isMouseEvent,
    isTouchEvent,
    isClickEvent,
    SafeWeakMap,
    getTagName,
} from '../shared';
import CurrentMouseEvent from './current-mouse-event';
import { eventTargetIsRootNode, maybeOverlay } from './element-tests';
import {
    isReactInstancePresent,
    jsActionTarget,
    getCurrentJQueryTarget,
} from './framework-workarounds';

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
    if (supported) {
        currentEvent = win.event;
        while (!currentEvent) {
            const { parent } = win;
            if (parent === win) { break; }
            // @ts-ignore
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

    if (!currentEvent) {
        log.print('window.event does not exist, trying to get event from Function.caller');
        try {
            // eslint-disable-next-line no-restricted-properties, no-caller
            let caller = arguments.callee;
            const touched = new SafeWeakMap();
            while (caller.caller) {
                caller = caller.caller;
                if (touched.has(caller)) {
                    /* eslint-disable @typescript-eslint/no-throw-literal */
                    if (DEBUG) {
                        // TODO make preprocessor plugin to cut these from beta and release builds
                        throw 'Recursion in the call stack';
                    } else {
                        throw null;
                    }
                    /* eslint-enable @typescript-eslint/no-throw-literal */
                }
                touched.set(caller, true);
            }
            log.print('Reached at the top of caller chain.');
            if (caller.arguments && caller.arguments[0] && 'target' in caller.arguments[0]) {
                // eslint-disable-next-line prefer-destructuring
                currentEvent = caller.arguments[0];
                log.print(
                    'The function at the bottom of the stack has an expected type. The current event is:',
                    currentEvent,
                );
            } else {
                log.print(
                    'The function at the bottom of the call stack does not have an expected type.',
                    caller.arguments[0],
                );
            }
        } catch (e) {
            log.print('Getting event from Function.caller failed, due to an error:', e);
        }
    } else {
        log.print('window.event exists, of which the value is:', currentEvent);
    }
    log.callEnd();
    return currentEvent;
}

/**
 * @param event Optional argument, an event to test with. Default value is currentEvent.
 * @return True if the event is legit, false if it is something that we should not allow window.open or dispatchEvent.
 */
export const verifyEvent = log.connect((event?:Event):boolean => {
    if (event) {
        if ((!isMouseEvent(event) || !isClickEvent(event)) && !isTouchEvent(event)) { return true; }
        const { currentTarget } = event;
        if (currentTarget) {
            log.print('Event is:', event);
            log.print('currentTarget is: ', currentTarget);
            if (eventTargetIsRootNode(currentTarget)) {
                const { eventPhase } = event;
                log.print(`Phase is: ${eventPhase}`);
                // Workaround for jsaction
                const maybeJsActionTarget = jsActionTarget(event);
                if (maybeJsActionTarget) {
                    log.print('maybeJsActionTarget');
                    if (eventTargetIsRootNode(maybeJsActionTarget)) {
                        return false;
                    }
                    log.print('jsActionTarget is not a root');
                    return true;
                }
                if (eventPhase === 1 /* Event.CAPTURING_PHASE */|| eventPhase === 2 /* Event.AT_TARGET */) {
                    // eslint-disable-next-line max-len
                    log.print('VerifyEvent - the current event handler is suspicious, for the current target is either window, document, html, or body.');
                    return false;
                }
                // eslint-disable-next-line max-len
                log.print('VerifyEvent - the current target is document/html/body, but the event is in a bubbling phase.');
                // Workaround for jQuery
                const jQueryTarget = getCurrentJQueryTarget(event);
                if (jQueryTarget) {
                    log.print('jQueryTarget exists: ', jQueryTarget);
                    // Performs the check with jQueryTarget again.
                    if (eventTargetIsRootNode(jQueryTarget)
                        || (isElement(jQueryTarget) && maybeOverlay(jQueryTarget))) {
                        return false;
                    }
                    // Workaround for React
                } else if (!isReactInstancePresent()
                        || (isNode(currentTarget) && getTagName(currentTarget) !== '#DOCUMENT')) {
                    return false;
                }

            // When an overlay is being used, checking for useCapture is not necessary.
            } else if (isElement(currentTarget) && maybeOverlay(currentTarget)) {
                // eslint-disable-next-line max-len
                log.print('VerifyEvent - the current event handler is suspicious, for the current target looks like an artificial overlay.');
                return false;
            }
        }
    }
    return true;
// eslint-disable-next-line prefer-rest-params
}, 'Verifying event', function () { return arguments[0]; });
