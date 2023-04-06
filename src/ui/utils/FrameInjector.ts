import {
    SingleEventEmitter,
    shadowDomV1Support,
    isUndef,
} from '../../shared';
import { concatStyle, getSafeDocument } from './ui-utils';

/**
 * FrameInjector abstracts away an operation of injecting iframe on page's context.
 */
export interface IFrameInjector {
    /**
     * Injects an iframe to the page's dom. It causes `load` event listeners to fire.
     */
    inject():void
    /**
     * A method to read iframe node that is injected.
     */
    getFrameElement():HTMLIFrameElement
    /**
     * Add load event handlers to fire when the frame is injected with `inject` method.
     * The instance's implementation is responsible for filtering out other `load` events.
     */
    addListener(eventHandler:func):void
    /**
     * Completely removes the UI injected to the page DOM. The instance cannot be used after
     * this method is called.
     */
    $destroy():void
}

/**
 * It is a common practice for us to inject UI elements to page's DOM.
 * This class provides an abstraction of such
 */
export class FrameInjector extends SingleEventEmitter implements IFrameInjector {
    private iframe:HTMLIFrameElement;

    private shadowHostEl:HTMLElement;

    private static readonly shadowHostStyle = [
        'display', 'block',
        'position', 'relative',
        'width', String(0),
        'height', String(0),
        'margin', String(0),
        'padding', String(0),
        'overflow', 'hidden',
        // eslint-disable-next-line no-bitwise
        'z-index', String(-1 - (1 << 31)),
    ];

    private static isIE10OrLower():boolean {
        const { documentMode } = document;
        return documentMode < 11;
    }

    private static shadowRoot:ShadowRoot;

    private static getShadowRoot() {
        let { shadowRoot } = FrameInjector;
        if (isUndef(shadowRoot)) {
            const host = getSafeDocument().createElement('div');

            shadowRoot = FrameInjector.shadowRoot = host.attachShadow({ mode: 'closed' });
            const hostStyleEl = getSafeDocument().createElement('style');
            hostStyleEl.textContent = `:host{${concatStyle(FrameInjector.shadowHostStyle, true)}}`;
            shadowRoot.appendChild(hostStyleEl);
            document.documentElement.appendChild(host);
        }
        return shadowRoot;
    }

    private static detach(el:Node) {
        const parent = el.parentNode;
        if (!parent) { return; }
        parent.removeChild(el);
    }

    private static instances:FrameInjector[] = [];

    constructor() {
        super('load');
        const iframe = this.iframe = getSafeDocument().createElement('iframe');
        iframe.setAttribute('allowTransparency', 'true');

        if (FrameInjector.isIE10OrLower()) {
            // Workaround for https://github.com/AdguardTeam/PopupBlocker/issues/67
            // eslint-disable-next-line max-len
            iframe.src = `javascript:document.write('<script>document.domain="${document.domain}";</script>');document.close();`;
        }
        this.$install(iframe);
        FrameInjector.instances.push(this);
    }

    handleEvent(evt:Event) {
        if (this.loadedOnce) { return; }
        if (!evt.isTrusted) { return; }
        this.loadedOnce = true;
        const { listeners } = this;
        for (let i = 0, l = listeners.length; i < l; i += 1) {
            const cb = listeners[i];
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
    public loadedOnce = false;

    $destroy() {
        const i = FrameInjector.instances.indexOf(this);
        if (i === -1) { return; }

        FrameInjector.instances.splice(i, 1);

        const { iframe } = this;
        FrameInjector.detach(iframe);
        iframe.removeEventListener('load', this);
        this.iframe = undefined;

        if (shadowDomV1Support && FrameInjector.instances.length === 0) {
            // detach shadowRoot when it is no longer used.
            const { host } = FrameInjector.shadowRoot;
            FrameInjector.detach(host);
            FrameInjector.shadowRoot = undefined;
        }
    }
}
