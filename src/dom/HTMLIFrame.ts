/**
 * @fileoverview Applies the userscript to iframes which has `location.href` `about:blank`.
 * It evaluates the code to the iframe's contentWindow when its getter is called for the first time.
 * There is a 2-way binding we are maintaining in proxy.ts between objects and proxied objects,
 * and this must be shared to the iframe, because objects can be passed back and forth between
 * the parent and the child iframes. To do so, we temporarily expose 2 weakmaps to the global scope
 * just before calling `eval`, and deletes it afterwards.
 * When debugging is active, iframe elements are printed to consoles, and some browsers may
 * invoke the contentWindow's getter. This may cause an infinite loop, so we do not apply the main block of eval'ing
 * the userscript when it is being processed, and to do so, we store such informaction in a `beingProcessed` WeakMap instance.
 */

import { expose, unexpose, ApplyHandler, makeObjectProxy, wrapAccessor } from '../proxy';
import * as log from '../shared/log';
import WeakMap from '../weakmap';

const processed = new WeakMap();
// @ifdef DEBUG
const beingProcessed = new WeakMap();
// @endif

const getContentWindow = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow').get;

const applyPopupBlockerOnGet:ApplyHandler = function(_get, _this) {
    let ret;
    if (!processed.has(_this)) {
        // @ifdef DEBUG
        if (!beingProcessed.has(_this)) {
        // @endif
            log.call('getContent');
            // @ifdef DEBUG
            beingProcessed.set(_this, true);
            // @endif
            let key = Math.random().toString(36).substr(7);
            let contentWindow = getContentWindow.call(_this);
            try {
                if (contentWindow.location.href === 'about:blank') {
                    log.print('An empty iframe called the contentWindow/Document getter for the first time, applying popupBlocker..', _this);
                    expose(key);
                    let code =
                        // @ifdef RECORD
                        'window.__t = '  +
                        // @endif
                        '(' + popupBlocker.toString() + ')(window,"' + key + '");';
                    contentWindow.eval(code);
                    unexpose(key);
                    ret = makeObjectProxy(_get.call(_this));
                }
            } catch(e) {
                log.print('Applying popupBlocker to an iframe failed, due to an error:', e);
            } finally {
                processed.set(_this, true);
                // @ifdef DEBUG
                beingProcessed.delete(_this);
                // @endif
                log.callEnd();
            }
        // @ifdef DEBUG
        }
        // @endif
    }
    return ret || _get.call(_this);
};

wrapAccessor(HTMLIFrameElement.prototype, 'contentWindow', applyPopupBlockerOnGet);
wrapAccessor(HTMLIFrameElement.prototype, 'contentDocument', applyPopupBlockerOnGet);

// @ifdef DEBUG
wrapAccessor(HTMLIFrameElement.prototype, 'src'); // logging only
wrapAccessor(HTMLIFrameElement.prototype, 'srcdoc');
// @endif
