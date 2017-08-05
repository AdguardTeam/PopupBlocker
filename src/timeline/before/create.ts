import { getTime, TimelineEvent, condition } from '../index';
import * as log from '../../log';

const createOpen:condition = (events) => {
    log.call('Performing create test');
    let evt = events[0];
    if (evt.type == 'create' && getTime() - evt.timeStamp < 200) {
        log.callEnd();
        return false;
    }
    log.callEnd();
    return true;
};

export default createOpen;
