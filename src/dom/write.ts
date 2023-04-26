import ILoggedProxyService from '../proxy/ILoggedProxyService';

/**
 * DEV channel only
 */
export function wrapDocumentWrite(externalWindow:Window, proxyService:ILoggedProxyService) {
    if (DEBUG) {
        // TODO make preprocessor plugin to cut these from beta and release builds
        const documentPrototype = externalWindow.Document.prototype;
        proxyService.wrapMethod(documentPrototype, 'write');
        proxyService.wrapMethod(documentPrototype, 'writeIn');
    }
}
