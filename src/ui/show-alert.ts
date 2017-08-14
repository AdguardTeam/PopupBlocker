import { requestDomainWhitelist, requestDestinationWhitelist } from './storage';

const innerHTML = "ALERT_TEMPLATE";

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
            document.open();
            document.write(innerHTML);
            document.close();

            if (showCollapsed) {
                document.getElementsByClassName('popup')[0].classList.add('popup--min');
            }

            let allowBtns = document.getElementsByClassName('popup__link--allow');
            let l = allowBtns.length;
            while (l-- > 0) {
                allowBtns[l].addEventListener('click', () => {
                    requestDestinationWhitelist(popup_domain);
                });
            }
            let allBtns = document.getElementsByClassName('popup__link--all');
            l = allBtns.length;
            while (l-- > 0) {
                allBtns[l].addEventListener('click', () => {
                    requestDomainWhitelist(orig_domain);
                });
            }
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
        let root = this.element.contentDocument.getElementsByClassName('popup')[0];
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

        // Appends an alert to DOM
        document.body.appendChild(alert.element);

        // Adds event listeners that needs to run in this context
        let closeBtns = alert.element.contentDocument.getElementsByClassName('popup__close');
        l = closeBtns.length;
        while (l-- > 0) {
            closeBtns[l].addEventListener('click', () => {
                this.destroyAlert(alert);    
            });
        }
        
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

export default new AlertController();
