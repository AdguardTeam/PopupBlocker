import bridge from './bridge';
import * as log from './log';

const supported = typeof WeakMap === 'function';
const parent = window.parent;
const isTopOrEmpty = parent === window || location.href === 'about:blank';

const enum MessageType {    
    SHOW_ALERT,
    DISPATCH_MOUSE_EVENT
}

interface ShowAlertDataIntf {
    type:MessageType.SHOW_ALERT,
    orig_domain:string,
    popup_domain:string,
    isGeneric:boolean
}

interface DispatchMouseEventDataIntf {
    type:MessageType.DISPATCH_MOUSE_EVENT,
    args:initMouseEventArgs
}

type MsgData = ShowAlertDataIntf | DispatchMouseEventDataIntf;

const onMessage = (evt:MessageEvent) => {
    const data = <MsgData>evt.data;
    log.print('received a message of type: ' + data.type);
    switch (data.type) {
        case MessageType.SHOW_ALERT: {
            createAlertInTopFrame(data.orig_domain, data.popup_domain, data.isGeneric);
            break;
        }
        case MessageType.DISPATCH_MOUSE_EVENT: {
            dispatchMouseEvent(data.args);
            break;
        }
    }
};

const MAGIC = 'pb_handshake';
const framePortMap = supported ? new WeakMap() : null;
const handshake = (evt:MessageEvent) => {
    if (evt.origin === "null" || evt.origin === "about://") {
        // For such empty frames, PopupBlocker inject itself and shares the bridge object.
        // So there is no need to use a messaging channel.
        // IE and Edge recognize empty frames' origin as `about://`.
        return;
    }
    if (evt.data !== MAGIC) {
        // `MAGIC` indicates that this message is sent by the popupblocker from the child frame.
        return;
    }
    if (framePortMap.has(evt.source)) {
        // Such frames have already sent its message port, we do not accept additional ports.
        return;
    }
    log.print('received a message from:', evt.source);
    let port = evt.ports[0]; // This is a port that a child frame sent.
    port.onmessage = onMessage;
    framePortMap.set(evt.source, port);
    evt.stopImmediatePropagation();
    evt.preventDefault();
};

const channel = !isTopOrEmpty && supported ? new MessageChannel() : null;
if (supported) {
    window.addEventListener('message', handshake);
    if (!isTopOrEmpty) {
        parent.postMessage(MAGIC, '*', [channel.port1]);
        channel.port2.onmessage = onMessage;
    }
}

/*******************************/

export const createAlertInTopFrame = supported && !isTopOrEmpty ? (orig_domain:string, popup_domain:string, isGeneric:boolean):void => {
    let data:ShowAlertDataIntf = {
        type: MessageType.SHOW_ALERT,
        orig_domain,
        popup_domain,
        isGeneric
    };
    channel.port2.postMessage(data);
} : isTopOrEmpty ? (orig_domain:string, popup_domain:string, isGeneric:boolean):void => {
    bridge.showAlert(orig_domain, popup_domain, isGeneric);
} : /* noop */(orig_domain:string, popup_domain:string, isGeneric:boolean):void => {};

/**
 * It expects to receive a initMouseEventArgs that is already modified according to the targetFrame's position.
 */
function dispatchMouseEventToFrame(initMouseEventArgs:initMouseEventArgs, targetWin:Window):void {
    const port = framePortMap.get(targetWin);
    if (!port) {
        log.print('port is undefined');
        return;
    }
    const data:DispatchMouseEventDataIntf = {
        type:MessageType.DISPATCH_MOUSE_EVENT,
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
    if (target.nodeName.toLowerCase() === 'iframe') {
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
        // quick and dirty hack :(
        if (pressed) { return; }
        pressed = true;
        setTimeout(() => {
            pressed = false;
        }, 100);
        // using click()
        (<HTMLElement>target).click();
    }
    log.callEnd();
}

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
