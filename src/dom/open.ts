import { ApplyHandler, makeObjectProxy, wrapMethod } from '../proxy';
import { clonedEvents, retrieveEvent, verifyCurrentEvent } from '../verify-event';
import { _dispatchEvent } from './dispatchEvent';
import { timeline } from '../timeline/index';
import log from '../log';

/**
 * Some popup scripts adds transparent overlays on each of page's links
 * which disappears only when popups are opened.
 * To restore the expected behavior, we need to detect if the event is 'masked' by artificial layers
 * and redirect it to the correct element.
 * ToDo: touch events: https://developer.mozilla.org/en/docs/Web/API/Touch_events
 */
const dispatchIfBlockedByMask = function() {
    var currentEvent = retrieveEvent();
    if (currentEvent) {
        if ('clientX' in currentEvent && currentEvent.isTrusted) {
            log('Checking current MouseEvent for its genuine target..');
            let mouseEvent = <MouseEvent>currentEvent;
            let x = mouseEvent.clientX, y = mouseEvent.clientY, target = <HTMLElement>mouseEvent.target;
            if (target.nodeType !== Node.ELEMENT_NODE) { return; }
            let elts;
            if (document.elementsFromPoint) { elts = document.elementsFromPoint(x, y); }
            else if (document.msElementsFromPoint) { elts = document.msElementsFromPoint(x, y); }
            else {
                log('document.elementsFromPoint API is not available, exiting');
                return;
            }
            log('Elements at the clicked position are:', elts);
            let el;
            if ( elts[0] === target ) {
                log('The target is staying.');
                el = elts[1];
            } else {
                log('The target has modified inside event handlers.');
                el = elts[0];
            }
            let name = el.nodeName.toLowerCase();
            if ( name == 'iframe' || name == 'input' || name == 'a' || el.hasAttribute('onclick') || el.hasAttribute('onmousedown') ) {
                log('A real target candidate has default event handlers');
                var style = window.getComputedStyle(<Element>target);
                var position = style.getPropertyValue('position');
                var zIndex = parseInt(style.getPropertyValue('z-index'), 10);
                if ( (position == 'absolute' || position == 'fixed') && zIndex > 1000 ) {
                    log('A mask candidate has expected style');
                    if (target.textContent.trim().length === 0 && target.getElementsByTagName('img').length === 0) {
                        log('A mask candidate has expected content, re-dispatching events..');
                        target.style.setProperty('display', 'none', 'important');
                        target.style.setProperty('pointer-events', 'none', 'important');
                        let clone = new MouseEvent(currentEvent.type, currentEvent);
                        clonedEvents.set(clone, true);
                        Event.prototype.stopPropagation.call(currentEvent);
                        currentEvent.stopImmediatePropagation();
                        _dispatchEvent.call(el, clone);
                    }
                }
            }
        }
    }
};

// keep in mind; it should log about window.open.call(newWindow, 'about:blank', '_blank').
const openVerifiedWindow:ApplyHandler = function(_open, _this, _arguments) {
    log('Called window.open with url ' + _arguments[0]);
    let passed = verifyCurrentEvent();
    let win;
    if (passed) {
        log('event verified, inquiring event timeline..');
        if (timeline.canOpenPopup()) {
            log('calling original window.open...');
            win = _open.apply(_this, _arguments);
            win = makeObjectProxy(win);
            return win;
        }
        log('canOpenPopup returned false');
    }
    dispatchIfBlockedByMask();
    log('mock a window object');
    // Return a mock window object, in order to ensure that the page's own script does not accidentally throw TypeErrors.
    let loc = document.createElement('a');
    loc.href = _arguments[0];
    let doc = Object.create(HTMLDocument.prototype);
    win = {};
    Object.getOwnPropertyNames(window).forEach(function(prop) {
        switch(typeof prop) {
            case 'object': win[prop] = {}; break;
            case 'function': win[prop] = function() {return true;}; break;
            case 'string':  win[prop] = ''; break;
            case 'number': win[prop] = NaN; break;
            case 'boolean': win[prop] = false; break;
            case 'undefined': win[prop] = undefined; break;
        }
    });
    win.opener = window;
    win.closed = false;
    win.name = _arguments[1];
    win.location = loc;
    win.document = doc;
    return win;
};

wrapMethod(window, 'open', openVerifiedWindow);
