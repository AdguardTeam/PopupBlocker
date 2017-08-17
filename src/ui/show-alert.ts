import { requestDomainWhitelist, requestDestinationWhitelist } from './storage';
import translate from './localization';
import * as log from '../log';

const innerHTML = "RESOURCE:ALERT_TEMPLATE";

const enum STYLE_CONST {
    top_offset = 10,
    right_offset = 10,
    height = 78,
    collapsed_height = 48,
    width = 574,
    collapsed_width = 135,
    middle_offset = 10
};

const FULL_ALERT_TIMEOUT = 2000;
const COLLAPSED_ALERT_TIMEOUT = 5000;

const MAX_ALERT_NUM = 4;

const px = 'px';

const initialAlertFrameStyle = {
    "position": "fixed",
    "right": STYLE_CONST.right_offset + px,
    "top": STYLE_CONST.top_offset + px,
    "border": "none",
    "opacity": "0",
    "z-index": String(-1 - (1 << 31)),
    "transition": "opacity 500ms, top 500ms",
    "transitionTimingFunction": "cubic-bezier(0.86, 0, 0.07, 1), cubic-bezier(0.86, 0, 0.07, 1)"
};

interface AlertIntf {
    readonly $element: HTMLIFrameElement,
    readonly $collapsed:boolean,
    readonly $top:number,
    readonly $height:number,
    readonly $collapse:()=>void,
    readonly destroy:()=>void,
    readonly pushdown:(amount:number)=>void,
    readonly lastUpdate:number,
    timerId:number // timer Id that schedules an alert's next state change (collapse, destroy) is assigned here.
}

function attachClickListenerForEach (iterable:NodeList, listener:(this:Node,evt:MouseEvent)=>any) {
    let l = iterable.length;
    while (l-- > 0) {
        iterable[l].addEventListener('click', listener);
    }
}

class Alert implements AlertIntf {
    public $element:HTMLIFrameElement;
    public $collapsed:boolean;
    public $top:number;
    public $height:number;
    constructor(orig_domain:string, popup_domain:string, showCollapsed:boolean) {
        let iframe = document.createElement('iframe');
        let loaded = false;
        // Prepare innerHTML
        let _innerHTML = innerHTML.replace(/\${dest}/g, popup_domain);
        iframe.addEventListener('load', (evt) => {
            // Attach event handlers
            if (loaded) { return; }
            loaded = true;
            let document = iframe.contentDocument;
            document.documentElement.innerHTML = _innerHTML; // document.write('..') does not work on FF Greasemonkey
            translate(document.body, {
                'dest': popup_domain
            });
            if (showCollapsed) { document[getElementsByClassName]('popup')[0].classList.add('popup--min'); }
            attachClickListenerForEach(document[getElementsByClassName]('popup__link--allow'), () => {
                requestDestinationWhitelist(popup_domain);
            });
            attachClickListenerForEach(document[getElementsByClassName]('popup__link--all'), () => {
                requestDomainWhitelist(orig_domain);
            });
            requestAnimationFrame(() => {
                iframe.style['opacity'] = '1';
            });
            // Unless this, the background of the iframe will be white in IE11
            document.body.setAttribute('style', 'background-color:transparent;');
        });
        // Adjust css of an iframe
        iframe.setAttribute('allowTransparency', 'true');
        for (let prop in initialAlertFrameStyle) { iframe.style[prop] = initialAlertFrameStyle[prop]; }
        let height = this.$height = showCollapsed ? STYLE_CONST.collapsed_height : STYLE_CONST.height;
        let width = showCollapsed ? STYLE_CONST.collapsed_width : STYLE_CONST.width;
        iframe.style['height'] = height + px;
        iframe.style['width'] = width + px;
        // Enable sandboxing
        iframe.setAttribute('sandbox', 'allow-same-origin');

        this.$element = iframe;
        this.$collapsed = showCollapsed;
        this.$top = STYLE_CONST.top_offset;
        this.lastUpdate = new Date().getTime();
    }
    pushdown(amount:number) {
        let newTop = this.$top + amount;
        this.$element.style.top = newTop + px;
        this.$top = newTop;
    }
    $collapse() {
        if (this.$collapsed) { return; }
        this.$element.style['height'] = STYLE_CONST.collapsed_height + px;
        this.$element.style['width'] = STYLE_CONST.collapsed_width + px;
        let root = this.$element.contentDocument[getElementsByClassName]('popup')[0];
        root.classList.add('popup--min');
        this.$collapsed = true;
        this.$height = STYLE_CONST.collapsed_height;
        // Since its state was changed, update its lastUpdate property.
        this.lastUpdate = new Date().getTime();
    }
    destroy() {
        clearTimeout(this.timerId);
        let parentNode = this.$element.parentNode;
        if (parentNode) { parentNode.removeChild(this.$element); }
    }
    public lastUpdate:number
    public timerId:number // This will be initialized when an alert is created by AlertController#createAlert.
}

