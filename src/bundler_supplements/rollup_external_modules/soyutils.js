// soyutils.js will be inlined here.
RESOURCE_SOYUTILS;

// A few closure library functions that are used in compiled soy templates
// but are missing in soyutils.js
goog.getCssName = function (arg) {
    return arg;
};

goog.isString = function (arg) {
    return typeof arg === 'string';
};

goog.isNumber = function (arg) {
    return typeof arg === 'number';
};

// https://github.com/google/closure-library/blob/master/closure/goog/asserts/asserts.js
goog.asserts.assertArray = function (arg) {
    if (!Array.isArray(arg)) {
        throw 'A closure library shim error has occured';
    }
    return arg;
};

export { goog, soy, soydata }
