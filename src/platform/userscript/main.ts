import adguard from '../../adguard';
import I18nService from '../../localization/I18nService';
import AlertController from '../../ui/alert_controller';
import UserscriptStorage from "./storage/UserscriptStorage";
import UserscriptSettings from './storage/UserscriptSettings';
import UserscriptStorageManager from './storage/UserscriptStorageManager';
import UserscriptStorageProvider from './storage/UserscriptStorageProvider';

/**************************************************************************/
/**************************************************************************/
// Custom getMessage implementation

const SupportedLocales = RESOURCE_TRANSLATIONS;

const defaultLocale = 'en';
let currentLocale = null;
if (typeof AdguardSettings !== 'undefined') {
    var locale = AdguardSettings.locale;
    if (SupportedLocales[locale]) {
        currentLocale = locale;
    }
}
if (!currentLocale || !SupportedLocales[currentLocale]) {
    let lang = navigator.language;
    if (!SupportedLocales[lang]) {
        let i = lang.indexOf('-');
        if (i !== -1) {
            lang = lang.slice(0, i);
        }
    }
    currentLocale = lang;
}
if (!currentLocale || !SupportedLocales[currentLocale]) {
    currentLocale = defaultLocale;
}

const getMessage = (messageId:string):string => {
    let message = SupportedLocales[currentLocale][messageId];
    if (!message) {
        message = SupportedLocales[defaultLocale][messageId];
        // @ifdef DEBUG
        throw messageId + ' not localized';
        // @endif
    }   
    return message;
};

/**************************************************************************/

const i18nService       = new I18nService(getMessage);
const settings          = new UserscriptSettings();
const storageManager    = new UserscriptStorageManager(settings);
const alertController   = new AlertController(i18nService, storageManager);
const storageProvider   = new UserscriptStorageProvider(settings, alertController, getMessage);

const BRIDGE_KEY = storageProvider.expose();

/**************************************************************************/

function popupBlocker(window, KEY, _BRIDGE_KEY) {
    RESOURCE_USERSCRIPT_PAGE_SCRIPT;
}

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
    popupBlocker(win,false,BRIDGE_KEY);
}

/**************************************************************************/

declare var RESOURCE_TRANSLATIONS:stringmap<stringmap<string>>;
declare var RESOURCE_USERSCRIPT_PAGE_SCRIPT;

/**************************************************************************/
/**************************************************************************/
