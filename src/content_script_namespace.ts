/**
 * @fileoverview Global namespace to be used throughout the content script.
 */

import II18nService from "./localization/II18nService";

interface IAdguard {
    i18nService?:II18nService
}

let adguard:IAdguard = {};

export default adguard;
