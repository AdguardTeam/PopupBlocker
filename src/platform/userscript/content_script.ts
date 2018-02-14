import I18nService from '../../localization/I18nService';
import UserscriptAlertController from './ui/UserscriptAlertController';
import UserscriptSettings from './storage/UserscriptSettings';
import UserscriptStorageManager from './storage/UserscriptStorageManager';
import UserscriptStorageProvider from './storage/UserscriptStorageProvider';
import adguard from '../../content_script_namespace';
import getMessage from './get_message';

/**************************************************************************/
/**************************************************************************/

const i18nService       = new I18nService(getMessage);
const storageManager    = new UserscriptStorageManager();
const alertController   = new UserscriptAlertController(storageManager);
const storageProvider   = new UserscriptStorageProvider(alertController, getMessage);

const BRIDGE_KEY = storageProvider.expose();

/**************************************************************************/

adguard.i18nService = i18nService;

/**************************************************************************/
window.popupBlocker = RESOURCE_PAGE_SCRIPT;

/**************************************************************************/

/**
 * In Firefox, userscripts can't write properties of unsafeWindow, so we
 * create a <script> tag to run the script in the page's context.
 */
if (storageProvider.envIsFirefoxGreasemonkey) {
    let script = document.createElement('script');
    let text = `(${popupBlocker.toString()})(this,!1,'${BRIDGE_KEY}')`;
    script.textContent = text;
    let el = document.body || document.head || document.documentElement;
    el.appendChild(script);
    el.removeChild(script);
} else {
    let win = typeof unsafeWindow !== 'undefined' ? unsafeWindow.window : window;
    popupBlocker(win,undefined,BRIDGE_KEY);
}

/**************************************************************************/

declare var RESOURCE_PAGE_SCRIPT;


/**************************************************************************/
/**************************************************************************/
