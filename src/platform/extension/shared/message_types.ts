/**
 * @fileoverview This module contains constants and type declarations used in various messages
 * (postMessage, chrome.runtime.sendMessage).
 * There are 3 contexts - background script(BG), content script(CT), page script(PG) - each of
 * which has its own JS bundle. This module is imported into each of them, so as to provide
 * type safety and consistent property renaming.
 */

export interface Settings {
    domainOption:DomainOptionEnum,
    whitelistedDestinations:string[]
}

// CT ➜ PG
export const CONTENT_PAGE_MAGIC = `pb_from_page_script`;
export const enum DownwardMsgTypesEnum {
    SETTINGS_DELTA
}
export interface SettingsDeltaMsg {
    $type:DownwardMsgTypesEnum.SETTINGS_DELTA,
    settings:Settings
}
export type DownwardMsgTypes = SettingsDeltaMsg

// PG ➜ CT
export const enum UpwardMsgTypesEnum {
    SETTINGS_CHANGE,
    CREATE_ALERT
}
export interface SettingsChangeMsg {
    $type:UpwardMsgTypesEnum.SETTINGS_CHANGE,
    settings:Settings
}
export interface CreateAlertMsg {
    $type:UpwardMsgTypesEnum.CREATE_ALERT,
    orig_domain:string,
    popup_url:string
}
export type UpwardMsgTypes = SettingsChangeMsg | CreateAlertMsg;

// CT ➜ BG
export const enum BGMsgTypesEnum {
    SET_ICON_AS_ENABLED,
    SET_ICON_AS_DISABLED,
    OPEN_OPTIONS_PAGE
}
