/// <reference path="../../../node_modules/closure-library.ts/closure-library.d.ts/all.d.ts"/>

import ISettingsDao from "../../storage/ISettingsDao";
import IAlertController from "./IAlertController";
import { trustedEventListener } from "../event_listener_decorators";

/*******************************************************************************/
// Importing soy templates
// For closure compiler, we use goog.require('popupblockerUI')
// For rollup, we replace RESOURCE_TEMPLATE_ROLLUP with a generated template js
// (including soyutils.js)

var popupblockerUI = goog.require('popupblockerUI');
RESOURCE_TEMPLATES_ROLLUP;

/*******************************************************************************/

export default abstract class BaseAlertController implements IAlertController {

    protected abstract getAlertStyle():string
    protected abstract openSettingsPage():void

    private numPopup:number = 0
    private origDomain:string
    private destUrl:string

    private collapsed:boolean

    private iframe:HTMLIFrameElement
    private shadowHostEl:HTMLElement
    private frameDoc:HTMLDocument

    constructor(
        private storageManager:ISettingsDao
    ) {
        this.updateIframe               = trustedEventListener(this.updateIframe, this);
        this.updateIframeContent        = trustedEventListener(this.updateIframeContent, this);
        this.onPinClick                 = trustedEventListener(this.onPinClick, this);
        this.onContinueBlockingClick    = trustedEventListener(this.onContinueBlockingClick, this);
        this.onOptionChange             = trustedEventListener(this.onOptionChange, this);
    }

    private static shadowDomV1Support = 'attachShadow' in Element.prototype;

    private appendIframe() {
        let iframe = this.iframe = document.createElement('iframe');
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
        this.numPopup++;
        this.origDomain = origDomain;
        this.destUrl = destUrl;

        if (!this.iframe) {
            this.appendIframe();
            this.collapsed = true;
            this.iframe.addEventListener('load', this.updateIframe);
        } else {
            this.updateIframeContent();
        }
    }

    private toggleCollapse() {
        const document = this.frameDoc;
        const root = document.getElementsByClassName(goog.getCssName('alert'))[0];
        root.classList.toggle(goog.getCssName('alert--show'));
        this.collapsed = !this.collapsed;

        // Adjust iframe size.

    }

    private updateIframe(evt?:Event) {
        const document = this.frameDoc = this.iframe.contentDocument;
        const template = popupblockerUI.alertHead(this.getAlertStyle);
        document.documentElement.innerHTML = template;
        this.updateIframeContent();
    }

    private updateIframeContent(evt?:Event) {
        if (evt && !evt.isTrusted) { return; }
        this.iframe.removeEventListener('load', this.updateIframeContent);
        const document = this.frameDoc;
        const template = popupblockerUI.alertContent({
            numPopup: this.numPopup,
            origDomain: this.origDomain,
            destUrl: this.destUrl
        });
        document.body.innerHTML = template;

        // Get references of interactive elements.
        const closeBtn = document.getElementsByClassName(goog.getCssName('alert__close'))[0];
        const pin = document.getElementsByClassName(goog.getCssName('pin'))[0];
        const continueBtn = document.getElementsByClassName(goog.getCssName('alert__btn'))[0];
        const select = document.getElementsByClassName(goog.getCssName('alert__select'))[0];
        
        // Attach event listeners.
        closeBtn.addEventListener('click', this.onCloseClick);
        pin.addEventListener('click', this.onPinClick);
        continueBtn.addEventListener('click', this.onContinueBlockingClick);
        select.addEventListener('change', this.onOptionChange);
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
        if (this.iframe) {
            this.iframe.parentNode.removeChild(this.iframe);
            this.iframe = undefined;
            this.frameDoc = undefined;
        }
    }
}

//

declare const RESOURCE_TEMPLATES_ROLLUP:any;
