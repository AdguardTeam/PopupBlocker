import { getTime } from '../shared';

export const enum TLEventType {
    CREATE,
    APPLY,
    GET,
    SET,
}

export interface TLEventData<C=void> {
    thisOrReceiver:any,
    arguments?:IArguments | any[],
    externalContext?:C
}

export class TimelineEvent<C> {
    public $timeStamp:number = getTime();

    constructor(
        public $type:TLEventType,
        public $name:PropertyKey,
        public $data:TLEventData<C>,
    ) { }
}
