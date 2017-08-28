import { isHTMLElement } from '../shared/instanceof';
import * as log from '../shared/log';

export const hasDefaultHandler = (el:Element):boolean => {
    const name = el.nodeName.toLowerCase();
    if (name == 'iframe' || name == 'input' || name == 'a' || name == 'button' || el.hasAttribute('onclick') || el.hasAttribute('onmousedown') || el.hasAttribute('onmouseup')) {
        return true;
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
    log.call('maybeOverlay test');
    let w = window.innerWidth, h = window.innerHeight;
    if (el.offsetLeft << 4 < w && (w - el.offsetWidth) << 3 < w
        && el.offsetTop << 4 < h && (h - el.offsetHeight) << 3 < w) {
        return maskStyleTest(el);
    }
    // ToDo: the element may have been modified in the event handler.
    // We may still test it using the inline style attribute.
    log.callEnd();
    return false;
}
