import blurOnPopup from './after/blur-on-popup';
import focusClose from './before/focus-close';
import createOpen from './before/create';
import * as log from '../log';


export type condition = (events:TimelineEvent[], event?:TimelineEvent) => boolean;

export const getTime = 'now' in performance ? () => {
    return performance.now()
} : () => {
    return (new Date()).getTime()
};

const beforeTest:condition[] = [focusClose, createOpen];
const afterTest = [blurOnPopup];

/** @constructor */
class Timeline {
    private events:TimelineEvent[];
    private isRecording:boolean;
    constructor() {
        this.events = [];
        this.isRecording = false;
        // @ifdef DEBUG
        try {
            if (window !== window.top && top['__t'].isRecording) {
                this.isRecording = true;
            }
        } catch(e) { }
        // @endif
        this.registerEvent(new TimelineEvent('create', null));
    }
    registerEvent(event:TimelineEvent):void {
        let i = afterTest.length;
        while (i--) { afterTest[i](this.events, event); }
        this.events.push(event);
        if (!this.isRecording) {
            setTimeout(function() {
                this.events.splice(this.events.indexOf(event), 1);
            }.bind(this), 5000);
        } else {
            log.print("Timeline.registerEvent: " + event.type, event.data);
        }
    }
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
    // @ifdef DEBUG
    startRecording():void {
        this.isRecording = true;
        for (let i = 0, l = frames.length; i < l; i++) {
            let frame = frames[i];
            try {
                if (frame.hasOwnProperty('__t')) {
                    frame['__t'].startRecording();
                }
            } catch(e) { }
        }
    }
    takeRecords():TimelineEvent[] {
        if (!this.isRecording) { return; }
        this.isRecording = false;
        let res = Array.prototype.slice.call(this.events);
        let current = getTime();
        while (this.events[0]) {
            if (current - this.events[0].timeStamp > 1000) { this.events.shift(); }
            else { break; }
        }
        if (window === window.top) {
            for (let i = 0, l = frames.length; i < l; i++) {
                let frame = frames[i];
                try {
                    if (frame.hasOwnProperty('__t')) {
                        let records = frame['__t'].takeRecords();
                        if (records) { top['__t' + i] = records; }
                    }
                } catch(e) { }
            }
        }
        return res;
    }
    // @endif
}

/**
 * @constructor
 * @final
 */
export class TimelineEvent {
    public timeStamp:number
    constructor(public type:string, public data) {
        this.timeStamp = getTime();
    }
}

export const timeline = new Timeline();
