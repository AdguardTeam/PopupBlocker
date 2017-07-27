import { wrapAccessor } from '../proxy';

wrapAccessor(HTMLIFrameElement.prototype, 'data');
