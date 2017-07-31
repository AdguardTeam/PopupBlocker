import { ApplyHandler, wrapMethod } from '../proxy';
import { verifyCurrentEvent } from '../verify-event';
import * as log from '../log';

const clickVerified:ApplyHandler = function(_click, _this) {
    if (_this.nodeName.toLowerCase() == 'a') {
        log.call('click() was called on an anchor tag');
        var passed = verifyCurrentEvent();
        if (!passed) {
            log.print('It did not pass the test, not clicking element');
            log.callEnd();
            return;
        }
        log.callEnd();
    }
    _click.call(_this);
};

wrapMethod(HTMLElement.prototype, 'click', clickVerified);
