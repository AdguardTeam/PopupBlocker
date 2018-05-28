import ILoggedProxyService from '../proxy/ILoggedProxyService';


export function wrapIFrameSrc(window:Window, proxyService:ILoggedProxyService) {
    const iframePType = window.HTMLIFrameElement.prototype;
    // @ifdef DEBUG    
    proxyService.wrapAccessor(iframePType, 'src'); // logging only
    proxyService.wrapAccessor(iframePType, 'srcdoc');
    // @endif
}
