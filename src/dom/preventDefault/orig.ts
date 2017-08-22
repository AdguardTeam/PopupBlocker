const eventPType = window['Event'].prototype; // Workaround for AG bug

export default eventPType;
export const _preventDefault = eventPType.preventDefault;
