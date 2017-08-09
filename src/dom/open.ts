import { ApplyHandler, makeObjectProxy, wrapMethod } from '../proxy';
import { verifyEvent, retrieveEvent, verifyCurrentEvent } from '../verify-event';
import { _dispatchEvent } from './dispatchEvent';
import { timeline, position } from '../timeline/index';
import * as log from '../log';

const openVerifiedWindow:ApplyHandler = function(_open, _this, _arguments, context) {
    log.call('Called window.open with url ' + _arguments[0]);
    let currentEvent = retrieveEvent();
    let passed = verifyEvent(currentEvent);
    let win;
    if (passed) {
        log.print('event verified, inquiring event timeline..');
        if (timeline.canOpenPopup(position)) {
            log.print('calling original window.open...');
            win = _open.apply(_this, _arguments);
            win = makeObjectProxy(win);
            log.callEnd();
            return win;
        }
        log.print('canOpenPopup returned false');
        log.callEnd();
    }
    if (currentEvent) {
        let redispatched = dispatchIfBlockedByMask(currentEvent);
        // Determines whether to return null or a mocked window object.
        // If an url is first-party or the target is an anchor, the original page may try to navigate away
        // In such cases we return null to signal that the request was unsuccessful.
        let target = currentEvent.target;
        let targetIsAnchor = 'nodeName' in target && (<Element>target).nodeName.toLowerCase() == 'a';
        let urlIsHrefOfAnchor;
        if (targetIsAnchor) {
            let anchor = <HTMLAnchorElement>target;
            if (anchor.href == _arguments[0]) { urlIsHrefOfAnchor = true; }
        }
        let urlIsCurrentHref;
        if (location.href === _arguments[0]) { urlIsCurrentHref = true; }
        if (redispatched || urlIsHrefOfAnchor || urlIsCurrentHref) {
            log.print("An event is re-dispatched or the opened url is equal to the target's href or the url is equal to the current href");
            log.callEnd();
            return null;
        }
    }
    log.print('mock a window object');
    // Return a mock window object, in order to ensure that the page's own script does not accidentally throw TypeErrors.
    win = mockWindow(_arguments[0], _arguments[1]);
    context['mocked'] = true;
    log.callEnd();
    return win;
};

/**
 * Some popup scripts adds transparent overlays on each of page's links
 * which disappears only when popups are opened.
 * To restore the expected behavior, we need to detect if the event is 'masked' by artificial layers
 * and redirect it to the correct element.
 * ToDo: touch events: https://developer.mozilla.org/en/docs/Web/API/Touch_events
 * @return true if an event is re-dispatched.
 */
const dispatchIfBlockedByMask = function(event) {
    var currentEvent = event;
    if (currentEvent) {
        if ('clientX' in currentEvent && currentEvent.isTrusted) {
            log.call('Checking current MouseEvent for its genuine target..');
            let mouseEvent = <MouseEvent>currentEvent;
            let x = mouseEvent.clientX, y = mouseEvent.clientY, target = <HTMLElement>mouseEvent.target;
            if (target.nodeType !== Node.ELEMENT_NODE) { log.callEnd(); return; }
            let elts;
            if (document.elementsFromPoint) { elts = document.elementsFromPoint(x, y); }
            else if (document.msElementsFromPoint) { elts = document.msElementsFromPoint(x, y); }
            else {
                log.print('document.elementsFromPoint API is not available, exiting');
                log.callEnd();
                return;
            }
            log.print('Elements at the clicked position are:', elts);
            let el;
            if ( elts[0] === target ) {
                log.print('The target is staying.');
                el = elts[1];
            } else {
                log.print('The target has modified inside event handlers.');
                el = elts[0];
            }
            let name = el.nodeName.toLowerCase();
            if ( name == 'iframe' || name == 'input' || name == 'a' || el.hasAttribute('onclick') || el.hasAttribute('onmousedown') ) {
                log.print('A real target candidate has default event handlers');
                var style = getComputedStyle(<Element>target);
                var position = style.getPropertyValue('position');
                var zIndex = parseInt(style.getPropertyValue('z-index'), 10);
                if ( (position == 'absolute' || position == 'fixed') && zIndex > 1000 ) {
                    log.print('A mask candidate has expected style');
                    if (target.textContent.trim().length === 0 && target.getElementsByTagName('img').length === 0) {
                        log.print('A mask candidate has expected content, re-dispatching events..');
                        target.style.setProperty('display', 'none', 'important');
                        target.style.setProperty('pointer-events', 'none', 'important');
                        let clone = new MouseEvent(currentEvent.type, currentEvent);
                        currentEvent.stopPropagation();
                        currentEvent.stopImmediatePropagation();
                        _dispatchEvent.call(el, clone);
                        return true;
                    }
                }
            }
            log.callEnd();
        }
    }
};

const mockWindow = (href, name) => {
    let loc = document.createElement('a');
    loc.href = href;
    let doc = Object.create(HTMLDocument.prototype);
    let win = <any>{};
    Object.getOwnPropertyNames(window).forEach(function(prop) {
        switch(typeof window[prop]) {
            case 'object': win[prop] = {}; break;
            case 'function': win[prop] = function() {return true;}; break;
            case 'string':  win[prop] = ''; break;
            case 'number': win[prop] = NaN; break;
            case 'boolean': win[prop] = false; break;
            case 'undefined': win[prop] = undefined; break;
        }
    });
    doc.location = loc;
    // doc.open = function(){return this;}
    // doc.write = function(){};
    // doc.close = function(){};
    win.opener = window;
    win.closed = false;
    win.name = name;
    win.location = loc;
    win.document = doc;
    return win;
};

wrapMethod(window, 'open', openVerifiedWindow);
wrapMethod(Window.prototype, 'open', openVerifiedWindow); // for IE
