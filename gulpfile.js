const gulp = require('gulp');
const closureCompiler = require('google-closure-compiler').gulp();
const preprocess = require('gulp-preprocess');
const gap = require('gulp-append-prepend');

const options = global.options = {
    src: '',
    scriptName: 'PopupBlocker',
    downloadUpdateUrlBuild: 'https://cdn.adguard.com/public/Userscripts/PopupBlocker/2.0/',
    downloadUpdateUrlBeta: 'https://cdn.adguard.com/public/Userscripts/Beta/PopupBlocker/2.0/',
    downloadUpdateUrlDev: 'https://AdguardTeam.github.io/PopupBlocker/',
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
    use_types_for_optimization: true
};


gulp.task('dev', () => gulp.src('index.js')
    .pipe(preprocess({
        context: {
            DEBUG: true
        }
    }))
    .pipe(gap.prependFile('meta.js'))
    .pipe(gulp.dest('build'))
);

gulp.task('prod', () => gulp.src('index.js')
    .pipe(preprocess())
    .pipe(closureCompiler(cc_options))
    .pipe(gap.prependFile('meta.js'))
    .pipe(gulp.dest('build'))
);
