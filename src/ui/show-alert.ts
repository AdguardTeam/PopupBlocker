import { requestDomainWhitelist, requestDestinationWhitelist } from './storage';
import * as log from '../log';


const innerHTML = "RESOURCE:ALERT_TEMPLATE";

const enum STYLE {
    top_offset = 10,
    right_offset = 10,
    height = 73,
    collapsed_height = 64,
    middle_offset = 0
}

const FULL_ALERT_TIMEOUT = 2000;
const COLLAPSED_ALERT_TIMEOUT = 5000;

const px = 'px';

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

        iframe.addEventListener('load', (evt) => {
            // Attach event handlers
            if (loaded) { return; }
            loaded = true;
            let document = iframe.contentDocument;
            document.documentElement.innerHTML = innerHTML; // document.write('..') does not work on FF Greasemonkey
            if (showCollapsed) {
                document[getElementsByClassName]('popup')[0].classList.add('popup--min');
            }

            attachClickListenerForEach(document[getElementsByClassName]('popup__link--allow'), () => {
                requestDestinationWhitelist(popup_domain);
            });

            attachClickListenerForEach(document[getElementsByClassName]('popup__link--all'), () => {
                requestDomainWhitelist(orig_domain);
            });
        });

        // Adjust css of an iframe
        iframe.setAttribute('allowtransparency', 'true');
        let height = this.height = showCollapsed ? STYLE.collapsed_height : STYLE.height;
        iframe.setAttribute('style', `position:fixed;right:${STYLE.right_offset + px};max-width:574px;height:${height + px};top:${STYLE.top_offset + px};border:none;`);
        this.element = iframe;
        this.collapsed = showCollapsed;
        this.top = STYLE.top_offset;
    }
    pushdown(amount:number) {
        let newTop = this.top + amount;
        this.element.style.top = newTop + px;
        this.top = newTop;
    }
    collapse() {
        if (this.collapsed) { return; }
        let root = this.element.contentDocument[getElementsByClassName]('popup')[0];
        root.classList.add('popup--min');
        this.collapsed = true;
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
        let offset = STYLE.middle_offset + alert.height;
        while (l-- > 0) {
            this.alerts[l].pushdown(offset);
        }

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
                alert.collapse();
                setTimeout(destroy, COLLAPSED_ALERT_TIMEOUT);
            }, FULL_ALERT_TIMEOUT);
        }

        this.alerts.push(alert);
    }
    private destroyAlert(alert:Alert) {
        alert.destroy();
        this.alerts.splice(this.alerts.indexOf(alert), 1);
    }
}

// Minifiers will not inline below strings
var getElementsByClassName = 'getElementsByClassName';

export default new AlertController();
