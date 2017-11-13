import { condition } from '../index';
import { TimelineEvent, TLEventType } from '../event';
import abort from '../../shared/abort';
import { isWindow, isLocation } from '../../shared/instanceof';
import * as log from '../../shared/log';

const navigatePopupToItself:condition = (index, events, incoming) => {
    let $type = incoming.$type;
    let $name = incoming.$name;
    if (
        ( ($name === 'assign' || $name === 'replace') && $type === TLEventType.APPLY ) ||
        ( ($name === 'location' || $name === 'href') && $type === TLEventType.SET )
    ) {
        let currentHref = location.href; // ToDo: Consider making this work on empty iframes
        let newLocation = String(incoming.$data.arguments[0]);
        if (newLocation === currentHref) {
            // Performs a check that it is a modification of a mocked object.
            // Non-determinism here is inevitable, due to our decoupled approach in timeline implementation.
            // This may be improved in future.
            if (
                (incoming.$name === 'location' && !isWindow(incoming.$data.this)) ||
                !isLocation(incoming.$data.this)
            ) {
                log.print('navigatePopupToItself - found a suspicious attempt');
                abort();
            }
        }
    }

    return true;
};

export default navigatePopupToItself;
