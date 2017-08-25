import { condition } from '../index';
import { TimelineEvent, TLEventType } from '../event';
import abort from '../../shared/abort';
import * as log from '../../shared/log';

const navigatePopupToItself:condition = (index, events, incoming) => {
    if (incoming.$type == TLEventType.SET && incoming.$name === 'location') {
        let currentHref = location.href; // ToDo: Consider making this work on empty iframes
        let newLocation = incoming.$data.arguments[0];
        if (newLocation.href === currentHref || newLocation === currentHref) {
            if (!(incoming.$data.this instanceof Window)) {
                log.print('navigatePopupToItself - found a suspicious attempt');
                abort();
            }
        }
    }
    return true;
};

export default navigatePopupToItself;
