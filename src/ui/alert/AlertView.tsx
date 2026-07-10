import { render } from 'preact';
import { trustedEventListener, concatStyle } from '../utils/ui-utils';
import { FrameInjector, IFrameInjector } from '../utils/FrameInjector';
import { AlertControllerInterface } from './AlertControllerInterface';
import { functionBind } from '../../shared';
import { NotificationHead, Alert } from '../../pages/notifications/components';

/**
 * These magic numbers are dictated in the CSS.
 * These are base of position calculation; There are other constants that are
 * dictated in the CSS such as the width of the alert, but we instead read it from
 * `HTMLElement.offset***` api to reduce coupling with CSS.
 */
const PIN_TOP = 5;
const PIN_RIGHT = 5;
const ALERT_TOP_REL_PIN = 0;
const px = 'px';
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

const MAX_URL_LENGTH = 50;

export interface AlertViewInterface {
    render(popupCount:number, origDomain:string, destUrl:string, callback?:()=>void):void
    $expand():void
    $collapse():void
    $destroy():void
}

export class AlertView implements AlertViewInterface {
    /**
     * Interanl data state of alerts
     */
    private collapsed:boolean;

    /**
     * DOM-related state of alerts
     */
    private frameInjector:IFrameInjector | null;

    private frameDoc?:Document | null;

    private alertRoot:HTMLElement;

    private pinRoot:HTMLElement;

    private optionsBtn:HTMLElement;

    private optionsList:HTMLElement;

    private iframeWidth:number;

    private iframeHeight:number;

    /**
     * Constants used to configure the view
     */
    private static initialAlertFrameStyle = [
        'position', 'fixed',
        'right', 0 + px,
        'top', 0 + px,
        'border', 'none',
        // eslint-disable-next-line no-bitwise
        'z-index', String(-1 - (1 << 31)),
    ];

    constructor(
        private controller:AlertControllerInterface,
    ) {
        this.renderHead = functionBind.call(this.renderHead, this);
        this.appendIframe();
    }

    private appendIframe() {
        // Create a FrameInjector instance, and store related states.
        const frameInjector = this.frameInjector = new FrameInjector();

        // Add `load` event listeners
        frameInjector.addListener(this.renderHead);

        // Set inline style for the frame.
        /** @todo Abstract this operation from FrameInjector, remove `getFrameElement` */
        const iframe = frameInjector.getFrameElement();
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

    private onOptionsToggle = trustedEventListener(() => {
        this.toggleOptionsList(!this.isOptionsListOpen());
    }, this);

    private onOptionSelect = trustedEventListener((evt?:UIEvent) => {
        this.toggleOptionsList(false);
        if (evt) {
            this.controller.onOptionChange(evt);
        }
    }, this);

    // Not wrapped in `trustedEventListener`, because it must not call
    // `preventDefault` on keystrokes it does not handle.
    private onKeyDown = (evt:KeyboardEvent) => {
        if (!evt.isTrusted || !this.isOptionsListOpen()) {
            return;
        }
        const { key } = evt;
        if (key === 'Escape' || key === 'Esc') {
            this.toggleOptionsList(false);
            this.optionsBtn.focus();
            evt.preventDefault();
        } else if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Down' || key === 'Up') {
            const items = this.optionsList.getElementsByClassName('alert__select-item');
            if (items.length === 0) {
                return;
            }
            let index = -1;
            for (let i = 0; i < items.length; i += 1) {
                if (items[i] === this.frameDoc?.activeElement) {
                    index = i;
                    break;
                }
            }
            const down = key === 'ArrowDown' || key === 'Down';
            if (index === -1) {
                index = down ? 0 : items.length - 1;
            } else {
                index = (index + (down ? 1 : -1) + items.length) % items.length;
            }
            (items[index] as HTMLElement).focus();
            evt.preventDefault();
        }
    };

    private onMouseEnter = trustedEventListener(this.controller.onMouseEnter, this.controller);

    private onMouseLeave = trustedEventListener(this.controller.onMouseLeave, this.controller);

    private onUserInteraction = trustedEventListener(this.controller.onUserInteraction, this.controller);

