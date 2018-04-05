/// <reference path="../../../../node_modules/closure-library.ts/closure-library.d.ts/all.d.ts"/>

import popupblockerNotificationUI from 'goog:popupblockerNotificationUI';
import { isUndef } from '../../../shared/instanceof';

const enum ToastState {
    NONE,
    WAXING,
    FULL,
    WANING
}

export default class ToastController {
    constructor(
        private root:Element,
        private defaultDuration?:number
    ) { }

    private state:ToastState = ToastState.NONE;
    private stateTransitionTimer:number;
    private currentDuration:number
    private toastEl:Element

    private static TRANSITION_DURATION = 300;

    showNotification(message:string, duration?:number) {
        // Stores duration of the current toast
        this.currentDuration = duration || this.defaultDuration;

        // Dismiss existing toast, if there was any.
        this.dismissCurrentNotification();
        let prevState = this.state;

        // Attach toast Element
        let toastHTML = popupblockerNotificationUI.toast({ message });
        this.root.insertAdjacentHTML('beforeend', toastHTML);
        this.toastEl = this.root.lastElementChild; // The toast markup has a single root.

        this.setState(
            prevState === ToastState.FULL || prevState === ToastState.WANING ?
                ToastState.FULL :
                ToastState.WAXING
        );
    }

    dismissCurrentNotification() {
        if (isUndef(this.toastEl)) { return; }
        let toastEl = this.toastEl;
        let parentEl = toastEl.parentElement;
        if (parentEl) {
            parentEl.removeChild(toastEl);
        }
        clearTimeout(this.stateTransitionTimer);
        this.toastEl = this.stateTransitionTimer = undefined;
    }

    private setState(state:ToastState) {
        clearTimeout(this.stateTransitionTimer);
        switch (state) {
            case ToastState.WAXING:
                requestAnimationFrame(() => {
                    this.toastEl.classList.add(goog.getCssName('toast--active'));
                });
                this.stateTransitionTimer = setTimeout(() => {
                    this.setState(ToastState.FULL);
                }, ToastController.TRANSITION_DURATION);
                break;
            case ToastState.FULL:
                this.toastEl.classList.add(goog.getCssName('toast--active'));
                this.stateTransitionTimer = setTimeout(() => {
                    this.setState(ToastState.WANING);
                }, this.currentDuration);
                break;
            case ToastState.WANING:
                this.toastEl.classList.remove(goog.getCssName('toast--active'));
                this.stateTransitionTimer = setTimeout(() => {
                    this.setState(ToastState.NONE);
                }, ToastController.TRANSITION_DURATION);
                break;
            case ToastState.NONE:
                this.dismissCurrentNotification();
                this.stateTransitionTimer = undefined;
                break;
        }
        this.state = state;
    }
    
}
