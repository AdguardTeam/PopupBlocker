import { retrieveEvent, verifyEvent } from '../../src/events/verify';

const { expect } = chai;

// Assigning `window.event`, as the tests below do, replaces the native accessor with a plain
// data property. Without putting the accessor back, every later test would read a stale event.
const windowEventDescriptor = Object.getOwnPropertyDescriptor(window, 'event');
const restoreWindowEvent = () => {
    if (windowEventDescriptor) {
        Object.defineProperty(window, 'event', windowEventDescriptor);
    }
};

const getEvt = () => {
    const evt = document.createEvent('MouseEvents');
    window.event = evt;
    evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
    return evt;
};

describe('retrieveEvent', () => {
    afterEach(restoreWindowEvent);

    it('returns window.event if available', () => {
        if ('event' in window) {
            const desc = Object.getOwnPropertyDescriptor(window, 'event');
            if (desc && desc.set) {
                // Otherwise, the 'hack' of setting window.event directly for testing won't work. IE works in this way.
                const evt = getEvt();
                window.event = evt;
                expect(retrieveEvent()).to.be.equal(evt);
                window.event = undefined;
            }
        }
    });
    it('retrieves value from the call stack when window.event is unavailable', (done) => {
        const evt = getEvt();
        window.event = evt;
        let retrieved;
        setTimeout((() => {
            window.event = undefined;
            retrieved = retrieveEvent();
            expect(retrieved).to.be.equal(evt);
            done();
        }).bind(null, evt), 100);
    });
});

describe('verifyEvent', () => {
    afterEach(restoreWindowEvent);

    it('returns true for non-dispatched events', () => {
        const evt = getEvt();
        window.event = evt;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(verifyEvent(evt)).to.be.true;
    });
    it('returns false for events of which currentTarget is document', () => {
        const evt = getEvt();
        let result: boolean;
        const listener = (event: Event) => {
            result = verifyEvent(event);
        };
        document.addEventListener('click', listener);
        try {
            document.dispatchEvent(evt);
        } finally {
            // Must not outlive the test, or it would run against every later click on the page
            document.removeEventListener('click', listener);
        }
        expect(result).to.equal(false);
    });
});
