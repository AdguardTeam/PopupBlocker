import createOpen from './before/create';
import { TimelineEvent, TLEventType } from './event';
import getTime from './time';
import * as log from '../log';

export type condition = (events:TimelineEvent[], event?:TimelineEvent) => boolean;

const beforeTest:condition[] = [createOpen];
const afterTest = [];

class Timeline {
    private events:TimelineEvent[];
    private isRecording:boolean;
    constructor() {
        this.events = [];
        this.isRecording = false;
        try {
            if (window !== window.parent && window.parent['__t'].isRecording) {
                log.print('parent is recording');
                this.isRecording = true;
            }
        } catch(e) { }
        // Registers a unique event when it is first created.
        this.registerEvent(new TimelineEvent(TLEventType.CREATE, undefined, undefined));
    }
    /**
     * When an event is registered, it performs some checks by calling functions of type `condition`
     * which accepts an existing events as a first argument, and an incoming event as a second argument.
     * An object at which the event is happened is included in the event as a `data` property,
     * and such functions can act on it appropriately, for example, it can close a popup window.
     */
    registerEvent(event:TimelineEvent):void {
        let i = afterTest.length;
        while (i--) { afterTest[i](this.events, event); }
        this.events.push(event);
        if (!this.isRecording) {
            setTimeout(function() {
                this.events.splice(this.events.indexOf(event), 1);
            }.bind(this), 5000);
        } else {
            let name:string = event.name ? event.name.toString() : '';
            log.print(`Timeline.registerEvent: ${event.type} ${name}`, event.data);
        }
    }
    /**
     * Wrapped window.open calls this. If it returns false, it does not call window.open.
     * beforeTests are basically the same as the afterTests except that
     * it does not accept a second argument.
     */
    canOpenPopup():boolean {
        log.call('Inquiring events timeline about whether window.open can be called...');
        let i = beforeTest.length;
        while (i--) {
            if (!beforeTest[i](this.events)) {
                log.print('false');
                log.callEnd();
                return false;
            }
        }
        log.print('true');
        log.callEnd();
        return true;
    }
    /**
     * Below methods are used only for logging & testing purposes.
     * It does not provide any functionality to block popups,
     * and is stipped out in production builds.
     * In dev build, the timeline instance is exposed to the global scope with a name '__t',
     * and one can call below methods to it to inspect how the popup script calls browser apis.
     * In test builds, it is used to access a private member `events`.
     */
    // @ifdef RECORD
    startRecording():void {
        this.isRecording = true;
        for(let i = 0; ; i++) {
            let frame = window[i];
            if (typeof frame === 'undefined') { break; }
            try {
                if (frame.hasOwnProperty('__t')) {
                    frame['__t'].startRecording();
                }
            } catch(e) { }
        }
    }
    /**
     * Returns an array. Its elements corresponds to frames to which the current window
     * has access, and the first element corresponds to the current window.
     */
    takeRecords():TimelineEvent[][] {
        this.isRecording = false;
        let res = [Array.prototype.slice.call(this.events)];
        let current = getTime();
        while (this.events[0]) {
            if (current - this.events[0].timeStamp > 1000) { this.events.shift(); }
            else { break; }
        }
        // Recursively visits child frames.
        for(let i = 0; ; i++) {
            let frame = window[i];
            if (typeof frame === 'undefined') { break; }
            try {
                if (frame.hasOwnProperty('__t')) {
                    Array.prototype.push.apply(res, frame['__t'].takeRecords());
                }
            } catch(e) { }
        }
        return res;
    }
    // @endif
}

export const timeline = new Timeline();
