import chrome from '../shared/platform_namespace';
import ExtensionAlertController from '../shared/ui/ExtensionAlertController';
import ExtensionSettingsDao from '../shared/storage/ExtensionSettingsDao';
import EdgeI18nService from './localization/EdgeI18nService'
import main from '../shared/content_script_main';
import getURL from '../shared/get_url';

const i18nService       = new EdgeI18nService(chrome.i18n.getMessage);
const settingsDao       = new ExtensionSettingsDao();
const alertController   = new ExtensionAlertController(settingsDao, getURL);

main(i18nService, settingsDao, alertController);
