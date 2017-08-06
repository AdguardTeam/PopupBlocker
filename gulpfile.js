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


const options = global.options = {
    src: '',
    scriptName: 'popupblocker',
    downloadUPDATE_URLRelease: 'https://cdn.adguard.com/public/Userscripts/PopupBlocker/2.0/',
    downloadUPDATE_URLBeta: 'https://cdn.adguard.com/public/Userscripts/Beta/PopupBlocker/2.0/',
    downloadUPDATE_URLDev: 'https://AdguardTeam.github.io/PopupBlocker/',
    outputPath: 'build'
};

const cc_options = {
    compilation_level: 'ADVANCED',
    language_in: 'ECMASCRIPT6',
    language_out: 'ECMASCRIPT5',
    assume_function_wrapper: true,
    warning_level: 'VERBOSE',
    strict_mode_input: false,
    externs: ['externs.js'],
    rewrite_polyfills: false
};

const cc_options_dev = Object.assign({}, cc_options, {
    compilation_level: 'WHITESPACE_ONLY',
    assume_function_wrapper: false,
    warning_level: 'QUIET'
});

const cc_options_test = Object.assign({}, cc_options_dev, {
    compilation_level: 'SIMPLE'
});

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

const makeMetaConfig = (channel) => {
    let url = options['downloadUPDATE_URL' + channel];
    return {
        'DOWNLOAD_URL': url + options.scriptName + '.user.js',
        'UPDATE_URL': url + options.scriptName + '.meta.js',
        'NAME_SUFFIX': channel,
        'ADG_PERMANENT': channel !== 'Dev'
    };
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

const makeTask = (preprocessContext, minify_option, metaConfig) => {
    return (done) => {
        let content = gulp.src('src/**/*.ts')
            .pipe(preprocess({ context: preprocessContext }))
            .pipe(rollup(rollup_options));
        let meta = gulp.src('meta.js')
            .pipe(insert.transform(replaceMeta(metaConfig)))
            .pipe(rename(options.scriptName + '.meta.js'))
            .pipe(gulp.dest(options.outputPath));
        let wrapper = gulp.src('src/wrapper.js')
            .pipe(preprocess({ context: preprocessContext }))
            .on('data', (file) => {
                content = content.pipe(insert.transform(wrapModule(file.contents.toString().split('/*CONTENT*/'))));
                if(minify_option) { content = content.pipe(closureCompiler(minify_option)); }
                merge(meta, content)
                    .pipe(concat(options.scriptName + '.user.js'))
                    .pipe(gulp.dest(options.outputPath))
                    .on('end', done);
            });
    };
};

gulp.task('dev', makeTask({ DEBUG: true, RECORD: true }, false, makeMetaConfig('Dev')));
gulp.task('beta', makeTask({}, cc_options, makeMetaConfig('Beta')));
gulp.task('release', makeTask({}, cc_options, makeMetaConfig('Release')));
gulp.task('dev-ghpages', makeTask({ DEBUG: true, RECORD: true }, cc_options_dev, makeMetaConfig('Dev')));

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

gulp.task('build-test', function() {
    return gulp.src(['./test/**/*.ts', './src/**/*.ts'])
    .pipe(preprocess({ context: { RECORD: true } }))
    .pipe(rollup(rollup_options_test))
    .pipe(closureCompiler(cc_options_test))
    .pipe(rename('index.js'))
    .pipe(gulp.dest('./test/build'));
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
