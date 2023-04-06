// @ts-ignore
export const matches = Element.prototype.matches || Element.prototype.msMatchesSelector;

export const closest = 'closest' in Element.prototype
    ? (el: Element, selector: string)
    : Element => el.closest(selector) : (el: Element, selector: string): Element => {
        while (el) {
            if (matches.call(el, selector)) {
                return el;
            }
            // eslint-disable-next-line no-param-reassign
            el = el.parentElement;
        }
        return null;
    };

/**
 * This serves as an allowlist on various checks where we block re-triggering of events.
 * See dom/dispatchEvent.ts.
 */
export function targetsAreChainable(prev: Node, next: Node): boolean {
    if (prev.nodeType === 3 /* Node.TEXT_NODE */) {
        // Based on observation that certain libraries re-triggers
        // an event on text nodes on its parent due to iOS quirks.
        // eslint-disable-next-line no-param-reassign
        prev = prev.parentNode;
    }
    return prev === next;
}

export const getTagName = (el: Node): string => el.nodeName.toUpperCase();

/**
 * Detects about:blank, about:srcdoc urls.
 */
export const ABOUT_PROTOCOL = 'about:';
const reEmptyUrl = new RegExp(`^${ABOUT_PROTOCOL}`);
export const isEmptyUrl = (url: string): boolean => reEmptyUrl.test(url);

const frameElementDesc = Object.getOwnPropertyDescriptor(window, 'frameElement')
    || Object.getOwnPropertyDescriptor(Window.prototype, 'frameElement');
const getFrameElement = frameElementDesc.get;

/**
 * A function to be called inside an empty iframe to obtain a reference to a parent window.
 * `window.parent` is writable and configurable, so this could be modified by external scripts,
 * and this is actually common for popup/popunder scripts.
 * However, `frameElement` property is defined with a getter, so we can keep its reference
 * and use it afterhands.
 */
const getSafeParent = (window: Window): Window => {
    const frameElement = getFrameElement.call(window);
    if (!frameElement) {
        return null;
    }
    return frameElement.ownerDocument.defaultView;
};

export const getSafeNonEmptyParent = (window: Window): Window => {
    let frame = window;
    while (frame && isEmptyUrl(frame.location.href)) { frame = getSafeParent(frame); }
    if (!frame) {
        return null;
    }
    return frame;
};

export const shadowDomV1Support = 'attachShadow' in Element.prototype;
