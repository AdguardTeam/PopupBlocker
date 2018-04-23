export default interface II18nService {
    /**
     * Analogous to chrome.i18n.getMessage.
     */
    $getMessage(messageId:string):string
    /**
     * Analogous to goog.getMsg.
     * {@link https://github.com/google/closure-library/blob/master/closure/goog/base.js#L1782}
     */
    getMsg(messageId:string, opt_values:stringmap<number|string>)
}
