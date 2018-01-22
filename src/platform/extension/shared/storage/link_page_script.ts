import chrome from '../platform_namespace';
import { CONTENT_PAGE_MAGIC, DownwardMsgTypesEnum, UpwardMsgTypesEnum, UpwardMsgTypes, SettingsDeltaMsg, Settings } from "../MessageTypes";
import AlertController from "../../../../ui/alert_controller";
import * as log from '../../../../shared/log';

export default function (alertController:AlertController) {

    const receivePort = new Promise<MessagePort>(function(resolve, reject) {
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
            case UpwardMsgTypesEnum.SETTINGS_CHANGE:
                chrome.storage.local.set(message.data);
                break;
            case UpwardMsgTypesEnum.CREATE_ALERT:
                alertController.createAlert(data.orig_domain, data.popup_url);
        }
    }

    receivePort
        .then(function(port) {
            port.onmessage = onMessage;
        });

    const getSettings = new Promise(function(resolve, reject) {
        chrome.storage.local.get(["whitelist", location.host], function(items) {
            resolve(items);
        });
    });

    Promise.all([receivePort, getSettings])
        .then(function(resolved) {
            const port = resolved[0];
            const settings = resolved[1];
            port.postMessage(<SettingsDeltaMsg>{
                $type: DownwardMsgTypesEnum.SETTINGS_DELTA,
                settings: settings
            });
        });

    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (namespace !== 'local') { return; }
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
}
