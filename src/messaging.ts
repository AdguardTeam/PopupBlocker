/**
 * @fileoverview This establishes a private messaging channel between child frames and
 * the parent frame using `postMessage` and `MessageChannel` api, to be used for various
 * operations which needs to cross border of different browsing contexts. For security
 * reasons, we do not use a simple `postMessage`, for if we did so all `message` event
 * listeners in the top frame would be able to listen to such a message and frames would
 * be able to simulate our postMessage requests, opening a gate for a
 * potential abuse.
 * Current usages:
 *  - a request to show a blocked popup alert on the top frame.
 *  - a request to dispatch a MouseEvent to a specified coordinate inside a frame.
 */

import adguard from './adguard';
import * as log from './shared/log';
import { getTagName, isEmptyUrl, getSafeNonEmptyParent } from './shared/dom';

const supported = typeof WeakMap === 'function';
const parent = window.parent;
const isTop = parent === window;
const isEmpty = isEmptyUrl(location.href);

const _preventDefault = Event.prototype.preventDefault;

const enum MessageType {
    SHOW_ALERT,
    DISPATCH_MOUSE_EVENT
}

interface ShowAlertDataIntf {
    $type:MessageType.SHOW_ALERT,
    orig_domain:string,
    popup_url:string,
    isGeneric:boolean
}

interface DispatchMouseEventDataIntf {
    $type:MessageType.DISPATCH_MOUSE_EVENT,
    args:initMouseEventArgs
}

type MsgData = ShowAlertDataIntf | DispatchMouseEventDataIntf;

const onMessage = (evt:MessageEvent) => {
    const data = <MsgData>evt.data;
    log.print('received a message of type: ' + data.$type);
    switch (data.$type) {
        case MessageType.SHOW_ALERT: {
            createAlertInTopFrame(data.orig_domain, data.popup_url, data.isGeneric);
            break;
        }
        case MessageType.DISPATCH_MOUSE_EVENT: {
            dispatchMouseEvent(data.args);
            break;
        }
    }
};

const MAGIC = 'pb_handshake';
const framePortMap = supported ? new WeakMap() : null; // Maps a frame's contentWindow --> a port to communicate with the frame
const handshake = (evt:MessageEvent) => {
    if (evt.data !== MAGIC) {
        // `MAGIC` indicates that this message is sent by the popupblocker from the child frame.
        return;
    }
    // From now on, propagation of event must be stopped.
    receivePort: {
        if (typeof evt.source === 'undefined') {
            // evt.source can be undefiend when an iframe has been removed from the document before the message is received.
            break receivePort;
        }
        if (framePortMap.has(evt.source)) {
            // Such frames have already sent its message port, we do not accept additional ports.
            break receivePort;
        }
        log.print('received a message from:', evt.source);
        let port = evt.ports[0]; // This is a port that a child frame sent.
        port.onmessage = onMessage;
        framePortMap.set(evt.source, port);
    }
    evt.stopImmediatePropagation();
    _preventDefault.call(evt);
};

const channel = !isTop && supported ? new MessageChannel() : null;
if (supported) {
    window.addEventListener('message', handshake);
    if (!isTop) {
        parent.postMessage(MAGIC, '*', [channel.port1]);
        channel.port2.onmessage = onMessage;
    }
}

/**********************************************************************/
// SHOW_ALERT

export const createAlertInTopFrame = supported && !isTop && !isEmpty ? (orig_domain:string, popup_url:string, isGeneric:boolean):void => {
    // If a current window is not top nor empty and the browser supports WeakMap, postMessage to parent.
    let data:ShowAlertDataIntf = {
        $type: MessageType.SHOW_ALERT,
        orig_domain,
        popup_url,
        isGeneric
    };
    channel.port2.postMessage(data);
} : (isTop || isEmpty) ? (orig_domain:string, popup_domain:string):void => {
    // If a current window is the top frame or an empty frame, display an alert using bridge.
    // Empty iframes can be detached from the document shortly after opening a popup.
    // In such cases, `postMessage` may not work due to `evt.source` being `undefined`,
    // so we use bridge directly which is readily available anyway.
    // A `setTimeout` is used to prevent event handler from blocking UI.
    //
    // const targetFrame = getSafeNonEmptyParent(window);
    // targetFrame.setTimeout(adguard.storageProvider.showAlert, 0, orig_domain, popup_domain);
    adguard.storageProvider.showAlert(orig_domain, popup_domain);
} : /* noop */(orig_domain:string, popup_domain:string, isGeneric:boolean):void => {
    // If a current window is not top and the browser does not support WeakMap, do nothing.
};

/**********************************************************************/
// DISPATCH_MOUSE_EVENT

/**
 * Formats and posts a message to a target frame. It expects to receive a initMouseEventArgs
 * that is already modified according to the targetFrame's position.
 */
function dispatchMouseEventToFrame(initMouseEventArgs:initMouseEventArgs, targetWin:Window):void {
    const port = framePortMap.get(targetWin);
    if (!port) {
        log.print('port is undefined');
        return;
    }
    const data:DispatchMouseEventDataIntf = {
        $type:MessageType.DISPATCH_MOUSE_EVENT,
        args:initMouseEventArgs
    };
    log.print('posting a message...', port);
    port.postMessage(data);
}

let pressed = false;

export function dispatchMouseEvent(initMouseEventArgs:initMouseEventArgs, target?:Element) {
    log.call('dispatchMouseEvent');
    const clientX = initMouseEventArgs[7];
    const clientY = initMouseEventArgs[8];
    target = target || document.elementFromPoint(clientX, clientY);
    if (getTagName(target) === 'IFRAME') {
        log.print('target is an iframe');
        let _target = <HTMLIFrameElement>target
        // adjust initMouseEventArgs array values here
        let rect = _target.getBoundingClientRect();
        initMouseEventArgs[7] -= rect.left;
        initMouseEventArgs[8] -= rect.top;
        initMouseEventArgs[3] = null; // Window object cannot be cloned
        dispatchMouseEventToFrame(initMouseEventArgs, _target.contentWindow);
    } else {
        log.print('target is not an iframe, directly dispatching event...', target);
        // The purpose of this is to prevent triggering click for both `mousedown` and `click`,
        // or `mousedown` and `mouseup`.
        if (pressed) { return; }
        pressed = true;
        setTimeout(() => {
            pressed = false;
        }, 100);
        // Using click(). Manually dispatching a cloned event may not trigger an intended behavior.
        // For example, when a cloned mousedown event is dispatched to a target and a real mouseup
        // event is dispatched to the target, it won't cause a `click` event.
        (<HTMLElement>target).click();
    }
    log.callEnd();
}

export const initMouseEventArgs = 'type,canBubble,cancelable,view,detail,screenX,screenY,clientX,clientY,ctrlKey,altKey,shiftKey,metaKey,button,relatedTarget'.split(',');
export interface initMouseEventArgs {
    0:string,       // type
    1:boolean,      // canBubble
    2:boolean,      // cancelable
    3:Window,       // view
    4:number,       // detail
    5:number,       // screenX
    6:number,       // screenY
    7:number,       // clientX
    8:number,       // clientY
    9:boolean,      // ctrlKey
    10:boolean,     // altKey
    11:boolean,     // shiftKey
    12:boolean,     // metaKey
    13:number,      // button
    14:EventTarget  // relatedTarget
}
