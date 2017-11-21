import { condition } from '../index';
import { TimelineEvent, TLEventType } from '../event';
import { ABOUT_PROTOCOL } from '../../shared/dom';
import getTime from '../../shared/time';
import * as log from '../../shared/log';

const createOpen:condition = (index, events) => {
    log.print('index:', index);
    let evt = events[index][0];
    if (evt.$type == TLEventType.CREATE && getTime() - evt.$timeStamp < 200) {
        /**
         * A test here is meant to block attempts to call window.open from iframes which
         * was created later than 200 milliseconds ago. Such techniques are mostly used
         * by popup/popunder scripts on Firefox.
         * In an issue https://github.com/AdguardTeam/PopupBlocker/issues/63, a pop-up
         * window of Google Hangout is created with chrome-extension://... url, and it
         * contains an iframe having domain hangouts.google.com, and inside it it immediately
         * calls window.open with empty url in order to obtain reference to certain browsing
         * context.
         */
        if (window.location.protocol === ABOUT_PROTOCOL) {
            return false;
        }
    }
    return true;
};

export default log.connect(createOpen, 'Performing create test');
