/* eslint-disable no-plusplus */
/**
 * @fileoverview Certain popunder scripts exploits chrome pdf plugin to gain focus of a window.
 * The purpose of this mutation observer is to detect an insertion of pdf document during a short time
 * after a popup is blocked, and neutralize it.
 * Without this, a prompt window "Please wait..." can be displayed. This can also be prevented by
 * aborting a popunder script's execution, but I suppose this is a more gentle way.
 */

import MO from './mutation-observer';
import {
    getTime,
    isElement,
    log,
} from '../shared';

class PdfObjectObserver {
    private observer:MutationObserver;

    private lastActivated = 0;

    private static readonly OBSERVE_TIME = 500;

    private static readonly pdfObjectSelector = 'object[data^="data:application/pdf"]';

    private static readonly option:MutationObserverInit = {
        childList: true,
        subtree: true,
    };

    private static neutralizeDummyPdf = (el:Element):void => {
        el.removeAttribute('data');
    };

    private callback:MutationCallback = log.connect((mutations) => {
        log.print('mutations:', mutations);
        let i = mutations.length;
        while (i--) {
            const mutation = mutations[i];
            const { addedNodes } = mutation;
            if (addedNodes) {
                let j = addedNodes.length;
                while (j-- > 0) {
                    const addedNode = addedNodes[j];
                    if (isElement(addedNode)) {
                        const objectNodes = addedNode.querySelectorAll(PdfObjectObserver.pdfObjectSelector);
                        if (objectNodes) {
                            let k = objectNodes.length;
                            while (k-- > 0) {
                                const objectNode = objectNodes[k];
                                PdfObjectObserver.neutralizeDummyPdf(objectNode);
                            }
                        }
                    }
                }
            }
        }
    }, 'pdfObjectObserver callback fired');

    constructor() {
        if (MO) {
            this.observer = new MO(this.callback);
        }
    }

    $start():void {
        if (this.observer && this.lastActivated === 0) {
            const docEl = document.documentElement;
            this.observer.observe(docEl, PdfObjectObserver.option);
            log.print(`MO started at ${getTime()}`);
            this.lastActivated = getTime();
        }
        setTimeout(() => {
            log.print(`MO stopped at ${getTime()}`);
            this.stop();
        }, PdfObjectObserver.OBSERVE_TIME);
    }

    private stop():void {
        if (this.observer && this.lastActivated !== 0) {
            this.observer.disconnect();
            this.lastActivated = 0;
        }
    }
}

export default new PdfObjectObserver();
