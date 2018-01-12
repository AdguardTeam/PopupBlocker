/**
 * @fileoverview Service locator object to be used throughout the page script.
 */

import IStorageProvider from "./storage/IStorageProvider";

interface IAdguard {
    storageProvider?:IStorageProvider
}

let adguard:IAdguard = {};

export default adguard;
