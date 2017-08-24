/**
 * @fileoverview Bridge object is the object shared between userscript's priviliged context and
 * the page's context. Mostly due to FF restrictions, we cannot directly pass objects and functions of
 * priviliged context to the page's context. We attach them on bridge object with extension APIs
 * designed to selectively expose object/functions.
 */

import BRIDGE_KEY from './bridge';
import { domainOption, whitelistedDestinations } from './storage';
// import { createAlertInTopFrame, dispatchMouseEventToFrame } from './messaging';
import alertController from './alert-controller';
import { getMessage } from './localization';

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
exportFn(alertController.createAlert.bind(alertController), bridge, {
    defineAs: 'showAlert'
});
exportFn(getMessage, bridge, {
    defineAs: 'getMessage'
});

export default bridge;
