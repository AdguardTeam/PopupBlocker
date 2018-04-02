/**
 * @fileoverview Entry point for userscript options page (to be hosted on GitHub);
 */

import adguard from '../../content_script_namespace';
import UserscriptSettingsDao from './storage/UserscriptSettingsDao';
import OptionsController from '../../ui/options/OptionsController';
import getMessage from './get_message';
import I18nService from '../../localization/I18nService';

function main() {
    const settingsDao = new UserscriptSettingsDao();
    const optionsController = new OptionsController(settingsDao);
    adguard.i18nService = new I18nService(getMessage);
    optionsController.initialize();
}

const MAX_USERSCRIPT_WAITING_TIME = 1000 * 10 // 10 sec

let pollUserscriptExecutionAndRunMain = setInterval(() => {
    if (typeof GM_listValues === 'function') {
        // Wait for GM_api exported to the global scope.
        clearInterval(pollUserscriptExecutionAndRunMain);
        clearTimeout(displayNotInstalledMessage);
        main();
    }
});

let displayNotInstalledMessage = setTimeout(() => {
    clearInterval( pollUserscriptExecutionAndRunMain);
    document.body.innerHTML = "Userscript is not installed.";
}, MAX_USERSCRIPT_WAITING_TIME);
