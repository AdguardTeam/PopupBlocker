import popupblockerNotificationUI from 'goog:popupblockerNotificationUI';
import { isUndef } from '../../../shared/instanceof';

export default class ToastController {
    constructor(
        private root:Element,
        private defaultDuration?:number
    ) { }
    private toastEl:Element
    private dismissTimer:number

    showNotification(message:string, duration?:number) {
        let toastHTML = popupblockerNotificationUI.toast({ message });

        // Dismiss existing toast, if there was any.
        this.dismissCurrentNotification();

        // Attach toast Element
        this.root.insertAdjacentHTML('beforeend', toastHTML);
        this.toastEl = this.root.lastElementChild; // The toast markup has a single root.

        // Schedule auto-dismissal
        this.dismissTimer = setTimeout(() => {
            this.dismissCurrentNotification()
        }, duration || this.defaultDuration);
    }
    dismissCurrentNotification() {
        if (isUndef(this.toastEl)) { return; }
        let toastEl = this.toastEl;
        let parentEl = toastEl.parentElement;
        if (parentEl) {
            parentEl.removeChild(toastEl);
        }
        clearTimeout(this.dismissTimer);
        this.toastEl = this.dismissTimer = undefined;
    }
}
