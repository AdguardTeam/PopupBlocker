/// <reference path="../../../node_modules/closure-library.ts/closure-library.d.ts/all.d.ts"/>

import ISettingsDao, { AllOptions } from "../../storage/ISettingsDao";
import { isUndef, isElement } from "../../shared/instanceof";
import { trustedEventListener, getByClsName } from "../ui_utils";
import IOptionsController from "./IOptionsController";

/*******************************************************************************/
// Importing soy templates
// For closure compiler, we use goog.require('popupblockerOptionsUI')
// For rollup, we replace RESOURCE_OPTIONS_TEMPLATE_ROLLUP with a generated template js
// (including soyutils.js)

const popupblockerOptionsUI = goog.require('popupblockerOptionsUI');
"REMOVE_START";
RESOURCE_SOYUTILS;
RESOURCE_OPTIONS_TEMPLATE_ROLLUP;
"REMOVE_END";
declare const RESOURCE_SOYUTILS;
declare const RESOURCE_OPTIONS_TEMPLATE_ROLLUP;

/*******************************************************************************/

const enum DomainIsRelevantFor {
    WHITELISTED,
    SILENCED,
    WHITELISTED_AS_DESTINATION
}

export default class OptionsController implements IOptionsController {

    constructor(
        private settingsDao:ISettingsDao
    ) {
        // Decorate event handlers.
        this.handleContentClick  = trustedEventListener(this.handleContentClick, this);
        this.onPopupClose        = trustedEventListener(this.onPopupClose, this);
        this.onPopupSubmit       = trustedEventListener(this.onPopupSubmit, this);

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
        let template = popupblockerOptionsUI.outer();
        document.body.innerHTML = template;

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
                this.settingsDao.setSourceOption(value, DomainOptionEnum.WHITELISTED, this.closePopupAndRender);
                break;
            case DomainIsRelevantFor.SILENCED:
                this.settingsDao.setSourceOption(value, DomainOptionEnum.SILENCED, this.closePopupAndRender);
                break;
            case DomainIsRelevantFor.WHITELISTED_AS_DESTINATION:
                this.settingsDao.setIsWhitelistedDestination(value, true, this.closePopupAndRender);
                break;
        }
    }

    private closePopupAndRender(data?:AllOptions) {
        this.closePopup();
        this.popupInput.value = '';
        this.renderBody(data);
    }
    private showPopup(isFor:DomainIsRelevantFor) {
        this.currentPopupIsFor = isFor;
        this.popupRoot.classList.add(goog.getCssName('settings-modal--show'));
    }
    private closePopup() {
        this.popupRoot.classList.remove(goog.getCssName('settings-modal--show'));
    }

    /**
     * Render part of settings html which displays modified settings data.
     */
    private renderBody(data:AllOptions) {
        if (data === null) { return; }
        let whitelisted = data[0];
        let silenced = data[1];
        let whitelistedDests = data[2];
        // let [whitelisted, silenced, whitelistedDests] = data;
        let template = popupblockerOptionsUI.content({
            allowedOrigins: whitelisted,
            silencedOrigins: silenced,
            allowedDestinations: whitelistedDests
        });
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
        let domain = target.previousElementSibling.textContent.trim();

        let isFor = OptionsController.controlElementIsFor(target);
        if (isFor === DomainIsRelevantFor.WHITELISTED_AS_DESTINATION) {
            this.settingsDao.setIsWhitelistedDestination(domain, false, this.renderBody);
        } else {
            this.settingsDao.setSourceOption(domain, DomainOptionEnum.NONE, this.renderBody);
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
        this.settingsDao.enumerateOptions(this.renderBody);
    }
}
