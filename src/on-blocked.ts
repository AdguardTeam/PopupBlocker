import { adguard } from './page-script-namespace';
import pdfObjObserver from './observers/pdf-object-observer';
import examineTarget from './events/examine-target';
import { InterContextMessageHubInterface, IMessageHandler } from './messaging/InterContextMessageHubInterface';
import { MessageTypes } from './messaging/MessageTypes';
import { PopupContext } from './dom/open';

export default function onBlocked(popup_url:string, currentEvent:Event, popupContext?:PopupContext) {
    if (!adguard.contentScriptApiFacade.originIsSilenced()) {
        adguard.messageHub.trigger<IAlertData>(MessageTypes.SHOW_NOTIFICATION, {
            orig_domain: adguard.contentScriptApiFacade.domain,
            popup_url,
        }, adguard.messageHub.parent);
    } // Otherwise, we silently block popups
    pdfObjObserver.$start();
    if (currentEvent) { examineTarget(currentEvent, popup_url, popupContext); }
}

interface IAlertData {
    orig_domain:string,
    popup_url:string
}

class FrameAlertMessageHandler implements IMessageHandler<IAlertData> {
    constructor(
        private messageHub:InterContextMessageHubInterface,
    ) { }

    handleMessage(data:IAlertData) {
        this.messageHub.trigger<IAlertData>(MessageTypes.SHOW_NOTIFICATION, data, this.messageHub.parent);
    }
}

export function installAlertMessageTransferrer(messageHub:InterContextMessageHubInterface) {
    const handler:IMessageHandler<IAlertData> = messageHub.isTop ? {
        handleMessage(data:IAlertData) {
            adguard.contentScriptApiFacade.showAlert(data.orig_domain, data.popup_url);
        },
    } : new FrameAlertMessageHandler(messageHub);
    messageHub.on<IAlertData>(MessageTypes.SHOW_NOTIFICATION, handler);
}
