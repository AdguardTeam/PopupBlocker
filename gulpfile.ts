import { posix as path }  from 'path';
import * as fs from 'async-file';
import * as fsExtra from 'fs-extra';

import Reservoir from './tasks/Reservoir';
import toPromise from './tasks/to_promise';

import log = require('fancy-log');

import gulp = require('gulp');
import insert = require('gulp-insert');
import preprocess = require('gulp-preprocess');
import rename = require('gulp-rename');
import rollup = require('gulp-rollup');
import uglify = require('gulp-uglify');

import xml2js = require('xml2js');

import InlineResource = require('inline-resource-literal');

import typescript = require('@alexlur/rollup-plugin-typescript');
import typescript2 = require('rollup-plugin-typescript2');

import { main as tsickleMain } from './tasks/tscc/third-party/tsickle/main';

import * as closureTools from 'closure-tools-helper';

import { BuildTarget, Channel, BuildOption } from './compiler/BuildOption';
import Builder from './compiler/Builder';
import PathUtils from './compiler/PathUtils';

/******************************************************************************************************/

process.setMaxListeners(0);
process.on('unhandledRejection', r => log.error(r));

/******************************************************************************************************/

const preprocessCtxt = {
    NO_PROXY: true
};

const devPreprocessCtxt = {
    DEBUG: true,
    RECORD: true
};

// Define gulp tasks: <channel>-<target>[-[un]minified]
for (let target in BuildTarget) {
    for (let channel in Channel) {
        let taskName = `${Channel[channel]}-${BuildTarget[target]}`;

        let option = new BuildOption(
            <BuildTarget>BuildTarget[target],
            <Channel>Channel[channel],
            channel === 'DEV' ? devPreprocessCtxt : preprocessCtxt
        );

        let option_minified = option.clone();
        option_minified.overrideShouldMinify = true;

        let option_unminified = option.clone();
        option_unminified.overrideShouldMinify = false;

        gulp.task(taskName, new Builder(option).build);
        gulp.task(taskName + '-minified', new Builder(option_minified).build);
        gulp.task(taskName + '-unminified', new Builder(option_unminified).build);
    }
}

/******************************************************************************************************/

// UglifyJS option for dead code removal and stripping out comments.
const uglifyOptions = {
    warnings: 'verbose',
    mangle: false,
    compress: {
        sequences: false,
        properties: false,
        drop_debugger: true,
        dead_code: true,
        conditionals: false,
        comparisons: false,
        evaluate: false,
        booleans: false,
        typeofs: false,
        loops: false,
        unused: true,
        toplevel: false,
        hoist_funs: false,
        if_return: false,
        inline: false,
        join_vars: false,
        collapse_vars: false,
        reduce_vars: false,
        keep_fargs: true,
        // UglifyJs by default does not remove functions with empty function body.
        // We declare here that certain functions used for logging are side-effect free,
        // so that UglifyJs can remove them.
        pure_funcs: ['print', 'call', 'callEnd', 'closeAllGroup']
    },
    output: {
        beautify: true,
        comments: false,
        indent_level: 2
    }
};

gulp.task('greasyfork-postprocess', () => {
    return gulp.src('build/userscript/popupblocker.user.js')
        .pipe(uglify(uglifyOptions))
        .pipe(insert.prepend(require('fs').readFileSync('build/userscript/popupblocker.meta.js').toString()))
        .pipe(gulp.dest('build/userscript'));
});

/******************************************************************************************************/


function testBuilderFactory(tsconfigOverride?) {
    const plugin = tsconfigOverride ? (<any>typescript2)({ tsconfigOverride }) : (<any>typescript)();

    return () => {
        return gulp.src(['test/**/*.ts', 'src/**/*.ts'])
            .pipe(<any>preprocess({
                context: {
                    RECORD: true
                }
            }))
            .pipe(rollup({
                entry: 'test/index.ts',
                plugins: [ plugin ],
                format: 'iife',
                strict: false
            }))
            .pipe(rename('index.js'))
            .pipe(gulp.dest('./test/build'));
    }
}

gulp.task('build-test', testBuilderFactory());
gulp.task('build-test-es5', testBuilderFactory({ compilerOptions: { target: "es5" } }))

gulp.task('travis', ['dev-userscript', 'build-test-es5'], () => {
    return [
        fs.writeFile('build/.nojekyll', ''),
        gulp.src(PathUtils.outputDir + '/userscript/**.js')
            .pipe(gulp.dest(PathUtils.outputDir)),
        gulp.src(['test/index.html', 'test/**/*.js'])
            .pipe(gulp.dest(PathUtils.outputDir + '/test/')),
        gulp.src('node_modules/mocha/mocha.*')
            .pipe(gulp.dest(PathUtils.outputDir + '/node_modules/mocha/')),
        gulp.src('node_modules/chai/chai.js')
            .pipe(gulp.dest(PathUtils.outputDir + '/node_modules/chai/'))
    ];
});

