/**
 * @fileoverview Certain popunder scripts exploits chrome pdf plugin to gain focus of a window.
 * The purpose of this mutation observer is to detect an insertion of pdf document during a short time
 * after a popup is blocked, and neutralize it.
 * Without this, a prompt window "Please wait..." can be displayed. This can also be prevented by
 * aborting a popunder script's execution, but I suppose this is a more gentle way.
 */

import MO from './mutation_observer';
import getTime from '../shared/time';
import { isElement } from '../shared/instanceof';
import * as log from '../shared/log';

class PdfObjectObserver {
    private observer:MutationObserver
    private lastActivated:number = 0
    private static readonly OBSERVE_TIME = 200;
    private static readonly pdfObjectSelector = 'object[data^="data:application/pdf"]';
    private static readonly option:MutationObserverInit = {
        childList: true,
        subtree: true
    }
    private static neutralizeDummyPdf = (el:Element):void => {
        el.removeAttribute('data');
    }
    private callback:MutationCallback = log.connect((mutations, observer) => {
        log.print('mutations:', mutations);
        let i = mutations.length;
        while (i--) {
            let mutation = mutations[i];
            let addedNodes = mutation.addedNodes;
            if (addedNodes) {
                let j = addedNodes.length;
                while (j-- > 0) {
                    let addedNode = addedNodes[j];
                    if (isElement(addedNode)) {
                        let objectNodes = addedNode.querySelectorAll(PdfObjectObserver.pdfObjectSelector);
                        if (objectNodes) {
                            let k = objectNodes.length;
                            while (k-- > 0) {
                                let objectNode = objectNodes[k];
                                PdfObjectObserver.neutralizeDummyPdf(objectNode);
                            }
                        }
                    }
                }
            }
        }
    }, 'pdfObjectObserver callback fired')
    constructor() {
        if (MO)
            this.observer = new MO(this.callback);
    }
    start():void {
        log.print('MO started at ' + getTime());
        if (this.observer && this.lastActivated === 0) {
            this.observer.observe(document.documentElement, PdfObjectObserver.option);
            this.lastActivated = getTime();
        }
        setTimeout(() => {
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
