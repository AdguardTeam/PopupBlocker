import IChildContextInjector from "./IChildContextInjector";
import IProxyService, { IWrappedExecutionContext } from './IProxyService';
import * as TypeGuards from '../shared/instanceof';
import * as debug from '../shared/debug';
import { ABOUT_PROTOCOL, isSameOrigin } from '../shared/url';
import WeakMap from '../shared/WeakMap';
import { getOwnPropertyDescriptor, defineProperty, MO, functionBind, getContentWindow, getContentDocument } from "../shared/protected_api";

export default class ChildContextInjector implements IChildContextInjector {
    /**
     * A Weakmap instance that maps iframe elements to its contentDocument.
     * If an iframe's contentDocument is not available, it is mapped to `null`.
     */
    private frameToDocument:IWeakMap<HTMLIFrameElement, Document>
    private callbacks:func[] = [];
    constructor(
        private $window:Window,
        private proxyService:IProxyService,
        private instanceID:string
    ) {
        this.onFrameLoad = functionBind.call(this.onFrameLoad, this);
        this.processChildOnContentAccess = functionBind.call(this.processChildOnContentAccess, this);
        // Initialize
        const iframePType = $window.HTMLIFrameElement.prototype;
        this.frameToDocument = new WeakMap();
        proxyService.wrapAccessor(iframePType, 'contentWindow', this.processChildOnContentAccess);
        proxyService.wrapAccessor(iframePType, 'contentDocument', this.processChildOnContentAccess);
        this.observeChildFrames($window);
    }
    private childFrameObserver:MutationObserver;
    private observeChildFrames(window:Window) {
        if (!MO) { return; }
        if (!this.childFrameObserver) {
            this.childFrameObserver = new MO((mutations) => {
                for (let i = 0, j = mutations.length; i < j; i++) {
                    let mutation = mutations[i];
                    let addedNodes = mutation.addedNodes
                    for (let k = 0, l = addedNodes.length; k < l; k++) {
                        let addedNode = addedNodes[k];
                        if (TypeGuards.isIFrame(addedNode)) {
                            this.processChildFrameIfNew(addedNode);
                        } else if (TypeGuards.isElement(addedNode)) {
                            let iframes = <NodeListOf<HTMLIFrameElement>>addedNode.getElementsByTagName('IFRAME');
                            for (let m = 0, n = iframes.length; m < n; m++) {
                                let iframe = iframes[m];
                                this.processChildFrameIfNew(iframe);
                            }
                        }
                    }
                }
            });
        }
        this.childFrameObserver.observe(window.document.documentElement, {
            childList: true,
            subtree: true
        });
    }
    private processChildFrameIfNew(iframe:HTMLIFrameElement) {
        let prevDoc = this.frameToDocument.get(iframe);
        if (!TypeGuards.isUndef(prevDoc)) {
            // We've already processed this frame, returning.
            return;
        }
        // New iframe element
        debug.print("ChildContextInjector: attaching an event listener to a first met frame");
        iframe.addEventListener('load', this.onFrameLoad);
        try {
            let contentWin:Window = getContentWindow.call(iframe);
            if (contentWin.location.protocol === ABOUT_PROTOCOL) {
                debug.print("ChildContextInjector: new child context encountered.", iframe.outerHTML);
                this.frameToDocument.set(iframe, contentWin.document);
                this.processChildWindow(contentWin);
                /**
                 * {@link https://dev.w3.org/html5/spec-preview/history.html#navigate}
                 * 
                 *    First, a new Window object must be created and associated with the Document, with one exception:
                 *    if the browsing context's only entry in its session history is the about:blank Document that was
                 *    added when the browsing context was created, and navigation is occurring with replacement enabled,
                 *    and that Document has the same origin as the new Document, then the Window object of that Document
                 *    must be used instead, and the document attribute of the Window object must be changed to point to
                 *    the new Document instead.
                 * 
                 * This exception clause is applied when there is an iframe whose src attribute is set to be same-origin,
                 * and its `contentWindow` is accessed after the iframe is attached to the document very quickly,
                 * either synchronously or in the next microtask queue.
                 * Note that, how such uninitialized empty frames' origins are treated can be browser-dependent.
                 * In such cases, the `Window` object will reused by the newly loaded document, so we set a global flag
                 * in order to prevent userscripts loaded to the document from running, to avoid overriding DOM Apis
                 * twice.
                 */
                let src = iframe.src;
                if (src && this.instanceID && isSameOrigin(src, this.$window.location, this.$window.document.domain)) {
                    debug.print("ChildContextInjector: setting a global flag");
                    ChildContextInjector.setNonEnumerableValue(contentWin, this.instanceID, undefined);
                }
            }
        } catch (e) {
            debug.print('Processing a child frame has failed, due to an error:', e);
            this.frameToDocument.set(iframe, null);
        }
    }
    private processChildOnContentAccess(ctxt:IWrappedExecutionContext<HTMLIFrameElement,any>, _arguments:IArguments) {
        let iframe = ctxt.thisArg;
        this.processChildFrameIfNew(iframe);
        return this.proxyService.makeObjectProxy(ctxt.invokeTarget(_arguments));
    }
    /**
     * This should be called when we are sure that `childWindow` is not subject to
     * CORS restrictions.
     */
    private processChildWindow(childWindow:Window) {
        const callbacks = this.callbacks;
        for (let i = 0, l = callbacks.length; i < l; i++) {
            callbacks[i](childWindow);
        }
    }
    private onFrameLoad(evt:Event) {
        const iframe = <HTMLIFrameElement>evt.target;
        try {
            let document:Document = getContentDocument.call(iframe);
            // If a loaded document has empty location, and it is different from the previous document,
            // We execute the callback again.
            if (document.location.protocol === ABOUT_PROTOCOL && this.frameToDocument.get(iframe) !== document) {
                debug.print("ChildContextInjector: a content of an empty iframe has changed.");
                this.frameToDocument.set(iframe, document);
                this.processChildWindow(document.defaultView);
            }
        } catch(e) {
            this.frameToDocument.set(iframe, null);
        }
    }
    private static setNonEnumerableValue(owner:object, prop:string, value:any) {
        defineProperty(owner, prop, {
            value,
            configurable: true
        });
    }
    registerCallback(callback:(win:Window)=>void):void {
        this.callbacks.push(callback);
    }
}

declare global {
    interface Window {
        HTMLIFrameElement:typeof HTMLIFrameElement
    }
}
