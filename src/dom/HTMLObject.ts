import ILoggedProxyService from '../proxy/ILoggedProxyService';

/**
 * This is DEV version only.
 */
export function wrapObjectData(window:Window, proxyService: ILoggedProxyService) {
    if (DEBUG) {
        // TODO make preprocessor plugin to cut these from beta and release builds
        proxyService.wrapAccessor(window.HTMLObjectElement.prototype, 'data');
    }
}
