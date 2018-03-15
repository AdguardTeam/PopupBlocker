/// <reference path="../../../node_modules/closure-library.ts/closure-library.d.ts/all.d.ts"/>
/// <reference path="../../../node_modules/closure-tools-helper/soyutils.d.ts"/>

import ISettingsDao from "../../storage/ISettingsDao";
import IAlertController from "./IAlertController";
import { trustedEventListener, getByClsName } from "../ui_utils";
import { isUndef } from "../../shared/instanceof";
import { shadowDomV1Support } from '../../shared/dom';
import popupblockerUI from 'goog:popupblockerUI';
import soydata_VERY_UNSAFE from 'goog:soydata.VERY_UNSAFE';

const px = 'px';

export default abstract class BaseAlertController implements IAlertController {

    private static fontsDir = '/assets/fonts/';

    private getCssText() {
        const fontsDir = BaseAlertController.fontsDir;
        const opensans = "/OpenSans-";
        const woff = '.woff';
        const WOFF_OPENSANS_REGULAR = `${fontsDir}regular${opensans}Regular${woff}`;
        const WOFF_OPENSANS_SEMIBOLD = `${fontsDir}semibold${opensans}Semibold${woff}`;
        const WOFF_OPENSANS_BOLD = `${fontsDir}bold${opensans}Bold${woff}`;
        const WOFF2_OPENSANS_REGULAR = WOFF_OPENSANS_REGULAR + 2;
        const WOFF2_OPENSANS_SEMIBOLD = WOFF_OPENSANS_SEMIBOLD + 2;
        const WOFF2_OPENSANS_BOLD = WOFF_OPENSANS_BOLD + 2;
        return RESOURCE_ARGS("ALERT_CSS",
            "WOFF_OPENSANS_REGULAR",     this.$getURL(WOFF_OPENSANS_REGULAR),
            "WOFF2_OPENSANS_REGULAR",    this.$getURL(WOFF2_OPENSANS_REGULAR),
            "WOFF_OPENSANS_SEMIBOLD",    this.$getURL(WOFF_OPENSANS_SEMIBOLD),
            "WOFF2_OPENSANS_SEMIBOLD",   this.$getURL(WOFF2_OPENSANS_SEMIBOLD),
            "WOFF_OPENSANS_BOLD",        this.$getURL(WOFF_OPENSANS_BOLD),
            "WOFF2_OPENSANS_BOLD",       this.$getURL(WOFF2_OPENSANS_BOLD)
        );
    }

    protected abstract openSettingsPage():void

    private domainToPopupCount:stringmap<number> = Object.create(null);

    private origDomain:string
    private destUrl:string

    private collapsed:boolean

    private iframe:HTMLIFrameElement
    private shadowHostEl:HTMLElement
    private frameDoc:HTMLDocument
    private alertRoot:HTMLElement
    private pinRoot:HTMLElement

    private iframeWidth:number
    private iframeHeight:number

    constructor(
        private storageManager:ISettingsDao,
        private $getURL:(resc_marker:string)=>string
    ) {
        this.updateIframe               = trustedEventListener(this.updateIframe, this);
        this.onCloseClick               = trustedEventListener(this.onCloseClick, this);
        this.onPinClick                 = trustedEventListener(this.onPinClick, this);
        this.onContinueBlockingClick    = trustedEventListener(this.onContinueBlockingClick, this);
        this.onOptionChange             = trustedEventListener(this.onOptionChange, this);
    }

    private static BLUR_OFFSET = 10 + 3; // Specified in styles as box-shadow: 0 0 10px 3px

    private static initialAlertFrameStyle = [
        "position", "fixed",
        "right",     0 + px,
        "bottom",    0 + px,
        "border",   "none" ,
        "z-index",   String(-1 - (1 << 31))
    ];

    private static shadowHostStyle = [
        "display",  "block",
        "position", "relative",
        "width",     String(0),
        "height",    String(0),
        "margin",    String(0),
        "padding",   String(0),
        "overflow", "hidden",
        "z-index",   String(-1 - (1 << 31))
    ];

