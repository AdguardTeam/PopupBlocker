import { maybeOverlay } from '../../src/events/element-tests';

const { expect } = chai;

describe('maybeOverlay', () => {
    it('detects position:absolute;left:0;top:0;width:100%;height:100%;z-index:2147483647', () => {
        const el = document.createElement('div');
        el.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;z-index:2147483647';
        document.body.appendChild(el);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(maybeOverlay(el)).to.be.true;
        document.body.removeChild(el);
    });
});
