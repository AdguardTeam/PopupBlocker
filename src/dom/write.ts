import ILoggedProxyService from '../proxy/ILoggedProxyService';

/**
 * DEV channel only
 */
export function wrapDocumentWrite(window:Window, proxyService:ILoggedProxyService) {
    if (DEBUG) {
        // TODO make preprocessor plugin to cut these from beta and release builds
        const documentPrototype = window.Document.prototype;
        proxyService.wrapMethod(documentPrototype, 'write');
        proxyService.wrapMethod(documentPrototype, 'writeIn');
    }
}
