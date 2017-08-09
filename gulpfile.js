const fs = require('fs');
const gulp = require('gulp');
const preprocess = require('gulp-preprocess');
const insert = require('gulp-insert');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const merge = require('merge-stream');
const clean = require('gulp-clean');
const rollup = require('gulp-rollup');
const typescript2 = require('rollup-plugin-typescript2');
const typescript = require('@alexlur/rollup-plugin-typescript');
const closureCompiler = require('google-closure-compiler').gulp();
const runSequence = require('run-sequence');
const exec = require('child_process').exec;


const options = global.options = {
    scriptName: 'popupblocker',
    channel: 'Dev',
    get name() { return this.scriptName + '.user.js'; },
    get metaName() { return this.scriptName + '.meta.js'; },
    downloadUPDATE_URLRelease: 'https://cdn.adguard.com/public/Userscripts/PopupBlocker/2.0/',
    downloadUPDATE_URLBeta: 'https://cdn.adguard.com/public/Userscripts/Beta/PopupBlocker/2.0/',
    downloadUPDATE_URLDev: 'https://AdguardTeam.github.io/PopupBlocker/',
    get downloadUpdateUrl() { return this['downloadUPDATE_URL' + this.channel]; },
    outputPath: 'build',
    tmp_build_dir: 'tsickle',
    get metaConfig() {
        let url = this.downloadUpdateUrl;
        return {
            'DOWNLOAD_URL': url + this.name,
            'UPDATE_URL': url + this.metaName,
            'NAME_SUFFIX': this.channel
        };
    },
    rollup_options: {},
    cc_options: {},
    preprocessContext: {},
};

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

