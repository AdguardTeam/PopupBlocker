export const bind = Function.prototype.bind;

export function trustedEventListener(listener:(evt?:UIEvent)=>void, __this:any):(evt?:UIEvent)=>void {
    return (evt:UIEvent) => {
        if (evt.isTrusted) {
            listener.call(__this, evt);
            evt.preventDefault();
        }
    };
}
