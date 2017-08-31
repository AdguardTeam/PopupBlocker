import eventTargetPType from './dispatchEvent/orig';
import * as log from '../shared/log';``
import bridge from '../bridge';

const MSG = bridge.getMessage('on_navigation_by_popunder');

const onbeforeunloadHandler = (evt:BeforeUnloadEvent) => {
    evt.returnValue = MSG;
    return MSG;
};

export const setBeforeunloadHandler = () => {
    // ToDo: if this is found to be useful, consider making it work on cross-origin iframes
    if (window === window.top) {
        log.call("Attaching beforeunload event handler");
        eventTargetPType.addEventListener.call(window, 'beforeunload', onbeforeunloadHandler);
        setTimeout(() => {
            eventTargetPType.removeEventListener.call(window, 'beforeunload', onbeforeunloadHandler);
        }, 1000);
        log.callEnd();
    }
};
