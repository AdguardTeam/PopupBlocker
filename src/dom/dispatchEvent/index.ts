import eventTargetPType from './orig';
import { ApplyHandler, ApplyOption, wrapMethod } from '../../proxy';
import { retrieveEvent, verifyEvent, verifyCurrentEvent } from '../../events/verify';
import examineTarget from '../../events/examine_target';
import { setBeforeunloadHandler } from '../unload';
import { isUIEvent } from '../../shared/instanceof';
import { getTagName } from '../../shared/dom';
import * as log from '../../shared/log';
import bridge from '../../bridge';
import { createAlertInTopFrame } from '../../messaging';
import pdfObjObserver from '../../observers/pdf_object_observer';

const dispatchVerifiedEvent:ApplyHandler = function(_dispatchEvent, _this, _arguments) {
    let evt = _arguments[0];
    if ('clientX' in evt && getTagName(_this) === 'A' && !evt.isTrusted) {
        log.call('It is a MouseEvent on an anchor tag.');
        // Checks if an url is in a whitelist
        let url = bridge.url(_this.href);
        let destDomain = url[1];
        if (bridge.whitelistedDestinations.indexOf(destDomain) !== -1) {
            log.print(`The domain ${destDomain} is in whitelist.`);
            return _dispatchEvent.call(_this, evt);
        }
        let currentEvent = retrieveEvent();
        if (!verifyEvent(currentEvent)) {
            log.print('It did not pass the test, not dispatching event');
            createAlertInTopFrame(bridge.domain, url[2], false);
            pdfObjObserver.start();
            examineTarget(currentEvent, _this.href);
            log.callEnd();
            return false;
            // Or, we may open a new widnow with window.open to save a reference and do additional checks.
        }
        log.print("It passed the test");
        log.callEnd();
    }
    return _dispatchEvent.call(_this, evt);
};

const logUIEventOnly:ApplyOption = (target, _this, _arguments) => {
    return isUIEvent(_this);
};

wrapMethod(eventTargetPType, 'dispatchEvent', dispatchVerifiedEvent, logUIEventOnly);
