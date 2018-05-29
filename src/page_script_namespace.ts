/**
 * @fileoverview Global namespace to be used throughout the page script.
 */

import IContentScriptApiFacade from "./storage/IContentScriptApiFacade";
import IInterContextMessageHub from "./messaging/IInterContextMessageHub";

interface IAdguard {
    contentScriptApiFacade?:IContentScriptApiFacade
    messageHub?:IInterContextMessageHub
}

let adguard:IAdguard = {};

export default adguard;
