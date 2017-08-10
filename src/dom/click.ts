import { ApplyHandler, wrapMethod } from '../proxy';
import { verifyCurrentEvent } from '../events/verify-event';
import * as log from '../log';

let clickVerified:ApplyHandler = function(_click, _this) {
    if (_this.nodeName.toLowerCase() == 'a') {
        log.print('click() was called on an anchor tag');
        var passed = verifyCurrentEvent();
        if (!passed) {
            log.print('It did not pass the test, not clicking element');
            log.callEnd();
            return;
        }
    }
    _click.call(_this);
};

clickVerified = log.connect(clickVerified, 'Verifying click')

wrapMethod(HTMLElement.prototype, 'click', clickVerified);
