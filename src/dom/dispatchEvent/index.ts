import eventTargetPType from './orig';
import { ApplyHandler, ApplyOption, wrapMethod } from '../../proxy';
import { retrieveEvent, verifyEvent, verifyCurrentEvent } from '../../events/verify';
import examineTarget from '../../events/examine_target';
import { setBeforeunloadHandler } from '../unload';
import { isNode, isMouseEvent, isUIEvent, isClickEvent } from '../../shared/instanceof';
import { getTagName } from '../../shared/dom';
import * as log from '../../shared/log';
import bridge from '../../bridge';
import onBlocked from '../../on_blocked';

const dispatchVerifiedEvent:ApplyHandler = function(_dispatchEvent, _this, _arguments, context) {
    let evt:Event = _arguments[0];
    if (isMouseEvent(evt) && isClickEvent(evt) && getTagName(_this) === 'A' && !evt.isTrusted) {
        log.call('It is a MouseEvent on an anchor tag.');
        log.print('dispatched event is:', evt);
        // Checks if an url is in a whitelist
        let url = bridge.url(_this.href);
        let destDomain = url[1];
        if (bridge.whitelistedDestinations.indexOf(destDomain) !== -1) {
            log.print(`The domain ${destDomain} is in whitelist.`);
            return _dispatchEvent.call(_this, evt);
        }
        let currentEvent = retrieveEvent();
        if (!verifyEvent(currentEvent)) {
            // Before blocking an artificial click, we perform another check:
            // Page's script may try to re-dispatch certain events inside of
            // its handlers. In such case, targets of each events will be closely related,
            // and we allow such cases.
            // In case of popup/popunder scripts, the target of an event to be dispatched
            // is normally an anchor tag that is just created or is detached to the document.
            // See: https://github.com/AdguardTeam/PopupBlocker/issues/49
            let currentTarget = currentEvent.target;
            if (!isNode(currentTarget) ||
                // Certain iOS browser allow text nodes as event targets.
                // We treat its parent as a correct target in such cases.
                !(currentTarget.nodeType === 3 /* Node.TEXT_NODE */ ? currentTarget.parentNode : currentTarget).contains(_this)) {
                log.print('It did not pass the test, not dispatching event');
                onBlocked(url[2], false, currentEvent);
                log.callEnd();
                return false;
            }
            log.print("dispatched event's target is contained in the original target.");
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
