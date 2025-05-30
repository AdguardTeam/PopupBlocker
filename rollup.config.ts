import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';
import * as path from 'path';

import MetaDataPlugin from './tasks/metadata/MetaDataPlugin';
import { metaSettings } from './tasks/metadata/meta.settings';
import { commonPostcssConfig, userscriptPostcssConfig } from './postcss.config';
import { env, resourceEnv } from './tasks/environment';
import { ChannelPostfix } from './tasks/channels';
import { BUILD_PATH } from './tasks/paths';
import {
    USERSCRIPT_NAME,
    METADATA_NAME,
    METADATA_TEMPLATE_NAME,
    RESOURCE_VERSION,
} from './tasks/constants';

const USERSCRIPT_BUILD_PATH = path.join(BUILD_PATH, 'userscript');
const USERSCRIPT_ENTRY_PATH = path.resolve(__dirname, './src/init', './userscript-entry.ts');
const PAGE_SCRIPT_ENTRY_PATH = path.resolve(__dirname, './src/init', './page-script.ts');
const METADATA_TEMPLATE_PATH = path.join(__dirname, './tasks/metadata', METADATA_TEMPLATE_NAME);
const LOCALES_PATH = path.join(__dirname, './src/locales/translations.json');
const ASSETS_PATH = path.resolve(__dirname, './src/assets');

const OPTIONS_SRC_PATH = path.resolve(__dirname, './src/pages/options');
const OPTIONS_SCRIPT_PATH = path.join(OPTIONS_SRC_PATH, 'options.tsx');

const commonPlugins = [
    commonjs({ include: 'node_modules/**' }),
    resolve(),
    json(),
];

/**
 * Development build and tests have logging enabled and override significantly more browser apis
 * to introspect behavior of popup/popunder script.
 */
// TODO make preprocessor plugin to cut these from beta and release builds
const isDev = env === 'dev';
const intro = `const DEBUG = ${isDev}; const RECORD = ${isDev}; const NO_PROXY = ${!isDev};`;

const pageScriptConfig = {
    input: PAGE_SCRIPT_ENTRY_PATH,
    output: {
        intro,
        compact: true,
    },
    plugins: [
        ...commonPlugins,
        typescript({
            tsconfig: 'tsconfig.json',
        }),
    ],
};

const getUserscriptConfig = (buildPath = USERSCRIPT_BUILD_PATH) => {
    // Prepare metadata
    const metadataPlugin = new MetaDataPlugin(
        METADATA_NAME,
        METADATA_TEMPLATE_PATH,
        LOCALES_PATH,
        ChannelPostfix[env],
        metaSettings.headersData,
    );

    return {
        input: USERSCRIPT_ENTRY_PATH,
        output: {
            dir: buildPath,
            entryFileNames: `${USERSCRIPT_NAME}.user.js`,
            format: 'iife',
            intro,
            compact: true,
        },
        plugins: [
            replace({
                preventAssignment: true,
                // word boundaries are ignored
                delimiters: ['', ''],
                values: {
                    // To build specific options page URLs
                    // for each channel
                    __userscriptResourceEnv__: resourceEnv,
                    __userscriptResourceVersion__: RESOURCE_VERSION,
                },
            }),
            ...commonPlugins,
            typescript({
                tsconfig: 'tsconfig.json',
            }),
            postcss(userscriptPostcssConfig),
            !isDev && terser(),
            cleanup(),
            copy({
                targets: [
                    { src: ASSETS_PATH, dest: buildPath },
                ],
            }),
            {
                writeBundle() {
                    // Build and inject metadata
                    metadataPlugin.injectMetadata(buildPath, `${USERSCRIPT_NAME}.user.js`);
                },
            },
        ],
    };
};

const testsConfig = {
    input: 'test/index.ts',
    output: {
        dir: './test/build',
        format: 'iife',
        intro,
        strict: false,
    },
    plugins: [
        ...commonPlugins,
        typescript({
            tsconfig: 'tsconfig.json',
            compilerOptions: {
                target: 'es5',
            },
        }),
    ],
};

const optionsPageConfig = {
    input: OPTIONS_SCRIPT_PATH,
    output: {
        dir: BUILD_PATH,
    },
    plugins: [
        replace({
            preventAssignment: true,
            // word boundaries are ignored
            delimiters: ['', ''],
            values: {
                __channel__: env,
            },
        }),
        ...commonPlugins,
        typescript({
            tsconfig: 'tsconfig.json',
        }),
        postcss(commonPostcssConfig),
        copy({
            targets: [
                { src: path.join(OPTIONS_SRC_PATH, 'index.html'), dest: BUILD_PATH },
                { src: path.join(OPTIONS_SRC_PATH, 'options.html'), dest: BUILD_PATH },
                { src: ASSETS_PATH, dest: BUILD_PATH },
            ],
        }),
    ],
};

export {
    pageScriptConfig,
    getUserscriptConfig,
    testsConfig,
    optionsPageConfig,
};
