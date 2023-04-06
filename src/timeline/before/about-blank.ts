import { condition } from '../Timeline';
import { TLEventType } from '../TimelineEvent';
import {
    isEmptyUrl,
    log,
    convertToString,
} from '../../shared';
import { PopupContext } from '../../dom/open';

const aboutBlank:condition = (index, events) => {
    // if there is a blocked popup within 100 ms, do not allow opening popup with url about:blank.
    // It is a common technique used by popunder scripts on FF to regain focus of the current window.
    const latestOpenEvent = events[index][events[index].length - 1];
    const now = latestOpenEvent.$timeStamp;
    if (latestOpenEvent.$type === TLEventType.APPLY
        && latestOpenEvent.$name === 'open'
        && isEmptyUrl(convertToString(latestOpenEvent.$data.arguments[0]))
    ) {
        log.print('The latest event is open(\'about:blank\')');
        let l = events.length;
        // eslint-disable-next-line no-plusplus
        while (l-- > 0) {
            const frameEvents = events[l];
            let k = frameEvents.length;
            // eslint-disable-next-line no-plusplus
            while (k-- > 0) {
                const event = frameEvents[k];
                if (now - event.$timeStamp > 200) { break; }
                if (event.$name === 'open' && event.$type === TLEventType.APPLY) {
                    if ((<PopupContext>event.$data.externalContext).mocked) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
};

export default log.connect(aboutBlank, 'Performing aboutBlank test');
