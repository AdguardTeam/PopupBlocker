/// <reference path="../../../node_modules/closure-library.ts/closure-library.d.ts/all.d.ts"/>

import ISettingsDao, { AllOptions } from "../../storage/ISettingsDao";
import { isUndef, isElement } from "../../shared/instanceof";
import { trustedEventListener } from "../event_listener_decorators";
import IOptionsController from "./IOptionsController";

/*******************************************************************************/
// Importing soy templates
// We only provide closure compiler build for settings page.

var popupblockerUI = goog.require('popupblockerUI');

/*******************************************************************************/

const enum DomainIsRelevantFor {
    WHITELISTED,
    SILENCED,
    WHITELISTED_AS_DESTINATION
}

export default class OptionsController implements IOptionsController {

    constructor(
        private settingsManager:ISettingsDao,
        /**
         * Stylesheet content is different between userscript and extensions settings page.
         * This class receives the stylesheet content in the constructor to provide an easy
         * way of using the same implementation for both platforms.
         */
        private SETTINGS_STYLE:string
    ) {
        // Decorate event handlers.
        this.handleContentClick  = trustedEventListener(this.handleContentClick, this);
        this.onPopupClose        = trustedEventListener(this.onPopupClose, true);
        this.onPopupSubmit       = trustedEventListener(this.onPopupSubmit, true);

        // Bind `this` to storage operation callbacks.
        this.renderBody          = this.renderBody.bind(this);
        this.closePopupAndRender = this.closePopupAndRender.bind(this);
    }

    private popupRoot:Element
    private popupInput:HTMLInputElement

    private currentPopupIsFor:DomainIsRelevantFor

    /**
     * Render part of settings page, which does not change during settings data change.
     */
    private renderOuter() {
        let template = popupblockerUI.settingsOuter(this.SETTINGS_STYLE);
        document.documentElement.innerHTML = template;

        // Get references of elements.
        let roots = getByClsName(goog.getCssName('settings'));

        this.popupRoot = roots[1];
        this.popupInput = <HTMLInputElement>getByClsName(goog.getCssName('settings__input'))[0];
        
        const settingsContentRoot = roots[0];
        const popupCloseBtn = getByClsName(goog.getCssName('settings__close'))[0];
        const popupSubmitBtn = <HTMLInputElement>getByClsName(goog.getCssName('settings__submit'))[0];

        // Attach event listeners.
        settingsContentRoot.addEventListener('click', this.handleContentClick);
        popupCloseBtn.addEventListener('click', this.onPopupClose);
        popupSubmitBtn.addEventListener('click', this.onPopupSubmit);
    }

    private onPopupClose(evt) {
        this.closePopup();
    }
    private onPopupSubmit(evt) {
        let value = this.popupInput.value;
        if (!OptionsController.domainIsValid(value)) { return; }
        switch (this.currentPopupIsFor) {
            case DomainIsRelevantFor.WHITELISTED:
                this.settingsManager.setSourceOption(value, DomainOptionEnum.WHITELISTED, this.closePopupAndRender);
                break;
            case DomainIsRelevantFor.SILENCED:
                this.settingsManager.setSourceOption(value, DomainOptionEnum.SILENCED, this.closePopupAndRender);
                break;
            case DomainIsRelevantFor.WHITELISTED_AS_DESTINATION:
                this.settingsManager.setIsWhitelistedDestination(value, true, this.closePopupAndRender);
                break;
        }
    }

    private closePopupAndRender(data?:AllOptions) {
        this.popupRoot.classList.remove(goog.getCssName('settings--show'));
        this.popupInput.value = '';
        this.renderBody(data);
    }
    private showPopup(isFor:DomainIsRelevantFor) {
        this.currentPopupIsFor = isFor;
        this.popupRoot.classList.add(goog.getCssName('settings--show'));
    }
    private closePopup() {
        this.popupRoot.classList.remove(goog.getCssName('settings--show'));
    }

    /**
     * Render part of settings html which displays modified settings data.
     */
    private renderBody(data:AllOptions) {
        if (data === null) { return; }
        let [whitelisted, silenced, whitelistedDests] = data;
        let template = popupblockerUI.settingsContent(whitelisted, silenced, whitelistedDests);
        document.body.firstElementChild.innerHTML = template;
    }
    
    // Event handling delegator
    private handleContentClick(evt:MouseEvent) {
        let target = evt.target;
        if (!isElement(target)) { return; }
        let className = target.className;
        switch (className) {
            case goog.getCssName('settings__control-item'):
                this.handleSettingsControlItemClick(target);
                return;
            case goog.getCssName('settings__del'):
                this.handleSettingsDeleteClick(target);
                return;
            case goog.getCssName('settings__close'):
                this.handleSettingsCloseClick();
                return;
        }
    }
    private handleSettingsControlItemClick(target:Element) {
        let isFor = OptionsController.controlElementIsFor(target);
        this.showPopup(isFor);
    }
    private handleSettingsDeleteClick(target:Element) {
        // This is dependent on an order of elements specified in the markup.
        // Should be updated when markup changes.
        let domain = target.previousElementSibling.textContent;

        let isFor = OptionsController.controlElementIsFor(target);
        if (isFor === DomainIsRelevantFor.WHITELISTED_AS_DESTINATION) {
            this.settingsManager.setIsWhitelistedDestination(domain, false, this.renderBody);
        } else {
            this.settingsManager.setSourceOption(domain, DomainOptionEnum.NONE, this.renderBody);
        }
    }
    private handleSettingsCloseClick() {
        window.close();
    }

    private static isForAttrName = 'data-for';
    private static isForSelector = `[${OptionsController.isForAttrName}]`
    private static controlElementIsFor(elem:Element):DomainIsRelevantFor {
        let blockEl = elem.closest(OptionsController.isForSelector);
        return OptionsController.attrToEnum[blockEl.getAttribute(OptionsController.isForAttrName)];
    }

    // Instead of hard-coding `DomainIsRelevantFor` enum in the html,
    // We store a map mapping html attribute to the enum here, in order to
    // achieve separation of concerns.
    private static attrToEnum = {
        [goog.getCssName('allowed')]: DomainIsRelevantFor.WHITELISTED,
        [goog.getCssName('silenced')]: DomainIsRelevantFor.SILENCED,
        [goog.getCssName('allowed_dest')]: DomainIsRelevantFor.WHITELISTED_AS_DESTINATION
    }

    private static domainRegex =  /^((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}(?:\:[\d]{0,5})?$/;
    private static domainIsValid(domain:string):boolean {
        return OptionsController.domainRegex.test(domain);
    }

    initialize() {
        this.renderOuter();
        this.settingsManager.enumerateOptions(this.renderBody);
    }
}

function getByClsName(className:string, element:Element|Document = document) {
    return element.getElementsByClassName(className);
}
