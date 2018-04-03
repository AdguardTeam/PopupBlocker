/// <reference path="../../../../node_modules/closure-library.ts/closure-library.d.ts/all.d.ts"/>

import ISettingsDao, { AllOptions } from "../../../storage/ISettingsDao";
import { isUndef, isElement } from "../../../shared/instanceof";
import { trustedEventListener, getByClsName } from "../../ui_utils";
import IOptionsController from "./IOptionsController";
import popupblockerOptionsUI from 'goog:popupblockerOptionsUI'
import * as log from '../../../shared/log';

const enum DomainIsRelevantFor {
    WHITELISTED,
    SILENCED
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
        this.closeAndClearPopup = this.closeAndClearPopup.bind(this);

        this.listenForChanges();
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
                this.settingsDao.setWhitelist(value, true, this.closeAndClearPopup);
                break;
            case DomainIsRelevantFor.SILENCED:
                this.settingsDao.setSourceOption(value, DomainOptionEnum.SILENCED, this.closeAndClearPopup);
                break;
        }
    }

    private closeAndClearPopup() {
        this.closePopup();
        this.popupInput.value = '';
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
        // let [whitelisted, silenced, whitelistedDests] = data;
        let template = popupblockerOptionsUI.content({
            allowedOrigins: whitelisted,
            silencedOrigins: silenced,
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
        if (isFor === DomainIsRelevantFor.WHITELISTED) {
            this.settingsDao.setWhitelist(domain, false);
        } else {
            this.settingsDao.setSourceOption(domain, DomainOptionEnum.NONE);
        }
    }
    private handleSettingsCloseClick() {
        window.close();
    }

    private listenForChanges() {
        this.settingsDao.onSettingsChange(this.renderBody);
    }

    private static isForAttrName = 'data-for';
    private static isForSelector = `[${OptionsController.isForAttrName}]`
    private static controlElementIsFor(elem:Element):DomainIsRelevantFor {
        let blockEl = elem.closest(OptionsController.isForSelector);
        return parseInt(blockEl.getAttribute(OptionsController.isForAttrName));
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
