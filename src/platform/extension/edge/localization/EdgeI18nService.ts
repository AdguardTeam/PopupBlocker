import I18nService from "../../../../localization/I18nService";

/**
 * Edge extension api does not replace `$$` to `$` in internationalized messages.
 * Since there is no way to obtain a single `$` from the api, we have to replace it
 * from an overridden `getMessage` method.
 */
export default class EdgeI18nService extends I18nService {
    private static reDoubleDollarMark:RegExp = /\$\$/g;
    constructor(getMessage:(messageId:string)=>string) {
        super(getMessage);
        this.$getMessage = (messageId:string):string => {
            return getMessage(messageId).replace(EdgeI18nService.reDoubleDollarMark, '$');
        }
    }
}
