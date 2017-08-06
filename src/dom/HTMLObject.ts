import { wrapAccessor } from '../proxy';

// @ifdef DEBUG
wrapAccessor(HTMLObjectElement.prototype, 'data');
// @endif
