import chrome from '../shared/platform_namespace';
import AlertController from '../../../ui/alert_controller';
import ExtensionStorageManager from '../shared/storage/ExtensionStorageManager';
import EdgeI18nService from './localization/EdgeI18nService'
import main from '../shared/content_script_main';

/**************************************************************************/
/**************************************************************************/

const i18nService       = new EdgeI18nService(chrome.i18n.getMessage);
const storageManager    = new ExtensionStorageManager();
const alertController   = new AlertController(i18nService, storageManager);

/**************************************************************************/

main(i18nService, alertController);

/**************************************************************************/
/**************************************************************************/
