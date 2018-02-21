import II18nService from "./II18nService";

export default class I18nService implements II18nService {
    constructor(
        public $getMessage:(messageId:string)=>string
    ) { }
    getMsg(messageId:string, opt_values:stringmap<any>) {
        let str = this.$getMessage(messageId);
        if (opt_values) {
            str = str.replace(/\{\$([^}]+)}/g, (match, key) => {
                return (opt_values != null && key in opt_values) ? opt_values[key] : match;
            });
        }
        return str;
    }
}
