/**
 * @fileoverview Utility functions for instanceof checks against DOM classes. Used for type casting.
 * Since it is common for us to cross the border of browsing contexts, instanceof
 * check for DOM element is not reliable.
 */

import { getTagName } from './dom';

export function isMouseEvent(event:Event):event is MouseEvent {
    return 'clientX' in event;
}

export function isTouchEvent(event:Event):event is TouchEvent {
    return 'touches' in event;
}

export function isUIEvent(event:Event):event is UIEvent {
    return 'view' in event;
}

/**/

export function isNode(el:EventTarget):el is Node {
    return 'nodeName' in el;
}

export function isElement(el:EventTarget):el is Element {
    return 'id' in el;
}

export function isHTMLElement(el:Element):el is HTMLElement {
    return 'style' in el;
}

export function isAnchor(el:Node):el is HTMLAnchorElement {
    return getTagName(el) === 'A';
}

export function isIFrame(node:Node):node is HTMLIFrameElement {
    return getTagName(node) === 'IFRAME';
}

/**/

const { toString } = Object.prototype;

export function isWindow(el:any):el is Window {
    return toString.call(el) === '[object Window]';
}

export function isLocation(el:any):el is Location {
    return toString.call(el) === '[object Location]';
}

/**/

export function isUndef(obj:any):obj is undefined {
    return typeof obj === 'undefined';
}

export function isNumber(obj:any):obj is number {
    return typeof obj === 'number';
}

/**/

export function isClickEvent(evt:MouseEvent):boolean {
    const { type } = evt;
    return type === 'click' || type === 'mousedown' || type === 'mouseup';
}
