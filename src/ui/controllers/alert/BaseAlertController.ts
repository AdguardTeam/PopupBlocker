/// <reference path="../../../../node_modules/closure-library.ts/closure-library.d.ts/all.d.ts"/>
/// <reference path="../../../../node_modules/closure-tools-helper/soyutils.d.ts"/>

import ISettingsDao from "../../../storage/ISettingsDao";
import IAlertController from "./IAlertController";
import { trustedEventListener, getByClsName, bind, concatStyle } from "../../ui_utils";
import { isUndef } from "../../../shared/instanceof";
import { shadowDomV1Support } from '../../../shared/dom';
import popupblockerUI from 'goog:popupblockerUI';
import soydata_VERY_UNSAFE from 'goog:soydata.VERY_UNSAFE';
import ToastController from "../toast/ToastController";
import adguard from '../../../content_script_namespace';
import FrameInjector from "../utils/FrameInjector";
import IFrameInjector from "../utils/IFrameInjector";
import CSSService from "../utils/CssService";
import { DomainOptionEnum } from "../../../storage/storage_data_structure";

const px = 'px';

/**************************************************************************************************/

/**
 * These magic numbers are dictated in the CSS.
 * These are base of position calculation; There are other constants that are
 * dictated in the CSS such as the width of the alert, but we instead read it from
 * `HTMLElement.offset***` api to reduce coupling with CSS.
 */
const PIN_TOP = 50;
const PIN_RIGHT = 50;
const ALERT_TOP_REL_PIN = -37;
const ALERT_RIGHT_REL_PIN = 50;
/**
 * Specified in styles as box-shadow: 0 0 10px 3px
 * https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow#<blur-radius>
 */
const BLUR_OFFSET = 10 / 2 + 3;

const PIN_OFFSET_RIGHT = BLUR_OFFSET;
const IFRAME_RIGHT = PIN_RIGHT - PIN_OFFSET_RIGHT;

const PIN_OFFSET_TOP_COLLAPSED = BLUR_OFFSET;
const IFRAME_TOP_COLLAPSED = PIN_TOP - PIN_OFFSET_TOP_COLLAPSED;

const ALERT_OFFSET_TOP_EXPANDED = BLUR_OFFSET;
const PIN_OFFSET_TOP_EXPANDED = ALERT_OFFSET_TOP_EXPANDED - ALERT_TOP_REL_PIN;
const IFRAME_TOP_EXPANDED = PIN_TOP - PIN_OFFSET_TOP_EXPANDED;

/**************************************************************************************************/

export default abstract class BaseAlertController implements IAlertController {

    protected abstract openSettingsPage():void

    private domainToPopupCount:stringmap<number> = Object.create(null);

    private origDomain:string
    private destUrl:string

    private collapsed:boolean

    private frameDoc:HTMLDocument
    private alertRoot:HTMLElement
    private pinRoot:HTMLElement

    private iframeWidth:number
    private iframeHeight:number

    private toastController:ToastController
    private static TOAST_DURATION = 2 * 1000 // 2 seconds


    constructor(
        private settingsDao:ISettingsDao,
        private cssService:CSSService
    ) {
        // FrameInjector takes care of event's trusted-ness.
        this.initializeIframe           = bind.call(this.initializeIframe, this);
        this.notifyAboutSavedSettings   = bind.call(this.notifyAboutSavedSettings, this);

        this.initializeIframe           = trustedEventListener(this.initializeIframe, this);
        this.onCloseClick               = trustedEventListener(this.onCloseClick, this);
        this.onPinClick                 = trustedEventListener(this.onPinClick, this);
        this.onContinueBlockingClick    = trustedEventListener(this.onContinueBlockingClick, this);
        this.onOptionChange             = trustedEventListener(this.onOptionChange, this);

        this.toastController = new ToastController(
            this.cssService,
            BaseAlertController.TOAST_DURATION
        );
    }

    private static initialAlertFrameStyle = [
        "position", "fixed",
        "right",     0 + px,
        "top",       0 + px,
        "border",   "none" ,
        "z-index",   String(-1 - (1 << 31))
    ];

    private frameInjector:IFrameInjector;

    private appendIframe() {
        let frameInjector = this.frameInjector = new FrameInjector();

        // Add `load` event listeners.
        frameInjector.addListener(this.initializeIframe)

        // Set inline style for the frame.
        /** @todo Abstract this operation from FrameInjector, remove `getFrameElement` */
        let iframe = frameInjector.getFrameElement();
        iframe.style.cssText = concatStyle(BaseAlertController.initialAlertFrameStyle, false);
        this.iframeWidth = this.iframeHeight = 0;
        iframe.style.width = iframe.style.height = 0 + px;

        // Append to the DOM.
        frameInjector.inject();
    }

    createAlert(origDomain:string, destUrl:string) {
        if (isUndef(this.domainToPopupCount[origDomain])) {
            this.domainToPopupCount[origDomain] = 1;
        } else {
            this.domainToPopupCount[origDomain]++;
        }
        this.origDomain = origDomain;
        this.destUrl = destUrl;

        if (!this.frameInjector) {
            this.appendIframe();
        } else {
            this.updateIframeContent();
        }
    }

