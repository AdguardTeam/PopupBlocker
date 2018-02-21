/**
 * @fileoverview Global namespace to be used throughout the page script.
 */

import IContentScriptApiFacade from "./storage/IContentScriptApiFacade";

interface IAdguard {
    storageProvider?:IContentScriptApiFacade
}

let adguard:IAdguard = {};

export default adguard;
