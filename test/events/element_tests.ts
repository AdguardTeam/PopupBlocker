import { maybeOverlay } from '../../src/events/element_tests';

const expect = chai.expect;

describe('maybeOverlay', function() {
    it('detects position:absolute;left:0;top:0;width:100%;height:100%;z-index:2147483647', function() {
        var el = document.createElement('div');
        el.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;z-index:2147483647';
        document.body.appendChild(el);
        expect(maybeOverlay(el)).to.be.true;
        document.body.removeChild(el);
    });
});
