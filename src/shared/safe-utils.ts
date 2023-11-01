/**
 * This module saves native methods to avoid errors when native methods are overwritten by other scripts,
 * e.g https://github.com/AdguardTeam/PopupBlocker/issues/291
 *
 * Note: script is not guaranteed to save native methods before other scripts are executed.
 */
const {
    call: safeCall,
    apply: safeApply,
    toString: safeToString,
} = window.Function.prototype;

/**
 * Safely checks if the given function is native
 * Note: this helper is required to avoid infinite loops, as we overwrite `.toString()` ourselves
 * and `.call()` possibly being overwritten does not matter here.
 *
 * @param fn arbitrary function to check
 * @returns true if the function is native and was not overwritten
 */
const isNativeFunction = (fn: Function): boolean => safeToString.call(fn).includes('[native code]');

/**
 * Calls the given function with `.call` or `.apply` if possible, otherwise calls it directly.
 *
 * @param fn arbitrary function to be called with `.call` or `.apply`
 * @param context the context in which the function should be called
 * @param args arguments to call function with
 * @returns the result of the function call
 */
export const safeCallApply = (
    fn: Function,
    context: any,
    args: IArguments | any[],
) => {
    // Check if the function's .apply() or .call() are native first
    if (isNativeFunction(fn.apply)) {
        return fn.apply(context, args);
    }

    if (isNativeFunction(fn.call)) {
        return fn.call(context, ...args);
    }

    if (isNativeFunction(safeApply)) {
        return safeApply.call(fn, context, args);
    }

    if (isNativeFunction(safeCall)) {
        return safeCall.apply(fn, [context, ...args]);
    }

    // At this point we've exhausted all options, so just call the function directly
    return fn.apply(context, args);
};
