import { shadowDomV1Support } from '../../../shared/dom';
import { concatStyle } from '../../ui_utils';
import IFrameInjector from './IFrameInjector';
import { isUndef } from '../../../shared/instanceof';
import { getSafeDocument } from './get_safe_document';
import SingleEventEmitter from '../../../shared/SingleEventEmitter';

/**
 * It is a common practice for us to inject UI elements to page's DOM.
 * This class provides an abstraction of such 
 */
export default class FrameInjector extends SingleEventEmitter implements IFrameInjector {
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

    private static shadowRoot:ShadowRoot
    private static getShadowRoot() {
        let shadowRoot = FrameInjector.shadowRoot;
        if (isUndef(shadowRoot)) {
            let host = getSafeDocument().createElement('div');
            shadowRoot = FrameInjector.shadowRoot = host.attachShadow({ mode: 'closed' });
            let hostStyleEl = getSafeDocument().createElement('style');
            hostStyleEl.textContent = `:host{${concatStyle(FrameInjector.shadowHostStyle, true)}}`;
            shadowRoot.appendChild(hostStyleEl);
            document.documentElement.appendChild(host);
        }
        return shadowRoot;
    }

    private static detach(el:Node) {
        let parent = el.parentNode;
        if (!parent) { return; }
        parent.removeChild(el);
    }

    private static instances:FrameInjector[] = [];

    constructor() {
        super('load');
        let iframe = this.iframe = getSafeDocument().createElement('iframe');
        iframe.setAttribute('allowTransparency', 'true');

        if (FrameInjector.isIE10OrLower()) {
            // Workaround for https://github.com/AdguardTeam/PopupBlocker/issues/67
            iframe.src = `javascript:document.write('<script>document.domain="${document.domain}";</script>');document.close();`;
        }
        this.$install(iframe);
        FrameInjector.instances.push(this);
    }

    handleEvent(evt:Event) {
        if (this.loadedOnce) { return; }
        if (!evt.isTrusted) { return; }
        this.loadedOnce = true;
        let listeners = this.listeners;
        for (let i = 0, l = listeners.length; i < l; i++) {
            let cb = listeners[i];
            cb();
        }
    }

    inject() {
        if (shadowDomV1Support) {
            FrameInjector.getShadowRoot().appendChild(this.iframe);
        } else {
            document.documentElement.appendChild(this.iframe);
        }
    }

    getFrameElement() {
        return this.iframe;
    }

    // Made public to be accessed in handleEvent method body
    public loadedOnce:boolean = false;

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
