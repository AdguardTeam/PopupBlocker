import { condition } from '../Timeline';
import { TimelineEvent, TLEventType } from '../TimelineEvent';
import abort from '../../shared/abort';
import { isWindow, isLocation } from '../../shared/instanceof';
import * as log from '../../shared/debug';
import { PopupContext } from '../../dom/open';

const navigatePopupToItself:condition = (index, events, incoming) => {
    let $type = incoming.$type;
    let $name = incoming.$name;
    if (
        ( ($name === 'assign' || $name === 'replace') && $type === TLEventType.APPLY ) ||
        ( ($name === 'location' || $name === 'href') && $type === TLEventType.SET )
    ) {
        let currentHref = location.href; // ToDo: Consider making this work on empty iframes
        let incomingData = incoming.$data;
        let newLocation = String(incomingData.arguments[0]);
        let thisArg = incomingData.thisOrReceiver;

        if (newLocation === currentHref) {
            // Performs a check that it is a modification of a mocked object.
            // Non-determinism here is inevitable, due to our decoupled approach in timeline implementation.
            // This may be improved in future.
            if (
                (incoming.$name === 'location' && !isWindow(thisArg)) ||
                !isLocation(thisArg)
            ) {
                log.print('navigatePopupToItself - tried to navigate a blocked popup to itself');
                abort();
            }
        }

        // Look up a recent event record for a blocked popup
        let currentFrameRecords = events[index];
        let l = currentFrameRecords.length;
        while (l--) {
            let evt = currentFrameRecords[l];
            if (incoming.$timeStamp - evt.$timeStamp > 200) {
                // Do not lookup too old event
                break;
            }
            let context:PopupContext = evt.$data.context; // supposedly
            if (
                context && context.mocked &&
                context.defaultEventHandlerTarget === newLocation
            ) {
                log.print('navigatePopupToItself - tried to navigate a blocked popup to a target of a recently blocked popup initiator');
                abort();
            }
        }
    }

    return true;
};

export default navigatePopupToItself;
