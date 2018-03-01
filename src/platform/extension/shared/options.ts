/**
 * @fileoverview Entry point for extension options page.
 */

import chrome from './platform_namespace';
import OptionsController from "../../../ui/options/OptionsController";
import ExtensionSettingsDao from "./storage/ExtensionSettingsDao";
import I18nService from '../../../localization/I18nService';
import adguard from '../../../content_script_namespace';

const settingsDao = new ExtensionSettingsDao();
const optionsController = new OptionsController(settingsDao);

adguard.i18nService = new I18nService(chrome.i18n.getMessage);

optionsController.initialize();
