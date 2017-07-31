import { TimelineEvent, condition } from '../index';
import * as log from '../../log';

const blurOnPopup = (events, incoming) => {
    if (incoming.type == 'get blur') {
        log.call('blurOnPopup - window.blur found');
        let l = events.length;
        let evt;
        while (l-- > 0) {
            evt = events[l];
            if (evt.data === incoming.data && incoming.timeStamp - evt.timeStamp < 10) {
                log.print('blur called quickly');
                log.callEnd();
                evt.data.close();
                break;
            }
        }
    }
};

export default blurOnPopup;
