import chrome from '../shared/platform_namespace';
import ExtensionAlertController from '../shared/ui/ExtensionAlertController';
import ExtensionSettingsDao from '../shared/storage/ExtensionSettingsDao';
import EdgeI18nService from './localization/EdgeI18nService'
import main from '../shared/content_script_main';
import getURL from '../shared/get_url';
import CSSService from '../../../ui/controllers/utils/CssService';

const i18nService       = new EdgeI18nService(chrome.i18n.getMessage);
const settingsDao       = new ExtensionSettingsDao();
const cssService        = new CSSService(getURL);
const alertController   = new ExtensionAlertController(settingsDao, cssService);

main(i18nService, settingsDao, alertController);
