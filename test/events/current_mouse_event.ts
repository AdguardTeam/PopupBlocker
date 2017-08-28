import CurrentMouseEvent from '../../src/events/current_mouse_event';

const currentEvent = (new CurrentMouseEvent()).getCurrentMouseEvent;

const expect = chai.expect;
const getEvt = (type) => {
    let evt = window.event = document.createEvent("MouseEvents");
    evt.initMouseEvent(type, true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
    return evt;
};

const types = ['mousedown', 'mouseup', 'click'];

// Gets a random mouseevent type.
const getType = () => {
    return types[Math.floor(Math.random() * 3)]
};

describe('CurrentMouseEvent', function () {
    it('retrieves a current mouse event in multiple nested event handlers', function(done) {
        this.timeout(5000);
        const LIMIT = 1000;
        let counter = 0;

        let pr = typeof Promise !== 'undefined' ? Promise : { resolve: () => ({ then: (fn) => {fn();} }) };

        const callback = function(evt) {
            counter++;
            // Tests whether currentEvent returns the right event.
            let retrieved = currentEvent();
            expect(retrieved).to.equal(evt);
            
            if (counter < LIMIT) {
                switch (counter % 7) {
                    case 0:
                        setTimeout(document.body.dispatchEvent(getEvt(getType())));
                        break;
                    case 1:
                        pr.resolve().then(() => { document.body.dispatchEvent(getEvt(getType())); });
                        break;
                    case 2:
                    case 3:
                    case 4:
                        document.body.dispatchEvent(getEvt(getType()));
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
                        setTimeout(() => {
                            console.log(`dispatched total ${counter} events`)
                            done();
                        }, 500);
                    })
                })
            })
        });
    });
});
