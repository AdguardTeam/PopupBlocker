import ILoggedProxyService from '../proxy/ILoggedProxyService';

export function wrapIFrameSrc(externalWindow:Window, proxyService:ILoggedProxyService) {
    if (DEBUG) {
        // TODO make preprocessor plugin to cut these from beta and release builds
        const iframePType = externalWindow.HTMLIFrameElement.prototype;
        proxyService.wrapAccessor(iframePType, 'src'); // logging only
        proxyService.wrapAccessor(iframePType, 'srcdoc');
    }
}
