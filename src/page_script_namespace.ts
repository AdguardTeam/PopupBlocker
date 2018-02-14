/**
 * @fileoverview Global namespace to be used throughout the page script.
 */

import IContentScriptApi from "./storage/IContentScriptApi";

interface IAdguard {
    storageProvider?:IContentScriptApi
}

let adguard:IAdguard = {};

export default adguard;
