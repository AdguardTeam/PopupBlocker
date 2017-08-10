import CurrentMouseEvent from '../../src/events/current-mouse-event';

const currentEvent = (new CurrentMouseEvent()).getCurrentMouseEvent;

const expect = chai.expect;
const getEvt = (type) => {
    let evt = window.event = document.createEvent("MouseEvents");
    evt.initMouseEvent(type, true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
    return evt;
};

const types = ['mousedown', 'mouseup', 'click'];

const getType = () => {
    return types[Math.floor(Math.random() * 3)]
};

describe('CurrentClickEvent', function () {
    it('retrieves a current click event in multiple nested event handlers', function(done) {
        const LIMIT = 100;
        let counter = 0;

        const callback = function(evt) {
            counter++;
            expect(currentEvent()).to.equal(evt);
            if (counter < LIMIT) {
                console.log('dispatching...');
                document.body.dispatchEvent(getEvt(getType()));
            }
            switch (counter % 10) {
                case 0:
                    evt.stopPropagation();
                    break;
                case 1:
                    evt.stopImmediatePropagation();
                    break;
                case 2:
                    evt.cancelBubble = true;
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

        document.body.dispatchEvent(getEvt(getType()));

        setTimeout(() => {
            setTimeout(() => {
                setTimeout(() => {
                    setTimeout(() => {
                        setTimeout(done);
                    })
                })
            })
        });
    });
});
