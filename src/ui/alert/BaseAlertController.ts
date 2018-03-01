/// <reference path="../../../node_modules/closure-library.ts/closure-library.d.ts/all.d.ts"/>
/// <reference path="../../../node_modules/closure-tools-helper/soyutils.d.ts"/>

import ISettingsDao from "../../storage/ISettingsDao";
import IAlertController from "./IAlertController";
import { trustedEventListener, getByClsName } from "../ui_utils";
import { isUndef } from "../../shared/instanceof";

/*******************************************************************************/
// Importing soy templates
// For closure compiler, we use goog.require('popupblockerUI')
// For rollup, we replace RESOURCE_TEMPLATE_ROLLUP with a generated template js
// (including soyutils.js)

import * as popupblockerUI from 'goog:popupblockerUI';
import 'goog:soydata.VERY_UNSAFE';

"REMOVE_START";
RESOURCE_SOYUTILS;
RESOURCE_TEMPLATE_ROLLUP;
"REMOVE_END";
declare const RESOURCE_SOYUTILS;
declare const RESOURCE_TEMPLATE_ROLLUP;

/*******************************************************************************/

const px = 'px';

export default abstract class BaseAlertController implements IAlertController {

    protected abstract getAlertStyle():string
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
        private storageManager:ISettingsDao
    ) {
        this.updateIframe               = trustedEventListener(this.updateIframe, this);
        this.updateIframeContent        = trustedEventListener(this.updateIframeContent, this);
        this.onCloseClick               = trustedEventListener(this.onCloseClick, this);
        this.onPinClick                 = trustedEventListener(this.onPinClick, this);
        this.onContinueBlockingClick    = trustedEventListener(this.onContinueBlockingClick, this);
        this.onOptionChange             = trustedEventListener(this.onOptionChange, this);
    }

    private static shadowDomV1Support = 'attachShadow' in Element.prototype;

    private static initialAlertFrameStyle = {
        "position": "fixed",
        "right": 0 + px,
        "bottom": 0 + px,
        "border": "none",
        "z-index": String(-1 - (1 << 31)),
    }

    private appendIframe() {
        let iframe = this.iframe = document.createElement('iframe');
        iframe.setAttribute('allowTransparency', 'true');

        iframe.addEventListener('load', this.updateIframe);
        iframe.addEventListener('load', () => {
            // Without this, the background of the iframe will be white in IE11
            this.frameDoc.body.setAttribute('style', 'background-color:transparent;');
        });

        for (let property in BaseAlertController.initialAlertFrameStyle) {
            iframe.style[property] = BaseAlertController.initialAlertFrameStyle[property];
        }
        this.iframeWidth = this.iframeHeight = 0;
        iframe.style.width = iframe.style.height = 0 + px;

        if (BaseAlertController.shadowDomV1Support) {
            let host = this.shadowHostEl = document.createElement('div');
            let root = host.attachShadow({ mode: 'closed' });
            document.documentElement.appendChild(host);
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
        const document = this.frameDoc;
        const root = getByClsName(goog.getCssName('alert'), this.frameDoc)[0];
        root.classList.toggle(goog.getCssName('alert--show'));
        this.collapsed = !this.collapsed;
        this.updateIframeDimension();
    }

    private updateIframeDimension() {
        if (!this.frameDoc) return;
        let { offsetLeft, offsetTop } = (this.collapsed ? this.pinRoot : this.alertRoot);
        this.iframe.style.width = (this.iframeWidth -= offsetLeft) + px;
        this.iframe.style.height = (this.iframeHeight -= offsetTop) + px;
    }

    private updateIframe(evt?:Event) {
        const document = this.frameDoc = this.iframe.contentDocument;
        const template = popupblockerUI.head({
            cssText: soydata.VERY_UNSAFE.ordainSanitizedHtml(this.getAlertStyle())
        });
        document.documentElement.innerHTML = template;
        this.updateIframeContent();
    }

    private updateIframeContent(evt?:Event) {
        this.iframe.removeEventListener('load', this.updateIframeContent);
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
