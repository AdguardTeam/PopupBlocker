import { wrapAccessor } from '../proxy';

wrapAccessor(HTMLObjectElement.prototype, 'data');
