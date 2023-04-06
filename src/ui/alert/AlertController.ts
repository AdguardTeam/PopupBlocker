import { ISettingsDao } from '../../storage/SettingsDao';
import ToastController from '../toast/ToastController';
import { AlertView, AlertViewInterface } from './AlertView';
import { AlertControllerInterface } from './AlertControllerInterface';
import { translator } from '../../i18n';
import { OptionName } from '../../storage/Option';
import {
    isUndef,
    isNumber,
    functionBind,
    create,
    setTimeout,
} from '../../shared';

const enum AlertStates {
    NONE,
    EXPANDED,
    COLLAPSED,
}

interface IAlertData {
    origDomain:string,
    destUrl:string
}

export class AlertController implements AlertControllerInterface {
    /**
     * Controller state provided from external sources
     */
    private domainToPopupCount = create(null);

    private currentAlertData:IAlertData;

    private renderedAlertData:IAlertData;

    /**
     * Controller internal states
     */
    private $state:AlertStates = AlertStates.NONE;

    private stateTransitionTimer:number;

    private timerStart:number;

    private remainingAfterMouseLeave:number;

    private remainingTimeout:number;

    /**
     * Configuration constants
     */
    private static STATE_TRANSITION_TIMEOUT = 1000 * 10; // 10 sec

    private static HOVER_TIMEOUT_INCR = 1000 * 2; // 2 sec

    private static TOAST_DURATION = 1000 * 2; // 2 seconds

    /**
     * Dependent classes
     */
    private toastController:ToastController;

    private alertView:AlertViewInterface;

    constructor(
        private settingsDao:ISettingsDao,
        // Platform-specific functionalities are injected via ctor
        private $openOptionsPage:()=>void,
    ) {
        this.$expand = functionBind.call(this.$expand, this);
        this.$collapse = functionBind.call(this.$collapse, this);
        this.$destroy = functionBind.call(this.$destroy, this);
        this.notifyAboutSavedSettings = functionBind.call(this.notifyAboutSavedSettings, this);

        this.toastController = new ToastController(AlertController.TOAST_DURATION);
    }

    /**
     * Not providing @param callback means that a currently scheduled transition will be canceled.
     */
    private scheduleTransition(callback?:()=>void, timeout?:number) {
        clearTimeout(this.stateTransitionTimer);
        if (callback) {
            this.stateTransitionTimer = setTimeout(callback, timeout);
            this.timerStart = Date.now();
            this.remainingTimeout = timeout;
        } else {
            this.stateTransitionTimer = this.timerStart = this.remainingTimeout = null;
        }
    }

    /**
     * State transition handlers
     */
    private $expand() {
        this.alertView.$expand();
        this.$state = AlertStates.EXPANDED;
        // Schedules auto-collapse.
        this.scheduleTransition(this.$collapse, AlertController.STATE_TRANSITION_TIMEOUT);
        this.remainingAfterMouseLeave = null;
    }

    private $collapse() {
        this.alertView.$collapse();
        this.$state = AlertStates.COLLAPSED;
        // Schedules auto-destroy.
        this.scheduleTransition(this.$destroy, AlertController.STATE_TRANSITION_TIMEOUT);
        this.remainingAfterMouseLeave = null;
    }

    private $destroy() {
        if (this.alertView) {
            this.alertView.$destroy();
            this.alertView = null;
        }
        this.$state = AlertStates.NONE;
        this.scheduleTransition();
        this.remainingAfterMouseLeave = null;
    }

    /**
     * Public methods
     */
    createAlert(origDomain:string, destUrl:string) {
        const { domainToPopupCount } = this;
        const numPopup:number = isUndef(domainToPopupCount[origDomain])
            ? (domainToPopupCount[origDomain] = 1)
            // eslint-disable-next-line no-plusplus
            : ++domainToPopupCount[origDomain];

        // Initialize view when necessary
        if (!this.alertView) {
            this.alertView = new AlertView(this);
        }

        const alertData = { origDomain, destUrl };
        this.currentAlertData = alertData;
        this.alertView.render(numPopup, origDomain, destUrl, () => {
            this.renderedAlertData = alertData;
        });

        switch (this.$state) {
            case AlertStates.NONE:
                // If it is a first alert, start in an expanded state
                // The View will render the alert in an expanded state in this case.
                this.$state = AlertStates.EXPANDED;
                this.scheduleTransition(this.$collapse, AlertController.STATE_TRANSITION_TIMEOUT);
                break;
            case AlertStates.EXPANDED:
                // If a new alert has arrived while it is in an expanded state,
                // resets the timer.
                this.scheduleTransition(this.$collapse, AlertController.STATE_TRANSITION_TIMEOUT);
                break;
            default:
                break;
            // If a new alert has arrived while it is in a collpased state,
            // do nothing.
        }
    }

    onMouseEnter() {
        // Only do the logic of postponing state transition when there is
        // an ongoing timer.
        if (!isNumber(this.stateTransitionTimer)) { return; }
        this.remainingAfterMouseLeave = this.remainingTimeout - (Date.now() - this.timerStart);
        this.scheduleTransition();
    }

    onMouseLeave() {
        if (!isNumber(this.remainingAfterMouseLeave)) { return; }
        // The alert should not be collapsed within 2 sec of of mouseleave event.
        this.scheduleTransition(
            this.$state === AlertStates.EXPANDED ? this.$collapse : this.$destroy,
            Math.max(
                this.remainingAfterMouseLeave,
                AlertController.HOVER_TIMEOUT_INCR,
            ),
        );
        this.remainingAfterMouseLeave = null;
    }

    onClose() {
        this.$collapse();
    }

    onPinClick() {
        switch (this.$state) {
            case AlertStates.COLLAPSED:
                this.$expand();
                break;
            case AlertStates.EXPANDED:
                this.$collapse();
                break;
            default: break;
        }
    }

    onContinueBlocking() {
        this.$destroy();
    }

    onOptionChange(evt:Event) {
        const select = <HTMLSelectElement>evt.target;
        const selectedValue = select.value;
        switch (selectedValue) {
            case '1':
                this.settingsDao.setListItem(
                    OptionName.Allowed,
                    this.renderedAlertData.origDomain,
                    this.notifyAboutSavedSettings,
                );
                break;
            case '2':
                this.settingsDao.setListItem(
                    OptionName.Silenced,
                    this.renderedAlertData.origDomain,
                    this.notifyAboutSavedSettings,
                );
                break;
            case '3':
                this.$openOptionsPage();
                this.onOptionChangeOperationCompletion();
                break;
            case '4':
                window.open(this.renderedAlertData.destUrl, '_blank');
                this.onOptionChangeOperationCompletion();
                break;
            default: break;
        }
        evt.preventDefault();
    }

    onUserInteraction() {
        this.scheduleTransition();
    }

    private onOptionChangeOperationCompletion() {
        this.$destroy();
    }

    private notifyAboutSavedSettings() {
        const { toastController } = this;
        if (toastController) {
            toastController.showNotification(translator.getMessage('settings_saved'));
        }
        this.onOptionChangeOperationCompletion();
    }
}
