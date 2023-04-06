import createOpen from './before/create';
import aboutBlank from './before/about-blank';
import navigatePopupToItself from './after/navigate-popup-to-itself';
import { TimelineEvent, TLEventType } from './TimelineEvent';
import { getTime, log } from '../shared';

export type condition = (index:number, events:TimelineEvent<any>[][], event?:TimelineEvent<any>) => boolean | never;

const beforeTest:condition[] = [createOpen, aboutBlank];
const afterTest = [navigatePopupToItself];

const EVENT_RETENTION_LENGTH = 5000;

export default class Timeline {
    private events:TimelineEvent<any>[][] = [];

    private isRecording = false;

    /**
     * When an event is registered, it performs some checks by calling functions of type `condition`
     * which accepts an existing events as a first argument, and an incoming event as a second argument.
     * An object at which the event is happened is included in the event as a `data` property,
     * and such functions can act on it appropriately, for example, it can close a popup window.
     */
    registerEvent(event:TimelineEvent<any>, index:number):void {
        if (this.isRecording) {
            const name:string = event.$name ? event.$name.toString() : '';
            log.print(`Timeline.registerEvent: ${event.$type} ${name}`, event.$data);
        }
        let i = afterTest.length;
        // eslint-disable-next-line no-plusplus
        while (i--) { afterTest[i](index, this.events, event); }
        const frameEvents = this.events[index];
        frameEvents.push(event);
        if (!this.isRecording) {
            setTimeout(() => {
                frameEvents.splice(frameEvents.indexOf(event), 1);
            }, EVENT_RETENTION_LENGTH);
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
        // eslint-disable-next-line no-plusplus
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

    onNewFrame(window:Window):number {
        const pos = this.events.push([]) - 1;
        // Registers a unique event when a frame is first created.
        // It passes the `window` object of the frame as a value of `$data` property.
        this.registerEvent(new TimelineEvent(TLEventType.CREATE, undefined, {
            thisOrReceiver: window,
        }), pos);
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
    'startRecording'():void {
        this.isRecording = true;
    }

    /**
     * Returns an array. Its elements corresponds to frames to which the current window
     * has access, and the first element corresponds to the current window.
     */
    'takeRecords'():TimelineEvent<any>[][] {
        this.isRecording = false;
        const res = this.events.map((el) => (Array.prototype.slice.call(el)));
        const now = getTime();
        let l = this.events.length;
        // eslint-disable-next-line no-plusplus
        while (l-- > 0) {
            const frameEvents = this.events[l];
            while (frameEvents[0]) {
                if (now - frameEvents[0].$timeStamp > EVENT_RETENTION_LENGTH) { frameEvents.shift(); } else { break; }
            }
        }
        return res;
    }
}

export const timeline:Timeline = new Timeline();

/**
 * These are called from the outside of the code,
 * so we have to make sure that call structures of those are not modified.
 * It is removed in minified builds, see the gulpfile.
 */
function cc_export() {
    // @ts-ignore
    window.registerEvent = timeline.registerEvent;
    // @ts-ignore
    window.canOpenPopup = timeline.canOpenPopup;
    // @ts-ignore
    window.onNewFrame = timeline.onNewFrame;
}
cc_export();

if (RECORD) {
    // TODO make preprocessor plugin to cut these from beta and release builds
    // @ts-ignore
    window.__t = timeline; // eslint-disable-line no-underscore-dangle
}
