/**
 * @fileoverview Service locator object to be used throughout the page script.
 */

import I18nService from "./localization/I18nService";
import IStorageProvider from "./storage/IStorageProvider";
import IStorageManager from "./storage/IStorageManager";

namespace adguard {
    export let storageProvider:IStorageProvider
}

export default adguard;
