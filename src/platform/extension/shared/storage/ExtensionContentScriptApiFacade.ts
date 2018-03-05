import IContentScriptApiFacade from "../../../../storage/IContentScriptApiFacade";
import { CONTENT_PAGE_MAGIC, DownwardMsgTypesEnum, DownwardMsgTypes, Settings, UpwardMsgTypesEnum, CreateAlertMsg } from '../message_types'
import * as log from '../../../../shared/log';
import { isUndef } from "../../../../shared/instanceof";


export default class ExtensionContentScriptApiFacade implements IContentScriptApiFacade {
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
                    log.print(`Received setting is: `, data.$settings);
                    this.receiveSettings(data.$settings);
                    break;
            }
        }
    }
    private whitelistedDestinations:string[]
    private currentDomainOption:DomainOptionEnum

    private receiveSettings(settings:Partial<Settings>) {
        if (!isUndef(settings.whitelistedDestinations)) {
            this.whitelistedDestinations = settings.whitelistedDestinations;
        }
        if (!isUndef(settings.domainOption)) {
            this.currentDomainOption = settings.domainOption;
        }
    }

    originIsWhitelisted():boolean {
        return this.currentDomainOption === DomainOptionEnum.WHITELISTED;
    }
    destinationIsWhitelisted(destination:string):boolean {
        if (isUndef(this.whitelistedDestinations)) {
            // Settings are not received.
            return false;
        }
        return this.whitelistedDestinations.indexOf(destination) !== -1;
    }
    originIsSilenced():boolean {
        return this.currentDomainOption === DomainOptionEnum.SILENCED;
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
