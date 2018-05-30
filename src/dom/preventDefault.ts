import { retrieveEvent, verifyEvent } from '../events/verify';
import { isMouseEvent } from '../shared/instanceof';
import * as log from '../shared/debug';
import { ApplyHandler } from '../proxy/IProxyService';
import ILoggedProxyService from '../proxy/ILoggedProxyService';

const allowVerifiedCall:ApplyHandler<Event,void> = (execContext, _arguments) => {
    const _this = execContext.thisArg;
    const currentEvent = retrieveEvent();
    if (isMouseEvent(_this)) {
        if (_this === currentEvent) {
            if (currentEvent.eventPhase === 1 && !verifyEvent(currentEvent)) {
                log.print('Not allowing');
                return;
            }
        }
    }
    return execContext.invokeTarget(_arguments);
};

export function wrapPreventDefault(window:Window, proxyService:ILoggedProxyService) {
    // @ifdef DEBUG 
    proxyService.wrapMethod(window.Event.prototype, 'preventDefault', log.connect(allowVerifiedCall, 'Performing verification on preventDefault..', function() {
        return isMouseEvent(arguments[1]);
    }));
    // @endif
}
