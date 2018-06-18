import { condition } from '../Timeline';
import { TimelineEvent, TLEventType } from '../TimelineEvent';
import getTime from '../../shared/time';
import { isEmptyUrl } from '../../shared/dom';
import * as log from '../../shared/debug';
import { convertToString } from '../../shared/url';
import { PopupContext } from '../../dom/open';

const aboutBlank:condition = (index, events) => {
    // if there is a blocked popup within 100 ms, do not allow opening popup with url about:blank.
    // It is a common technique used by popunder scripts on FF to regain focus of the current window.
    let latestOpenEvent = events[index][events[index].length - 1];
    let now = latestOpenEvent.$timeStamp;
    if (latestOpenEvent.$type === TLEventType.APPLY && latestOpenEvent.$name === 'open' && isEmptyUrl(convertToString(latestOpenEvent.$data.arguments[0]))) {
        log.print('The latest event is open(\'about:blank\')');
        let l = events.length;
        while (l-- > 0) {
            let frameEvents = events[l];
            let k = frameEvents.length;
            while (k-- > 0) {
                let event = frameEvents[k];
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
