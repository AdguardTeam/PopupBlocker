import { requestDomainWhitelist, requestDestinationWhitelist } from './storage';
import translate from './localization';
import * as log from '../log';

const innerHTML = "RESOURCE:ALERT_TEMPLATE";

const enum STYLE_CONST {
    top_offset = 10,
    right_offset = 10,
    height = 78,
    collapsed_height = 48,
    middle_offset = 10
};

const FULL_ALERT_TIMEOUT = 2000;
const COLLAPSED_ALERT_TIMEOUT = 5000;

const MAX_ALERT_NUM = 4;

const px = 'px';

const initialAlertFrameStyle = {
    "position": "fixed",
    "right": STYLE_CONST.right_offset + px,
    "width": "574px",
    "top": STYLE_CONST.top_offset + px,
    "border": "none",
    "opacity": "0",
    "transition": "opacity 500ms, top 500ms",
    "transitionTimingFunction": "cubic-bezier(0.86, 0, 0.07, 1), cubic-bezier(0.86, 0, 0.07, 1)"
};

interface AlertIntf {
    readonly element: HTMLIFrameElement,
    readonly collapsed:boolean,
    readonly top:number,
    readonly height:number,
    readonly collapse:()=>void,
    readonly destroy:()=>void,
    readonly pushdown:(amount:number)=>void    
}

function attachClickListenerForEach (iterable:NodeList, listener:(this:Node,evt:MouseEvent)=>any) {
    let l = iterable.length;
    while (l-- > 0) {
        iterable[l].addEventListener('click', listener);
    }
}

class Alert implements AlertIntf {
    public element:HTMLIFrameElement;
    public collapsed:boolean;
    public top:number;
    public height:number;
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
        let height = this.height = showCollapsed ? STYLE_CONST.collapsed_height : STYLE_CONST.height;
        iframe.style['height'] = height + px;

        this.element = iframe;
        this.collapsed = showCollapsed;
        this.top = STYLE_CONST.top_offset;
    }
    pushdown(amount:number) {
        let newTop = this.top + amount;
        this.element.style.top = newTop + px;
        this.top = newTop;
    }
    collapse() {
        if (this.collapsed) { return; }
        this.element.style['height'] = STYLE_CONST.collapsed_height + px;
        let root = this.element.contentDocument[getElementsByClassName]('popup')[0];
        root.classList.add('popup--min');
        this.collapsed = true;
        this.height = STYLE_CONST.collapsed_height;
    }
    destroy() {
        let parentNode = this.element.parentNode;
        if (parentNode) { parentNode.removeChild(this.element); }
    }
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
        let offset = STYLE_CONST.middle_offset + alert.height;
        this.moveBunch(l, offset);
        // Adds event listeners that needs to run in this context
        alert.element.addEventListener('load', () => {
            attachClickListenerForEach(alert.element.contentDocument[getElementsByClassName]('popup__close'), () => {
                this.destroyAlert(alert);
            });
        });
        // Appends an alert to DOM
        document.body.appendChild(alert.element);
        // Schedules collapsing
        let self = this;
        let destroy = () => {
            self.destroyAlert(alert);
        };
        if (showCollapsed) {
            setTimeout(destroy, COLLAPSED_ALERT_TIMEOUT);
        } else {
            setTimeout(() => {
                self.collapseAlert(alert);
                setTimeout(destroy, COLLAPSED_ALERT_TIMEOUT);
            }, FULL_ALERT_TIMEOUT);
        }
        // Pushes the new alerts to an array, destroy from the oldest alert when needed
        if ((l = this.alerts.push(alert)) > MAX_ALERT_NUM) {
            l -= MAX_ALERT_NUM;
            while (l-- > 0) { this.destroyAlert(this.alerts[l]); }
        }
    }
    private moveBunch(index:number, offset:number) {
        while (index-- > 0) { this.alerts[index].pushdown(offset); }
    }
    private collapseAlert(alert:Alert) {
        let prevHeight = alert.height;
        alert.collapse();
        let offset = alert.height - prevHeight;
        let index = this.alerts.indexOf(alert);
        this.moveBunch(index, offset);
    }
    private destroyAlert(alert:Alert) {
        alert.destroy();
        let i = this.alerts.indexOf(alert);
        let offset = alert.height + STYLE_CONST.middle_offset;
        this.moveBunch(i, -offset);
        this.alerts.splice(i, 1);
    }
}

// Minifiers will not inline below strings
var getElementsByClassName = 'getElementsByClassName';

export default new AlertController();
