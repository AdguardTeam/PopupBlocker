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

export function main(window:Window, globalKey:string) {
    // eslint-disable-next-line no-prototype-builtins
    if (window.hasOwnProperty(globalKey)) {
        // eslint-disable-next-line no-param-reassign
        delete window[globalKey];
    } else {
        const initMsgHub = (window:Window) => {
            adguard.messageHub = new InterContextMessageHub(window);
            installAlertMessageTransferrer(adguard.messageHub);
            installDispatchMouseEventMessageTransferrer(adguard.messageHub);
        };

        const initMsgHubInIframe = (window:Window) => {
            const messageHub = new InterContextMessageHub(window, adguard.messageHub);
            installAlertMessageTransferrer(messageHub);
            installDispatchMouseEventMessageTransferrer(messageHub);
        };

        const initProxy = (window:Window) => {
            ProxyService.$apply(window);
            const framePosition = timeline.onNewFrame(window); // Will be `0` for main fame
            const loggedProxyService = new LoggedProxyService(timeline, framePosition);

            wrapOpen(window, loggedProxyService);
            wrapClick(window, loggedProxyService);
            wrapDispatchEvent(window, loggedProxyService);
            wrapIFrameSrc(window, loggedProxyService);
            wrapObjectData(window, loggedProxyService);
            wrapDocumentWrite(window, loggedProxyService);
            wrapPreventDefault(window, loggedProxyService);

            const injector = new ChildContextInjector(window, loggedProxyService, globalKey);
            injector.registerCallback(initProxy);
            injector.registerCallback(initMsgHubInIframe);
        };

        initProxy(window);
        initMsgHub(window);
    }
}
