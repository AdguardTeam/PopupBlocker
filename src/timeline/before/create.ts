import { getTime, TimelineEvent, condition } from '../index';
import log from '../../log';

const createOpen:condition = (events) => {
    log('Performing create test');
    let evt = events[0];
    if (evt.type == 'create' && getTime() - evt.timeStamp < 70) {
        return false;
    }
    return true;
};

export default createOpen;
