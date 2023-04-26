import { adguard } from '../page-script-namespace';
import { main } from '../main';
import '../observers/overlay-link-observer';

adguard.contentScriptApiFacade = externalWindow[externalBridgeKey];
const instanceID = adguard.contentScriptApiFacade.getInstanceID();
main(externalWindow, instanceID);
