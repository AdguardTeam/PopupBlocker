import chrome from './platform_namespace';
import { CONTENT_PAGE_MAGIC, DownwardMsgTypesEnum, UpwardMsgTypesEnum, UpwardMsgTypes, SettingsDeltaMsg, Settings, BGMsgTypesEnum, FromBGMsgTypesEnum } from "./message_types";
import IAlertController from "../../../ui/controllers/alert/IAlertController";
import * as log from '../../../shared/debug';
import II18nService from '../../../localization/II18nService';
import adguard from '../../../content_script_namespace';
import IExtensionSettingsDao from './storage/IExtensionSettingsDao';
import { isUndef } from '../../../shared/instanceof';

const domain = location.host;
const isTop = window === top;

function linkPageScript (settingsDao:IExtensionSettingsDao, alertController:IAlertController) {

    const portReceived = new Promise<MessagePort>(function(resolve, reject) {
        window.addEventListener("message", function(event) {
            if (event.source !== window) { return; }
            if (event.data !== CONTENT_PAGE_MAGIC) { return; }
            log.print(`contentscript: received a port...`);
            const port:MessagePort = event.ports[0];
            event.stopImmediatePropagation();
            resolve(port);
        });
    });

    function onMessage(message:MessageEvent) {
        const data:UpwardMsgTypes = message.data;
        switch (data.$type) {
            case UpwardMsgTypesEnum.CREATE_ALERT:
                alertController.createAlert(data.orig_domain, data.popup_url);
        }
    }

    portReceived
        .then(function(port) {
            port.onmessage = onMessage;
        });

    const initialSettingsReceived = new Promise<Partial<Settings>>(function(resolve, reject) {
        settingsDao.getDomainOption(domain, (settings) => {
            resolve(settings);
        });
    });

    function updateIcon(settings:Partial<Settings>) {
        // Send message from top frames only
        if (!isTop) { return; }

        let whitelist = settings.$whitelist;

        if (isUndef(whitelist)) { return; }

        const message = whitelist.indexOf(domain) === -1 ?
            BGMsgTypesEnum.SET_ICON_AS_ENABLED :
            BGMsgTypesEnum.SET_ICON_AS_DISABLED;

        chrome.runtime.sendMessage(message);
    }

    initialSettingsReceived.then(updateIcon)

    Promise.all([portReceived, initialSettingsReceived])
        .then(function(resolved) {
            const port = resolved[0];
            const settings = resolved[1];
            port.postMessage(<SettingsDeltaMsg>{
                $type: DownwardMsgTypesEnum.SETTINGS_DELTA,
                $settings: settings
            });
        });

    settingsDao.onDomainSettingsChange(domain, (partialSettings) => {
        updateIcon(partialSettings);
        portReceived.then(function(port) {
            port.postMessage(<SettingsDeltaMsg>{
                $type: DownwardMsgTypesEnum.SETTINGS_DELTA,
                $settings: partialSettings
            });
        });
    });
}

function linkBackgroundScript(settingsDao:IExtensionSettingsDao) {
    const onMessage = (message:FromBGMsgTypesEnum) => {
        switch (message) {
            case FromBGMsgTypesEnum.ICON_CLICKED:
                if (!isTop) { return; }
                settingsDao.setWhitelist(domain, null);
                break;
        }
    };

    chrome.runtime.onMessage.addListener(onMessage);
}

function runScript(code) {
    const parent = document.head || document.documentElement;
    let el = document.createElement('script');
    el.textContent = code;
    parent.appendChild(el);
    parent.removeChild(el);
}

export default function main(i18nService:II18nService, settingsDao:IExtensionSettingsDao, alertController:IAlertController) {
    adguard.i18nService = i18nService;
    
    linkPageScript(settingsDao, alertController);
    linkBackgroundScript(settingsDao);

    const PAGE_SCRIPT = RESOURCE_ARGS("PAGE_SCRIPT",
        "VAR_ABORT",        i18nService.$getMessage('aborted_popunder_execution'),
        "VAR_BEFOREUNLOAD", i18nService.$getMessage('on_navigation_by_popunder')
    );

    runScript(`(${PAGE_SCRIPT})(window);`);
}
