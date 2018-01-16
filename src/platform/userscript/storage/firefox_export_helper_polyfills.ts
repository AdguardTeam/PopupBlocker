export const clone = typeof cloneInto === 'function' ? cloneInto : x=>x;
export const createObject = typeof createObjectIn === 'function' ? createObjectIn : (target:Object, option:DefineAs) => {
    let obj = {};
    target[option.defineAs] = obj;
    return obj;
};

export const exportFn = <T extends func>(fn:T, target, option?:exportFunctionOption):T => {
    return <T>exportFunction(<T>function() {
        return clone(fn.apply(this, arguments), unsafeWindow);
    }, target, option);
};
