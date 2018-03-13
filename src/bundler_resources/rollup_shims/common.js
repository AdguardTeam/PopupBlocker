RESOURCE_SOYUTILS;

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

// Modules imported via goog.require calls.
var popupblockerUI, popupblockerOptionsUI;
var soydata_VERY_UNSAFE = soydata.VERY_UNSAFE;
