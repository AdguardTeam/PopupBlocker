import { retrieveEvent, verifyEvent, maybeOverlay } from '../../src/events/verify-event';

const expect = chai.expect;
const getEvt = () => {
    let evt = window.event = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
    return evt;
};

describe('retrieveEvent', function() {
    it('returns window.event if available', function() {
        if ('event' in window) {
            var desc = Object.getOwnPropertyDescriptor(window, 'event');
            if (desc && desc.set) { // Otherwise, the 'hack' of setting window.event directly for testing won't work. IE works in this way.
                var evt = window.event = getEvt();
                expect(retrieveEvent()).to.be.equal(evt);
                window.event = undefined;
            }
        }
    });
    it('retrieves value from the call stack when window.event is unavailable', function(done) {
        var evt = window.event = getEvt();
        var retrieved;
        setTimeout(function() {
            window.event = undefined;
            retrieved = retrieveEvent();
            expect(retrieved).to.be.equal(evt);
            done();
        }.bind(null, evt), 100);
    });
});

describe('verifyEvent', function() {
    it('returns true for non-dispatched events', function() {
        var evt = window.event = getEvt();
        expect(verifyEvent(evt)).to.be.true;
    });
    it('returns false for events of which currentTarget is document', function() {
        var evt = getEvt();
        document.addEventListener('click', function(evt) {
            expect(verifyEvent(evt)).to.be.false;
        });
        document.dispatchEvent(evt);
    });
});

describe('maybeOverlay', function() {
    it('detects position:absolute;left:0;top:0;width:100%;height:100%;z-index:2147483647', function() {
        var el = document.createElement('div');
        el.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;z-index:2147483647';
        document.body.appendChild(el);
        expect(maybeOverlay(el)).to.be.true;
        document.body.removeChild(el);
    });
});
