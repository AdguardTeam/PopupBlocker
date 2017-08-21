import { ApplyHandler, wrapMethod } from '../proxy';
import { retrieveEvent, verifyEvent, verifyCurrentEvent } from '../events/verify';
import examineTarget from '../events/examine-target';
import abort from '../abort';
import * as log from '../log';
import bridge from '../bridge';

let clickVerified:ApplyHandler = function(_click, _this) {
    if (_this.nodeName.toLowerCase() == 'a') {
        log.print('click() was called on an anchor tag');
        // Checks if an url is in a whitelist
        if (bridge.whitelistedDestinations.indexOf(_this.host) !== -1) {
            _click.call(_this);
            return;
        }
        let currentEvent = retrieveEvent();
        if (!verifyEvent(currentEvent)) {
            log.print('It did not pass the test, not clicking element');
            bridge.showAlert(bridge.domain, _this.host, false);
            examineTarget(currentEvent, _this.href);
            log.callEnd();
            return;
        }
    }
    _click.call(_this);
};

clickVerified = log.connect(clickVerified, 'Verifying click')
export const _click = HTMLElement.prototype.click;
wrapMethod(HTMLElement.prototype, 'click', clickVerified);
