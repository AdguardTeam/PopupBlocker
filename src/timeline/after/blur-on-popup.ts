import { TimelineEvent, condition } from '../index';
import log from '../../log';

const blurOnPopup = (events, incoming) => {
    if (incoming.type == 'get blur') {
        log('TL - window.blur called');
        let l = events.length;
        let evt;
        while (l-- > 0) {
            evt = events[l];
            if (evt.data === incoming.data && incoming.timeStamp - evt.timeStamp < 10) {
                log('blur called quickly');
                evt.data.close();
                break;
            }
        }
    }
};

export default blurOnPopup;
