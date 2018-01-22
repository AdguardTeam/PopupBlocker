import chrome from '../shared/platform_namespace';
import AlertController from '../../../ui/alert_controller';
import ExtensionStorageManager from '../shared/storage/ExtensionStorageManager';
import EdgeI18nService from './localization/EdgeI18nService'
import * as log from '../../../shared/log';
import linkPageScript from '../shared/storage/link_page_script';

/**************************************************************************/
/**************************************************************************/

const i18nService       = new EdgeI18nService(chrome.i18n.getMessage);
const storageManager    = new ExtensionStorageManager();
const alertController   = new AlertController(i18nService, storageManager);

/**************************************************************************/

linkPageScript(alertController);

/**************************************************************************/

function runScript(code) {
    const parent = document.head || document.documentElement;
    let el = document.createElement('script');
    el.textContent = code;
    parent.appendChild(el);
    parent.removeChild(el);
}

const PAGE_SCRIPT = RESOURCE_ARGS("PAGE_SCRIPT",
    "VAR_ABORT",        i18nService.$getMessage('aborted_popunder_execution'),
    "VAR_BEFOREUNLOAD", i18nService.$getMessage('on_navigation_by_popunder')
);

runScript(`(${PAGE_SCRIPT})(window,void 0);`);

/**************************************************************************/
/**************************************************************************/
