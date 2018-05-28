import ILoggedProxyService from "../proxy/ILoggedProxyService";

/**
 * DEV channel only
 */
export function wrapDocumentWrite(window:Window, proxyService:ILoggedProxyService) {
    // @ifdef DEBUG
    const documentPrototype = window.Document.prototype;
    proxyService.wrapMethod(documentPrototype, 'write');
    proxyService.wrapMethod(documentPrototype, 'writeIn');
    // @endif
}