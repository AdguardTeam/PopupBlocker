/**
 * This message hub instance is used in a situation where,
 * multiple instance of the script will be run across different
 * browsing contexts, to enable event-based communication between
 * script instances. Userscripts fit into this situation.
 *
 * Users can declaratively assign a callback to the instance with a JS primitive,
 * and trigger such callbacks to a target window with a user-provided data.
 * Currently it accepts only `number` type primitives.
 *
 * On initialization, the class will attempt to establish `MessageChannel`s with
 * its parent context. Further communication will use this channel, and the
 * propagation of the initial message will be stopped immediately when received,
 * so as long as this instance is initialized before other scripts, the message
 * won't leak.
 */
export interface InterContextMessageHubInterface {
    /**
     * Registers a callback to a primitive type
     * @param type A primitive to be assigned to a callback.
     * @param callback Callback functions are provided with 2 arguments:
     *   - arg1 is a serializable object provided with #trigger call.
     *   - arg2 is a global object from a browsing context which
     *     triggered the callback.
     */
    on<T>(type:number, messageHandler:IMessageHandler<T>):void
    /**
     * Triggers a callback assigned to the given primitive to a target context.
     * @param type Indicator for the callback to trigger.
     * @param data Serializable object to be passed to the callback.
     * @param target A target browsing context. This must equal
     *   - the parent frame;
     *   - direct descendent frames.
     * @param transferList An array of objects to be transferred to the
     *   target context.
     */
    trigger<T>(type:number, data:T, target:Window | Worker, transferList?:any[]):void
    /**
     * This instance is fully functional only when the browser has
     * native `WeakMap` support, and this property indicates that.
     * If it does not have native `WeakMap` support, this intance will
     * only trigger callbacks registered from the frame itself.
     */
    readonly supported:boolean
    /**
     * Below properties provide quick access to context-sensitive information.
     * Other classes which depends on this class can use these information
     * to register and trigger callbacks.
     */
    readonly hostWindow:Window
    readonly parent:Window
    readonly isTop:boolean
    /**
     * This is used to provide messaging port to the parent browsing context
     * when it is in the same origin, hence can be directly accessed.
     */
    registerChildPort?(child:Window, port:MessagePort):void
}

export interface IMessageHandler<T> {
    handleMessage(data:T, source?:Window):void
}
