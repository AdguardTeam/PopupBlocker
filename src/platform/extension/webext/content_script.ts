import { CONTENT_PAGE_MAGIC, DownwardMsgTypesEnum, UpwardMsgTypesEnum, UpwardMsgTypes, SettingsDeltaMsg, Settings } from '../shared/MessageTypes';

import AlertController from '../../../ui/alert_controller';
import WebExtStorageManager from './storage/WebExtStorageManager';
import I18nService from '../../../localization/I18nService';

/**************************************************************************/
/**************************************************************************/

const i18nService       = new I18nService(browser.i18n.getMessage);
const storageManager    = new WebExtStorageManager();
const alertController   = new AlertController(i18nService, storageManager);

/**************************************************************************/

function runScript(code) {
    const parent = document.head || document.documentElement;
    let el = document.createElement('script');
    el.textContent = code;
    parent.appendChild(el);
    parent.removeChild(el);
}

const PAGE_SCRIPT = RESOURCE_ARGS("PAGE_SCRIPT",
    "VAR_ABORT",        i18nService.getMessage('aborted_popunder_execution'),
    "VAR_BEFOREUNLOAD", i18nService.getMessage('on_navigation_by_popunder')
);

runScript(`(function popupBlocker(window,PARENT_FRAME_KEY){${PAGE_SCRIPT}})(window,void 0);`);

/**************************************************************************/

const receivePort = new Promise<MessagePort>(function(resolve, reject) {
    window.addEventListener("message", function(event) {
        if (event.source !== window) { return; }
        if (event.type !== CONTENT_PAGE_MAGIC) { return; }
        const port:MessagePort = event.ports[0];
        event.stopImmediatePropagation();
        resolve(port);
    });
});

function onMessage(message:MessageEvent) {
    const data:UpwardMsgTypes = message.data;
    switch (data.$type) {
        case UpwardMsgTypesEnum.SETTINGS_CHANGE:
            browser.storage.sync.set(message.data);
            break;
        case UpwardMsgTypesEnum.CREATE_ALERT:
            alertController.createAlert(data.orig_domain, data.popup_url);
    }
}

receivePort
    .then(function(port) {
        port.onmessage = onMessage;
    });

/**************************************************************************/

const getSettings = <Promise<Settings>><any>browser.storage.sync.get(["whitelist", location.host]);

/**************************************************************************/

Promise.all([receivePort, getSettings])
    .then(function(resolved) {
        const port = resolved[0];
        const settings = resolved[1];
        port.postMessage(<SettingsDeltaMsg>{
            $type: DownwardMsgTypesEnum.SETTINGS_DELTA,
            settings: settings
        });
    });

/**************************************************************************/

browser.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace !== 'sync') { return; }
    let partialSettings:Partial<Settings> = {};
    let storageChange;
    if ('whitelisted' in changes) {
        storageChange = changes['whitelisted'];
        partialSettings.whitelistedDestinations = storageChange.newVal;
    }
    if (location.hostname in changes) {
        storageChange = changes[location.hostname];
        partialSettings.originIsWhitelisted = storageChange.newValue;
    }
    receivePort.then(function(port) {
        port.postMessage(<SettingsDeltaMsg>{
            $type: DownwardMsgTypesEnum.SETTINGS_DELTA,
            settings: partialSettings
        });
    });
});

/**************************************************************************/
/**************************************************************************/
