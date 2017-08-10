import { wrapMethod } from '../proxy';

// @ifdef DEBUG
wrapMethod(Document.prototype, 'write');
wrapMethod(Document.prototype, 'writeIn');
// @endif