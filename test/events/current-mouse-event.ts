import CurrentMouseEvent from '../../src/events/current-mouse-event';

const currentEvent = (new CurrentMouseEvent()).getCurrentMouseEvent;

const { expect } = chai;
const getEvt = (type) => {
    const evt = document.createEvent('MouseEvents');
    window.event = document.createEvent('MouseEvents');
    evt.initMouseEvent(type, true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
    return evt;
};

const types = ['mousedown', 'mouseup', 'click'];

// Gets a random mouseevent type.
const getType = () => types[Math.floor(Math.random() * 3)];

describe('CurrentMouseEvent', () => {
    it('retrieves a current mouse event in multiple nested event handlers', function (done) {
        this.timeout(5000);
        const LIMIT = 1000;
        let counter = 0;

        const pr = typeof Promise !== 'undefined' ? Promise : { resolve: () => ({ then: (fn) => { fn(); } }) };

        const getRndEvt = () => {
            const evt = getEvt(getType());
            // @ts-ignore
            evt.counter = counter;
            return evt;
        };

        const callback = (evt) => {
            counter += 1;
            // Tests whether currentEvent returns the right event.
            const { timeStamp, offsetX, offsetY } = currentEvent();

            expect(timeStamp).to.equal(evt.timeStamp);
            expect(offsetX).to.equal(evt.offsetX);
            expect(offsetY).to.equal(evt.offsetY);

            if (counter < LIMIT) {
                switch (counter % 7) {
                    case 0:
                        document.body.dispatchEvent(getRndEvt());
                        break;
                    case 1:
                        pr.resolve().then(() => { document.body.dispatchEvent(getRndEvt()); });
                        break;
                    case 2:
                    case 3:
                    case 4:
                        document.body.dispatchEvent(getRndEvt());
                        break;
                    default:
                        break;
                }
            }
            // Occasionally stops bubbling.
            switch (counter % 10) {
                case 0:
                    evt.stopPropagation();
                    break;
                case 1:
                    evt.stopImmediatePropagation();
                    break;
                case 2:
                    // eslint-disable-next-line no-param-reassign
                    evt.cancelBubble = true;
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('mousedown', callback);
        document.addEventListener('mousedown', callback, true);
        document.body.addEventListener('mousedown', callback);

        document.addEventListener('mouseup', callback);
        document.addEventListener('mouseup', callback, true);
        document.body.addEventListener('mouseup', callback);

        document.addEventListener('click', callback);
        document.addEventListener('click', callback, true);
        document.body.addEventListener('click', callback);

        document.body.dispatchEvent(getRndEvt());

        setTimeout(() => {
            setTimeout(() => {
                setTimeout(() => {
                    setTimeout(() => {
                        setTimeout(() => {
                            // eslint-disable-next-line no-console
                            console.log(`dispatched total ${counter} events`);
                            done();
                        }, 500);
                    });
                });
            });
        });
    });
});
