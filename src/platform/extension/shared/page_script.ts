import adguard from '../../../page_script_namespace';
import '../../../observers/overlay_link_observer';
import ExtensionContentScriptApiFacade from './storage/ExtensionContentScriptApiFacade';
import main from '../../../main';

adguard.contentScriptApiFacade = new ExtensionContentScriptApiFacade();

/**
 * This key should be changed on each release.
 * We can't use a key stored in user's storage, as there is no way to synchronously retrieve .such values.
 * Unlike userscripts, content scripts are guaranteed to be executed before website's scripts, so websites
 * can't set this flag before we read it.
 */
const GLOBAL_KEY = 'c4d38f5c-9a7f-49c1-8eae-95768d33617d'

main(window, GLOBAL_KEY);
