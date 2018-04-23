/**
 * @fileoverview Entry point for userscript options page (to be hosted on GitHub);
 */

import adguard from '../../content_script_namespace';
import UserscriptSettingsDao from './storage/UserscriptSettingsDao';
import getMessage from './get_message';
import I18nService from '../../localization/I18nService';
import UserscriptOptionsController from './ui/UserscriptOptionsController';

adguard.i18nService = new I18nService(getMessage);

const settingsDao = new UserscriptSettingsDao();
const optionsController = new UserscriptOptionsController(settingsDao);
optionsController.initialize();
