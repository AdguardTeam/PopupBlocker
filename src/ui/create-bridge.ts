import BRIDGE_KEY from './bridge';
import { domainOption, whitelistedDestinations } from './storage';
import createAlertInTopFrame from './handshake';

const bridge:Bridge = createObjectIn(unsafeWindow, {
    defineAs: BRIDGE_KEY
});

let clone = typeof cloneInto === 'function' ? cloneInto : x=>x; // Shim for userscript hosts that does not implement cloneInto

bridge.domain = location.host;
bridge.domainOption = clone(domainOption, bridge, { defineAs: 'domainOption' });
bridge.whitelistedDestinations = clone(whitelistedDestinations, bridge, { defineAs: 'whitelistedDestinations' });
exportFunction(createAlertInTopFrame, bridge, {
    defineAs: 'showAlert'
});

export default bridge;
