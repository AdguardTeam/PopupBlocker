import log from './log';
import WeakMap from './weakmap';

export const clonedEvents = new WeakMap();

/**
 * Gets the event that is being currently handled.
 * @suppress {es5Strict}
 */
export function retrieveEvent():Event {
    log('Retrieving event');
    let currentEvent = top.event;
    if (!currentEvent) {
        log('window.event does not exist, trying to get event from Function.caller');
        try {
            let caller = arguments.callee;
            let touched = new WeakMap();
            while (caller.caller) {
                caller = caller.caller;
                if (touched.has(caller)) {
                    // @ifdef DEBUG
                    throw "Recursion in the call stack";
                    // @endif
                    // @ifndef DEBUG
                    throw null;
                    // @endif
                }
                touched.set(caller, true);
            }
            log('Reached at the top of caller chain.');
            if (caller.arguments && caller.arguments[0] && 'target' in caller.arguments[0]) {
                currentEvent = caller.arguments[0];
                log('The function at the bottom of the stack has an expected type. The current event is:', currentEvent);
            }
        } catch (e) {
            log('Getting event from Function.caller failed, due to an error:', e);
        }
    } else {
        log('window.event exists, of which the value is:', currentEvent);
    }
    return currentEvent;
};


/**
 * @param event Optional argument, an event to test with. Default value is currentEvent.
 * @return True if the event is legit, false if it is something that we should not allow window.open or dispatchEvent.
 */
export function verifyEvent(event?):boolean {
    if (event) {
        log('Verifying event');
        if (clonedEvents.has(event)) {
            log('It is a cloned event');
            return true;
        }
        let currentTarget = event.currentTarget;
        if (currentTarget) {
            let tagName = currentTarget.nodeName.toLowerCase();
            if (tagName == '#document' || tagName == 'html' || tagName == 'body') {
                log('VerifyEvent - the current event handler is suspicious, for the current target is either document, html, or body.');
                return false;
            } else if (maybeOverlay(currentTarget)) {
                log('VerifyEvent - the current event handler is suspicious, for the current target looks like an artificial overlay.');
                return false;
            }
        }
    }
    return true;
};

export function verifyCurrentEvent():boolean {
    return verifyEvent(retrieveEvent());
}

/**
 * Detects common overlay pattern.
 * @param el an element to check whether it is an overlay.
 * @return true if el is an overlay.
 */
function maybeOverlay(el:HTMLElement):boolean {
    let w = window.innerWidth, h = window.innerHeight;
    if (el.offsetLeft << 4 < w && (w - el.offsetWidth) << 3 < w
        && el.offsetTop << 4 < h && (h - el.offsetHeight) << 3 < w) {
        let style = getComputedStyle(el);
        let position = style.getPropertyValue('position');
        let zIndex = parseInt(style.getPropertyValue('z-index'), 10);
        log('An element passed offset test.');
        if ((position == 'fixed' || position == 'absolute') && zIndex > 1000) {
            log('An element passed computedStyle test.');
            return true;
        }
    }
    // ToDo: the element may have been modified in the event handler.
    // We may still test it using the inline style attribute.
    return false;
}
