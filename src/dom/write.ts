import ILoggedProxyService from '../proxy/ILoggedProxyService';

/**
 * DEV channel only
 *
 * @param externalWindow window whose prototypes are wrapped
 * @param proxyService proxy service used to wrap them
 */
export function wrapDocumentWrite(externalWindow:Window, proxyService:ILoggedProxyService) {
    if (DEBUG) {
        // TODO make preprocessor plugin to cut these from beta and release builds
        const documentPrototype = externalWindow.Document.prototype;
        proxyService.wrapMethod(documentPrototype, 'write');
        proxyService.wrapMethod(documentPrototype, 'writeIn');
    }
}
