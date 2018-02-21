import BaseAlertController from "../../../../ui/alert/BaseAlertController";
import chrome from '../platform_namespace';

const getURL = chrome.runtime.getURL;

export default class ExtensionAlertController extends BaseAlertController {
    private static getURL = chrome.runtime.getURL;
    private alertStyle:string
    protected getAlertStyle() {
        if (typeof this.alertStyle === 'undefined') {
            this.alertStyle = RESOURCE_ARGS("ALERT_STYLE",
                "OPENSANS_REGULAR",     getURL('/assets/fonts/regular/OpenSans-Regular.woff'),
                "OPENSANS_SEMIBOLD",    getURL('/assets/fonts/semibold/OpenSans-Semibold.woff'),
                "OPENSANS_BOLD",        getURL('/assets/fonts/bold/OpenSans-Bold.woff')
            );
        }
        return this.alertStyle;
    }
    protected openSettingsPage() {
        chrome.runtime.openOptionsPage();
    }
}
