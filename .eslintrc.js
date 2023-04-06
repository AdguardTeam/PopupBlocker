module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
    },
    plugins: [
        '@typescript-eslint',
        'import',
        'import-newlines',
    ],
    env: {
        browser: true,
        node: true,
    },
    extends: [
        'airbnb-base',
        'airbnb-typescript/base',
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
    ],
    rules: {
        indent: 'off',
        'import/no-cycle': 'off',
        'import-newlines/enforce': ['error', 2, 120],
        'no-multi-assign': 'off',
        'func-names': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-types': 'off',
        'class-methods-use-this': 'off',
        'max-classes-per-file': 'off',
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/indent': ['error', 4, {
            SwitchCase: 1,
        }],
        'max-len': [
            'error',
            {
                code: 120,
            },
        ],
        'import/no-extraneous-dependencies': 0,
        'import/prefer-default-export': 0,
    },
};
