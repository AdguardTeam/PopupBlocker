import I18nService from '../../localization/I18nService';
import AlertController from '../../ui/alert_controller';
import UserscriptSettings from './storage/UserscriptSettings';
import UserscriptStorageManager from './storage/UserscriptStorageManager';
import UserscriptStorageProvider from './storage/UserscriptStorageProvider';
import getMessage from './get_message';

/**************************************************************************/
/**************************************************************************/

const i18nService       = new I18nService(getMessage);
const settings          = new UserscriptSettings();
const storageManager    = new UserscriptStorageManager(settings);
const alertController   = new AlertController(i18nService, storageManager);
const storageProvider   = new UserscriptStorageProvider(settings, alertController, getMessage);

const BRIDGE_KEY = storageProvider.expose();

/**************************************************************************/

window.popupBlocker = RESOURCE_PAGE_SCRIPT;

/**************************************************************************/

/**
 * In Firefox, userscripts can't write properties of unsafeWindow, so we
 * create a <script> tag to run the script in the page's context.
 */
if (settings.isFirefox) {
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
