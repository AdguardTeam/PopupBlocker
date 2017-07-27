import { ApplyHandler, wrapMethod } from '../proxy';
import { verifyCurrentEvent } from '../verify-event';
import log from '../log';

const clickVerified:ApplyHandler = function(_click, _this) {
    if (_this.nodeName.toLowerCase() == 'a') {
        log('click() was called on an anchor tag');
        var passed = verifyCurrentEvent();
        if (!passed) {
            log('It did not pass the test, not clicking element');
            return;
        }
    }
    _click.call(_this);
};

wrapMethod(HTMLElement.prototype, 'click', clickVerified);
