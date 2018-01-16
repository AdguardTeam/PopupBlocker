import IStorageProvider from "../../../../storage/IStorageProvider";
import { CONTENT_PAGE_MAGIC, DownwardMsgTypesEnum, DownwardMsgTypes, Settings, UpwardMsgTypesEnum, CreateAlertMsg } from '../MessageTypes'
import * as log from '../../../../shared/log';

export default class ExtensionStorageProvider implements IStorageProvider {
    public domain = location.hostname;
    private port:MessagePort
    constructor() {
        const channel = new MessageChannel();
        log.print(`ExtensionStorageProvider: sending message to the content script`);
        window.postMessage(CONTENT_PAGE_MAGIC, '*', [channel.port2]);
        this.port = channel.port1;
        this.port.onmessage = (message) => {
            log.print(`ExtensionStorageProvider: received a message from the port`);
            const data:DownwardMsgTypes = message.data;
            switch (data.$type) {
                case DownwardMsgTypesEnum.SETTINGS_DELTA:
                    this.receiveSettings(data.settings);
                    break;
            }
        }
    }
    private whitelistedDestinations:string[]
    private isWhitelistedOrigin:boolean
    private receiveSettings(settings:Partial<Settings>) {
        if (typeof settings.whitelistedDestinations !== 'undefined') {
            this.whitelistedDestinations = settings.whitelistedDestinations;
        }
        if (typeof settings.originIsWhitelisted !== 'undefined') {
            this.isWhitelistedOrigin = settings.originIsWhitelisted;
        }
    }

    originIsWhitelisted():boolean {
        if (typeof this.isWhitelistedOrigin === 'undefined') {
            // Settings are not received.
            return false;
        }
        return this.isWhitelistedOrigin;
    }
    destinationIsWhitelisted(destination:string):boolean {
        if (typeof this.whitelistedDestinations === 'undefined') {
            // Settings are not received.
            return false;
        }
        return this.whitelistedDestinations.indexOf(destination) !== -1;
    }
    showAlert(orig_domain:string, popup_url:string):void {
        log.print('StorageProvider: showAlert');
        this.port.postMessage(<CreateAlertMsg>{
            $type:UpwardMsgTypesEnum.CREATE_ALERT,
            orig_domain,
            popup_url
        });
    }
    $getMessage(messageId:string):string {
        switch (messageId) {
            case 'on_navigation_by_popunder':
                return "RESOURCE_VAR_BEFOREUNLOAD";
            case 'aborted_popunder_execution':
                return "RESOURCE_VAR_ABORT";
        }
    }
}
