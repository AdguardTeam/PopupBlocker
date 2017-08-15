import { ApplyHandler, ApplyOption, wrapMethod } from '../proxy';
import { verifyCurrentEvent } from '../events/verify-event';
import * as log from '../log';
import bridge from '../bridge';

const dispatchVerifiedEvent:ApplyHandler = function(_dispatchEvent, _this, _arguments) {
    let evt = _arguments[0];
    if ('clientX' in evt && _this.nodeName.toLowerCase() == 'a' && !evt.isTrusted) {
        log.call('It is a MouseEvent on an anchor tag.');
        // Checks if an url is in a whitelist
        if (bridge.whitelistedDestinations.indexOf(_this.host)) {
            return _dispatchEvent.call(_this, evt);
        }
        let passed = verifyCurrentEvent();
        if (!passed) {
            log.print('It did not pass the test, not dispatching event');
            log.callEnd();
            bridge.showAlert(bridge.domain, _this.host, false);
            return false;
            // Or, we may open a new widnow with window.open to save a reference and do additional checks.
        }
        log.callEnd();
    }
    return _dispatchEvent.call(_this, evt);
};

const isUIEvent:ApplyOption = (target, _this, _arguments) => {
    return 'view' in _this;
};

const eventTargetPType = typeof EventTarget == 'undefined' ? Node.prototype : EventTarget.prototype;

export const _dispatchEvent = eventTargetPType.dispatchEvent;
wrapMethod(eventTargetPType, 'dispatchEvent', dispatchVerifiedEvent, isUIEvent);
