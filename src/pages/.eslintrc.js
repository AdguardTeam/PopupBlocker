module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: '../../tsconfig.json',
    },
    extends: [
        '../../.eslintrc',
        'preact',
    ],
    rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
        'import/no-cycle': 'off',
        'jest/no-deprecated-functions': 'off',
        'no-undef': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
    },
};
