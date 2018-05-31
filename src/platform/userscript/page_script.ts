import adguard from '../../page_script_namespace';
import '../../observers/overlay_link_observer';
import main from '../../main';

adguard.contentScriptApiFacade = window[CONTENT_SCRIPT_KEY];
const instanceID = adguard.contentScriptApiFacade.getInstanceID();
main(window, instanceID);
