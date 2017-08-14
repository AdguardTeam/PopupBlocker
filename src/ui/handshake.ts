/**
 * @fileoverview This establishes a private messaging channel between child frames and
 * the top frame to be used to trigger an alert for blocked popups.
 * Expected messages:
 *  - a request to show a blocked popup alert.
 *  - a request to pass a MessagePort from a child-child-iframe
 */
import alertController from './show-alert';
import * as log from '../log';

const parent = window.parent;
const isTopOrEmpty = parent === window || location.href === 'about:blank';

const MAGIC = 'handshake';
const MAGIC_CHILD = 'handshake-child';
const connectedFrames = [];

const channel = isTopOrEmpty ? null : new MessageChannel(); // Do not initialize messagechannel on top frames

const handshake = (evt:MessageEvent) => {
    if (evt.origin === "null" || evt.origin === "about://") { return; }
    if (evt.data !== MAGIC) { return; }
    if (connectedFrames.indexOf(evt.source) !== -1) { return; }

    log.print('received a message from:', evt.source);

    let port = evt.ports[0];
    port.onmessage = onMessage;

    connectedFrames.push(evt.source);

    evt.stopImmediatePropagation();
    evt.preventDefault();
};

const onMessage = (evt:MessageEvent) => {
    if (evt.data === MAGIC_CHILD) {
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
};

window.addEventListener('message', handshake);

if (!isTopOrEmpty) {
    parent.postMessage(MAGIC, '*', [channel.port1]);
}

export default function createAlertInTopFrame(orig_domain:string, popup_domain:string, isGeneric:boolean):void {
    log.print('called createAlertInTopFrame');
    if (isTopOrEmpty) {
        alertController.createAlert(orig_domain, popup_domain, isGeneric);
    } else {
        channel.port2.postMessage(JSON.stringify({
            orig_domain,
            popup_domain,
            isGeneric
        }));
    }
}
