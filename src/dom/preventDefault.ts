import { retrieveEvent, verifyEvent } from '../events/verify';
import { isMouseEvent, log } from '../shared';
import { ApplyHandler } from '../proxy/IProxyService';
import ILoggedProxyService from '../proxy/ILoggedProxyService';

const allowVerifiedCall:ApplyHandler<Event, void> = (execContext, _arguments) => {
    const { thisArg } = execContext;
    const currentEvent = retrieveEvent();
    if (isMouseEvent(thisArg)) {
        if (thisArg === currentEvent) {
            if (currentEvent.eventPhase === 1 && !verifyEvent(currentEvent)) {
                log.print('Not allowing');
                return;
            }
        }
    }
    // eslint-disable-next-line consistent-return
    return execContext.invokeTarget(_arguments);
};

export function wrapPreventDefault(window:Window, proxyService:ILoggedProxyService) {
    if (!DEBUG) {
        // TODO make preprocessor plugin to cut these from beta and release builds
        return;
    }
    function curryIsMouseEvent() {
        // eslint-disable-next-line prefer-rest-params
        return isMouseEvent(arguments[1]);
    }
    proxyService.wrapMethod(
        window.Event.prototype,
        'preventDefault',
        log.connect(
            allowVerifiedCall,
            'Performing verification on preventDefault..',
            curryIsMouseEvent,
        ),
    );
}
