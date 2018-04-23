import { condition } from '../index';
import { TimelineEvent, TLEventType } from '../event';
import { ABOUT_PROTOCOL } from '../../shared/dom';
import getTime from '../../shared/time';
import * as log from '../../shared/log';

const createOpen:condition = (index, events) => {
    log.print('index:', index);
    let evt = events[index][0];
    if (evt.$type == TLEventType.CREATE && getTime() - evt.$timeStamp < 200) {
        log.print(`time difference is less than a threshold`);
        /**
         * A test here is meant to block attempts to call window.open from iframes which
         * was created later than 200 milliseconds ago. Such techniques are mostly used
         * by popup/popunder scripts on Firefox.
         *
         * In an issue https://github.com/AdguardTeam/PopupBlocker/issues/63, a pop-up
         * window of Google Hangout is created with chrome-extension://... url, and it
         * contains an iframe having domain hangouts.google.com, and inside it it immediately
         * calls window.open with empty url in order to obtain reference to certain browsing
         * context.
         *
         * A delicate issue revealed by https://github.com/AdguardTeam/PopupBlocker/issues/98
         * is that such a meant-to-be empty iframe can have non-empty `location` object.
         * This is caused by `document.open`, which is in effect identical to performing another
         * navigation, i.e. replacing associated `document` object, setting location from
         * initiating origin, etc. I refer to
         * {@link https://bugs.chromium.org/p/chromium/issues/detail?id=742049} for more info.
         *
         * Therefore, we take advantage of `performance.timing` api to determine whether the
         * empty iframe has an associated HTTP request.
         */
        let browsingContext = <Window>evt.$data;
        log.print(`testing context is: `, browsingContext);
        let isSameOriginChildContext = browsingContext.frameElement !== null;
        if (isSameOriginChildContext) {
            let timing = browsingContext.performance.timing;
            let { fetchStart, responseEnd } = timing;
            if (fetchStart === 0 || fetchStart === responseEnd) {
                return false;
            }
        }
    }
    return true;
};

export default log.connect(createOpen, 'Performing create test');
