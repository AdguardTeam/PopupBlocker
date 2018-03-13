import BaseAlertController from "../../../ui/alert/BaseAlertController";

export default class UserscriptAlertController extends BaseAlertController {
    private static OPTIONS_PAGE_URL = 'https://adguardteam.github.io/PopupBlocker/options.html';
    private optionsPageName = `__pb_${Math.random()}`;
    protected openSettingsPage() {
        window.open(UserscriptAlertController.OPTIONS_PAGE_URL, this.optionsPageName);
    }
}
