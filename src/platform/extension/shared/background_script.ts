/**
 * @fileoverview Entry point for the background script.
 */
import chrome from './platform_namespace';
import { BGMsgTypesEnum } from './message_types';

const grayIconPaths = {
    "16": "/assets/gray_16.png",
    "48": "/assets/gray_48.png",
    "128": "/assets/gray_128.png"
};

const orangeIconPaths = {
    "16": "/assets/blocked_16.png",
    "48": "/assets/blocked_48.png",
    "128": "/assets/blocked_128.png"
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message) {
        case BGMsgTypesEnum.SET_ICON_AS_ENABLED:   
            chrome.browserAction.setIcon({
                path: orangeIconPaths,
                tabId: sender.tab.id
            });
            break;
        case BGMsgTypesEnum.SET_ICON_AS_DISABLED:
            chrome.browserAction.setIcon({
                path: grayIconPaths,
                tabId: sender.tab.id
            });
            break;
    }
});