gulp.task('watch', () => {
    const onerror = (error) => { console.log(error.toString()); };
    const onchange = (event) => { console.log('File ' + event.path + ' was ' + event.type + ', building...'); };
    gulp.watch('src/**/*', <any>['dev-userscript'])
        .on('change', onchange)
        .on('error', onerror);
    gulp.watch('test/**/*.ts', <any>['build-test'])
        .on('change', onchange)
        .on('error', onerror);
});

/******************************************************************************************************/

// I18n Tasks

import onesky = require('onesky-utils');
import { spawn } from 'child_process';
import SoyBuilder from './compiler/resc/SoyBuilder';

gulp.task('i18n-up', async () => {
    try {
        const base = require('./config/.key.js');
        const file = (await fs.readFile(PathUtils.i18nSourceJSONPath)).toString();

        const _options = {
            language: 'en',
            fileName: 'en.json',
            format: 'HIERARCHICAL_JSON',
            content: file,
            keepStrings: false
        };

        Object.assign(_options, base);

        await onesky.postFile(_options);
    } catch (e) {
        log.error(e);
    }
});

gulp.task('i18n-down',  async () => {
    const base = require('./config/.key.js');
    const languages = JSON.parse(await onesky.getLanguages(base)).data;
    const map = {};
    await Promise.all(languages.map(async (lang) => {
        let languageCode = lang.code;
        let option = Object.assign({
            language: languageCode,
            fileName: 'en.json' // Do not change this
        }, base);
        let response = await onesky.getFile(option);
        if (response) {
            map[languageCode]= JSON.parse(response);
        }
    }));

    await fsExtra.writeJSON(PathUtils.i18nJSONPath, map);
});

/**
 * Converts xliff files generated by Closure Templates to json recognized by extension and userscripts.
 *
 * Note that we use a custom format that includes original phrase in descriptions.
 */
async function xliffToJson(xliffContent:string) {
    const xmlParser = new xml2js.Parser();

    const json:any = await (new Promise((resolve, reject) => {
        xmlParser.parseString(xliffContent, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        })
    }));

    const error:()=>never = () => {
        throw new Error('Invalid data, check soy sources');
    }

    const map = Object.create(null);
    const transUnit = json.xliff.file[0].body[0]['trans-unit'];

    for (let unit of transUnit) {
        let source = unit.source[0];
        if (typeof source === 'undefined') { error(); }
        if (typeof source === 'object') {
            // source is string for usual messages,
            // but is an object having keys '_' and 'x' in case when it contains
            // placeholders
            source = source._;
        }
        if (typeof source !== 'string') { error(); }
        if (!unit.note) { error(); }
        let message = unit.note[0]._;
        if (typeof message !== 'string') { error(); }

        map[source] = { message };
    }

    return map;
}

gulp.task('i18n-extract', async () => {
    const sauces = [
        SoyBuilder.alert,
        SoyBuilder.options
    ];

    await Promise.all(sauces.map(sauce => {
        return toPromise(closureTools.extractTemplateMsg([
            `--outputFile`, sauce.xliffPath,
            sauce.soyPath
        ]).src());
    }));
    log.info("Message extraction has been finished.");

    const maps = await Promise.all(sauces.map(async (sauce) => {
        return await fs.readFile(sauce.xliffPath)
            .then(file => file.toString())
            .then(async (content) => xliffToJson(content))
    }));

    // Merge maps and report error when encountered multiple phrases with the same name.
    const merged = Object.create(null);

    for (let map of maps) {
        for (let key in map) {
            if (merged[key]) { // If phrase already exists
                if (merged[key].message !== map[key].message) // and have different translations
                throw new Error(`Phrase name collision for ${key}`);
            } else {
                merged[key] = map[key];
            }
        }
    }

    const writeTasks = [];

    // Write translation
    const misc = await fsExtra.readJSON(PathUtils.i18nMiscSourceJSONPath);
    const translation = Object.assign({}, merged, misc);

    writeTasks.push(fsExtra.writeJSON(PathUtils.i18nSourceJSONPath, translation));

    // Write userscript_keys.json
    // Userscript-keys contain certain keys from misc and
    // keys from alert.soy file.

    const userscriptKeys = [];
    const extensionKeys = [];
    const settingsKeys = [];
    for (let key in misc) {
        if (misc[key].description === 'userscript_only') {
            userscriptKeys.push(key);
        } else if (misc[key].description === 'extension_only') {
            extensionKeys.push(key);
        } else {
            userscriptKeys.push(key);
            extensionKeys.push(key);
        }
    }
    for (let key in maps[0]) { // keys from alert.soy
        userscriptKeys.push(key);
        extensionKeys.push(key);
    }
    for (let key in maps[1]) {
        extensionKeys.push(key);
        settingsKeys.push(key);
    }

    writeTasks.push(fsExtra.writeJSON(PathUtils.i18nUserscriptKeysPath, userscriptKeys));
    writeTasks.push(fsExtra.writeJSON(PathUtils.i18nExtensionKeysPath, extensionKeys));
    writeTasks.push(fsExtra.writeJSON(PathUtils.i18nSettingsKeysPath, settingsKeys));

    await Promise.all(writeTasks);
});

/******************************************************************************************************/
