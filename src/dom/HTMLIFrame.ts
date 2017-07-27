import { ApplyHandler, wrapAccessor } from '../proxy';
import log from '../log';
import WeakMap from '../weakmap';

const processedIfr = new WeakMap();
// @ifdef DEBUG
const beingProcessed = new WeakMap();
// @endif
const getContentWindow = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow').get;

const applyPopupBlockerOnGet:ApplyHandler = function(_get, _this) {
    if ( processedIfr.has(_this) ) { return _get.call(_this); }
    // @ifdef DEBUG
    // Prevent infinite loop when console.log on certain browsers inquires contentWindow to display iframes in console
    if ( beingProcessed.has(_this) ) { return _get.call(_this); }
    else { beingProcessed.set(_this, true); }
    // @endif
    try {
        log('An iframe called the contentWindow/Document getter for the first time, applying popupBlocker..', _this);
        getContentWindow.call(_this).eval('new ' + popupBlocker.toString() + '(window);');
    } catch(e) {
        log('Applying popupBlocker to an iframe failed, due to an error:', e);
    } finally {
        processedIfr.set(_this, true);
        // @ifdef DEBUG
        beingProcessed.delete(_this);
        // @endif
        return _get.call(_this);
    }
};

wrapAccessor(HTMLIFrameElement.prototype, 'contentWindow', applyPopupBlockerOnGet);
wrapAccessor(HTMLIFrameElement.prototype, 'contentDocument', applyPopupBlockerOnGet);

wrapAccessor(HTMLIFrameElement.prototype, 'src'); // logging only
wrapAccessor(HTMLIFrameElement.prototype, 'srcdoc'); 
