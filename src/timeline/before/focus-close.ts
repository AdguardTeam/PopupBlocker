import { getTime, TimelineEvent, condition } from '../index';
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
        switch(evt.type) {
            case 'get close':
                closeEvent = evt;
                break;
            case 'get focus':
                if (closeEvent.data === evt.data && closeEvent.timeStamp - evt.timeStamp < 100) {
                    log.print('FOUND focusclose');
                    log.callEnd();
                    return false;
                }
                break;
            case 'apply open':
                if (reJsFocusUri.test(evt.data.arguments[0])) {
                    log.print('FOUND jsuri');
                    log.callEnd();
                    return false;
                }
        }
    }
    log.callEnd()
    return true;
};

export default focusClose;

