import { _dispatchEvent } from '../dom/dispatchEvent/orig';
import { _preventDefault } from '../dom/preventDefault/orig';
import { setBeforeunloadHandler } from '../dom/unload';
import { hasDefaultHandler, maskStyleTest, maskContentTest, maybeOverlay } from './element_tests';
import { isMouseEvent, isTouchEvent, isElement, isHTMLElement } from '../shared/instanceof';
import { dispatchMouseEvent, initMouseEventArgs } from '../messaging';
import abort from '../shared/abort';
import * as log from '../shared/log';
import bridge from '../bridge';

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
    let target:EventTarget;
    let x:number, y:number;
    let a:number;
    // Normalize mouseevent and touchevent
    if (isMouseEvent(currentEvent)) {
        // mouse event
        log.print("It is a mouse event");
        target = currentEvent.target;
        x = currentEvent.clientX;
        y = currentEvent.clientY;
    } else if (isTouchEvent(currentEvent)) {
        // This is just a stuff. It needs more research.
        target = currentEvent.target;
        let touch = currentEvent.touches[0];
        x = touch.clientX;
        y = touch.clientY;
    }
    if (!target || !isElement(target)) { return; }
    // Use elementsFromPoint API
    let candidates:Element[]|NodeListOf<Element>;
    if (document.elementsFromPoint) {
        candidates = document.elementsFromPoint(x, y)
    } else if (document.msElementsFromPoint) {
        candidates = document.msElementsFromPoint(x, y);
    } else {
        log.print("elementsFromPoint api is missing, exiting..");
        return;
        // log something
    }
    log.print('ElementsFromPoint:', candidates);
    // Use Event#deepPath API
    let path:EventTarget[]|undefined;
    if ('path' in currentEvent) {
        path = currentEvent.path;
    } else if ('composedPath' in currentEvent) {
        path = currentEvent.composedPath!();
    }
    /**
     * This is a heuristic. I won't try to make it robust by following specs for now.
     * ToDo: make the logic more modular and clear.
     * https://drafts.csswg.org/cssom-view/#dom-document-elementsfrompoint
     * https://philipwalton.com/articles/what-no-one-told-you-about-z-index/
     */
    let candidate:Element;
    let i = 0;
    let j = 0;
    let l = candidates.length;
    let parent:Element|null;
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
            if (!isElement(path[++j])) { parent = null; }
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
                // We should check elements behind this if there is a real target.
                log.print("current target looks like an overlay");
                check = false;
                preventPointerEvent(parent);
            }
        } else {
            return;
        }
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
        preventPointerEvent(target);
        while (i-- > 0) { preventPointerEvent(candidates[i]); }
        let args = initMouseEventArgs.map((prop) => currentEvent[prop]);
        dispatchMouseEvent(<initMouseEventArgs><any>args, candidate);
    }
};

const preventPointerEvent = (el:Element):void => {
    if (!isHTMLElement(el)) { return; }
    el.style.setProperty('display', "none", important);
    el.style.setProperty('pointer-events', "none", important);
};

var important = 'important';

export default log.connect(examineTarget, 'Examining Target');
