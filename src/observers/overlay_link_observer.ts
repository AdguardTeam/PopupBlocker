import MO from './mutation_observer';
import { maybeOverlay } from '../events/element_tests';
import { preventPointerEvent } from '../events/examine_target';
import getTime from '../shared/time';
import { isAnchor } from '../shared/instanceof';
import * as log from '../shared/log';

class OverlayAnchorObserver {
    private observer:MutationObserver
    private lastFired:number = 0
    private callbackTimer:number = -1
    private callback:MutationCallback = (mutations, observer) => {
        this.lastFired = getTime();
        this.callbackTimer = -1;
        let el = OverlayAnchorObserver.hitTest();
        if (el) {
            OverlayAnchorObserver.preventPointerEventIfOverlayAnchor(el);
        }
    }
    private static hitTest = ():Element => {
        let w = window.innerWidth, h = window.innerHeight;
        let el = document.elementFromPoint(w >> 1, h >> 1);
        return el;
    }
    private static preventPointerEventIfOverlayAnchor = (el:Element):boolean => {
        if (isAnchor(el) && maybeOverlay(el)) {
            log.print('Found an overlay Anchor, processing it...');
            preventPointerEvent(el);
            return true;
        }
        return false;
    }
    private clicked:boolean = false
    private clickTimer:number
    private throttledCallback:MutationCallback = (mutations, observer) => {
        let time = getTime() - this.lastFired;
        if (this.clicked) {
            if (this.callbackTimer !== -1) {
                return;
            }
            if (time > 50) {
                this.callback(mutations, observer);
            } else {
                this.callbackTimer = setTimeout(() => {
                    this.callback(mutations, observer);
                }, 50 - time);
            }
        }
    }
    private static readonly option:MutationObserverInit = {
        childList: true,
        subtree: true
    }
    constructor() {
        window.addEventListener('mousedown', (evt) => {
            if (evt.isTrusted) {
                this.clicked = true;
                clearTimeout(this.clickTimer);
                this.clickTimer = setTimeout(() => {
                    this.clicked = false;
                }, 200);
            }
        }, true);
        if (MO) {
            this.observer = new MO(this.throttledCallback);
            this.observer.observe(document.documentElement, OverlayAnchorObserver.option);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new OverlayAnchorObserver();
});
