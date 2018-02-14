import BaseAlertController from "../../../ui/alert/BaseAlertController";

export default class UserscriptAlertController extends BaseAlertController {
    private alertStyle:string
    protected getAlertStyle() {
        if (typeof this.alertStyle === 'undefined') {
            this.alertStyle = RESOURCE_ARGS("ALERT_STYLE",
                "OPENSANS_REGULAR",     GM_getResourceURL('OpenSans_Regular'),
                "OPENSANS_SEMIBOLD",    GM_getResourceURL('OpenSans_SemiBold'),
                "OPENSANS_BOLD",        GM_getResourceURL('OpenSans_Bold')
            );
        }
        return this.alertStyle;
    }

    private static OPTIONS_PAGE_URL = 'https://adguardteam.github.io/PopupBlocker/options.html';
    private optionsPageName = `__pb_${Math.random()}`;
    protected openSettingsPage() {
        open(UserscriptAlertController.OPTIONS_PAGE_URL, this.optionsPageName);
    }
}
