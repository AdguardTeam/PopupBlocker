/**
 * @fileoverview Alert controller interface.
 *
 * Its implementation must be different across platforms in order to mitigate various security issues.
 *
 *  1. Event handlers must check events' trustedness before calling privileged code.
 *     {@link https://palant.de/2017/11/11/on-web-extensions-shortcomings-and-their-impact-on-add-on-security}
 *
 *  2. When using web_accessible_resources on chrome, make sure that it cannot easily be
 *     accessed via xhr'ing to it, such as by using webRequest listeners.
 *
 *  3. When using web_accessible_resources on Firefox and Edge, make sure that the uri of such resource
 *     is not accessible from page DOM, otherwise it will make user's browser fingerprintable.
 *     {@link https://github.com/ghacksuserjs/ghacks-user.js/issues/227}
 *
 * Ideally, we should be able to freely use web_accessible_resource to inject heavy UI components such
 * as fonts memory-efficiently, but we have to implement workarounds as follows.
 *
 *    1. To create an alert, create an empty iframe under a closed shadow root.
 *       - If shadow dom is not supported, we fallback to creating the iframe as a direct child of <html>.
 *       - Shadow dom v1 can be enabled on FF>=58 via `dom.webcomponents.enabled` flag.
 *    2. Populate its content.
 *  2-1. For extensions, use `getURL` to link to heavy UI resources in a dynamically created stylesheets.
 *  2-2. For userscripts, use GM_getResourceURL instead.
 *       - To enjoy memory efficiency of this approach, AG needs implementation of my proposal
 *         {@link https://github.com/AdguardTeam/CoreLibs/issues/170}
 *       - Tampermonkey always uses `data:` uri, so there is no memory-wise gain.
 */

export interface AlertControllerInterface {
    createAlert(origDomain:string, destUrl:string):void

    onClose():void
    onPinClick():void
    onContinueBlocking():void
    onOptionChange(evt:Event):void

    onMouseEnter():void
    onMouseLeave():void
    onUserInteraction():void
}