    private static concatStyle(style:string[], important:boolean):string {
        let cssText = '';
        for (let i = 0, l = style.length; i < l; i++) {
            cssText += style[i] + ':' + style[++i];
            if (important) { cssText += '!important' }
            cssText += ';';
        }
        return cssText;
    }

    private appendIframe() {
        let iframe = this.iframe = document.createElement('iframe');
        iframe.setAttribute('allowTransparency', 'true');

        iframe.addEventListener('load', this.updateIframe);
        iframe.addEventListener('load', () => {
            // Without this, the background of the iframe will be white in IE11
            this.frameDoc.body.setAttribute('style', 'background-color:transparent;');
        });

        iframe.style.cssText = BaseAlertController.concatStyle(BaseAlertController.initialAlertFrameStyle, false);

        this.iframeWidth = this.iframeHeight = 0;
        iframe.style.width = iframe.style.height = 0 + px;

        if (shadowDomV1Support) {
            let host = this.shadowHostEl = document.createElement('div');
            let root = host.attachShadow({ mode: 'closed' });
            document.documentElement.appendChild(host);

            let hostStyleEl = document.createElement('style');
            hostStyleEl.textContent = `:host{${BaseAlertController.concatStyle(BaseAlertController.shadowHostStyle, true)}}`;
        
            root.appendChild(hostStyleEl);
            root.appendChild(iframe);
        } else {
            document.documentElement.appendChild(iframe);
        }
    }

    createAlert(origDomain:string, destUrl:string) {
        if (isUndef(this.domainToPopupCount[origDomain])) {
            this.domainToPopupCount[origDomain] = 1;
        } else {
            this.domainToPopupCount[origDomain]++;
        }
        this.origDomain = origDomain;
        this.destUrl = destUrl;

        if (!this.iframe) {
            this.collapsed = true;
            this.appendIframe();
        } else {
            this.updateIframeContent();
        }
    }

    private toggleCollapse() {
        this.alertRoot.classList.toggle(goog.getCssName('alert--show'));
        this.collapsed = !this.collapsed;
        this.updateIframeDimension();
    }

    private updateIframeDimension(evt?:Event) {
        if (!this.frameDoc) return;
        let { offsetLeft, offsetTop } = (this.collapsed ? this.pinRoot : this.alertRoot);
        // Adjusts iframe width and height so that the top left corner of the element
        // (pinRoot in collapsed, alertRoot in un-collapsed mode) plus its shadow fits in the iframe
        this.iframe.style.width = (this.iframeWidth -= offsetLeft - BaseAlertController.BLUR_OFFSET) + px;
        this.iframe.style.height = (this.iframeHeight -= offsetTop - BaseAlertController.BLUR_OFFSET) + px;
    }

    private updateIframe(evt?:Event) {
        const document = this.frameDoc = this.iframe.contentDocument;
        const template = popupblockerUI.head({
            cssText: soydata_VERY_UNSAFE.ordainSanitizedHtml(this.getCssText())
        });
        
        document.documentElement.innerHTML = template;
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
        const pin = getByClsName(goog.getCssName('pin'), doc)[0];
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
        this.updateIframeDimension();
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
        this.destroy();
    }

    private onOptionChange(evt:Event) {
        const select = <HTMLSelectElement>evt.target;
        const selectedValue =  select.value;
        switch (selectedValue) {
            case goog.getCssName('allowFrom'):
                this.storageManager.setSourceOption(this.origDomain, DomainOptionEnum.WHITELISTED);
                break;
            case goog.getCssName('silence'):
                this.storageManager.setSourceOption(this.origDomain, DomainOptionEnum.SILENCED);
                break;
            case goog.getCssName('goPref'):
                this.openSettingsPage();
                break;
            case goog.getCssName('showPopup'):
                window.open(this.destUrl, '_blank');
                break;
        }
    }

    private destroy() {
        let iframe = this.iframe;
        if (iframe) {
            iframe.parentNode.removeChild(iframe);
            this.iframe = undefined;
            this.frameDoc = undefined;
        }
        let shadowHostEl = this.shadowHostEl;
        if (shadowHostEl) {
            shadowHostEl.parentNode.removeChild(shadowHostEl);
            this.shadowHostEl = undefined;
        }
    }

}
