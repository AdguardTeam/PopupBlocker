import { ApplyHandler, makeObjectProxy, wrapMethod } from '../proxy';
import { verifyEvent, retrieveEvent } from '../events/verify';
import examineTarget from '../events/examine_target';
import { isGtmSimulatedAnchorClick } from '../events/framework_workarounds';
import { _dispatchEvent } from './dispatchEvent/orig';
import { timeline, position } from '../timeline/index';
import { TLEventType, TimelineEvent } from '../timeline/event';
import * as log from '../shared/log';
import bridge from '../bridge';
import mockWindow from '../mock_window';
import onBlocked from '../on_blocked';

const openVerifiedWindow:ApplyHandler = function(_open, _this, _arguments, context) {
    let targetHref = _arguments[0];
    log.call('Called window.open with url ' + targetHref);
    const url = bridge.url(targetHref);
    const destDomain = url[1];
    if (bridge.whitelistedDestinations.indexOf(destDomain) !== -1) {
        log.print(`The domain ${destDomain} is in whitelist.`);
        return _open.apply(_this, _arguments);
    }
    let currentEvent = retrieveEvent();
    let win;
    verification: {
        let passed = verifyEvent(currentEvent);
        if (!passed) {
            if (!isGtmSimulatedAnchorClick(currentEvent, _arguments[1])) {
                break verification;
            }
        }
        log.print('event verified, inquiring event timeline..');
        if (!timeline.canOpenPopup(position)) {
            log.print('canOpenPopup returned false');
            break verification;
        }
        log.print('calling original window.open...');
        win = _open.apply(_this, _arguments);
        win = makeObjectProxy(win);
        log.callEnd();
        return win;
    }

    onBlocked(url[2], false, currentEvent);
    
    log.print('mock a window object');
    // Return a mock window object, in order to ensure that the page's own script does not accidentally throw TypeErrors.
    win = mockWindow(_arguments[0], _arguments[1]);
    win = makeObjectProxy(win);
    context['mocked'] = true;
    log.callEnd();
    return win;
};

wrapMethod(window, 'open', openVerifiedWindow);
wrapMethod(Window.prototype, 'open', openVerifiedWindow); // for IE
