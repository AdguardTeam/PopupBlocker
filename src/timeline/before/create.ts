import { condition } from '../index';
import { TimelineEvent, TLEventType } from '../event';
import { ABOUT_PROTOCOL } from '../../shared/dom';
import getTime from '../../shared/time';
import * as log from '../../shared/log';

const createOpen:condition = (index, events) => {
    log.print('index:', index);
    let evt = events[index][0];
    if (evt.$type == TLEventType.CREATE && getTime() - evt.$timeStamp < 200) {
        if (window.location.protocol === ABOUT_PROTOCOL) {
            return false;
        }
    }
    return true;
};

export default log.connect(createOpen, 'Performing create test');
