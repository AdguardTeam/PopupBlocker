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
    ts: Object.assign({}, base, {
        externs: [
            options.tscc_path + '/generated-externs.js',
            'externs.js'
        ],
        dependency_mode: 'STRICT',
        entry_point: 'goog:build.tsickle.index',
    }),
    ts_wrapper: Object.assign({}, base, {
        externs: [
            options.tscc_path + '/generated-externs.js',
            'externs.js'
        ],
        dependency_mode: 'STRICT',
        entry_point: 'goog:build.tsickle.wrapper'
    }),
    after_ts: Object.assign({}, base, {
        compilation_level: 'SIMPLE',
        warning_level: 'DEFAULT'
    })
};
