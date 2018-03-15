import * as log from '../shared/log';

export default class CurrentMouseEvent {
    public getCurrentMouseEvent:()=>MouseEvent;
    constructor() {
        const mousedownQueue:MouseEvent[] = [];
        const mouseupQueue:MouseEvent[] = [];
        const clickQueue:MouseEvent[] = [];
        const removeFromQueue = (array, el) => {
            let i = array.indexOf(el);
            if (i != -1) { array.splice(i, 1); }
        };
        const captureListener = (queue) => {
            return (evt) => {
                queue.push(evt);
                /**
                 * Schedules dequeueing in next task. It will be executed once all event handlers
                 * for the current event fires up. Note that task queue is flushed between the end of
                 * `mousedown` event handlers and the start of `mouseup` event handlers, but may not between
                 * the end of `mouseup` and `click` depending on browsers.
                 */
                setTimeout(removeFromQueue.bind(null, queue, evt));
            };
        };
        window.addEventListener('mousedown', captureListener(mousedownQueue), true);
        window.addEventListener('mouseup', captureListener(mouseupQueue), true);
        window.addEventListener('click', captureListener(clickQueue), true);
        /**
         * Some events in event queues may have been finished firing event handlers,
         * either by bubbling up to `window` or by `Event#(stopPropagation,stopImmediatePropagation)`
         * or by `Event#cancelBubble`. Such events will satisfy `.currentTarget === null`. We skip
         * such events.
         */
        const getLatest = (queue) => {
            let l = queue.length;
            let evt;
            while (!evt || !evt.currentTarget) {
                if (l === 0) { return undefined; }
                evt = queue[--l];
            }
            return evt;
        };
        /**
         * When there are latest events of different types,
         * we choose the latest one.
         */
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
            let evt = [cl, md, mu].sort(compareTimestamp)[0];
            log.print('Retrieved event is: ', evt);
            log.callEnd();
            return evt;
        };
    }
}
