import { adguard } from '../page-script-namespace';
import { main } from '../main';
import '../observers/overlay-link-observer';

/**
 * Wrapper will connect main with userscript's api through the bridge key
 * at build time
 * Note: parameter names should not conflict with the variable names used in the bundle
 * @param externalContext global context
 * @param externalBridgeKey prop under which to hide script api
 */
declare const externalContext: Window;
declare const externalBridgeKey: string;

adguard.contentScriptApiFacade = externalContext[externalBridgeKey];
const instanceID = adguard.contentScriptApiFacade.getInstanceID();
main(externalContext, instanceID);
