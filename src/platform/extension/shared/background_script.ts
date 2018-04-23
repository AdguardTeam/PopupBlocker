/**
 * @fileoverview Entry point for the background script.
 */

import chrome from './platform_namespace';
import { BGMsgTypesEnum, FromBGMsgTypesEnum } from './message_types';
import { shadowDomV1Support } from '../../../shared/dom';
import { isUndef } from '../../../shared/instanceof';

/**
 * Set extension icon, and make it clickable.
 * {@link https://github.com/AdguardTeam/PopupBlocker/issues/84}
 */
const iconSizes = ["16", "19", "38", "48", "128"];

const grayIconPaths = {};
const orangeIconPaths = {};

for (let i = 0, l = iconSizes.length; i < l; i++) {
    let size = iconSizes[i];
    orangeIconPaths[size] = `/assets/${size}.png`;
    grayIconPaths[size] = `/assets/${size}-g.png`;
}

chrome.browserAction.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, FromBGMsgTypesEnum.ICON_CLICKED, {
        frameId: 0 // Send to top-frame only, requires chrome ver >=41
    });
});

/**
 * This is a counter measure against a well-known extension detection method
 * using web accessible resources".
 * {@link http://www.cse.chalmers.se/~andrei/codaspy17.pdf}
 * 
 * PopupBlocker injects ui into the page's scope. Being able to load heavy resources
 * from the extension package provides memory and performance benefits.
 * 
 * We create a random string key for each browser instances, and we allow access to
 * web accessible resource only when this key is provided in url query string.
 * This is achieved by attaching an `onBeforeRequest` listener that controls
 * requests to resources from extension package.
 * 
 * This key will be used in ui frames that we inject into pages. It won't be
 * exposed to page script on modern browsers that supports Shadow Dom V1.
 * (PopupBlocker does not use the access key when it is not supported)
 */
if (shadowDomV1Support) {

    var accessKey = (function() {
        let buffer = new Uint8Array(16);
        crypto.getRandomValues(buffer);
        return btoa(String.fromCharCode.apply(null, buffer));
    })();

    const reHttp = /^http/;

    chrome.webRequest.onBeforeRequest.addListener((details) => {
        /**
         * Support: details.initiator Chrome 63 or higher,
         * details.originURL Firefox 48 or higher
         * {@link https://developers.chrome.com/extensions/webRequest#event-onBeforeRequest}
         * {@link https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/webRequest/onBeforeRequest}
         */
        let initiator = details["initiator"] || details["originURL"];
        // Do not block requests if initiator is unsupported or is non-http url.
        if (isUndef(initiator) || !reHttp.test(initiator)) { return; }
        // Block if the request does not contain the access key.
        if (!details.url.endsWith(accessKey)) {
            return { 'cancel': true };
        }
    }, {
        urls: [ chrome.runtime.getURL('/assets/fonts/*') ]
    }, [ 'blocking' ]);
}

//

function checkLastError() {
    chrome.runtime.lastError;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    let tabId = sender.tab.id;
    switch (message) {
        case BGMsgTypesEnum.SET_ICON_AS_ENABLED:   
            chrome.browserAction.setIcon({
                path: orangeIconPaths,
                tabId
            }, checkLastError);
            chrome.browserAction.setTitle({
                title: chrome.i18n.getMessage("ext_enabled"),
                tabId
            });
            break;
        case BGMsgTypesEnum.SET_ICON_AS_DISABLED:
            chrome.browserAction.setIcon({
                path: grayIconPaths,
                tabId
            }, checkLastError);
            chrome.browserAction.setTitle({
                title: chrome.i18n.getMessage("ext_disabled", new URL(sender.url).host),
                tabId
            });
            break;
        case BGMsgTypesEnum.OPEN_OPTIONS_PAGE:
            chrome.runtime.openOptionsPage();
            break;
        case BGMsgTypesEnum.GET_RESOURCE_ACCESS_KEY:
            sendResponse(accessKey);
            break;
    }
});
