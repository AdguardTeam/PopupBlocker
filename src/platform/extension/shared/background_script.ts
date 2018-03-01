/**
 * @fileoverview Entry point for the background script.
 */
import chrome from './platform_namespace';
import { BGMsgTypesEnum } from './message_types';

const iconSizes = ["16", "19", "38", "48", "128"];

const grayIconPaths = {};
const orangeIconPaths = {};

for (let i = 0, l = iconSizes.length; i < l; i++) {
    let size = iconSizes[i];
    orangeIconPaths[size] = `/assets/${size}.png`;
    grayIconPaths[size] = `/assets/${size}-g.png`;
}

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
        case BGMsgTypesEnum.OPEN_OPTIONS_PAGE:
            chrome.runtime.openOptionsPage();
            break;
    }
});
