export const clone = typeof cloneInto === 'function' ? cloneInto : x=>x;
export const createObject = typeof createObjectIn === 'function' ? createObjectIn : (target:Object, option:DefineAs) => {
    let obj = {};
    target[option.defineAs] = obj;
    return obj;
};
export const exportFn = typeof exportFunction === 'function' ? (fn, target, option?:exportFunctionOption) => {
    exportFunction(function() {
        return clone(fn.apply(this, arguments), unsafeWindow);
    }, target, option);
} : function(fn, target, option?:exportFunctionOption) {
    target[option.defineAs] = fn;
};
