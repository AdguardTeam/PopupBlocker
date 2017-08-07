const cc = require('google-closure-compiler');

const base = {
    compilation_level: 'ADVANCED',
    language_in: 'ECMASCRIPT6',
    language_out: 'ECMASCRIPT5',
    assume_function_wrapper: true,
    warning_level: 'VERBOSE',
    strict_mode_input: false,
    externs: ['externs.js'],
    rewrite_polyfills: false
};

module.exports = {
    dev: Object.assign({}, base, {
        compilation_level: 'WHITESPACE_ONLY',
        assume_function_wrapper: false,
        warning_level: 'QUIET'
    }),
    test: Object.assign({}, base, {
        compilation_level: 'WHITESPACE_ONLY'
    }),
    ts: Object.assign({}, base, {
        externs: ['build/tsc/generated-externs.js', 'externs.js'],
        dependency_mode: 'STRICT',
        entry_point: 'goog:build.tsc.index',
    })
};
