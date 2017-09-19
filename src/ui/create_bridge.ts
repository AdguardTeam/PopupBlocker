import alertController from './alert_controller';
import { domainOption, whitelistedDestinations } from './storage';
import { exportFn, clone } from './firefox_export_helper_polyfills';
import bridge from './bridge';

/**************************************************************************/
// Exports settings object from storage module.

bridge.domainOption = clone(domainOption, bridge);
bridge.whitelistedDestinations = clone(whitelistedDestinations, bridge);

/**************************************************************************/
// Exports showAlert method from alert_controller module.

exportFn(function(orig_domain:string, popup_url:string, showCollapsed:boolean):void {
    alertController.createAlert(orig_domain, popup_url, showCollapsed)
}, bridge, {
    defineAs: 'showAlert'
});

/**************************************************************************/

export default bridge;
