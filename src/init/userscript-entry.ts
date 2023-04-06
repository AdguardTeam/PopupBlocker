import { csApiFacade, BRIDGE_KEY } from './api-facade-init';
import { popupBlocker } from './page-script';
import { isOptionsPage, exposeStorage } from '../utils';

const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow.window : window;

if (isOptionsPage(win)) {
    /**
     * Allow options page to manage script's storage
     * by exposing script manager's API
     */
    exposeStorage(win);
} else if (csApiFacade.envIsFirefoxBrowserExt) {
    /**
     * In Firefox, userscripts can't write properties of unsafeWindow, so we
     * create a <script> tag to run the script in the page's context.
     */
    const script = document.createElement('script');
    const text = `(${popupBlocker.toString()})(this,'${BRIDGE_KEY}')`;
    script.textContent = text;
    const el = document.body || document.head || document.documentElement;
    el.appendChild(script);
    el.removeChild(script);
} else {
    popupBlocker(win, BRIDGE_KEY);
}
