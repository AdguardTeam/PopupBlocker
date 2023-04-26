/* eslint-disable @typescript-eslint/no-shadow */
import * as ProxyService from './proxy/ProxyService';
import LoggedProxyService from './proxy/LoggedProxyService';
import { timeline } from './timeline/Timeline';
import { wrapOpen } from './dom/open';
import { wrapClick } from './dom/click';
import { wrapDispatchEvent } from './dom/dispatchEvent';
import { wrapIFrameSrc } from './dom/HTMLIFrame';
import { wrapObjectData } from './dom/HTMLObject';
import { wrapDocumentWrite } from './dom/write';
import { wrapPreventDefault } from './dom/preventDefault';
import ChildContextInjector from './proxy/ChildContextInjector';
import { installAlertMessageTransferrer } from './on-blocked';
import { installDispatchMouseEventMessageTransferrer } from './events/examine-target';
import InterContextMessageHub from './messaging/InterContextMessageHub';
import { adguard } from './page-script-namespace';

export function main(externalWindow: Window, globalKey:string) {
    // eslint-disable-next-line no-prototype-builtins
    if (externalWindow.hasOwnProperty(globalKey)) {
        // eslint-disable-next-line no-param-reassign
        delete externalWindow[globalKey];
    } else {
        const initMsgHub = (externalWindow: Window) => {
            adguard.messageHub = new InterContextMessageHub(externalWindow);
            installAlertMessageTransferrer(adguard.messageHub);
            installDispatchMouseEventMessageTransferrer(adguard.messageHub);
        };

        const initMsgHubInIframe = (externalWindow: Window) => {
            const messageHub = new InterContextMessageHub(externalWindow, adguard.messageHub);
            installAlertMessageTransferrer(messageHub);
            installDispatchMouseEventMessageTransferrer(messageHub);
        };

        const initProxy = (externalWindow: Window) => {
            ProxyService.$apply(externalWindow);
            const framePosition = timeline.onNewFrame(externalWindow); // Will be `0` for main fame
            const loggedProxyService = new LoggedProxyService(timeline, framePosition);

            wrapOpen(externalWindow, loggedProxyService);
            wrapClick(externalWindow, loggedProxyService);
            wrapDispatchEvent(externalWindow, loggedProxyService);
            wrapIFrameSrc(externalWindow, loggedProxyService);
            wrapObjectData(externalWindow, loggedProxyService);
            wrapDocumentWrite(externalWindow, loggedProxyService);
            wrapPreventDefault(externalWindow, loggedProxyService);

            const injector = new ChildContextInjector(externalWindow, loggedProxyService, globalKey);
            injector.registerCallback(initProxy);
            injector.registerCallback(initMsgHubInIframe);
        };

        initProxy(externalWindow);
        initMsgHub(externalWindow);
    }
}
