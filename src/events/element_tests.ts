import { isNode, isHTMLElement, isWindow } from '../shared/instanceof';
import { getTagName } from '../shared/dom';
import * as log from '../shared/debug';

export const hasDefaultHandler = (el:Element):boolean => {
    const name = getTagName(el);
    if (name == 'IFRAME' || name == 'INPUT' || name == 'A' || name == 'BUTTON' || el.hasAttribute('onclick') || el.hasAttribute('onmousedown') || el.hasAttribute('onmouseup')) {
        return true;
    }
    return false;
};

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

export const maskStyleTest = (el:Element):boolean => {
    const style = getComputedStyle(el);
    const position = style.getPropertyValue('position');
    const zIndex = style.getPropertyValue('z-index');
    // Theoretically, opacity css property can be used to make masks as well
    // but hasn't encountered such usage in the wild, so not including it.
    if (position !== 'static' && parseInt(zIndex, 10) > 1000) { return true; }
    return false;
};

export const maskContentTest = (el:Element):boolean => {
    let textContent = el.textContent;
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
    const w = view.innerWidth, h = view.innerHeight;
    if (el.offsetLeft << 4 < w && (w - el.offsetWidth) << 3 < w
        && el.offsetTop << 4 < h && (h - el.offsetHeight) << 3 < h) {
        return maskStyleTest(el);
    }
    // ToDo: the element may have been modified in the event handler.
    // We may still test it using the inline style attribute.
    return false;
}
