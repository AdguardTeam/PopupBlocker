const typescript = require('@alexlur/rollup-plugin-typescript'); // Faster, but does not throw on type-checking errors
const typescript2 = require('rollup-plugin-typescript2'); // Slower, but throws on type-checking errors


const rollup_options = {
    entry: 'src/index.ts',
    plugins: [typescript2()],
    format: 'es',
    useStrict: false
};

const rollup_options_wrapper = {
    entry: 'src/wrapper.ts',
    plugins: [typescript2()],
    format: 'iife'
};

const rollup_options_test = {
    entry: 'test/index.ts',
    plugins: [typescript()],
    format: 'iife',
    useStrict: false
};

module.exports = {
    dev: rollup_options,
    wrapper: rollup_options_wrapper,
    test: rollup_options_test
};
