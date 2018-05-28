import * as ProxyService from './proxy/ProxyService';
import LoggedProxyService from './proxy/LoggedProxyService';
import { timeline } from './timeline/index';
import { wrapOpen } from './dom/open';
import { wrapClick } from './dom/click';
import { wrapDispatchEvent } from './dom/dispatchEvent';
import { wrapIFrameSrc } from './dom/HTMLIFrame';
import { wrapObjectData } from './dom/HTMLObject';
import { wrapDocumentWrite } from './dom/write';
import { wrapPreventDefault } from './dom/preventDefault';
import ChildContextInjector from './proxy/ChildContextInjector';

export default function main(window:Window, globalKey:string) {
    if (window.hasOwnProperty(globalKey)) {
        delete window[globalKey];
        return;
    } else {
        const main = (window:Window) => {
            ProxyService.$apply(window);
            const framePosition = timeline.onNewFrame(window);
            const loggedProxyService = new LoggedProxyService(timeline, framePosition);

            wrapOpen(window, loggedProxyService);
            wrapClick(window, loggedProxyService);
            wrapDispatchEvent(window, loggedProxyService);
            wrapIFrameSrc(window, loggedProxyService);
            wrapObjectData(window, loggedProxyService);
            wrapDocumentWrite(window, loggedProxyService);
            wrapPreventDefault(window, loggedProxyService);

            const injector = new ChildContextInjector(window, loggedProxyService, globalKey);
            injector.registerCallback(main);
        };
        main(window);
    }
}
