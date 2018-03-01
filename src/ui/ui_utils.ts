export const bind = Function.prototype.bind;

export function trustedEventListener(listener:(evt?:UIEvent)=>void, __this:object):(evt?:UIEvent)=>void {
    return (evt:UIEvent) => {
        if (!evt || evt.isTrusted) {
            listener.call(__this, evt);
            evt && evt.preventDefault();
        }
    };
}

export function getByClsName(className:string, element:Element|Document = document) {
    return element.getElementsByClassName(className);
}
