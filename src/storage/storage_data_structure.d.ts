/**
 * @fileoverview Type declarations on data stored in persistent storage,
 * i.e. chrome.storage.local for extensions, GM_storage in userscripts.
 */

/**
 * @deprecated Storage type used in version <2.2.
 */
interface DomainOption {
    whitelisted:boolean
}

/**
 * Storage type used in >=2.2.
 */
declare const enum DomainOptionEnum {
    NONE,
    SILENCED,
    WHITELISTED
}
