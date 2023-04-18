import { csApiFacade, BRIDGE_KEY } from './api-facade-init';
import {
    isOptionsPage,
    exposeStorage,
    appendScript,
} from './utils';
// eslint-disable-next-line import/no-unresolved, import/extensions
import { popupBlocker } from '../../tmp/page-script-bundle';

const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow.window : window;

if (isOptionsPage(win)) {
    /**
     * Allow options page to manage script's storage
     * by exposing script manager's API
     */
    exposeStorage(win);
} else {
    (() => {
        /**
         * In Firefox, userscripts can't write properties of unsafeWindow, so we
         * create a <script> tag to run the script in the page's context.
         */
        if (csApiFacade.envIsFirefoxBrowserExt) {
            const popupBlockerStringified = `(${popupBlocker.toString()})(this, '${BRIDGE_KEY}')`;
            appendScript(popupBlockerStringified);
            return;
        }

        popupBlocker(win, BRIDGE_KEY);
    })();
}
