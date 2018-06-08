import OptionsController from "../../../ui/options/OptionsController";
import popupblockerOptionsUI from 'goog:popupblockerOptionsUI';
import popupblockerUserscriptOptionsUI from "goog:popupblockerUserscriptOptionsUI";
import { AllOptions } from "../../../storage/ISettingsDao";

export default class UserscriptOptionsController extends OptionsController {
    /**
     * To re-use template for extension options page, instead of specifying titles and footers
     * in templates for normal settings page and noinstalled page, we instead insert it via
     * JS here.
     *
     * (Alternatively, templates could be structured component-wise and these dependency issues
     *  may be addressed there, but it's not the case :P)
     */
    protected renderOuter() {
        super.renderOuter();
        // Set a special className "userscript-options-page" to enable styles for userscript
        // options page only.
        document.body.classList.add(goog.getCssName('userscript-options-page'));

        // insert footer and title
        let titleTemplate = popupblockerUserscriptOptionsUI.title();
        let loadingSubTitleTemplate = popupblockerUserscriptOptionsUI.loading_subtitle();
        let footerTemplate = popupblockerUserscriptOptionsUI.footer();

        let settingsRoot = this.settingsRoot; // `settingsRoot` is the first `.settings__in` node.
        settingsRoot.insertAdjacentHTML('afterbegin', titleTemplate + loadingSubTitleTemplate);
        settingsRoot.insertAdjacentHTML('afterend', footerTemplate);
    }

    /**
     * Removes "Please wait..." message set by renderOuter method.
     */
    protected renderInner() {
        let settingsRoot = this.settingsRoot;
        settingsRoot.removeChild(settingsRoot.lastElementChild);
        super.renderInner();
    }

    /**
     * `renderBody` sets `settingsRoot.innerHTML = '...'`, which erases title,
     * so we append it again.
     */
    protected renderBody(data:AllOptions) {
        super.renderBody(data);
        let titleTemplate = popupblockerUserscriptOptionsUI.title();
        this.settingsRoot.insertAdjacentHTML('afterbegin', titleTemplate);
    }

    private static userscriptIsLoaded() {
        return typeof GM_listValues == 'function';
    }

    initialize() {
        this.renderOuter();

        const onUserscriptLoad = () => {
            this.renderInner();
            this.settingsDao.enumerateOptions(this.renderBody);
        };

        // Wait for userscript to load; if it times out, render noinstalled page
        // otherwise, call renderInner and renderBody
        let pollScriptLoad = setInterval(() => {
            if (UserscriptOptionsController.userscriptIsLoaded()) {
                // Wait for GM_api exported to the global scope.
                clearInterval(pollScriptLoad);
                clearTimeout(onLoadTimeout);
                onUserscriptLoad();
            }
        });
        let onLoadTimeout = setTimeout(() => {
            clearInterval(pollScriptLoad);
            this.renderNoinstalledPage();
        }, UserscriptOptionsController.MAX_USERSCRIPT_WAITING_TIME);
    }

    private renderNoinstalledPage() {
        let settingsRoot = this.settingsRoot;

        // Remove previous subtitle (saying "Please wait, ....")
        settingsRoot.removeChild(settingsRoot.lastElementChild);

        // Append template for noinstalled page
        let noinstalledTemplate = popupblockerUserscriptOptionsUI.noinstalled();
        settingsRoot.insertAdjacentHTML('beforeend', noinstalledTemplate);
    }

    private static readonly MAX_USERSCRIPT_WAITING_TIME = 500 // 500 milliseconds
}
