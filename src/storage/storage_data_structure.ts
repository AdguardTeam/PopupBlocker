/**
 * @fileoverview Type declarations on data stored in persistent storage,
 * i.e. chrome.storage.local for extensions, GM_storage in userscripts.
 */

/**
 * @deprecated Storage type used in version <2.2.
 */
export interface DomainOption {
    whitelisted:boolean
}

/**
 * Storage type used in >=2.2.
 */
export const enum DomainOptionEnum {
    NONE     = 0 << 0,
    SILENCED = 1 << 0
}
