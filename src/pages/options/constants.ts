const enum ResourceUrl {
    AdGuard = 'https://link.adtidy.org/forward.html?action=adguard_site&from=popup_blocker_options&app=popup_blocker',
    Popupblocker = 'https://github.com/AdguardTeam/PopupBlocker',
}

enum ScriptManagerUrl {
    AdGuard = 'https://link.adtidy.org/forward.html?action=adguard_site&from=popup_blocker_options&app=popup_blocker',
    GreaseMonkey = 'https://www.greasespot.net/',
    ViolentMonkey = 'https://violentmonkey.github.io/',
    TamperMonkey = 'https://tampermonkey.net/',
}

enum InstallSource {
    GitHub = 'https://github.com/AdguardTeam/PopupBlocker',
    Greasyfork = 'https://greasyfork.org/en/scripts/436537-adguard-popup-blocker-dev',
    OpenUserJS = 'https://openuserjs.org/scripts/AdGuard/Adguard_Popup_Blocker',
}

const enum AppState {
    Detecting,
    NotInstalled,
    Installed,
}

const enum OptionName {
    Allowed = 'allowed',
    Silenced = 'silenced',
}

export {
    ResourceUrl,
    ScriptManagerUrl,
    InstallSource,
    AppState,
    OptionName,
};
