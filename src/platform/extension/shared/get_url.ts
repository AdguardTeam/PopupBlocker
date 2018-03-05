/**
 * @fileoverview Extension chrome.runtime.getURL implementation
 */

import chrome from './platform_namespace';
import { BGMsgTypesEnum } from "./message_types";
import { isUndef } from '../../../shared/instanceof';
import { shadowDomV1Support } from '../../../shared/dom';

let getURL:(resc_url:string)=>string;

// A secret key will be attached to page DOM; if itself is exposed to 
// third-party scripts it is pointless to use secret keys.
if (shadowDomV1Support) {
    let accessKey:string;

    chrome.runtime.sendMessage(BGMsgTypesEnum.GET_RESOURCE_ACCESS_KEY, (message:string) => {
        accessKey = message;
    });

    getURL = (resc_url:string):string => {
        let url = chrome.runtime.getURL(resc_url);
        if (!isUndef(accessKey)) {
            url += `?secret=${accessKey}`;
        }
        return url;
    };
} else {
    getURL = chrome.runtime.getURL;
}

export default getURL;
