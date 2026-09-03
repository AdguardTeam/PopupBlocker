import ILoggedProxyService from '../proxy/ILoggedProxyService';

/**
 * Certain popunder scripts use <form> elements' target property to open a pop-under.
 * This is enabled on DEV version only for debugging purpose.
 *
 * @param externalWindow window whose prototypes are wrapped
 * @param proxyService proxy service used to wrap them
 */
export function wrapFormTarget(externalWindow:Window, proxyService:ILoggedProxyService) {
    if (DEBUG) {
        // TODO make preprocessor plugin to cut these from beta and release builds
        proxyService.wrapAccessor(externalWindow.HTMLFormElement.prototype, 'target');
    }
}
