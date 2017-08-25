/**
 * @fileoverview Utility functions for instanceof checks against DOM classes. Used for type casting.
 * Since it is common for us to cross the border of browsing contexts, instanceof
 * check for DOM element is not reliable.
 */

export const isMouseEvent = (event:Event):boolean => {
    return 'clientX' in event;
};

export const isTouchEvent = (event:Event):boolean => {
    return 'touches' in event;
};

export const isUIEvent = (event:Event):boolean => {
    return 'view' in event;
};

export const isNode = (el:EventTarget):boolean => {
    return 'nodeName' in el;
};

export const isElement = (el:EventTarget):boolean => {
    return 'id' in el;
};

export const isHTMLElement = (el:Element):boolean => {
    return 'style' in el;
};
