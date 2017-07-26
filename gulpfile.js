const gulp = require('gulp');
const closureCompiler = require('google-closure-compiler').gulp();
const preprocess = require('gulp-preprocess');
const gap = require('gulp-append-prepend');
const insert = require('gulp-insert');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const merge = require('merge2');
const clean = require('gulp-clean');


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
    js_output_file: 'user.min.js',
    assume_function_wrapper: true,
    warning_level: 'VERBOSE',
    strict_mode_input: false,
    externs: ['externs.js'],
    use_types_for_optimization: true
};

const makeTask = (preprocessContext, minify, metaConfig) => {
    return () => {
        let content = gulp.src('index.js')
            .pipe(preprocess({
                context: preprocessContext
            }));
        if (minify) {
            content = content.pipe(closureCompiler(cc_options));
        }
        let meta = gulp.src('meta.js')
            .pipe(insert.transform((text) => {
                return text.replace(/^\/\/\s@name(?:\:[\w-]*)?\s.*$/gm, (match) => {
                    return match + ' ' + metaConfig['NAME_SUFFIX'];
                }).replace(/^(\/\/\s@.*)\[([A-Za-g_]*?)\]/gm, (_, c1, c2) => {
                    return c1 + metaConfig[c2];
                });
            }))
            .pipe(rename('popupblocker.meta.js'))
            .pipe(gulp.dest(options.outputPath));
        return merge(meta, content)
            .pipe(concat('popupblocker.user.js'))
            .pipe(gulp.dest(options.outputPath));
    };
};

const makeMetaConfig = (channel) => {
    let url = options['downloadUPDATE_URL' + channel];
    return {
        'DOWNLOAD_URL': url + options.scriptName + '.user.js',
        'UPDATE_URL': url + options.scriptName + '.meta.js',
        'NAME_SUFFIX': channel === 'Release' ? '' : channel
    };
}

gulp.task('dev', ['clean'], makeTask({ DEBUG: true }, false, makeMetaConfig('Dev')));

gulp.task('beta', ['clean'], makeTask({}, true, makeMetaConfig('Beta')));

gulp.task('release', ['clean'], makeTask({}, true, makeMetaConfig('Release')));

gulp.task('clean', () => {
    return gulp.src(options.outputPath, {read: false})
        .pipe(clean());
});

gulp.task('check', () => {
    return gulp.src('index.js')
        .pipe(preprocess({ context: { DEBUG: true }}))
        .pipe(closureCompiler(Object.assign({}, cc_options, { checks_only: true })));
});

gulp.task('testsToGhPages', ['dev', 'check'], () => {
    require('fs').writeFileSync('build/.nojekyll', '');
    return [
        gulp.src('test/**').pipe(gulp.dest(options.outputPath + '/test/')),
        gulp.src('node_modules/mocha/mocha.*').pipe(gulp.dest(options.outputPath + '/node_modules/mocha/')),
        gulp.src('node_modules/chai/chai.js').pipe(gulp.dest(options.outputPath + '/node_modules/chai/'))
    ];
});

gulp.task('watch', () => {
    gulp.watch('*.js', ['dev']).on('change', (event) => {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});
