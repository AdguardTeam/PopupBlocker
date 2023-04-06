/* eslint-disable no-bitwise */
import MO from './mutation-observer';
import { maybeOverlay } from '../events/element-tests';
import { preventPointerEvent } from '../events/examine-target';
import {
    getTime,
    isAnchor,
    log,
} from '../shared';

/**
 * Certain pop-up or pop-under scripts creates a transparent anchor covering the entire page
 * on user action. This observer detects it and neutralizes it.
 */
class OverlayAnchorObserver {
    private observer:MutationObserver;

    private lastFired = 0;

    private callbackTimer: ReturnType<typeof setTimeout> | number = -1;

    private callback:MutationCallback = () => {
        this.lastFired = getTime();
        this.callbackTimer = -1;
        const el = OverlayAnchorObserver.hitTest();
        if (el) {
            OverlayAnchorObserver.preventPointerEventIfOverlayAnchor(el);
        }
    };

    private static hitTest = ():Element => {
        const w = window.innerWidth; const
            h = window.innerHeight;
        const el = document.elementFromPoint(w >> 1, h >> 1);
        return el;
    };

    private static preventPointerEventIfOverlayAnchor = (el:Element):boolean => {
        if (isAnchor(el) && maybeOverlay(el)) {
            log.print('Found an overlay Anchor, processing it...');
            preventPointerEvent(el);
            return true;
        }
        return false;
    };

    private clicked = false;

    private clickTimer:ReturnType<typeof setTimeout>;

    private static THROTTLE_TIME = 50;

    private throttledCallback:MutationCallback = (mutations, observer) => {
        if (!this.clicked) { return; }
        const time = getTime() - this.lastFired;
        if (this.callbackTimer !== -1) {
            return;
        }
        if (time > OverlayAnchorObserver.THROTTLE_TIME) {
            this.callback(mutations, observer);
        } else {
            this.callbackTimer = setTimeout(() => {
                this.callback(mutations, observer);
            }, OverlayAnchorObserver.THROTTLE_TIME - time);
        }
    };

    private static readonly option:MutationObserverInit = {
        childList: true,
        subtree: true,
    };

    // It react to overlay anchor creation within 200 ms after each of user click
    private static OBSERVE_DURATION_AFTER_CLICK = 200;

    constructor() {
        window.addEventListener('mousedown', (evt) => {
            if (evt.isTrusted) {
                this.clicked = true;
                clearTimeout(this.clickTimer);
                this.clickTimer = setTimeout(() => {
                    this.clicked = false;
                }, OverlayAnchorObserver.OBSERVE_DURATION_AFTER_CLICK);
            }
        }, true);
        if (MO) {
            this.observer = new MO(this.throttledCallback);
            this.observer.observe(document.documentElement, OverlayAnchorObserver.option);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // eslint-disable-next-line no-new
    new OverlayAnchorObserver();
});
