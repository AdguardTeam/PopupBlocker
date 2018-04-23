import BaseAlertController from "../../../ui/controllers/alert/BaseAlertController";

export default class UserscriptAlertController extends BaseAlertController {
    private static OPTIONS_PAGE_URL = 'https://adguardteam.github.io/PopupBlocker/options.html';
    private static OPTIONS_PAGE_NAME = "__popupBlocker_options_page__";
    protected openSettingsPage() {
        window.open(
            UserscriptAlertController.OPTIONS_PAGE_URL,
            UserscriptAlertController.OPTIONS_PAGE_NAME
        );
    }
}
