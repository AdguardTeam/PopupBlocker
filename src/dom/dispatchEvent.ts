import { ApplyHandler, wrapMethod } from '../proxy';
import { verifyCurrentEvent } from '../verify-event';
import log from '../log';

const dispatchVerifiedEvent:ApplyHandler = function(_dispatchEvent, _this, _arguments) {
    let evt = _arguments[0];
    if ('clientX' in evt && _this.nodeName.toLowerCase() == 'a' && !evt.isTrusted) {
        log('It is a MouseEvent on an anchor tag.');
        let passed = verifyCurrentEvent();
        if (!passed) {
            log('It did not pass the test, not dispatching event');
            return false;
            // Or, we may open a new widnow with window.open to save a reference and do additional checks.
        }
    }
    return _dispatchEvent.call(_this, evt);
};

let _dispatchEvent;

if (typeof EventTarget == 'undefined') {
    _dispatchEvent = Node.prototype.dispatchEvent;
    wrapMethod(Node.prototype, 'dispatchEvent', dispatchVerifiedEvent);
} else {
    _dispatchEvent = EventTarget.prototype.dispatchEvent;
    wrapMethod(EventTarget.prototype, 'dispatchEvent', dispatchVerifiedEvent);
}

export { _dispatchEvent };
