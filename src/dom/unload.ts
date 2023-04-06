import { log } from '../shared';
import { translator } from '../i18n';

const onbeforeunloadHandler = (evt:BeforeUnloadEvent) => {
    const MSG = translator.getMessage('on_navigation_by_popunder');
    // eslint-disable-next-line no-param-reassign
    evt.returnValue = MSG;
    return MSG;
};

export const setBeforeunloadHandler = () => {
    // ToDo: if this is found to be useful, consider making it work on cross-origin iframes
    if (window === window.top) {
        log.call('Attaching beforeunload event handler');
        window.addEventListener('beforeunload', onbeforeunloadHandler);
        setTimeout(() => {
            window.removeEventListener('beforeunload', onbeforeunloadHandler);
        }, 1000);
        log.callEnd();
    }
};
