import BRIDGE_KEY from './bridge';
import { domainOption, whitelistedDestinations } from './storage';
import createAlertInTopFrame from './handshake';

// Shim for AG Win
let clone = typeof cloneInto === 'function' ? cloneInto : x=>x;
let createObject = typeof createObjectIn === 'function' ? createObjectIn : function(target:Object, option:DefineAs) {
    let obj = {};
    target[option.defineAs] = obj;
    return obj;
};
let exportFn = typeof exportFunction === 'function' ? exportFunction : function(fn, target, option:DefineAs) {
    target[option.defineAs] = fn;
};
//

const bridge:Bridge = createObject(unsafeWindow, {
    defineAs: BRIDGE_KEY
});

bridge.domain = location.host;
bridge.domainOption = clone(domainOption, bridge, { defineAs: 'domainOption' });
bridge.whitelistedDestinations = clone(whitelistedDestinations, bridge, { defineAs: 'whitelistedDestinations' });
exportFn(createAlertInTopFrame, bridge, {
    defineAs: 'showAlert'
});

export default bridge;
