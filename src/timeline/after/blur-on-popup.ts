import { condition } from '../Timeline';
import { TimelineEvent, TLEventType } from '../TimelineEvent';
import { log } from '../../shared';

const blurOnPopup:condition = (index, events, incoming) => {
    if (incoming.$type === TLEventType.GET && incoming.$name === 'blur') {
        log.call('blurOnPopup - window.blur found');
        let l = events.length;
        // eslint-disable-next-line no-plusplus
        while (l-- > 0) {
            const frameEvents = events[l];
            let k = frameEvents.length;
            let evt:TimelineEvent<any>;
            // eslint-disable-next-line no-plusplus
            while (k-- > 0) {
                evt = frameEvents[l];
                if (evt.$data === incoming.$data && incoming.$timeStamp - evt.$timeStamp < 10) {
                    log.print('blur called quickly');
                    (<any>evt.$data).close();
                    log.callEnd();
                    return false;
                }
            }
        }
        log.callEnd();
    }
    return true;
};

export default blurOnPopup;
