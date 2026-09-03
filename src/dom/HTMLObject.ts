import ILoggedProxyService from '../proxy/ILoggedProxyService';

/**
 * This is DEV version only.
 *
 * @param externalWindow window whose prototypes are wrapped
 * @param proxyService proxy service used to wrap them
 */
export function wrapObjectData(externalWindow:Window, proxyService: ILoggedProxyService) {
    if (DEBUG) {
        // TODO make preprocessor plugin to cut these from beta and release builds
        proxyService.wrapAccessor(externalWindow.HTMLObjectElement.prototype, 'data');
    }
}
