export default interface II18nService {
    /**
     * Analogous to chrome.i18n.getMessage.
     */
    $getMessage(nessageId:string):string
    /**
     * Replace placeholders contained in a string `message` (usually obtained via getMessage
     * call) with respect to a `context` dictionary.
     * 
     * @param htmlSafe indicates that strings that are to be replaced with should be escaped
     * so that they can used as a value of `innerHTML` without allowing remote code execution
     * or breaking html structure.
     */
    formatText(message:string, context:StringMap, htmlSafe?:boolean):string
    /**
     * Apply translation on a DOM node, based on a scheme described in
     * {@link https://github.com/AdguardTeam/PopupBlocker/pull/22}.
     */
    applyTranslation(root:Element, context:StringMap):void
}
