import { _dispatchEvent } from '../dom/dispatchEvent/orig';
import { setBeforeunloadHandler } from '../dom/unload';
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
 * @return true indicates that we should throw.
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
     * This is a heuristic that works on most of cases.
     * https://drafts.csswg.org/cssom-view/#dom-document-elementsfrompoint
     * https://philipwalton.com/articles/what-no-one-told-you-about-z-index/
     * https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
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
        if (currentEvent.defaultPrevented) {
            // Needs to re-dispatch event so that default action cannot be prevented
        }
        if (parent && parent.nodeName.toLowerCase() === 'a' && (<HTMLAnchorElement>parent).href === targetHref) {
            log.print("Throwing, because the target url is an href of an eventTarget or its ancestor");
            // Can't set beforeunload handler here; it may prevent legal navigations.
            abort();
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
        iterate_candidates: while (i < l) {
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
        while (i-- > 0) {
            if (!('style' in candidates[i])) { continue; }
            let el = <HTMLElement>candidates[i];
            el.style.setProperty('display', 'none', 'important');
            el.style.setProperty('pointer-events', 'none', 'important');
        }
        const clonedEvent = document.createEvent('MouseEvents');
        clonedEvent.initMouseEvent.apply(clonedEvent, initMouseEventArgs.map((prop) => currentEvent[prop]));
        currentEvent.stopPropagation();
        currentEvent.stopImmediatePropagation();
        _dispatchEvent.call(candidate, clonedEvent);
        log.print("An event is re-dispatched");
    }
};

const hasDefaultHandler = (el:Element) => {
    const name = el.nodeName.toLowerCase();
    if (name == 'iframe' || name == 'input' || name == 'a' || name == 'button' || el.hasAttribute('onclick') || el.hasAttribute('onmousedown') || el.hasAttribute('onmouseup')) {
        return true;
    }
    return false;
};

const maskStyleTest = (el:Element):boolean => {
    const style = getComputedStyle(el);
    const position = style.getPropertyValue('position');
    const zIndex = style.getPropertyValue('z-index');
    // Theoretically, opacity css property can be used to make masks as well
    // but hasn't encountered such usage in the wild, so not including it.
    if (position !== 'static' && parseInt(zIndex, 10) > 1000) { return true; }
    return false;
};

const maskContentTest = (el:Element):boolean => {
    if (el.textContent.trim().length === 0 && el.getElementsByTagName('img').length === 0) {
        return true;
    }
    return false;
};

export default log.connect(examineTarget, 'Examining Target');
