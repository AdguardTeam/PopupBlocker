import * as fs from 'async-file';
import * as fsExtra from 'fs-extra';

import log = require('fancy-log');
import minimist = require('minimist');

import gulp = require('gulp');
import insert = require('gulp-insert');
import preprocess = require('gulp-preprocess');
import rename = require('gulp-rename');
import rollup = require('gulp-rollup');
import uglify = require('gulp-uglify');
import runSequence = require('run-sequence');

import xml2js = require('xml2js');

import typescript = require('@alexlur/rollup-plugin-typescript');
import typescript2 = require('rollup-plugin-typescript2');

import * as closureTools from 'closure-tools-helper';

import { BuildTarget, Channel, BuildOption } from './compiler/BuildOption';
import Builder from './compiler/Builder';
import PathUtils from './compiler/PathUtils';
import { toPromise } from './compiler/utils/to_promise';

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

// Define gulp tasks: build -t=chrome -c=beta --minify --use_adg_domain
gulp.task('build', () => {
    let args = minimist(process.argv.slice(2));

    let target: BuildTarget = args["target"] || args["t"];
    let channel: Channel = args["channel"] || args["c"];
    let overrideShouldMinify: boolean = (() => {
        if ("minify" in args) {
            return !!args["minify"];
        }
        if ("m" in args) {
            return !!args["m"];
        }
    })();
    let useAdGuardDomainForResources: boolean = args["use_adg_domain"];

    let option = new BuildOption(
        target,
        channel,
        channel === Channel.DEV ? devPreprocessCtxt : preprocessCtxt,
        overrideShouldMinify,
        useAdGuardDomainForResources
    );

    return new Builder(option).build()
})

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
                plugins: [plugin],
                format: 'iife',
                strict: false
            }))
            .pipe(rename('index.js'))
            .pipe(gulp.dest('./test/build'));
    }
}

gulp.task('build-test', testBuilderFactory());
gulp.task('build-test-es5', testBuilderFactory({ compilerOptions: { target: "es5" } }))


gulp.task('travis-builds', (done) => {
    runSequence('dev-userscript', 'release-userscript-settings', done);
});

gulp.task('travis', ['travis-builds', 'build-test-es5'], async () => {
    const moveTasks = [
        gulp.src('build/userscript/**/*')
            .pipe(gulp.dest(PathUtils.outputDir)),
        gulp.src('build/userscript-settings/**/*')
            .pipe(gulp.dest(PathUtils.outputDir)),
        gulp.src(['test/index.html', 'test/**/*.js'])
            .pipe(gulp.dest(PathUtils.outputDir + '/test/')),
        gulp.src('node_modules/mocha/mocha.*')
            .pipe(gulp.dest(PathUtils.outputDir + '/node_modules/mocha/')),
        gulp.src('node_modules/chai/chai.js')
            .pipe(gulp.dest(PathUtils.outputDir + '/node_modules/chai/'))
    ];

    await Promise.all([
        fs.writeFile('build/.nojekyll', ''),
        fs.writeFile('build/CNAME', 'popupblocker.adguard.com'),
        ...moveTasks.map(gulpTask => toPromise(gulpTask))
    ]);

    await Promise.all([
        fsExtra.remove('build/userscript'),
        fsExtra.remove('build/userscript-settings')
    ]);
});

gulp.task('clean', Builder.clean);

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

gulp.task('i18n-down', async () => {
    const base = require('./config/.key.js');
    const languages = require('./src/locales/languages.js');
    const map = {};

    for (let i = 0; i < languages.length; i++) {

        let languageCode = languages[i];
        let substituteCode = languageCode;

        // OneSky has a little bit different codes
        if (languageCode === 'zh') {
            substituteCode = 'zh-CN';
        } else if (languageCode === 'pt') {
            substituteCode = 'pt-BR';
        } else if (languageCode === 'sl') {
            substituteCode = 'sl-SI';
        }

        let option = Object.assign({
            language: substituteCode,
            fileName: 'en.json' // Do not change this,
            // this is a filename used in onesky
        }, base);
        log.info('Downloading translation for ' + languageCode);
        let response = await onesky.getFile(option);
        if (response) {
            map[languageCode] = JSON.parse(response);
        }
    }

    // Remove duplicates. As I remember, previously Onesky didn't fill missing
    // translations with translations of default language (en),
    // but strangely it does now
    for (let lang of Object.keys(map)) {
        if (lang === 'en') { continue; }
        let langPhrases = map[lang];
        for (let phrase of Object.keys(langPhrases)) {
            if (
                JSON.stringify(langPhrases[phrase]) ===
                JSON.stringify(map['en'][phrase])
            ) {
                delete langPhrases[phrase];
            }
        }
    }

    await PathUtils.writeJson(PathUtils.i18nJSONPath, map);
});


/**
 * Converts xliff files generated by Closure Templates to json recognized by extension and userscripts.
 *
 * Note that we use a custom format that includes original phrase in descriptions.
 * @todo make this robust
 */
async function xliffToJson(xliffContent: string) {
    const xmlParser = new xml2js.Parser();

    const json: any = await (new Promise((resolve, reject) => {
        xmlParser.parseString(xliffContent, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        })
    }));

    const error: () => never = () => {
        console.log(JSON.stringify(transUnit));
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
        if (!unit.note) { continue; }
        let message = unit.note[0]._;
        if (typeof message !== 'string') { error(); }
        if (message.length === 0) { continue; }

        map[source] = { message };
    }

    return map;
}

gulp.task('i18n-extract', async () => {
    const sauces = [
        SoyBuilder.alert,
        SoyBuilder.options,
        SoyBuilder.userscript_options
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

    writeTasks.push(PathUtils.writeJson(PathUtils.i18nSourceJSONPath, translation));

    // Write userscript_keys.json
    // Userscript-keys contain certain keys from misc and
    // keys from alert.soy file.

    const userscriptKeys = [];
    const extensionKeys = [];
    const settingsKeys = [];
    for (let key in misc) {
        let platform = misc[key].platform;
        if (!platform) {
            userscriptKeys.push(key);
            extensionKeys.push(key);
            settingsKeys.push(key);
        } else {
            if (platform.includes('userscript')) {
                userscriptKeys.push(key);
            }
            if (platform.includes('extension')) {
                extensionKeys.push(key);
            }
            if (platform.includes('userscript_settings')) {
                settingsKeys.push(key);
            }
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
    for (let key in maps[2]) {
        settingsKeys.push(key);
    }

    writeTasks.push(PathUtils.writeJson(PathUtils.i18nUserscriptKeysPath, userscriptKeys));
    writeTasks.push(PathUtils.writeJson(PathUtils.i18nExtensionKeysPath, extensionKeys));
    writeTasks.push(PathUtils.writeJson(PathUtils.i18nSettingsKeysPath, settingsKeys));

    await Promise.all(writeTasks);
});

/******************************************************************************************************/
