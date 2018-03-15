import adguard from '../page_script_namespace';
import * as log from '../shared/log';

const onbeforeunloadHandler = (evt:BeforeUnloadEvent) => {
    const MSG = adguard.contentScriptApiFacade.$getMessage('on_navigation_by_popunder');
    evt.returnValue = MSG;
    return MSG;
};

export const setBeforeunloadHandler = () => {
    // ToDo: if this is found to be useful, consider making it work on cross-origin iframes
    if (window === window.top) {
        log.call("Attaching beforeunload event handler");
        window.addEventListener('beforeunload', onbeforeunloadHandler);
        setTimeout(() => {
            window.removeEventListener('beforeunload', onbeforeunloadHandler);
        }, 1000);
        log.callEnd();
    }
};
