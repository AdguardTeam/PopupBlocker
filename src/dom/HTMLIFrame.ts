import ILoggedProxyService from '../proxy/ILoggedProxyService';

export function wrapIFrameSrc(window:Window, proxyService:ILoggedProxyService) {
    if (DEBUG) {
        // TODO make preprocessor plugin to cut these from beta and release builds
        const iframePType = window.HTMLIFrameElement.prototype;
        proxyService.wrapAccessor(iframePType, 'src'); // logging only
        proxyService.wrapAccessor(iframePType, 'srcdoc');
    }
}
