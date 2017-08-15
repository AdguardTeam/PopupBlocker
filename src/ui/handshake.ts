/**
 * @fileoverview This establishes a private messaging channel between child frames and
 * the top frame using `postMessage` and `MessageChannel` api, to be used to trigger an
 * alert for blocked popups. This is for security; if we used a plain `postMessage`, all
 * `message` event listeners in the top frame would be able to listen to such a message
 * and frames would be able to simulate our postMessage requests, opening a gate for a
 * potential abuse.
 * Expected messages:
 *  - a request to show a blocked popup alert.
 *  - a request to pass a MessagePort from a child-child-iframe
 */
import alertController from './show-alert';
import * as log from '../log';

const supported = typeof WeakMap === 'function';
const parent = window.parent;
const isTopOrEmpty = parent === window || location.href === 'about:blank';

let createAlertInTopFrame = (orig_domain:string, popup_domain:string, isGeneric:boolean):void => {
    alertController.createAlert(orig_domain, popup_domain, isGeneric);
};

if (supported) {
    const MAGIC = 'handshake';
    const MAGIC_CHILD = 'handshake-child';
    const connectedFrames = new WeakMap();
    const channel = isTopOrEmpty ? null : new MessageChannel(); // Do not initialize messagechannel when it is not going to be used

    /**
     * A `message` event handler to store private messaging channel.
     * Each iframe posts a message to its parent frame with a port of a newly created
     * MessageChannel. This handler receives it and calls `stopImmediatePropagation`
     * so that other `message` event handler cannot listen to such messages.
     */
    const handshake = (evt:MessageEvent) => {
        if (evt.origin === "null" || evt.origin === "about://") {
            // For such empty frames, PopupBlocker inject itself and shares the bridge object.
            // So there is no need to use a messaging channel.
            // IE and Edge recognizes empty frames' origin as `about://`.
            return;
        }
        if (evt.data !== MAGIC) {
            // `MAGIC` indicates that this message is sent by the popupblocker from the child frame.
            return;
        }
        if (connectedFrames.has(evt.source)) {
            // Such frames have already sent its message port, we do not accept additional ports.
            return;
        }
        log.print('received a message from:', evt.source);
        let port = evt.ports[0]; // This is a port that a child frame sent.
        port.onmessage = onMessage; // Registers a listener
        connectedFrames.set(evt.source, true);
        evt.stopImmediatePropagation();
        evt.preventDefault();
    };

    /**
     * This is a function that will be used as a message event handler for private
     * messaging channel we establishes.
     */
    const onMessage = (evt:MessageEvent) => {
        log.call('Received a message from a private channel');
        if (evt.data === MAGIC_CHILD) {
            log.print('It is a request to pass a MessagePort to a parent frame');
            let port = evt.ports[0];
            port.onmessage = onMessage;
        } else {
            if (isTopOrEmpty) {
                let data:PopupNotificationMsgIntf = JSON.parse(evt.data);
                alertController.createAlert(data.orig_domain, data.popup_domain, data.isGeneric);
            } else {
                channel.port2.postMessage(MAGIC_CHILD, [evt.ports[0]]);
            }
        }
        log.callEnd();
    };

    window.addEventListener('message', handshake);

    if (!isTopOrEmpty) {
        parent.postMessage(MAGIC, '*', [channel.port1]); // Passes a messeging channel to parent.

        createAlertInTopFrame = (orig_domain:string, popup_domain:string, isGeneric:boolean):void => {
            channel.port2.postMessage(JSON.stringify({
                orig_domain,
                popup_domain,
                isGeneric
            }));
        };
    }
} else {
    if (!isTopOrEmpty) {
        createAlertInTopFrame = (orig_domain:string, popup_domain:string, isGeneric:boolean):void => {};
    }
}

export default createAlertInTopFrame;
