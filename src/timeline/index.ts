import createOpen from './before/create';
import * as log from '../log';


export type condition = (events:TimelineEvent[], event?:TimelineEvent) => boolean;

export const getTime = 'now' in performance ? () => {
    return performance.now()
} : () => {
    return (new Date()).getTime()
};

const beforeTest:condition[] = [createOpen];
const afterTest = [];

class Timeline {
    private events:TimelineEvent[];
    private isRecording:boolean;
    /** @constructor */
    constructor() {
        this.events = [];
        this.isRecording = false;
        // @ifdef DEBUG
        try {
            if (window !== window.parent && parent['__t'].isRecording) {
                log.print('parent is recording');
                this.isRecording = true;
            }
        } catch(e) { }
        // @endif
        this.registerEvent(new TimelineEvent(TLEventType.CREATE, undefined, undefined));
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
            let name:string = event.name ? event.name.toString() : '';
            log.print(`Timeline.registerEvent: ${event.type} ${name}`, event.data);
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
    // @endif
    // @ifdef RECORD
    takeRecords():TimelineEvent[][] {
        this.isRecording = false;
        let res = [Array.prototype.slice.call(this.events)];
        let current = getTime();
        while (this.events[0]) {
            if (current - this.events[0].timeStamp > 1000) { this.events.shift(); }
            else { break; }
        }
        let fromFrames = [];
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

export class TimelineEvent {
    public timeStamp:number
    /** @constructor */
    constructor(public type:TLEventType, public name:PropertyKey, public data) {
        this.timeStamp = getTime();
    }
};

export const enum TLEventType {
    CREATE,
    APPLY,
    GET,
    SET
};

export const timeline = new Timeline();
