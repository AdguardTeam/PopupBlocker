/* eslint-disable no-bitwise */
import {
    isNode,
    isHTMLElement,
    isWindow,
    getTagName,
} from '../shared';

/**
 * Detects a common stacking context root pattern.
 * Stacking context root: https://philipwalton.com/articles/what-no-one-told-you-about-z-index/
 * https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context
 */
export function isArtificialStackingContextRoot(el:Element) {
    const { zIndex, position, opacity } = getComputedStyle(el);
    if (
        (position !== 'static' && zIndex !== 'auto')
        || parseFloat(opacity) < 1
    ) {
        if (parseInt(zIndex, 10) > 1000) {
            return true;
        }
    }
    return false;
}

export function numsAreClose(x:number, y: number, threshold:number) {
    return (((x - y) / threshold) | 0) === 0;
}

/**
 * @param w view.innerWidth
 * @param h view.innerHeight
 */
export function rectAlmostCoversView(rect:ClientRect, w:number, h:number) {
    const {
        left, right, top, bottom,
    } = rect;
    return numsAreClose(left, 0, w >> 4)
        && numsAreClose(right, w, w >> 4)
        && numsAreClose(top, 0, h >> 4)
        && numsAreClose(bottom, h, h >> 4);
}

export const eventTargetIsRootNode = (el:EventTarget):boolean => {
    if (isWindow(el)) { return true; }
    if (isNode(el)) {
        const name = getTagName(el);
        // Technically, document.body can be a frameset node,
        // but ui events originating from its child frames won't propagate
        // past the frame border, so such cases are irrelevant.
        // https://www.w3.org/TR/html401/present/frames.html
        if (name === '#DOCUMENT' || name === 'HTML' || name === 'BODY') {
            return true;
        }
    }
    return false;
};

export const maskContentTest = (el:Element):boolean => {
    const { textContent } = el;
    if (textContent && textContent.trim().length) { return false; }
    return el.getElementsByTagName('img').length === 0;
};

/**
 * Detects common overlay pattern.
 * @param el an element to check whether it is an overlay.
 * @return true if el is an overlay.
 */
export function maybeOverlay(el:Element):boolean {
    if (!isHTMLElement(el)) { return false; } // not an HTMLElement instance
    const view = el.ownerDocument.defaultView;
    const w = view.innerWidth; const
        h = view.innerHeight;

    if (rectAlmostCoversView(el.getBoundingClientRect(), w, h)) {
        // Find artificial stacking context root
        do {
            if (isArtificialStackingContextRoot(el)) {
                return true;
            }
        // eslint-disable-next-line no-param-reassign, no-cond-assign
        } while (el = el.parentElement);
    }
    // ToDo: the element may have been modified in the event handler.
    // We may still test it using the inline style attribute.
    return false;
}
