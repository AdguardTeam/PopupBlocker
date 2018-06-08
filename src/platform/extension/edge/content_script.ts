import chrome from '../shared/platform_namespace';
import AlertController from '../../../ui/alert/AlertController';
import ExtensionSettingsDao from '../shared/storage/ExtensionSettingsDao';
import EdgeI18nService from './localization/EdgeI18nService'
import main from '../shared/content_script_main';
import getURL from '../shared/get_url';
import CSSService from '../../../ui/utils/CssService';
import { BGMsgTypesEnum } from '../shared/message_types';

const i18nService       = new EdgeI18nService(chrome.i18n.getMessage);
const settingsDao       = new ExtensionSettingsDao();
const cssService        = new CSSService(getURL);
const alertController   = new AlertController(cssService, settingsDao, () => {
    chrome.runtime.sendMessage(BGMsgTypesEnum.OPEN_OPTIONS_PAGE);
});

main(i18nService, settingsDao, alertController);
