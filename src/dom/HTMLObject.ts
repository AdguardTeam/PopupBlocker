import ILoggedProxyService from '../proxy/ILoggedProxyService';

/**
 * This is DEV version only.
 */
export function wrapObjectData(externalWindow:Window, proxyService: ILoggedProxyService) {
    if (DEBUG) {
        // TODO make preprocessor plugin to cut these from beta and release builds
        proxyService.wrapAccessor(externalWindow.HTMLObjectElement.prototype, 'data');
    }
}
