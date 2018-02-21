import chrome from '../shared/platform_namespace';
import ExtensionAlertController from '../shared/ui/ExtensionAlertController';
import ExtensionSettingsDao from '../shared/storage/ExtensionSettingsDao';
import EdgeI18nService from './localization/EdgeI18nService'
import main from '../shared/content_script_main';

/**************************************************************************/
/**************************************************************************/

const i18nService       = new EdgeI18nService(chrome.i18n.getMessage);
const storageManager    = new ExtensionSettingsDao();
const alertController   = new ExtensionAlertController(storageManager);

/**************************************************************************/

main(i18nService, alertController);

/**************************************************************************/
/**************************************************************************/
