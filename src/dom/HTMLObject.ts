import { wrapAccessor } from '../proxy';

// @ifdef DEBUG
wrapAccessor(window.HTMLObjectElement.prototype, 'data');
// @endif
