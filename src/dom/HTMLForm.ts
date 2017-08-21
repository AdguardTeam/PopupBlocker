import { wrapAccessor } from '../proxy';

// @ifdef DEBUG
// This will be used on mobile popunders
wrapAccessor(HTMLFormElement.prototype, 'target');
// @endif
