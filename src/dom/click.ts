import adguard from '../page_script_namespace';
import { ApplyHandler, wrapMethod } from '../proxy';
import { retrieveEvent, verifyEvent, verifyCurrentEvent } from '../events/verify';
import examineTarget from '../events/examine_target';
import { getTagName } from '../shared/dom';
import * as log from '../shared/log';
import createUrl from '../shared/url';
import onBlocked from '../on_blocked';

const clickVerified:ApplyHandler = function(_click, _this, _arguments, context) {
    if (getTagName(_this) === 'A') {
        log.print('click() was called on an anchor tag', _this);
        if (adguard.contentScriptApiFacade.originIsWhitelisted()) {
            return _click.call(_this);
        }
        // Checks if an url is in a whitelist
        let url = createUrl(_this.href);
        let destDomain = url[1];
        if (adguard.contentScriptApiFacade.originIsWhitelisted(destDomain)) {
            log.print(`The domain ${destDomain} is in whitelist.`);
            _click.call(_this);
            return;
        }
        let currentEvent = retrieveEvent();
        if (!verifyEvent(currentEvent)) {
            log.print('It did not pass the test, not clicking element');
            onBlocked(url[2], false, currentEvent);
            return;
        }
    }
    _click.call(_this);
};

wrapMethod(HTMLElement.prototype, 'click', log.connect(clickVerified, 'Verifying click'));