const cc = {
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

const rollup_options = {
    entry: 'src/index.ts',
    plugins: [typescript2()],
    format: 'es',
    useStrict: false
};

const rollup_options_test = {
    entry: 'test/index.ts',
    plugins: [typescript()],
    format: 'iife',
    useStrict: false
};

const replaceMeta = (config) => {
    return (text) => {
        return text.replace(/^\/\/\s@name(?:\:[\w-]*)?\s.*$/gm, (match) => (match + ' ' + config['NAME_SUFFIX']))
            .replace(/^(\/\/\s@.*)\[([A-Za-g_]*?)\]/gm, (_, c1, c2) => (c1 + config[c2]));
    }
};

const wrapModule = (wrap) => {
    return (content) => {
        content = content.replace(/^export\sdefault\s/m, 'return ');
        content = wrap[0] + content + wrap[1];
        return content;
    };
};

/**
 * There are currently 4 preprocess variables that are being used.
 * @param DEBUG: if defined, it will print information in console, which reveals
 * what code path was chosen. Also, it will wrap some browser apis which are not
 * currently being used to detect popups, but may provide helpful insights.
 * @param RECORD: if defined, it will expose the `Timeline` class to the global scope,
 * and class methods `startRecording` and `takeRecords` will be defined. It can
 * be used to investigated collected events.
 * @param NO_PROXY: Forces proxy.ts not to use Proxy even if it is supported.
 * It is used in production builds.
 * @param NO_EVENT: Do not use `window.event`, emulate FF environment.
 */

gulp.task('dev', (done) => {
    options.channel = "Dev";
    options.rollup_options = rollup_options;
    options.preprocessContext = {
        DEBUG: true,
        RECORD: true
    };
    options.cc_options = false;
    runSequence('meta', 'rollup', done);
});

gulp.task('dev-ghpages', (done) => {
    options.channel = "Dev";
    options.rollup_options = rollup_options;
    options.preprocessContext = {
        DEBUG: true,
        RECORD: true
    };
    options.cc_options = cc.test;
    runSequence('meta', 'rollup', done);
});

gulp.task('dev-noevent', (done) => {
    options.channel = "Dev";
    options.rollup_options = rollup_options;
    option.preprocessContext = {
        DEBUG: true,
        RECORD: true,
        NO_EVENT: true
    };
    options.cc_options = false;
    runSequence('meta', 'rollup', done);
});

gulp.task('rollup', (done) => {
    let wrapper = fs.readFileSync('src/wrapper.js').toString().split('"CONTENT"');
    let meta = fs.readFileSync(options.outputPath + '/'+ options.metaName);
    let content = gulp.src('src/**/*.ts')
        .pipe(preprocess({ context: options.preprocessContext }))
        .pipe(rollup(options.rollup_options));
    gulp.src('src/wrapper.js')
        .pipe(preprocess({ context: options.preprocessContext }))
        .on('data', (file) => {
            let wrapper = file.contents.toString().split('"CONTENT"');
            content = content.pipe(insert.transform((content) => {
                return wrapper[0] + content.replace(/^export\sdefault\s/m, 'return ') + wrapper[1];
            }));
            if (options.cc_options) { content = content.pipe(closureCompiler(options.cc_options)); }
            content
                .pipe(insert.transform((content) => {
                    return meta + content;
                }))
                .pipe(rename(options.name))
                .pipe(gulp.dest(options.outputPath))
                .on('end', done);
        });
});

gulp.task('build-test', function() {
    return gulp.src(['test/**/*.ts', 'src/**/*.ts'])
        .pipe(preprocess({
            context: {
                RECORD: true
            }
        }))
        .pipe(rollup(rollup_options_test))
        .pipe(closureCompiler(cc.test))
        .pipe(rename('index.js'))
        .pipe(gulp.dest('./test/build'));
});

gulp.task('clean', () => {
    return gulp.src([options.outputPath], {read: false})
        .pipe(clean());
});

gulp.task('build-ghpage', (done) => {
    runSequence('clean', ['dev-ghpages', 'build-test'], done);
});

gulp.task('testsToGhPages', ['build-ghpage'], (done) => {
    return [
        require('fs').writeFile('build/.nojekyll', ''),
        gulp.src(['test/index.html', 'test/**/*.js']).pipe(gulp.dest(options.outputPath + '/test/')),
        gulp.src('node_modules/mocha/mocha.*').pipe(gulp.dest(options.outputPath + '/node_modules/mocha/')),
        gulp.src('node_modules/chai/chai.js').pipe(gulp.dest(options.outputPath + '/node_modules/chai/'))
    ];
});

gulp.task('watch', () => {
    const onerror = (error) => { console.log(error.toString()); };
    const onchange = (event) => { console.log('File ' + event.path + ' was ' + event.type + ', building...'); };
    gulp.watch('src/**/*.ts', ['dev'])
        .on('change', onchange)
        .on('error', onerror);
    gulp.watch('test/**/*.ts', ['build-test'])
        .on('change', onchange)
        .on('error', onerror);
});

// https://github.com/angular/tsickle/issues/481
const reWorkaroundTsickleBug = new RegExp('(goog.[A-Za-z]*\\(").*?\\.build\\.' + options.tmp_build_dir + '\\.', 'g');
const workaround = (content) => (content.replace(reWorkaroundTsickleBug, (_, c1, c2) => (c1 + 'build.tsc.')));

gulp.task('prep-tscc', ['clean'], () => {
    return gulp.src('src/**/*.ts')
        .pipe(preprocess({ context: options.preprocessContext}))
        .pipe(gulp.dest(options.outputPath + '/' + options.tmp_build_dir));
});

gulp.task('tsickle', (done) => {
    exec('tsickle --externs=build/tsc/generated-externs.js -- -p tasks/prod', (err, stdout, stderr) => {
        console.log(stdout);
        console.error(stderr);
        done(err);
    });
});

gulp.task('meta', () => {
    return gulp.src('meta.js')
        .pipe(insert.transform(replaceMeta(options.metaConfig)))
        .pipe(rename(options.metaName))
        .pipe(gulp.dest(options.outputPath));
});

gulp.task('tscc', (done) => {
    let meta = fs.readFileSync(options.outputPath + '/' + options.metaName);
    let content = gulp.src('build/tsc/**/*.js')
        .pipe(insert.transform(workaround))
        .pipe(closureCompiler(options.cc_options))
        .pipe(insert.transform((content) => {
            return content.replace(/"REMOVE_START"[\s\S]*?"REMOVE_END"/, '');
        }));
    gulp.src('src/wrapper.js')
        .pipe(preprocess({ context: options.preprocessContext }))
        .on('data', (file) => {
            let wrapper = file.contents.toString().split('"CONTENT"');
            content = content.pipe(insert.transform(wrapModule(wrapper)))
                .pipe(closureCompiler({
                    compilation_level: 'SIMPLE',
                    strict_mode_input: false,
                    assume_function_wrapper: true,
                    rewrite_polyfills: false
                }))
                .pipe(insert.transform((content) => { return meta + content; }))
                .pipe(rename(options.name))
                .pipe(gulp.dest(options.outputPath))
                .on('end', done);
        });
});

gulp.task('tscc-clean', () => {
    return gulp.src([options.outputPath + '/' + options.tmp_build_dir, options.outputPath + '/tsc', options.outputPath + '/wrapper.js'], {read: false})
        .pipe(clean());
});

gulp.task('beta', (done) => {
    options.channel = 'Beta';
    options.cc_options = cc.ts;
    options.preprocessContext = {
        NO_PROXY: true
    };
    runSequence('prep-tscc', 'tsickle', 'meta', 'tscc', 'tscc-clean', done);
});

gulp.task('release', (done) => {
    options.channel = 'Beta';
    options.cc_options = cc.ts;
    options.preprocessContext = {
        NO_PROXY: true
    };
    runSequence('prep-tscc', 'tsickle', 'meta', 'tscc', 'tscc-clean', done);
});
