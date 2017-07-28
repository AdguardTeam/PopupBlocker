import { ApplyHandler, makeObjectProxy, wrapAccessor } from '../proxy';
import log from '../log';
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
            try {
                log('An iframe called the contentWindow/Document getter for the first time, applying popupBlocker..', _this);
                getContentWindow.call(_this).eval('(' + popupBlocker.toString() + ')();');
            } catch(e) {
                log('Applying popupBlocker to an iframe failed, due to an error:', e);
            } finally {
                processed.set(_this, true);
                // @ifdef DEBUG
                beingProcessed.delete(_this);
                // @endif
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
