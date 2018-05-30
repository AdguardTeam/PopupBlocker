import ILoggedProxyService from '../proxy/ILoggedProxyService';

/**
 * Certain popunder scripts use <form> elements' target property to open a pop-under.
 * This is enabled on DEV version only for debugging purpose.
 */
export function wrapFormTarget(window:Window, proxyService:ILoggedProxyService) {
    // @ifdef DEBUG
    proxyService.wrapAccessor(window.HTMLFormElement.prototype, 'target');
    // @endif
}
