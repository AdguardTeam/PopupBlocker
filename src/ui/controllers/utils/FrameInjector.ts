import { shadowDomV1Support } from '../../../shared/dom';
import { concatStyle } from '../../ui_utils';
import IFrameInjector from './IFrameInjector';
import { isUndef } from '../../../shared/instanceof';

/**
 * It is a common practice for us to inject UI elements to page's DOM.
 * This class provides an abstraction of such 
 */
export default class FrameInjector implements IFrameInjector {
    private iframe:HTMLIFrameElement
    private shadowHostEl:HTMLElement

    private static readonly shadowHostStyle = [
        "display",  "block",
        "position", "relative",
        "width",     String(0),
        "height",    String(0),
        "margin",    String(0),
        "padding",   String(0),
        "overflow", "hidden",
        "z-index",   String(-1 - (1 << 31))
    ];

    private static isIE10OrLower():boolean {
        let documentMode = document.documentMode;
        return documentMode < 11;
    }

    private static safeDoc:HTMLDocument
    private static getSafeDocument():HTMLDocument {
        let safeDoc = FrameInjector.safeDoc;
        if (isUndef(safeDoc)) {
            safeDoc = FrameInjector.safeDoc = document.implementation.createHTMLDocument('');
        }
        return safeDoc;
    }

    private static shadowRoot:ShadowRoot
    private static getShadowDOM() {
        if (FrameInjector.shadowRoot) { return; }
        let host = FrameInjector.getSafeDocument().createElement('div');
        let root = FrameInjector.shadowRoot = host.attachShadow({ mode: 'closed' });
        let hostStyleEl = FrameInjector.getSafeDocument().createElement('style');
        hostStyleEl.textContent = `:host{${concatStyle(FrameInjector.shadowHostStyle, true)}}`;
        root.appendChild(hostStyleEl);
        document.documentElement.appendChild(host);
    }

    private static detach(el:Node) {
        let parent = el.parentNode;
        if (!parent) { return; }
        parent.removeChild(el);
    }

    private static instances:FrameInjector[] = [];

    constructor() {
        let iframe = this.iframe = FrameInjector.getSafeDocument().createElement('iframe');
        iframe.setAttribute('allowTransparency', 'true');

        if (FrameInjector.isIE10OrLower()) {
            // Workaround for https://github.com/AdguardTeam/PopupBlocker/issues/67
            iframe.src = `javascript:document.write('<script>document.domain="${document.domain}";</script>');document.close();`;
        }

        iframe.addEventListener('load', this);

        FrameInjector.instances.push(this);
    }

    inject() {
        if (shadowDomV1Support) {
            FrameInjector.getShadowDOM();
            FrameInjector.shadowRoot.appendChild(this.iframe);
        } else {
            document.documentElement.appendChild(this.iframe);
        }
    }

    getFrameElement() {
        return this.iframe;
    }

    // Made public to be accessed in handleEvent method body
    public loadedOnce:boolean = false;
    public handleEvent:(this:this, evt:Event)=>void
    public onLoadListeners:func[] = [];
    addOnLoadListener(eventHandler:func) {
        this.onLoadListeners.push(eventHandler);
    }

    $destroy() {
        let i = FrameInjector.instances.indexOf(this);
        if (i === -1) { return; }

        FrameInjector.instances.splice(i, 1);

        let iframe = this.iframe;
        FrameInjector.detach(iframe);
        iframe.removeEventListener('load', this);
        this.iframe = undefined;

        if (shadowDomV1Support && FrameInjector.instances.length === 0) {
            // detach shadowRoot when it is no longer used.
            let host = FrameInjector.shadowRoot.host;
            FrameInjector.detach(host);
            FrameInjector.shadowRoot = undefined;
        }
    }
}

FrameInjector.prototype.handleEvent = function (evt:Event) {
    if (this.loadedOnce) { return; }
    if (!evt.isTrusted) { return; }
    this.loadedOnce = true;
    let listeners = this.onLoadListeners;
    for (let i = 0, l = listeners.length; i < l; i++) {
        let cb = listeners[i];
        cb();
    }
}
