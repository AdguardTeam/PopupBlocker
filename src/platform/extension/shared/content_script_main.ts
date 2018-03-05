import chrome from './platform_namespace';
import { CONTENT_PAGE_MAGIC, DownwardMsgTypesEnum, UpwardMsgTypesEnum, UpwardMsgTypes, SettingsDeltaMsg, Settings, BGMsgTypesEnum, FromBGMsgTypesEnum } from "./message_types";
import IAlertController from "../../../ui/alert/IAlertController";
import * as log from '../../../shared/log';
import II18nService from '../../../localization/II18nService';
import adguard from '../../../content_script_namespace';
import ISettingsDao from '../../../storage/ISettingsDao';

const domain = location.host;

function linkPageScript (settingsDao:ISettingsDao, alertController:IAlertController) {

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
        if (top !== window) { return; }
        if (settings.domainOption === DomainOptionEnum.WHITELISTED) {
            chrome.runtime.sendMessage(BGMsgTypesEnum.SET_ICON_AS_DISABLED);
        } else {
            chrome.runtime.sendMessage(BGMsgTypesEnum.SET_ICON_AS_ENABLED);
        }
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

function linkBackgroundScript(settingsDao:ISettingsDao) {
    const onPrevSettingsReceived = (settings:Settings) => {
        let prevDomainOption = settings.domainOption;
        let nextDomainOption:DomainOptionEnum;
        if (prevDomainOption === DomainOptionEnum.WHITELISTED) {
            nextDomainOption = DomainOptionEnum.NONE;
        } else {
            nextDomainOption = DomainOptionEnum.WHITELISTED;
        }

        settingsDao.setSourceOption(domain, nextDomainOption);
    };

    const onMessage = (message:FromBGMsgTypesEnum) => {
        switch (message) {
            case FromBGMsgTypesEnum.ICON_CLICKED:
                settingsDao.getDomainOption(domain, onPrevSettingsReceived);
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

export default function main(i18nService:II18nService, settingsDao:ISettingsDao, alertController:IAlertController) {
    adguard.i18nService = i18nService;
    
    linkPageScript(settingsDao, alertController);
    linkBackgroundScript(settingsDao);

    const PAGE_SCRIPT = RESOURCE_ARGS("PAGE_SCRIPT",
        "VAR_ABORT",        i18nService.$getMessage('aborted_popunder_execution'),
        "VAR_BEFOREUNLOAD", i18nService.$getMessage('on_navigation_by_popunder')
    );

    runScript(`(${PAGE_SCRIPT})(window,void 0);`);
}
