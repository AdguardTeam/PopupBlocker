import adguard from '../page_script_namespace';
import { verifyEvent, retrieveEvent } from '../events/verify';
import examineTarget from '../events/examine_target';
import { isGtmSimulatedAnchorClick } from '../events/framework_workarounds';
import { timeline } from '../timeline/Timeline';
import { TLEventType, TimelineEvent } from '../timeline/TimelineEvent';
import * as log from '../shared/debug';
import createUrl from '../shared/url';
import mockWindow from '../mock_window';
import onBlocked from '../on_blocked';
import { ApplyHandler } from '../proxy/IProxyService';
import ILoggedProxyService from '../proxy/ILoggedProxyService';

export interface PopupContext {
    mocked?:boolean,
    defaultEventHandlerTarget?:string
}

export function wrapOpen(window:Window, proxyService:ILoggedProxyService) {
    const openVerifiedWindow:ApplyHandler<Window,Window,PopupContext> = (execContext, _arguments, externalContext) => {
        if (adguard.contentScriptApiFacade.originIsWhitelisted()) {
            return execContext.invokeTarget(_arguments);
        }
        let targetHref = _arguments[0];
        log.call('Called window.open with url ' + targetHref);
        const url = createUrl(targetHref);
        const destDomain = url[1];
        if (adguard.contentScriptApiFacade.originIsWhitelisted(destDomain)) {
            log.print(`The domain ${destDomain} is in whitelist.`);
            return execContext.invokeTarget(_arguments);
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
            if (!timeline.canOpenPopup(proxyService.framePosition)) {
                log.print('canOpenPopup returned false');
                break verification;
            }
            log.print('calling original window.open...');
            win = execContext.invokeTarget(_arguments);
            win = proxyService.makeObjectProxy(win);
            log.callEnd();
            return win;
        }

        externalContext.mocked = true;
        onBlocked(url[2], currentEvent, externalContext);
        log.print('mock a window object');
        // Return a mock window object, in order to ensure that the page's own script does not accidentally throw TypeErrors.
        win = mockWindow(_arguments[0], _arguments[1], proxyService);
        win = proxyService.makeObjectProxy(win);
        log.callEnd();
        return win;
    };
    
    proxyService.wrapMethod<Window,Window,PopupContext>(window, 'open', openVerifiedWindow);
    proxyService.wrapMethod<Window,Window,PopupContext>(window.Window.prototype, 'open', openVerifiedWindow); // for IE
}

