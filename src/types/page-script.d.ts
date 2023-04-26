/**
 * Wrapper will connect main with userscript's api through the bridge key
 * at build time
 *
 * @param externalWindow global context
 * @param externalBridgeKey prop under which to hide script api
 */
declare const externalWindow: Window;
declare const externalBridgeKey: string;
