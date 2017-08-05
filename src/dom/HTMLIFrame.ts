import { expose, unexpose, ApplyHandler, makeObjectProxy, wrapAccessor } from '../proxy';
import * as log from '../log';
import WeakMap from '../weakmap';

const processed = new WeakMap();
// @ifdef DEBUG
const beingProcessed = new WeakMap();
// @endif
const getContentWindow = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow').get;

const applyPopupBlockerOnGet:ApplyHandler = function(_get, _this) {
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
                    // @ifdef DEBUG
                    'window.__t = ' +
                    // @endif
                    '(' + popupBlocker.toString() + ')(window,"' + key + '");';
                    contentWindow.eval(code);
                }
            } catch(e) {
                log.print('Applying popupBlocker to an iframe failed, due to an error:', e);
            } finally {
                unexpose(key);
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
    return makeObjectProxy(_get.call(_this));
};

wrapAccessor(HTMLIFrameElement.prototype, 'contentWindow', applyPopupBlockerOnGet);
wrapAccessor(HTMLIFrameElement.prototype, 'contentDocument', applyPopupBlockerOnGet);

wrapAccessor(HTMLIFrameElement.prototype, 'src'); // logging only
wrapAccessor(HTMLIFrameElement.prototype, 'srcdoc'); 
