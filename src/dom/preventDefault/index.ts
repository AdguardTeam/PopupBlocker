import { _preventDefault } from './orig';
import { ApplyHandler, wrapMethod } from '../../proxy';
import { retrieveEvent, verifyEvent } from '../../events/verify';
import * as log from '../../log';

const allowVerifiedCall:ApplyHandler = (_orig, _this) => {
    const currentEvent = retrieveEvent();
    if (_this === currentEvent) {
        if (!verifyEvent(currentEvent)) {
            log.print('Not allowing');
            return;
        }
    }
    return _orig.call(_this);
};

wrapMethod(_preventDefault, 'preventDefault', log.connect(allowVerifiedCall, 'Performing verification on preventDefault..'));
