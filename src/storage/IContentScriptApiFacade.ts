/**
 * @fileoverview ContentScriptApi class serves as a mean for page script to call apis
 * only available in content script.
 * 
 * Implementation details:
 *   Extensions:  uses `window.postMessage`.
 *   Userscripts: Constructed in content script and passed directly to page script via temporary
 *                global variable. For FF Greasemonkey, its public methods are exported with
 *                FF export helpers (exportFunction, cloneInto).
 */
export default interface IContentScriptApiFacade {
    originIsWhitelisted(origin?:string):boolean
    originIsSilenced():boolean

    showAlert(orig_domain:string, popup_url:string):void
    $getMessage(messageId:string):string
    domain:string
}
