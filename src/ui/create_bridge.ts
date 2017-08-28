/**
 * @fileoverview Bridge object is the object shared between userscript's priviliged context and
 * the page's context. Mostly due to FF restrictions, we cannot directly pass objects and functions of
 * priviliged context to the page's context. We attach them on bridge object with extension APIs
 * designed to selectively expose object/functions.
 */

import BRIDGE_KEY from './bridge';
import { domainOption, whitelistedDestinations } from './storage';
// import { createAlertInTopFrame, dispatchMouseEventToFrame } from './messaging';
import alertController from './alert_controller';
import { getMessage } from './localization';
import createUrl from '../shared/url';

// Shim for AG Win
let clone = typeof cloneInto === 'function' ? cloneInto : x=>x;
let createObject = typeof createObjectIn === 'function' ? createObjectIn : (target:Object, option:DefineAs) => {
    let obj = {};
    target[option.defineAs] = obj;
    return obj;
};
let exportFn = typeof exportFunction === 'function' ? (fn, target, option?:exportFunctionOption) => {
    exportFunction(function() {
        return clone(fn.apply(this, arguments), unsafeWindow);
    }, target, option);
} : function(fn, target, option?:exportFunctionOption) {
    target[option.defineAs] = fn;
};
//

const bridge:Bridge = createObject(unsafeWindow, {
    defineAs: BRIDGE_KEY
});

bridge.domain = createUrl(location.href)[1];
bridge.domainOption = clone(domainOption, bridge);
bridge.whitelistedDestinations = clone(whitelistedDestinations, bridge);
exportFn(alertController.createAlert.bind(alertController), bridge, {
    defineAs: 'showAlert'
});
exportFn(getMessage, bridge, {
    defineAs: 'getMessage'
});
exportFn(createUrl, bridge, {
    defineAs: 'url'
});

export default bridge;
