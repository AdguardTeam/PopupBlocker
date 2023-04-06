import { adguard } from '../page-script-namespace';
import { main } from '../main';
import '../observers/overlay-link-observer';

/**
 * Connects main with userscript's api though bridge key
 * @param context global context
 * @param bridgeKey prop under which to hide script api
 */
export function popupBlocker(context: Window, bridgeKey: string): void {
    adguard.contentScriptApiFacade = context[bridgeKey];
    const instanceID = adguard.contentScriptApiFacade.getInstanceID();
    main(context, instanceID);
}
