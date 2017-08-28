import createOpen from './before/create';
import aboutBlank from './before/about-blank';
import navigatePopupToItself from './after/navigate-popup-to-itself';
import { TimelineEvent, TLEventType } from './event';
import getTime from '../shared/time';
import WeakMap from '../weakmap';
import * as log from '../shared/log';

export type condition = (index:number, events:TimelineEvent[][], event?:TimelineEvent) => boolean|never;

const beforeTest:condition[] = [createOpen, aboutBlank];
const afterTest = [navigatePopupToItself];

const EVENT_RETENTION_LENGTH = 5000;

class Timeline {
    private events:TimelineEvent[][];
    private isRecording:boolean;
    constructor() {
        this.events = [[]];
        this.isRecording = false;
        // Registers a unique event when it is first created.
        this.registerEvent(new TimelineEvent(TLEventType.CREATE, undefined, undefined), 0);
    }
    /**
     * When an event is registered, it performs some checks by calling functions of type `condition`
     * which accepts an existing events as a first argument, and an incoming event as a second argument.
     * An object at which the event is happened is included in the event as a `data` property,
     * and such functions can act on it appropriately, for example, it can close a popup window.
     */
    registerEvent(event:TimelineEvent, index:number):void {
        let i = afterTest.length;
        while (i--) { afterTest[i](index, this.events, event); }
        let frameEvents = this.events[index];
        frameEvents.push(event);
        if (!this.isRecording) {
            setTimeout(() => {
                frameEvents.splice(frameEvents.indexOf(event), 1);
            }, EVENT_RETENTION_LENGTH);
        } else {
            let name:string = event.$name ? event.$name.toString() : '';
            log.print(`Timeline.registerEvent: ${event.$type} ${name}`, event.$data);
        }
    }
    /**
     * Wrapped window.open calls this. If it returns false, it does not call window.open.
     * beforeTests are basically the same as the afterTests except that
     * it does not accept a second argument.
     */
    canOpenPopup(index:number):boolean {
        log.call('Inquiring events timeline about whether window.open can be called...');
        let i = beforeTest.length;
        while (i--) {
            if (!beforeTest[i](index, this.events)) {
                log.print('false');
                log.callEnd();
                return false;
            }
        }
        log.print('true');
        log.callEnd();
        return true;
    }
    onNewFrame():number {
        let pos = this.events.push([]) - 1;
        // Registers a unique event when a frame is first created.
        this.registerEvent(new TimelineEvent(TLEventType.CREATE, undefined, undefined), pos);
        return pos;
    }
    /**
     * Below methods are used only for logging & testing purposes.
     * It does not provide any functionality to block popups,
     * and is stipped out in production builds.
     * In dev build, the timeline instance is exposed to the global scope with a name '__t',
     * and one can call below methods of it to inspect how the popup script calls browser apis.
     * In test builds, it is used to access a private member `events`.
     */
    // @ifdef RECORD
    startRecording():void {
        this.isRecording = true;
    }
    /**
     * Returns an array. Its elements corresponds to frames to which the current window
     * has access, and the first element corresponds to the current window.
     */
    takeRecords():TimelineEvent[][] {
        this.isRecording = false;
        let res = this.events.map((el) => (Array.prototype.slice.call(el)));
        let now = getTime();
        let l = this.events.length;
        while (l-- > 0) {
            let frameEvents = this.events[l];
            while (frameEvents[0]) {
                if (now - frameEvents[0].$timeStamp > EVENT_RETENTION_LENGTH) { frameEvents.shift(); }
                else { break; }
            }
        }
        return res;
    }
    // @endif
}

export const timeline:Timeline = typeof KEY === 'string' ? window.parent[KEY][2] : new Timeline();
export const position:number = typeof KEY === 'string' ? timeline.onNewFrame() : 0;

// These are called from the outside of the code, so we have to make sure that call structures of those are not modified.
// It is removed in minified builds, see the gulpfile.
// @ifndef RECORD
/** @suppress {uselessCode} */
function cc_export() {
    "REMOVE_START"
    window['registerEvent'] = timeline.registerEvent;
    window['canOpenPopup'] = timeline.canOpenPopup;
    window['onNewFrame'] = timeline.onNewFrame;
    "REMOVE_END"
}
cc_export();
// @endif

// @ifdef RECORD
window['__t'] = timeline;
// @endif
