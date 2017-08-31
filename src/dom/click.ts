import { ApplyHandler, wrapMethod } from '../proxy';
import { retrieveEvent, verifyEvent, verifyCurrentEvent } from '../events/verify';
import examineTarget from '../events/examine_target';
import { getTagName } from '../shared/dom';
import * as log from '../shared/log';
import bridge from '../bridge';
import { createAlertInTopFrame } from '../messaging';
import pdfObjObserver from '../observers/pdf_object_observer';

const clickVerified:ApplyHandler = function(_click, _this) {
    if (getTagName(_this) === 'A') {
        log.print('click() was called on an anchor tag');
        // Checks if an url is in a whitelist
        let url = bridge.url(_this.href);
        let destDomain = url[1];
        if (bridge.whitelistedDestinations.indexOf(destDomain) !== -1) {
            log.print(`The domain ${destDomain} is in whitelist.`);
            _click.call(_this);
            return;
        }
        let currentEvent = retrieveEvent();
        if (!verifyEvent(currentEvent)) {
            log.print('It did not pass the test, not clicking element');
            createAlertInTopFrame(bridge.domain, url[2], false);
            pdfObjObserver.start();
            examineTarget(currentEvent, _this.href);
            return;
        }
    }
    _click.call(_this);
};

wrapMethod(HTMLElement.prototype, 'click', log.connect(clickVerified, 'Verifying click'));
