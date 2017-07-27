/** @constructor */
class Timeline {
    private events:TimelineEvent[];
    private isRecording:boolean;
    constructor() {
        this.events = [];
        this.isRecording = false;
    }
    registerEvent(event:TimelineEvent):void {
        let events = this.events;
        events.push(event);
        if (!this.isRecording) {
            setTimeout(function() {
                events.splice(events.indexOf(event), 1);
            }, 1000);
        }
    }
    canOpenPopup():boolean {
        return true;
    }
    // @ifdef DEBUG
    startRecording():void {
        this.isRecording = true;
    }
    takeRecords():TimelineEvent[] {
        this.isRecording = false;
        let res = Array.prototype.slice.call(this.events);
        let current = (new Date()).getDate();
        while (this.events[0]) {
            if (current - this.events[0].timeStamp > 1000) { this.events.shift(); }
            else { break; }
        }
        return res;
    }
    // @endif
}

/** @constructor */
export class TimelineEvent {
    public timeStamp:number
    constructor(public type:string, public data) {
        this.timeStamp = (new Date()).getDate();
    }
}

export const timeline = new Timeline();
