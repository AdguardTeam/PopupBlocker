import { ApplyHandler } from '../proxy/IProxyService';
import ILoggedProxyService, { ApplyOption } from '../proxy/ILoggedProxyService';
import { retrieveEvent, verifyEvent } from '../events/verify';
import {
    createUrl,
    isNode,
    isMouseEvent,
    isUIEvent,
    isClickEvent,
    isAnchor,
    targetsAreChainable,
    log,
} from '../shared';
import { adguard } from '../page-script-namespace';
import onBlocked from '../on-blocked';

const dispatchVerifiedEvent:ApplyHandler<EventTarget, boolean> = function (execContext, _arguments) {
    const { thisArg } = execContext;
    const evt:Event = _arguments[0];
    if (isMouseEvent(evt) && isClickEvent(evt) && isNode(thisArg) && isAnchor(thisArg) && !evt.isTrusted) {
        log.call('It is a MouseEvent on an anchor tag.');
        log.print('dispatched event is:', evt);
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
            // Before blocking an artificial click, we perform another check:
            // Page's script may try to re-dispatch certain events inside of
            // its handlers. In such case, targets of each events will be closely related,
            // and we allow such cases.
            // In case of popup/popunder scripts, the target of an event to be dispatched
            // is normally an anchor tag that is just created or is detached to the document.
            // See: https://github.com/AdguardTeam/PopupBlocker/issues/49
            // This logic is separated out in shared/dom.ts.
            const currentTarget = currentEvent.target;
            if (!isNode(currentTarget) || !isNode(thisArg) || !targetsAreChainable(currentTarget, thisArg)) {
                log.print('It did not pass the test, not dispatching event');
                onBlocked(url[2], currentEvent);
                log.callEnd();
                return false;
            }
            log.print("dispatched event's target is chainable with the original target.");
        }
        log.print('It passed the test');
        log.callEnd();
    }
    return execContext.invokeTarget(_arguments);
};

const logUIEventOnly:ApplyOption<EventTarget> = (target, _this, _arguments) => {
    const evt = _arguments[0];
    return isUIEvent(evt);
};

export function wrapDispatchEvent(window:Window, proxyService:ILoggedProxyService) {
    const eventTargetCtor = window.EventTarget || window.Node;
    proxyService.wrapMethod(eventTargetCtor.prototype, 'dispatchEvent', dispatchVerifiedEvent, logUIEventOnly);
}
