import { getTime, TimelineEvent, TLEventType, condition } from '../index';
import * as log from '../../log';

const createOpen:condition = log.connect((events) => {
    let evt = events[0];
    if (evt.type == TLEventType.CREATE && getTime() - evt.timeStamp < 200) {
        return false;
    }
    return true;
}, 'Performing create test');

export default createOpen;
