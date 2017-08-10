import * as log from '../log';

export default class CurrentMouseEvent {
    public getCurrentMouseEvent:()=>MouseEvent;
    constructor() {
        let mousedownQueue:MouseEvent[] = [];
        let mouseupQueue:MouseEvent[] = [];
        let clickQueue:MouseEvent[] = [];

        const removeFromQueue = (array, el) => {
            let i = array.indexOf(el);
            if (i != -1) { array.splice(i, 1); }
        };

        const captureListener = (queue) => {
            return (evt) => {
                queue.push(evt);
                setTimeout(removeFromQueue.bind(null, queue, evt));
            };
        };

        window.addEventListener('mousedown', captureListener(mousedownQueue), true);
        window.addEventListener('mouseup', captureListener(mouseupQueue), true);
        window.addEventListener('click', captureListener(clickQueue), true);

        const getLatest = (queue) => {
            let l = queue.length;
            let evt;
            while (!evt || !evt.currentTarget) {
                if (l === 0) { break; }
                evt = queue[--l];
            }
            return evt;
        };

        const compareTimestamp = (a:Event, b:Event) => {
            if (!a) { return 1; }
            if (!b) { return -1; }
            return b.timeStamp - a.timeStamp;
        };

        this.getCurrentMouseEvent = () => {
            log.call('getCurrentClickEvent');
            let md = getLatest(mousedownQueue);
            let mu = getLatest(mouseupQueue);
            let cl = getLatest(clickQueue);
            let evt = [md, mu, cl].sort(compareTimestamp)[0];
            log.print('Retrieved event is: ', evt);
            log.callEnd();
            return evt;
        };
    }
}
