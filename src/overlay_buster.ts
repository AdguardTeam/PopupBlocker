import { nodeIsElement, isAnchor, isUndef } from './shared/instanceof';
import { maybeOverlay } from './events/element_tests';
import { preventPointerEvent } from './events/examine_target';
import getTime from './shared/time';
import * as log from './shared/log';

let lastFired:number = 0;
let callbackTimer:number = -1;

const callback:MutationCallback = (mutations, observer) => {
    lastFired = getTime();
    callbackTimer = -1;
    let el = hitTest();
    if (el) {
        preventPointerEventIfOverlayAnchor(el);
    }
};

const hitTest = ():Element => {
    let w = window.innerWidth, h = window.innerHeight;
    let el = document.elementFromPoint(w >> 1, h >> 1);
    return el;
};

const preventPointerEventIfOverlayAnchor = (el:Element):boolean => {
    if (isAnchor(el) && maybeOverlay(el)) {
        log.print('Found an overlay Anchor, processing it...');
        preventPointerEvent(el);
        return true;
    }
    return false;
};

let clicked = false;
let clickTimer:number;

window.addEventListener('mousedown', (evt) => {
    if (evt.isTrusted) {
        clicked = true;
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
            clicked = false;
        }, 100);        
    }
}, true);

const throttledCallback:MutationCallback = (mutations, observer) => {
    let time = getTime() - lastFired;
    if (clicked) {
        if (callbackTimer !== -1) { return; }
        if (time > 50) {
            callback(mutations, observer);
        } else {
            callbackTimer = setTimeout(() => {
                callback(mutations, observer);
            }, 50 - time);
        }
    }
};

const MO = window.MutationObserver || window.WebKitMutationObserver;

if (!isUndef(MO)) {
    const observer = new MO(throttledCallback);
    const observerOption:MutationObserverInit = {
        childList: true,
        subtree: true
    };
    window.addEventListener('DOMContentLoaded', function() {
        observer.observe(document.body, observerOption);
    });
}

// Typescript doesn't contain declaration for MO in window property
interface MO {
    new (callback:MutationCallback):MutationObserver,
    prototype:MutationObserver
}

interface WindowWithMO extends Window {
    MutationObserver?:MO,
    WebKitMutationObserver?:MO
}

declare var window:WindowWithMO;
