import { _dispatchEvent } from '../dom/dispatchEvent/orig';
import { _preventDefault } from '../dom/preventDefault/orig';
import { setBeforeunloadHandler } from '../dom/unload';
import { hasDefaultHandler, maskStyleTest, maskContentTest, maybeOverlay } from './element-tests';
import abort from '../abort';
import * as log from '../log';

const initMouseEventArgs = 'type,canBubble,cancelable,view,detail,screenX,screenY,clientX,clientY,ctrlKey,altKey,shiftKey,metaKey,button,relatedTarget'.split(',');

/**
 * Some popup scripts adds transparent overlays on each of page's links
 * which disappears only when popups are opened.
 * To restore the expected behavior, we need to detect if the event is 'masked' by artificial layers
 * and redirect it to the correct element.
 * It will return true if no mask was detected and we should throw to abort script execution.
 * ToDo: we may need to prevent `preventDefault` in touch events
 */
const examineTarget = (currentEvent:Event, targetHref:string):void => {
    log.print('Event is:', currentEvent);
    if (!currentEvent.isTrusted) { return; }
    let _target:EventTarget;
    let target:Element;
    let x:number, y:number;
    // Normalize mouseevent and touchevent
    if ('clientX' in currentEvent) {
        // mouse event
        log.print("It is a mouse event");
        let mouseEvent = <MouseEvent>currentEvent;
        _target = mouseEvent.target;
        x = mouseEvent.clientX;
        y = mouseEvent.clientY;      
    } else if ('touches' in currentEvent) {
        // This is just a stuff. It needs more research.
        let touchEvent = <TouchEvent>currentEvent;
        _target = touchEvent.target;
        let touch = touchEvent.touches[0];
        x = touch.clientX;
        y = touch.clientY;
    }
    if (!('id' in _target)) { return; }
    target = <Element>_target;
    // Use elementsFromPoint API
    let candidates:Element[]|NodeListOf<Element>;
    if (document.elementsFromPoint) {
        candidates = document.elementsFromPoint(x,y)
    } else if (document.msElementsFromPoint) {
        candidates = document.msElementsFromPoint(x, y);
    } else {
        log.print("elementsFromPoint api is missing, exiting..");
        return;
        // log something
    }
    log.print('ElementsFromPoint:', candidates);
    // Use Event#deepPath API
    let path:EventTarget[];
    if (Event.prototype.hasOwnProperty('path')) {
        path = currentEvent.path;
    } else if (Event.prototype.hasOwnProperty('composedPath')) {
        path = currentEvent.composedPath();
    }
    /**
     * This is a heuristic. I won't try to make it robust by following specs for now.
     * https://drafts.csswg.org/cssom-view/#dom-document-elementsfrompoint
     * https://philipwalton.com/articles/what-no-one-told-you-about-z-index/
     */
    let candidate:Element;
    let i = 0;
    let j = 0;
    let l = candidates.length;
    let parent:Element;
    let check:boolean = false;
    if (candidates[0] !== target) {
        log.print('A target has changed in an event listener');
        i = -1;
    }
    // Unrolling first iteration
    candidate = parent = target;
    while (parent) {
        if (hasDefaultHandler(parent)) {
            check = true;
            break;
        }
        if (maskStyleTest(parent)) { break; }
        if (path) {
            if (!('id' in path[++j])) { parent = null; }
            else { parent = <Element>path[j]; }
        } else { parent = parent.parentElement; }
    }
    if (check) {
        if (parent && parent.nodeName.toLowerCase() === 'a') {
            // Can't set beforeunload handler here; it may prevent legal navigations.
            if ((<HTMLAnchorElement>parent).href === targetHref) {
                log.print("Throwing, because the target url is an href of an eventTarget or its ancestor");
                abort();
            }
            if (maybeOverlay(parent)) {
                log.print("Preventing default, because the current target looks like an overlay");
                _preventDefault.call(currentEvent);
                preventPointerEvent(parent);
            }
            // Perform overlay test;
        }
        return;
    }
    if (location.href === targetHref) {
        log.print("Throwing, because the target url is the same as the current url");
        abort();
    }
    if (!parent || !maskContentTest(candidate)) {
        setBeforeunloadHandler();
        return;
    }    
    if (!check) {
        iterate_candidates: while (i < l - 1) {
            if (candidate.parentElement === (candidate = candidates[++i])) { continue; }
            parent = candidate;
            while (parent) {
                if (hasDefaultHandler(parent)) { 
                    check = true;
                    break iterate_candidates;
                }
                if (maskStyleTest(parent)) { break; }
                parent = parent.parentElement;
            }
            if (maskContentTest(candidate)) {
                // found a mask-looking element
                continue;
            } else { break; }
        }
    }
    // Performs mask neutralization and event delivery
    if (check) {
        log.print("Detected a mask");
        while (i-- > 0) { preventPointerEvent(candidates[i]); }
        const clonedEvent = document.createEvent('MouseEvents');
        clonedEvent.initMouseEvent.apply(clonedEvent, initMouseEventArgs.map((prop) => currentEvent[prop]));
        currentEvent.stopPropagation();
        currentEvent.stopImmediatePropagation();
        _dispatchEvent.call(candidate, clonedEvent);
        log.print("An event is re-dispatched");
    }
};

const preventPointerEvent = (el:Element):void => {
    if (!('style' in el)) { return; }
    let _el:HTMLElement = <HTMLElement>el;
    _el.style.setProperty('display', 'none', 'important');
    _el.style.setProperty('pointer-events', 'none', 'important');
};

export default log.connect(examineTarget, 'Examining Target');
