import { condition } from '../index';
import { TimelineEvent, TLEventType } from '../event';
import getTime from '../../shared/time';
import * as log from '../../shared/log';

const aboutBlank:condition = (index, events) => {
    // if there is a blocked popup within 100 ms, do not allow opening popup with url about:blank.
    // It is a common technique used by popunder scripts on FF to regain focus of the current window.
    let latestOpenEvent = events[index][events[index].length - 1];
    let now = latestOpenEvent.$timeStamp;
    if (latestOpenEvent.$type === TLEventType.APPLY && latestOpenEvent.$name === 'open' && latestOpenEvent.$data.arguments[0] == 'about:blank') {
        log.print('The latest event is open(\'about:blank\')');
        let l = events.length;
        while (l-- > 0) {
            let frameEvents = events[l];
            let k = frameEvents.length;
            while (k-- > 0) {
                let event = frameEvents[k];
                if (now - event.$timeStamp > 200) { break; }
                if (event.$name === 'open' && event.$type === TLEventType.APPLY) {
                    if (event.$data.context['mocked']) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
};

export default log.connect(aboutBlank, 'Performing aboutBlank test');
