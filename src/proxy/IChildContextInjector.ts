/**
 * A class used to execute callback on same-origin child browsing contexts.
 */
export default interface IChildContextInjector {
    /**
     * @method registerCallback registers a callback that will be executed
     * with a WindowProxy object of a newly encountered child browsing context.
     * An optional second argument will be `this` of the callback.
     */
    registerCallback(callback:(win:Window)=>void):void
}
