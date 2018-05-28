import ILoggdProxyService from '../proxy/ILoggedProxyService';
import ILoggedProxyService from '../proxy/ILoggedProxyService';

/**
 * This is DEV version only.
 */
export function wrapObjectData(window:Window, proxyService: ILoggedProxyService) {
    // @ifdef DEBUG
    proxyService.wrapAccessor(window.HTMLObjectElement.prototype, 'data');
    // @endif
}
