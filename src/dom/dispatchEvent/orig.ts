const eventTargetPType = typeof EventTarget == 'undefined' ? Node.prototype : EventTarget.prototype;

export default eventTargetPType;
export const _dispatchEvent = eventTargetPType.dispatchEvent;
