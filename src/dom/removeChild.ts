import { wrapMethod } from '../proxy';

// @ifdef DEBUG
wrapMethod(Node.prototype, 'appendChild'); //This cause too much noise during document startup
wrapMethod(Node.prototype, 'removeChild');
// @endif
