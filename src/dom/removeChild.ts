import { wrapMethod } from '../proxy';

// @ifdef DEBUG
wrapMethod(window.Node.prototype, 'appendChild'); //This cause too much noise during document startup
wrapMethod(window.Node.prototype, 'removeChild');
// @endif
