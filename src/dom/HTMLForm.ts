import { wrapAccessor } from '../proxy';

// This will be used on mobile popunders
// @ifdef DEBUG
wrapAccessor(window.HTMLFormElement.prototype, 'target');
// @endif
