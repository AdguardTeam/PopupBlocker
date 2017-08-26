import eventPType from './orig';
import { ApplyHandler, wrapMethod } from '../../proxy';
import { retrieveEvent, verifyEvent } from '../../events/verify';
import { isMouseEvent } from '../../shared/instanceof';
import * as log from '../../shared/log';

const allowVerifiedCall:ApplyHandler = (_orig, _this) => {
    const currentEvent = retrieveEvent();
    if (isMouseEvent(_this)) {
        if (_this === currentEvent) {
            if (currentEvent.eventPhase === 1 && !verifyEvent(currentEvent)) {
                log.print('Not allowing');
                return;
            }
        }
    }
    return _orig.call(_this);
};

wrapMethod(eventPType, 'preventDefault', log.connect(allowVerifiedCall, 'Performing verification on preventDefault..', function() {
    return isMouseEvent(arguments[1]);
}));
