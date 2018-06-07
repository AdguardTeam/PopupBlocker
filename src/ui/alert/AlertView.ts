/// <reference path="../../../node_modules/closure-library.ts/closure-library.d.ts/all.d.ts"/>
/// <reference path="../../../node_modules/closure-tools-helper/soyutils.d.ts"/>

import IAlertView from './IAlertView';
import IFrameInjector from "../utils/IFrameInjector";
import { trustedEventListener, getByClsName, concatStyle } from "../utils/ui_utils";
import FrameInjector from "../utils/FrameInjector";
import CSSService from "../utils/CssService";

import popupblockerUI from 'goog:popupblockerUI';
import soydata_VERY_UNSAFE from 'goog:soydata.VERY_UNSAFE';
import IAlertController from './IAlertController';
import { functionBind } from '../../shared/protected_api';

const px = 'px';

/**************************************************************************************************/

/**
 * These magic numbers are dictated in the CSS.
 * These are base of position calculation; There are other constants that are
 * dictated in the CSS such as the width of the alert, but we instead read it from
 * `HTMLElement.offset***` api to reduce coupling with CSS.
 */
const PIN_TOP = 5;
const PIN_RIGHT = 5;
const ALERT_TOP_REL_PIN = 0;
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

export default class AlertView implements IAlertView {
    /**
     * Interanl data state of alerts
     */
    private collapsed:boolean
    /**
     * DOM-related state of alerts
     */
    private frameInjector:IFrameInjector
    private frameDoc:HTMLDocument
    private alertRoot:HTMLElement
    private pinRoot:HTMLElement
    private iframeWidth:number
    private iframeHeight:number
    /**
     * Constants used to configure the view
     */
    private static initialAlertFrameStyle = [
        "position", "fixed",
        "right",     0 + px,
        "top",       0 + px,
        "border",   "none" ,
        "z-index",   String(-1 - (1 << 31))
    ];
    constructor(
        private cssService:CSSService,
        private controller:IAlertController
    ) {
        this.renderHead = functionBind.call(this.renderHead, this);
        this.appendIframe();
    }
    private appendIframe() {
        // Create a FrameInjector instance, and store related states.
        let frameInjector = this.frameInjector = new FrameInjector();

        // Add `load` event listeners
        frameInjector.addListener(this.renderHead);

        // Set inline style for the frame.
        /** @todo Abstract this operation from FrameInjector, remove `getFrameElement` */
        let iframe = frameInjector.getFrameElement();
        iframe.style.cssText = concatStyle(AlertView.initialAlertFrameStyle, false);
        this.iframeWidth = this.iframeHeight = 0;
        iframe.style.width = iframe.style.height = 0 + px;

        // Append to the DOM.
        frameInjector.inject();
    }

    // Wraps methods of the controller to a trusted event listener

    private onClose = trustedEventListener(this.controller.onClose, this.controller);
    private onPinClick = trustedEventListener(this.controller.onPinClick, this.controller);
    private onContinueBlocking = trustedEventListener(this.controller.onContinueBlocking, this.controller);
    private onOptionChange = trustedEventListener(this.controller.onOptionChange, this.controller);
    private onMouseEnter = trustedEventListener(this.controller.onMouseEnter, this.controller);
    private onMouseLeave = trustedEventListener(this.controller.onMouseLeave, this.controller);
    private onUserInteraction = trustedEventListener(this.controller.onUserInteraction, this.controller);

    render(numPopup:number, origDomain:string, destUrl:string, callback:()=>void) {
        if (this.frameDoc && this.frameDoc.readyState === 'complete') {
            this.renderBodyOnLoad(numPopup, origDomain, destUrl);
            callback();
        } else {
            this.frameInjector.addListener((evt:Event) => {
                this.renderBodyOnLoad(numPopup, origDomain, destUrl);
                callback();
                // This is a workaround for issues on Edge and IE.
                // It seems that right after our template is appended, element's offsetWidth and such
                // are not fully realized. It is lesser for about 16 or 17 pixels then it should have been,
                // and it causes a part of ui to be cropped from the left side.
                // Maybe there is some asynchronous rendering going on. Maybe box-shadows.
                // TODO: find an exact cause of it, and remove this
                requestAnimationFrame(() => {
                    this.updateIframePosition();
                });
            });
        }
    }
    private renderHead() {
        const document = this.frameDoc = this.frameInjector.getFrameElement().contentDocument;
        // Render template
        const template = popupblockerUI.head({
            cssText: soydata_VERY_UNSAFE.ordainSanitizedHtml(this.cssService.getAlertCSS()),
            preloadFonts: this.cssService.getAlertPreloadFontURLs()
        });
        document.documentElement.innerHTML = template;

        // Attach event listeners.
        document.addEventListener('click', this.onUserInteraction, true);
        document.addEventListener('touchstart', this.onUserInteraction, true);
    }
    private renderBodyOnLoad(numPopup:number, origDomain:string, destUrl:string) {
        const document = this.frameDoc;
        const template = popupblockerUI.content({ numPopup, origDomain, destUrl });
        document.body.innerHTML = template;

        let doc = this.frameDoc;

        // Get references of elements.
        this.alertRoot = <HTMLElement>getByClsName(goog.getCssName('alert'), doc)[0];
        this.pinRoot = <HTMLElement>getByClsName(goog.getCssName('pin'), doc)[0];

        // Get references of interactive elements.
        const closeBtn = getByClsName(goog.getCssName('alert__close'), doc)[0];
        const pin = this.pinRoot;
        const continueBtn = getByClsName(goog.getCssName('alert__btn'), doc)[0];
        const select = <HTMLSelectElement>getByClsName(goog.getCssName('alert__select'), doc)[0];

        // Attach event listeners.
        closeBtn.addEventListener('click', this.onClose);
        pin.addEventListener('click', this.onPinClick);
        continueBtn.addEventListener('click', this.onContinueBlocking);
        select.addEventListener('change', this.onOptionChange);
        this.alertRoot.addEventListener('mouseenter', this.onMouseEnter);
        this.alertRoot.addEventListener('mouseleave', this.onMouseLeave);
        pin.addEventListener('mouseenter', this.onMouseEnter);
        pin.addEventListener('mouseleave', this.onMouseLeave);

        // The template is rendered in a collapsed state.
        if (!this.collapsed) {
            this.alertRoot.classList.add(goog.getCssName('alert--show'));
        }
        this.updatePosition();
    }
    expand() {
        this.alertRoot.classList.add(goog.getCssName('alert--show'));
        this.collapsed = false;
        this.updatePosition();
    }
    collapse() {
        this.alertRoot.classList.remove(goog.getCssName('alert--show'));
        this.collapsed = true;
        this.updatePosition();
    }
    private updatePosition(evt?:Event) {
        this.updatePinRootHeight();
        this.updateIframePosition();
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
    destroy() {
        this.frameInjector.$destroy();
        this.frameInjector = null;
    }
}