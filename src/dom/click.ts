import { adguard } from '../page-script-namespace';
import { ApplyHandler } from '../proxy/IProxyService';
import ILoggedProxyService from '../proxy/ILoggedProxyService';
import { retrieveEvent, verifyEvent } from '../events/verify';
import {
    log,
    createUrl,
    isAnchor,
} from '../shared';
import onBlocked from '../on-blocked';

const clickVerified:ApplyHandler<HTMLElement, void> = (execContext, _arguments) => {
    const { thisArg } = execContext;
    if (isAnchor(thisArg)) {
        log.print('click() was called on an anchor tag', thisArg);
        if (adguard.contentScriptApiFacade.originIsAllowed()) {
            return execContext.invokeTarget(_arguments);
        }
        // Checks if an url is in allowlist
        const url = createUrl(thisArg.href);
        const destDomain = url[1];
        if (adguard.contentScriptApiFacade.originIsAllowed(destDomain)) {
            log.print(`The domain ${destDomain} is in allowlist.`);
            return execContext.invokeTarget(_arguments);
        }
        const currentEvent = retrieveEvent();
        if (!verifyEvent(currentEvent)) {
            log.print('It did not pass the test, not clicking element');
            onBlocked(url[2], currentEvent);
            // eslint-disable-next-line consistent-return
            return;
        }
    }
    return execContext.invokeTarget(_arguments);
};

export function wrapClick(window:Window, proxyService:ILoggedProxyService) {
    proxyService.wrapMethod(window.HTMLElement.prototype, 'click', log.connect(clickVerified, 'Verifying click'));
}
