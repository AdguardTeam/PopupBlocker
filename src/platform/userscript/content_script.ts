import I18nService from '../../localization/I18nService';
import AlertController from '../../ui/alert/AlertController';
import UserscriptSettingsDao from './storage/UserscriptSettingsDao';
import UserscriptContentScriptApiFacade from './storage/UserscriptContentScriptApiFacade';
import adguard from '../../content_script_namespace';
import getMessage from './get_message';
import CSSService from '../../ui/utils/CssService';

const i18nService = new I18nService(getMessage);
const settingsDao = new UserscriptSettingsDao();
const cssService = new CSSService(GM_getResourceURL);
const alertController = new AlertController(cssService, settingsDao, () => {
    window.open(
        'https://link.adtidy.org/forward.html?action=popup_blocker_options&from=content_script&app=popup_blocker',
        '__popupBlocker_options_page__'
    );
});
const csApiFacade = new UserscriptContentScriptApiFacade(settingsDao, alertController, getMessage);

adguard.i18nService = i18nService;

UserscriptSettingsDao.migrateDataIfNeeded();

RESOURCE_PAGE_SCRIPT;

const BRIDGE_KEY = csApiFacade.expose();

const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow.window : window;
/**
 * In Firefox, userscripts can't write properties of unsafeWindow, so we
 * create a <script> tag to run the script in the page's context.
 */
if (csApiFacade.envIsFirefoxBrowserExt) {
    let script = document.createElement('script');
    let text = `(${popupBlocker.toString()})(this,'${BRIDGE_KEY}')`;
    script.textContent = text;
    let el = document.body || document.head || document.documentElement;
    el.appendChild(script);
    el.removeChild(script);
} else {
    popupBlocker(win, BRIDGE_KEY);
}

/**
 * Expose GM_api on options page.
 */
function isOptionsPage() {
    let { href } = location;
    return href === 'https://adguardteam.github.io/PopupBlocker/options.html' ||
        href === 'https://link.adtidy.org/forward.html?action=popup_blocker_options&from=content_script&app=popup_blocker' ||
        href === 'http://localhost:8000/options.html'; // For debug purposes.
}

if (isOptionsPage()) {

    document.title = i18nService.$getMessage('userscript_name') || 'Adguard Popup Blocker';

    // Export GM functions (used by the Dao layer)
    win['GM_getValue'] = exportFunction(GM_getValue, unsafeWindow);
    win['GM_setValue'] = exportFunction(GM_setValue, unsafeWindow);
    win['GM_listValues'] = exportFunction(GM_listValues, unsafeWindow);

    // Export AdguardSettings so that it was used by getMessage on the options page
    unsafeWindow['AdguardSettings'] = AdguardSettings;
}

declare var RESOURCE_PAGE_SCRIPT;