    private toggleCollapse() {
        this.alertRoot.classList.toggle(goog.getCssName('alert--show'));
        this.collapsed = !this.collapsed;
        this.updatePosition();
    }

    private updatePinRootHeight() {
        let pinOffsetTop = this.collapsed ? PIN_OFFSET_TOP_COLLAPSED : PIN_OFFSET_TOP_EXPANDED;
        this.pinRoot.style.top = pinOffsetTop + px;
    }

    private updateIframePosition() {
        let iframeStyle = this.frameInjector.getFrameElement().style;

        let { offsetLeft, offsetTop, offsetHeight } = (this.collapsed ? this.pinRoot : this.alertRoot);
        // Adjusts iframe width and height so that the bottom left corner of the element
        // (pinRoot in collapsed, alertRoot in un-collapsed mode) plus its shadow fits in the iframe
        iframeStyle.width = (this.iframeWidth -= offsetLeft - BLUR_OFFSET) + px;
        iframeStyle.height = (this.iframeHeight = offsetTop + offsetHeight + BLUR_OFFSET) + px;

        iframeStyle.right = IFRAME_RIGHT + px;
        iframeStyle.top = (this.collapsed ? IFRAME_TOP_COLLAPSED : IFRAME_TOP_EXPANDED) + px;
    }

    private updatePosition(evt?:Event) {
        this.updatePinRootHeight();
        this.updateIframePosition();
    }

    private initializeIframe(evt?:Event) {
        const document = this.frameDoc = this.frameInjector.getFrameElement().contentDocument;

        // New alerts are created in an expanded state,
        // and collapsed in 10 sec if there is no user interaction.
        this.collapsed = false;
        let autoCollapseTimer = setTimeout(() => {
            if (this.collapsed === false) {
                this.toggleCollapse();
            }
            this.frameDoc.removeEventListener('click', preventAutoCollapse);
        }, 10 * 1000);
        const preventAutoCollapse = trustedEventListener((evt) => {
            clearTimeout(autoCollapseTimer);
            this.frameDoc.removeEventListener('click', preventAutoCollapse);
        }, this);
        this.frameDoc.addEventListener('click', preventAutoCollapse);

        // Render template
        const template = popupblockerUI.head({
            cssText: soydata_VERY_UNSAFE.ordainSanitizedHtml(this.cssService.getAlertCSS()),
            preloadFonts: this.cssService.getAlertPreloadFontURLs()
        });
        document.documentElement.innerHTML = template;

        // Render contents
        this.updateIframeContent();
    }

    private updateIframeContent() {
        const document = this.frameDoc;
        const template = popupblockerUI.content({
            numPopup: this.domainToPopupCount[this.origDomain],
            origDomain: this.origDomain,
            destUrl: this.destUrl
        });
        document.body.innerHTML = template;

        let doc = this.frameDoc;

        // Get references of elements.
        this.alertRoot = <HTMLElement>getByClsName(goog.getCssName('alert'), doc)[0];
        this.pinRoot = <HTMLElement>getByClsName(goog.getCssName('pin'), doc)[0];

        // Get references of interactive elements.
        const closeBtn = getByClsName(goog.getCssName('alert__close'), doc)[0];
        const pin = this.pinRoot;
        const continueBtn = getByClsName(goog.getCssName('alert__btn'), doc)[0];
        const select = getByClsName(goog.getCssName('alert__select'), doc)[0];

        // Attach event listeners.
        closeBtn.addEventListener('click', this.onCloseClick);
        pin.addEventListener('click', this.onPinClick);
        continueBtn.addEventListener('click', this.onContinueBlockingClick);
        select.addEventListener('change', this.onOptionChange);

        // The template is rendered in a collapsed state.
        if (!this.collapsed) {
            this.alertRoot.classList.add(goog.getCssName('alert--show'));
        }
        this.updatePosition();
    }

    private onCloseClick(evt:MouseEvent) {
        if (!this.collapsed) {
            this.toggleCollapse();
        }
    }
    private onPinClick(evt:MouseEvent) {
        if (this.collapsed) {
            this.toggleCollapse();
        }
    }
    private onContinueBlockingClick(evt:MouseEvent) {
        this.destroyAlert();
    }

    private onOptionChange(evt:Event) {
        const select = <HTMLSelectElement>evt.target;
        const selectedValue =  select.value;
        switch (selectedValue) {
            case "1":
                this.settingsDao.setWhitelist(this.origDomain, true, this.notifyAboutSavedSettings);
                break;
            case "2":
                this.settingsDao.setSourceOption(this.origDomain, DomainOptionEnum.SILENCED, this.notifyAboutSavedSettings);
                break;
            case "3":
                this.openSettingsPage();
                break;
            case "4":
                window.open(this.destUrl, '_blank');
                break;
        }
        select.value = "0";
    }

    private notifyAboutSavedSettings() {
        let toastController = this.toastController;
        if (toastController) {
            toastController.showNotification(adguard.i18nService.$getMessage("settings_saved"));
        }
    }

    private destroyAlert() {
        this.frameInjector.$destroy();
        this.frameInjector = undefined;

        let toastController = this.toastController;
        if (toastController) {
            toastController.dismissCurrentNotification();
            this.toastController = undefined;
        }
    }

}
