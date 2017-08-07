import { condition } from '../index';
import { TimelineEvent, TLEventType } from '../event';
import getTime from '../time';
import * as log from '../../log';

const reJsFocusUri = /^javascript:window\.focus/;

const focusClose:condition = (events) => {
    log.call('Performing focusClose test');
    let l = events.length;
    let evt;
    let now = getTime();
    let closeEvent;
    while (l-- > 0) {
        evt = events[l];
        if (now - evt.timeStamp > 1000) { break; }


        if (evt.type === TLEventType.GET) {
            if (evt.name === 'close') {
                closeEvent = evt;
            } else if (evt.name === 'focus') {
                if (closeEvent.data === evt.data && closeEvent.timeStamp - evt.timeStamp < 100) {
                    log.print('found focusclose');
                    log.callEnd();
                    return false;
                }
            }
        } else if (evt.type === TLEventType.APPLY && evt.name === 'open') {
            if (reJsFocusUri.test(evt.data.arguments[0])) {
                log.print('found jsuri');
                log.callEnd();
                return false;
            }
        }
    }
    log.callEnd()
    return true;
};

export default focusClose;
