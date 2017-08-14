import { ApplyHandler, wrapMethod } from '../proxy';
import { verifyCurrentEvent } from '../events/verify-event';
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
        var passed = verifyCurrentEvent();
        if (!passed) {
            log.print('It did not pass the test, not clicking element');
            bridge.showAlert(bridge.domain, _this.host, true);
            log.callEnd();
            return;
        }
    }
    _click.call(_this);
};

clickVerified = log.connect(clickVerified, 'Verifying click')

wrapMethod(HTMLElement.prototype, 'click', clickVerified);
