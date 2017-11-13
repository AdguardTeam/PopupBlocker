/**
 * @fileoverview Bridge object is the object shared between userscript's priviliged context and
 * the page's context. Mostly due to FF restrictions, we cannot directly pass objects and functions of
 * priviliged context to the page's context. We attach them on bridge object with extension APIs
 * designed to selectively expose object/functions.
 */

import BRIDGE_KEY from './bridge_key';
import { domainOption, whitelistedDestinations } from './storage';
import { createObject, exportFn } from './firefox_export_helper_polyfills';
import { getMessage } from './localization';
import createUrl from '../shared/url';

const bridge:Bridge = createObject(unsafeWindow, {
    defineAs: BRIDGE_KEY
});

bridge.domain = createUrl(location.href)[1];

exportFn(getMessage, bridge, {
    defineAs: 'getMessage'
});
exportFn(createUrl, bridge, {
    defineAs: 'url'
});

export default bridge;
