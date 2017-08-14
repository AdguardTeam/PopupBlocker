import * as log from '../log';
import WeakMap from '../weakmap';
import CurrentMouseEvent from './current-mouse-event';

let supported = 'event' in window;
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


/**
 * @param event Optional argument, an event to test with. Default value is currentEvent.
 * @return True if the event is legit, false if it is something that we should not allow window.open or dispatchEvent.
 */
export function verifyEvent(event?:Event):boolean {
    if (event) {
        log.call('Verifying event');
        let currentTarget = event.currentTarget;
        if (currentTarget) {
            log.print('Event is:', event);
            if ('nodeName' in currentTarget) {
                let tagName = (<Element>currentTarget).nodeName.toLowerCase();
                if (tagName == '#document' || tagName == 'html' || tagName == 'body') {
                    log.print('VerifyEvent - the current event handler is suspicious, for the current target is either document, html, or body.');
                    log.callEnd();
                    return false;
                } else if ('offsetHeight' in currentTarget && maybeOverlay(<HTMLElement>currentTarget)) {
                    log.print('VerifyEvent - the current event handler is suspicious, for the current target looks like an artificial overlay.');
                    log.callEnd();
                    return false;
                }
            }
        }
    }
    log.callEnd();
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
export function maybeOverlay(el:HTMLElement):boolean {
    log.call('maybeOverlay test');
    let w = window.innerWidth, h = window.innerHeight;
    if (el.offsetLeft << 4 < w && (w - el.offsetWidth) << 3 < w
        && el.offsetTop << 4 < h && (h - el.offsetHeight) << 3 < w) {
        let style = getComputedStyle(el);
        let position = style.getPropertyValue('position');
        let zIndex = parseInt(style.getPropertyValue('z-index'), 10);
        log.print('An element passed offset test.');
        if ((position == 'fixed' || position == 'absolute') && zIndex > 1000) {
            log.print('An element passed computedStyle test.');
            log.callEnd();
            return true;
        }
    }
    // ToDo: the element may have been modified in the event handler.
    // We may still test it using the inline style attribute.
    log.callEnd();
    return false;
}
