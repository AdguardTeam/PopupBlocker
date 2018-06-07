/**
 * @fileoverview FrameInjector abstracts away an operation of injecting iframe on page's context.
 */
export default interface IFrameInjector {
    /**
     * Injects an iframe to the page's dom. It causes `load` event listeners to fire.
     */
    inject():void
    /**
     * A method to read iframe node that is injected.
     */
    getFrameElement():HTMLIFrameElement
    /**
     * Add load event handlers to fire when the frame is injected with `inject` method.
     * The instance's implementation is responsible for filtering out other `load` events.
     */
    addListener(eventHandler:func):void
    /**
     * Completely removes the UI injected to the page DOM. The instance cannot be used after
     * this method is called.
     */
    $destroy():void
}
