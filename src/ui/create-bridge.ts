import BRIDGE_KEY from './bridge';
import { domainOption, whitelistedDestinations } from './storage';
import createAlertInTopFrame from './handshake';


const bridge:Bridge = createObjectIn(unsafeWindow, {
    defineAs: BRIDGE_KEY
});

bridge.domain = location.host;
bridge.domainOption = domainOption;
bridge.whitelistedDestinations = whitelistedDestinations;

exportFunction(createAlertInTopFrame, bridge, {
    defineAs: 'showAlert'
});

export default bridge;
