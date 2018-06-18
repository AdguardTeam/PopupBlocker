import { condition } from '../Timeline';
import { TimelineEvent, TLEventType } from '../TimelineEvent';
import * as log from '../../shared/debug';

const blurOnPopup:condition = (index, events, incoming) => {
    if (incoming.$type == TLEventType.GET && incoming.$name === 'blur') {
        log.call('blurOnPopup - window.blur found');
        let l = events.length;
        while (l-- > 0) {
            let frameEvents = events[l];
            let k = frameEvents.length;
            let evt:TimelineEvent<any>;
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
