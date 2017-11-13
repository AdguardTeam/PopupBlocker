export const matches = Element.prototype.matches || Element.prototype.msMatchesSelector;

export const closest = 'closest' in Element.prototype ? (el:Element, selector:string):Element => {
    return el.closest(selector);
} : (el:Element, selector:string):Element => {
    for (let parent = el; parent; parent = parent.parentElement) {
        if (matches.call(el, selector)) {
            return el;
        }
    }
};

export const getTagName = (el:Node):string => {
    return el.nodeName.toUpperCase();
};

/**
 * Detects about:blank, about:srcdoc urls.
 */
const reEmptyUrl = /^about\:/;
export const isEmptyUrl = (url:string):boolean => {
    return reEmptyUrl.test(url);
};

const frameElementDesc = Object.getOwnPropertyDescriptor(window, 'frameElement') || Object.getOwnPropertyDescriptor(Window.prototype, 'frameElement');
const getFrameElement = frameElementDesc.get;

/**
 * A function to be called inside an empty iframe to obtain a reference to a parent window.
 * `window.parent` is writable and configurable, so this could be modified by external scripts,
 * and this is actually common for popup/popunder scripts.
 * However, `frameElement` property is defined with a getter, so we can keep its reference
 * and use it afterhands.
 */
const getSafeParent = (window:Window):Window => {
    let frameElement = getFrameElement.call(window);
    if (!frameElement) { return null; }
    return frameElement.ownerDocument.defaultView;
};

export const getSafeNonEmptyParent = (window:Window):Window => {
    let frame = window;
    while (frame && isEmptyUrl(frame.location.href)) { frame = getSafeParent(frame); }
    if (!frame) { return null; }
    return frame;
};
