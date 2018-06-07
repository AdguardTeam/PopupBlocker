/// <reference path="../../../node_modules/closure-library.ts/closure-library.d.ts/all.d.ts"/>

import popupblockerUI from 'goog:popupblockerUI';
import popupblockerNotificationUI from 'goog:popupblockerNotificationUI';
import soydata_VERY_UNSAFE from 'goog:soydata.VERY_UNSAFE';
import { isUndef } from '../../shared/instanceof';
import * as log from '../../shared/debug';
import IFrameInjector from '../utils/IFrameInjector';
import FrameInjector from '../utils/FrameInjector';
import { concatStyle } from '../utils/ui_utils';
import CSSService from '../utils/CssService';
import TextSizeWatcher from '../utils/TextSizeWatcher';
import { functionBind } from '../../shared/protected_api';

const px = 'px';

const enum ToastState {
    NONE,
    WAXING,
    FULL,
    WANING
}

export default class ToastController {
    constructor(
        private cssService:CSSService,
        private defaultDuration?:number
    ) {
        this.updateIframePosition = functionBind.call(this.updateIframePosition, this);
        this.updateIframePositionOnLoad = functionBind.call(this.updateIframePositionOnLoad, this);
    }

    private $state:ToastState = ToastState.NONE;
    private stateTransitionTimer:number
    private currentDuration:number
    private toastEl:Element
    private textSizeWatcher:TextSizeWatcher

    private frameInjector:IFrameInjector

    private static TOAST_STYLE = RESOURCE_TOAST_CSS;

    private static TOAST_FRAME_STYLE = [
        "position", "fixed",
        "bottom",    15 + px,
        "width",     0 + px,
        "height",    0 + px,
        "border",   "none" ,
        "z-index",   String(-1 - (1 << 31))
    ]

    private static TRANSITION_DURATION = 300;

    showNotification(message:string, duration?:number) {
        // Stores duration of the current toast
        this.currentDuration = duration || this.defaultDuration;

        // Dismiss existing toast, if there was any.
        let prevState = this.$state;
        this.dismissCurrentNotification();

        // Attach toast Element
        let outerHTML = popupblockerUI.head({
            cssText: soydata_VERY_UNSAFE.ordainSanitizedHtml(this.cssService.getToastCSS()),
            preloadFonts: this.cssService.getToastPreloadFontURLs()
        });
        let toastHTML = popupblockerNotificationUI.toast({ message });
        let frameInjector = this.frameInjector = new FrameInjector();
        frameInjector.getFrameElement().style.cssText = concatStyle(ToastController.TOAST_FRAME_STYLE, false);

        frameInjector.addListener(() => {
            if (isUndef(this.frameInjector)) { return; }
            let toastHTML = popupblockerNotificationUI.toast({ message });
            let iframe = this.frameInjector.getFrameElement();
            let doc = iframe.contentDocument;
            doc.documentElement.innerHTML = outerHTML;
            doc.body.innerHTML = toastHTML;
            this.toastEl = doc.body.firstElementChild;
        });

        frameInjector.addListener(this.updateIframePositionOnLoad);

        frameInjector.addListener(() => {
            this.setState(
                prevState === ToastState.FULL || prevState === ToastState.WANING ?
                    ToastState.FULL :
                    ToastState.WAXING
            );
        });

        frameInjector.inject();
    }

    private updateIframePositionOnLoad() {
        this.updateIframePosition();
        const textSizeWatcher = this.textSizeWatcher = new TextSizeWatcher(this.toastEl);
        textSizeWatcher.addListener(this.updateIframePosition);
    }

    private updateIframePosition() {
        let { offsetWidth, offsetHeight } = <HTMLElement>this.toastEl.firstElementChild;
        let iframeStyle = this.frameInjector.getFrameElement().style;
        iframeStyle.left = `calc(50% - ${offsetWidth / 2}px)`;
        iframeStyle.width = offsetWidth + px;
        iframeStyle.height = offsetHeight + px;
    }

    dismissCurrentNotification() {
        let frameInjector = this.frameInjector;
        if (isUndef(frameInjector)) { return; }
        frameInjector.$destroy();
        clearTimeout(this.stateTransitionTimer);

        let textSizeWatcher = this.textSizeWatcher;
        if (isUndef(textSizeWatcher)) { return; }
        textSizeWatcher.$destroy();

        this.frameInjector = this.toastEl = this.stateTransitionTimer = this.textSizeWatcher = undefined;
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
        this.$state = state;
    }

}

declare const RESOURCE_TOAST_CSS:string;
