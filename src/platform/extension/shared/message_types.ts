/**
 * @fileoverview This module contains constants and type declarations used in various messages
 * (postMessage, chrome.runtime.sendMessage).
 * There are 3 contexts - background script(BG), content script(CT), page script(PG) - each of
 * which has its own JS bundle. This module is imported into each of them, so as to provide
 * type safety and consistent property renaming.
 */

import { DomainOptionEnum } from "../../../storage/storage_data_structure";

export interface Settings {
    $whitelist:string[]
    domainOption:DomainOptionEnum
}

// CT ➜ PG
export const enum DownwardMsgTypesEnum {
    SETTINGS_DELTA
}
export interface SettingsDeltaMsg {
    $type:DownwardMsgTypesEnum.SETTINGS_DELTA,
    $settings:Settings
}
export type DownwardMsgTypes = SettingsDeltaMsg

// PG ➜ CT
export const CONTENT_PAGE_MAGIC = `pb_from_page_script`;
export const enum UpwardMsgTypesEnum {
    CREATE_ALERT
}
export interface CreateAlertMsg {
    $type:UpwardMsgTypesEnum.CREATE_ALERT,
    orig_domain:string,
    popup_url:string
}
export type UpwardMsgTypes = CreateAlertMsg;

// CT ➜ BG
export const enum BGMsgTypesEnum {
    SET_ICON_AS_ENABLED,
    SET_ICON_AS_DISABLED,
    OPEN_OPTIONS_PAGE,
    GET_RESOURCE_ACCESS_KEY
}

// BT ➜ CT
export const enum FromBGMsgTypesEnum {
    ICON_CLICKED
}
