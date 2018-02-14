import chrome from '../shared/platform_namespace';
import ExtensionAlertController from './ui/ExtensionAlertController';
import ExtensionStorageManager from './storage/ExtensionStorageManager';
import I18nService from '../../../localization/I18nService';
import main from './content_script_main';

/**************************************************************************/
/**************************************************************************/

const i18nService       = new I18nService(chrome.i18n.getMessage);
const storageManager    = new ExtensionStorageManager();
const alertController   = new ExtensionAlertController(storageManager);

/**************************************************************************/

main(i18nService, alertController);

/**************************************************************************/
/**************************************************************************/
