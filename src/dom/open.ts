/* eslint-disable no-restricted-syntax */
import { adguard } from '../page-script-namespace';
import { verifyEvent, retrieveEvent } from '../events/verify';
import { isGtmSimulatedAnchorClick } from '../events/framework-workarounds';
import { timeline } from '../timeline/Timeline';
import { log, createUrl } from '../shared';
import mockWindow from '../mock-window';
import onBlocked from '../on-blocked';
import { ApplyHandler } from '../proxy/IProxyService';
import ILoggedProxyService from '../proxy/ILoggedProxyService';

export interface PopupContext {
    mocked?:boolean,
    defaultEventHandlerTarget?:string
}

export function wrapOpen(window:Window, proxyService:ILoggedProxyService) {
    const openVerifiedWindow:ApplyHandler<Window, Window, PopupContext> = (
        execContext,
        _arguments,
        externalContext,
    ) => {
        if (adguard.contentScriptApiFacade.originIsAllowed()) {
            return execContext.invokeTarget(_arguments);
        }
        const targetHref = _arguments[0];
        log.call(`Called window.open with url ${targetHref}`);
        const url = createUrl(targetHref);
        const destDomain = url[1];
        if (adguard.contentScriptApiFacade.originIsAllowed(destDomain)) {
            log.print(`The domain ${destDomain} is in allowlist.`);
            return execContext.invokeTarget(_arguments);
        }
        const currentEvent = retrieveEvent();
        let win;
        // eslint-disable-next-line no-labels
        verification: {
            const passed = verifyEvent(currentEvent);
            if (!passed) {
                if (!isGtmSimulatedAnchorClick(currentEvent, _arguments[1])) {
                    // eslint-disable-next-line no-labels
                    break verification;
                }
            }
            log.print('event verified, inquiring event timeline..');
            if (!timeline.canOpenPopup(proxyService.framePosition)) {
                log.print('canOpenPopup returned false');
                // eslint-disable-next-line no-labels
                break verification;
            }
            log.print('calling original window.open...');
            win = execContext.invokeTarget(_arguments);
            win = proxyService.makeObjectProxy(win);
            log.callEnd();
            return win;
        }

        // eslint-disable-next-line no-param-reassign
        externalContext.mocked = true;
        onBlocked(url[2], currentEvent, externalContext);
        log.print('mock a window object');
        // Return a mock window object, in order to ensure that the page's own script
        // does not accidentally throw TypeErrors.
        win = mockWindow(_arguments[0], _arguments[1], proxyService);
        win = proxyService.makeObjectProxy(win);
        log.callEnd();
        return win;
    };

    proxyService.wrapMethod<Window, Window>(window, 'open', openVerifiedWindow);
    proxyService.wrapMethod<Window, Window>(window.Window.prototype, 'open', openVerifiedWindow); // for IE
}
