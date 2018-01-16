/**************************************************************************/
/**************************************************************************/

export interface Settings {
    originIsWhitelisted:boolean,
    whitelistedDestinations:string[]
}

/**************************************************************************/

export const CONTENT_PAGE_MAGIC = `pb_from_page_script`;

export const enum DownwardMsgTypesEnum {
    SETTINGS_DELTA
}

export interface SettingsDeltaMsg {
    $type:DownwardMsgTypesEnum.SETTINGS_DELTA,
    settings:Settings
}

export type DownwardMsgTypes = SettingsDeltaMsg

/**************************************************************************/

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
    popup_url:string,
}

export type UpwardMsgTypes = SettingsChangeMsg | CreateAlertMsg;

/**************************************************************************/
/**************************************************************************/
