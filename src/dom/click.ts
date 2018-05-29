import adguard from '../page_script_namespace';
import { ApplyHandler } from '../proxy/IProxyService';
import ILoggedProxyService from '../proxy/ILoggedProxyService';
import { retrieveEvent, verifyEvent, verifyCurrentEvent } from '../events/verify';
import examineTarget from '../events/examine_target';
import { getTagName } from '../shared/dom';
import * as log from '../shared/debug';
import createUrl from '../shared/url';
import onBlocked from '../on_blocked';
import { isAnchor } from '../shared/instanceof';

const clickVerified:ApplyHandler<HTMLElement,void> = function(execContext, _arguments) {
    const _this = execContext.thisArg;
    if (isAnchor(_this)) {
        log.print('click() was called on an anchor tag', _this);
        if (adguard.contentScriptApiFacade.originIsWhitelisted()) {
            return execContext.invokeTarget(_arguments);
        }
        // Checks if an url is in a whitelist
        let url = createUrl(_this.href);
        let destDomain = url[1];
        if (adguard.contentScriptApiFacade.originIsWhitelisted(destDomain)) {
            log.print(`The domain ${destDomain} is in whitelist.`);
            return execContext.invokeTarget(_arguments);
        }
        let currentEvent = retrieveEvent();
        if (!verifyEvent(currentEvent)) {
            log.print('It did not pass the test, not clicking element');
            onBlocked(url[2], currentEvent);
            return;
        }
    }
    return execContext.invokeTarget(_arguments);
};

export function wrapClick(window:Window, proxyService:ILoggedProxyService) {
    proxyService.wrapMethod(window.HTMLElement.prototype, 'click', log.connect(clickVerified, 'Verifying click'));
}

