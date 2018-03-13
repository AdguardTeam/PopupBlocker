import I18nService from '../../localization/I18nService';
import UserscriptAlertController from './ui/UserscriptAlertController';
import UserscriptSettingsDao from './storage/UserscriptSettingsDao';
import UserscriptContentScriptApiFacade from './storage/UserscriptContentScriptApiFacade';
import adguard from '../../content_script_namespace';
import getMessage from './get_message';

const i18nService       = new I18nService(getMessage);
const storageManager    = new UserscriptSettingsDao();
const alertController   = new UserscriptAlertController(storageManager, GM_getResourceURL);
const storageProvider   = new UserscriptContentScriptApiFacade(alertController, getMessage);

adguard.i18nService = i18nService;

RESOURCE_PAGE_SCRIPT;

const BRIDGE_KEY = storageProvider.expose();

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
    popupBlocker(win, undefined, BRIDGE_KEY);
}

//
declare var RESOURCE_PAGE_SCRIPT;
