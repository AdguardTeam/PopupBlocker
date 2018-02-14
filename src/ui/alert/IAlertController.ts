/**
 * @fileoverview Alert controller interface.
 * 
 * Its implementation must be different across platforms in order to mitigate various security issues.
 * 
 *  1. Event handlers must check events' trustedness before calling privileged code.
 *     {@link https://palant.de/2017/11/11/on-web-extensions-shortcomings-and-their-impact-on-add-on-security}
 * 
 *  2. Should not use web_accessible_resources on chrome, because using it exposes
 *     an easy way of detecting presence of an extension via extension id.
 *     Firefox and Edge mitigates this via creating unique id for each extension installation.
 *     FIXME: link chrome issue tracker if there is an ongoing discussion about this issue.
 * 
 *  3. When using web_accessible_resources on Firefox and Edge, make sure that the uri of such resource
 *     is not accessible from page DOM, otherwise it will make user's browser fingerprintable.
 *     {@link https://github.com/ghacksuserjs/ghacks-user.js/issues/227}
 *  
 * Ideally, we should be able to freely use web_accessible_resource to inject heavy UI components such
 * as fonts memory-efficiently, but we have to implement workarounds as follows.
 * 
 * For extensions:
 * 
 *  1. Register a content script to run only on `about:` schemes, and install a message listener in it.
 *  2. To create an alert, create an empty frame under closed shadow dom, populate its content, and
 *     bind event listeners.
 *     - If shadow dom is not supported, we fallback to creating the iframe as a direct child of <html>.
 *     - Shadow dom v1 can be enabled on FF>=58 via `dom.webcomponents.enabled` flag.
 *  3. postMessage's to the frame, and the the listener in its contentscript passes a message to 
 *     the background script.
 *  4. the background script calls `tabs.insertCSS` in `onMessage` handler.
 * 
 * For userscripts:
 * 
 *  1. To create an alert, create it under a closed shadow root as well.
 *  2. In populating its content style, dynamically create a cssText, and use GM_getResourceURL in it
 *     for heavy resources such as fonts.
 *     - To enjoy memory efficiency of this approach, AG needs implementation of my proposal
 *       {@link https://github.com/AdguardTeam/CoreLibs/issues/170}
 *     - Tampermonkey always uses `data:` uri, so there is no memory-wise gain.
 */

export default interface IAlertController {
    createAlert(origDomain:string, destUrl:string):void
}
