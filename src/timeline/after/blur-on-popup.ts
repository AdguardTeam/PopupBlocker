import { condition } from '../index';
import { TimelineEvent, TLEventType } from '../event';
import * as log from '../../log';

const blurOnPopup = (events, incoming) => {
    if (incoming.type == TLEventType.GET && incoming.name === 'blur') {
        log.call('blurOnPopup - window.blur found');
        let l = events.length;
        let evt;
        while (l-- > 0) {
            evt = events[l];
            if (evt.data === incoming.data && incoming.timeStamp - evt.timeStamp < 10) {
                log.print('blur called quickly');
                evt.data.close();
                log.callEnd();
                break;
            }
        }
    }
};

export default blurOnPopup;
