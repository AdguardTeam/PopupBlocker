import getTime from '../shared/time';

export const enum TLEventType {
    CREATE,
    APPLY,
    GET,
    SET
};

export class TimelineEvent {
    public $timeStamp:number
    constructor(public $type:TLEventType, public $name:PropertyKey, public $data) {
        this.$timeStamp = getTime();
    }
};
