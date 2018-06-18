import getTime from '../shared/time';

export const enum TLEventType {
    CREATE,
    APPLY,
    GET,
    SET
};

export interface TLEventData<C=void> {
    thisOrReceiver:any,
    arguments?:IArguments|any[],
    context?:C
}

export class TimelineEvent<C> {
    public $timeStamp:number = getTime()
    constructor(
        public $type:TLEventType,
        public $name:PropertyKey,
        public $data:TLEventData<C>
    ) { }
};

