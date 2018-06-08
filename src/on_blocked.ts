import adguard from './page_script_namespace';
import pdfObjObserver from './observers/pdf_object_observer';
import examineTarget from './events/examine_target';
import IInterContextMessageHub, { IMessageHandler } from './messaging/IInterContextMessageHub';
import { MessageTypes } from './messaging/MessageTypes';

export default function onBlocked(popup_url:string, currentEvent:Event) {
    if (!adguard.contentScriptApiFacade.originIsSilenced()) {
        adguard.messageHub.trigger<IAlertData>(MessageTypes.SHOW_NOTIFICATION, {
            orig_domain: adguard.contentScriptApiFacade.domain,
            popup_url
        }, adguard.messageHub.parent);
    } // Otherwise, we silently block popups
    pdfObjObserver.$start();
    if (currentEvent) { examineTarget(currentEvent, popup_url); }
}

interface IAlertData {
    orig_domain:string,
    popup_url:string
}

export function installAlertMessageTransferrer(messageHub:IInterContextMessageHub) {
    const handler:IMessageHandler<IAlertData> = messageHub.isTop ? {
        handleMessage(data:IAlertData) {
            adguard.contentScriptApiFacade.showAlert(data.orig_domain, data.popup_url);
        }
    } : new FrameAlertMessageHandler(messageHub);
    messageHub.on<IAlertData>(MessageTypes.SHOW_NOTIFICATION, handler);
}

class FrameAlertMessageHandler implements IMessageHandler<IAlertData> {
    constructor(
        private messageHub:IInterContextMessageHub
    ) { }
    handleMessage(data:IAlertData, source?:Window) {
        this.messageHub.trigger<IAlertData>(MessageTypes.SHOW_NOTIFICATION, data, this.messageHub.parent);
    }
}
