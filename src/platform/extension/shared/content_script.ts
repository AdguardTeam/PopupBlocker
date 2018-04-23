/**
 * @fileoverview Entry point for content script.
 */

import chrome from '../shared/platform_namespace';
import ExtensionAlertController from './ui/ExtensionAlertController';
import ExtensionSettingsDao from './storage/ExtensionSettingsDao';
import I18nService from '../../../localization/I18nService';
import main from './content_script_main';
import getURL from './get_url';
import CSSService from '../../../ui/controllers/utils/CssService';

const i18nService       = new I18nService(chrome.i18n.getMessage);
const settingsDao       = new ExtensionSettingsDao();
const cssService        = new CSSService(getURL);
const alertController   = new ExtensionAlertController(settingsDao, cssService);

main(i18nService, settingsDao, alertController);