class AlertController {
    private alerts:AlertIntf[];
    constructor() {
        this.alerts = [];
    }
    createAlert(orig_domain:string, popup_domain:string, showCollapsed:boolean) {
        let alert = new Alert(orig_domain, popup_domain, showCollapsed);
        // Pushes previous alerts down
        let l = this.alerts.length;
        let offset = STYLE_CONST.middle_offset + alert.$height;
        this.moveBunch(l, offset);
        // Adds event listeners that needs to run in this context
        alert.$element.addEventListener('load', () => {
            attachClickListenerForEach(alert.$element.contentDocument[getElementsByClassName]('popup__close'), () => {
                this.destroyAlert(alert);
            });
        });
        alert.$element.addEventListener('mouseover', () => { this.onMouseOver(); });
        alert.$element.addEventListener('mouseout', () => { this.onMouseOut(); });
        // Appends an alert to DOM
        document.body.appendChild(alert.$element);
        // Schedules collapsing & destroying
        if (showCollapsed) {
            alert.timerId = setTimeout(() => {
                this.destroyAlert(alert);
            }, COLLAPSED_ALERT_TIMEOUT);
        } else {
            alert.timerId = setTimeout(() => {
                this.collapseAlert(alert);
            }, FULL_ALERT_TIMEOUT);
        }
        // Pushes the new alert to an array, destroy from the oldest alert when needed
        if ((l = this.alerts.push(alert)) > MAX_ALERT_NUM) {
            l -= MAX_ALERT_NUM;
            while (l-- > 0) { this.destroyAlert(this.alerts[l]); }
        }
    }
    private moveBunch(index:number, offset:number) {
        while (index-- > 0) { this.alerts[index].pushdown(offset); }
    }
    /**
     * Collapses an alert and schedules its destruction
     */
    private collapseAlert(alert:Alert) {
        let prevHeight = alert.$height;
        alert.$collapse();
        let offset = alert.$height - prevHeight;
        let index = this.alerts.indexOf(alert);
        this.moveBunch(index, offset);
        const self = this;
        alert.timerId = setTimeout(() => {
            self.destroyAlert(alert);
        }, COLLAPSED_ALERT_TIMEOUT);
    }
    private destroyAlert(alert:Alert) {
        alert.destroy();
        let i = this.alerts.indexOf(alert);
        let offset = alert.$height + STYLE_CONST.middle_offset;
        this.moveBunch(i, -offset);
        this.alerts.splice(i, 1);
    }
    /************************************************************************************

        When a user hovers the mouse over any of alerts,

         1. All timers are cleared, so as to prevent ui change during
            user interaction;

         2. When the mouse is moved out of alerts:
           - It resumes all timers as if there was no pause;
           - If a pause was long enough so that ANY of timer's callback should
             have been called, call the oldest callback immediately, and then schedules
             other callbacks so that relative fire time differences are unchanged.

    **/
    private onMouseOver() {
        this.alerts.forEach((alert) => {
            clearTimeout(alert.timerId);
        });
    }
    private onMouseOut() {
        const now = new Date().getTime();
        const time = this.getImminentDue();
        const pastDue = now > time ? now - time : 0;
        this.alerts.forEach((alert) => {
            if (alert.$collapsed) {
                alert.timerId = setTimeout(() => {
                    this.destroyAlert(alert);
                // This value will be 0 for the oldest callback.
                }, alert.lastUpdate + COLLAPSED_ALERT_TIMEOUT - now + pastDue);
            } else {
                alert.timerId = setTimeout(() => {
                    this.collapseAlert(alert);
                }, alert.lastUpdate + FULL_ALERT_TIMEOUT - now + pastDue);
            }
        });
    }
    private getImminentDue() {
        let amongCollapsed, amongUncollapsed;
        const alerts = this.alerts;
        for (let i = 0, l = alerts.length; i < l; i++) {
            if (alerts[i].$collapsed) {
                if (amongCollapsed) { continue; }
                amongCollapsed = alerts[i].lastUpdate + COLLAPSED_ALERT_TIMEOUT;
                if (amongUncollapsed) { break; }
            } else {
                if (amongUncollapsed) { continue; }
                amongUncollapsed = alerts[i].lastUpdate + FULL_ALERT_TIMEOUT;
                if (amongCollapsed) { break; }
            }
        }
        return amongCollapsed > amongUncollapsed ? amongUncollapsed : amongCollapsed;
    }
}

// Minifiers will not inline below strings
var getElementsByClassName = 'getElementsByClassName';

export default new AlertController();
