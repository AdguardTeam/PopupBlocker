import { ApplyHandler, wrapMethod } from '../proxy';
import { retrieveEvent, verifyEvent, verifyCurrentEvent } from '../events/verify';
import examineTarget from '../events/examine-target';
import abort from '../abort';
import * as log from '../log';
import bridge from '../bridge';

const clickVerified:ApplyHandler = function(_click, _this) {
    if (_this.nodeName.toLowerCase() == 'a') {
        log.print('click() was called on an anchor tag');
        // Checks if an url is in a whitelist
        let destDomain = _this.hostname;
        if (bridge.whitelistedDestinations.indexOf(destDomain) !== -1) {
            log.print(`The domain ${destDomain} is in whitelist.`);
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

wrapMethod(HTMLElement.prototype, 'click', log.connect(clickVerified, 'Verifying click'));