    render(numPopup:number, origDomain:string, destUrl:string, callback:()=>void) {
        if (this.frameDoc && this.frameDoc.readyState === 'complete') {
            this.renderBodyOnLoad(numPopup, origDomain, destUrl);
            callback();
        } else {
            this.frameInjector?.addListener(() => {
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
        const doc = this.frameDoc = this.frameInjector?.getFrameElement().contentDocument;
        const head = doc?.documentElement.querySelector('head');
        if (head && doc) {
            render(<NotificationHead />, head);
            // Attach event listeners.
            doc.addEventListener('click', this.onUserInteraction, true);
            doc.addEventListener('touchstart', this.onUserInteraction, true);
        }
    }

    private renderBodyOnLoad(numPopup:number, origDomain:string, destUrl:string) {
        const doc = this.frameDoc;
        if (!doc) {
            return;
        }
        // Trim URL to first 50 characters
        // https://github.com/AdguardTeam/PopupBlocker/issues/250
        const trimmedUrl = destUrl.length > MAX_URL_LENGTH ? `${destUrl.substring(0, MAX_URL_LENGTH)}...` : destUrl;
        render(<Alert numPopup={numPopup} origDomain={origDomain} destUrl={trimmedUrl} />, doc.body);

        // Get references of elements.
        /* eslint-disable prefer-destructuring */
        this.alertRoot = doc.getElementsByClassName('alert')[0] as HTMLElement;
        this.pinRoot = doc.getElementsByClassName('pin')[0] as HTMLElement;
        /* eslint-enable prefer-destructuring */

        // Get references of interactive elements.
        const closeBtn = doc.getElementsByClassName('alert__close')[0];
        const pin = this.pinRoot;
        const continueBtn = doc.getElementsByClassName('alert__btn')[0];
        this.optionsBtn = doc.getElementsByClassName('alert__select')[0] as HTMLElement;
        this.optionsList = doc.getElementsByClassName('alert__select-list')[0] as HTMLElement;
        const optionItems = doc.getElementsByClassName('alert__select-item');

        // Attach event listeners.
        // Listener instances are stable class members, so re-rendering does not
        // attach duplicates.
        // @ts-ignore
        closeBtn.addEventListener('click', this.onClose);
        pin.addEventListener('click', this.onPinClick);
        // @ts-ignore
        continueBtn.addEventListener('click', this.onContinueBlocking);
        // @ts-ignore
        this.optionsBtn.addEventListener('click', this.onOptionsToggle);
        for (let i = 0; i < optionItems.length; i += 1) {
            // @ts-ignore
            optionItems[i].addEventListener('click', this.onOptionSelect);
        }
        doc.addEventListener('keydown', this.onKeyDown, true);
        this.alertRoot.addEventListener('mouseenter', this.onMouseEnter);
        this.alertRoot.addEventListener('mouseleave', this.onMouseLeave);
        pin.addEventListener('mouseenter', this.onMouseEnter);
        pin.addEventListener('mouseleave', this.onMouseLeave);

        // The template is rendered in a collapsed state.
        if (!this.collapsed) {
            this.alertRoot.classList.add('alert--show');
        }
        this.updatePosition();
    }

    $expand() {
        this.alertRoot.classList.add('alert--show');
        this.collapsed = false;
        this.updatePosition();
    }

    $collapse() {
        this.toggleOptionsList(false);
        this.alertRoot.classList.remove('alert--show');
        this.collapsed = true;
        this.updatePosition();
    }

    private isOptionsListOpen():boolean {
        return !!this.optionsList && !this.optionsList.hidden;
    }

    private toggleOptionsList(open:boolean) {
        if (!this.optionsList || this.isOptionsListOpen() === open) {
            return;
        }
        this.optionsList.hidden = !open;
        this.optionsBtn.setAttribute('aria-expanded', String(open));
        // The list is rendered inside the iframe, so the iframe must be resized
        // to fit it when it is open.
        this.updateIframePosition();
    }

    private updatePosition() {
        this.updatePinRootHeight();
        this.updateIframePosition();
    }

    private updatePinRootHeight() {
        const pinOffsetTop = this.collapsed ? PIN_OFFSET_TOP_COLLAPSED : PIN_OFFSET_TOP_EXPANDED;
        this.pinRoot.style.top = pinOffsetTop + px;
    }

    private updateIframePosition() {
        const iframeStyle = this.frameInjector?.getFrameElement().style;

        if (iframeStyle) {
            const { offsetLeft, offsetTop, offsetHeight } = (this.collapsed ? this.pinRoot : this.alertRoot);
            // Adjusts iframe width and height so that the bottom left corner of the element
            // (pinRoot in collapsed, alertRoot in un-collapsed mode) plus its shadow fits in the iframe
            iframeStyle.width = (this.iframeWidth -= offsetLeft - BLUR_OFFSET) + px;
            let iframeHeight = offsetTop + offsetHeight + BLUR_OFFSET;
            if (!this.collapsed && this.isOptionsListOpen()) {
                // The options list overflows the alert root, extend the iframe to fit it.
                const listBottom = this.optionsList.getBoundingClientRect().bottom + BLUR_OFFSET;
                if (listBottom > iframeHeight) {
                    iframeHeight = listBottom;
                }
            }
            iframeStyle.height = (this.iframeHeight = iframeHeight) + px;

            iframeStyle.right = IFRAME_RIGHT + px;
            iframeStyle.top = (this.collapsed ? IFRAME_TOP_COLLAPSED : IFRAME_TOP_EXPANDED) + px;
        }
    }

    $destroy() {
        this.frameInjector?.$destroy();
        this.frameInjector = null;
    }
}
