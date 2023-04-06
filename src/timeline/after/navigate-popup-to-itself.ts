import { condition } from '../Timeline';
import { TLEventType } from '../TimelineEvent';
import {
    abort,
    isWindow,
    isLocation,
    log,
} from '../../shared';
import { PopupContext } from '../../dom/open';

/**
 * If a popup/popunder script tries to navigate a popup window to a target a link on which
 * a user has clicked within an interval specified by this constant, it will abort script execution.
 */
const NAVIGATION_TIMING_THRESOLD = 200;

const navigatePopupToItself:condition = (index, events, incoming) => {
    const { $type } = incoming;
    const { $name } = incoming;
    if (
        (($name === 'assign' || $name === 'replace') && $type === TLEventType.APPLY)
        || (($name === 'location' || $name === 'href') && $type === TLEventType.SET)
    ) {
        const currentHref = window.location.href; // ToDo: Consider making this work on empty iframes
        const incomingData = incoming.$data;
        const newLocation = String(incomingData.arguments[0]);
        const thisArg = incomingData.thisOrReceiver;

        if (newLocation === currentHref) {
            // Performs a check that it is a modification of a mocked object.
            // Non-determinism here is inevitable, due to our decoupled approach in timeline implementation.
            // This may be improved in future.
            if (
                (incoming.$name === 'location' && !isWindow(thisArg))
                || !isLocation(thisArg)
            ) {
                log.print('navigatePopupToItself - tried to navigate a blocked popup to itself');
                abort();
            }
        }

        // Look up a recent event record for a blocked popup
        const currentFrameRecords = events[index];
        let l = currentFrameRecords.length;
        // eslint-disable-next-line no-plusplus
        while (l--) {
            const evt = currentFrameRecords[l];
            if (incoming.$timeStamp - evt.$timeStamp > NAVIGATION_TIMING_THRESOLD) {
                // Do not lookup too old event
                break;
            }
            const context:PopupContext = evt.$data.externalContext; // supposedly
            if (
                context && context.mocked
                && context.defaultEventHandlerTarget === newLocation
            ) {
                // eslint-disable-next-line max-len
                log.print('navigatePopupToItself - tried to navigate a blocked popup to a target of a recently blocked popup initiator');
                abort();
            }
        }
    }

    return true;
};

export default navigatePopupToItself;
