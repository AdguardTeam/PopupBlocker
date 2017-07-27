const gulp = require('gulp');
const closureCompiler = require('google-closure-compiler').gulp();
const preprocess = require('gulp-preprocess');
const insert = require('gulp-insert');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const merge = require('merge-stream');
const clean = require('gulp-clean');
const rollup = require('gulp-rollup');
const inject = require('gulp-inject');
const fs = require('fs');
const typescript = require('rollup-plugin-typescript2');


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
    //js_output_file: 'user.min.js',
    assume_function_wrapper: true,
    warning_level: 'VERBOSE',
    strict_mode_input: false,
    externs: ['externs.js'],
    use_types_for_optimization: true,
    rewrite_polyfills: false
};

const rollup_options = {
    entry: 'src/index.ts',
    plugins: [typescript()],
    format: 'es',
    useStrict: false
};

const bundle = (preprocessContext) => {
    let wrapper = fs.readFileSync('src/wrapper.js').toString().split('/*CONTENT*/');
    return gulp.src('src/**/*.ts')
        .pipe(preprocess({
            context: preprocessContext
        })).pipe(rollup(rollup_options))
        .pipe(insert.transform((content) => {
            content = content.replace(/^export\sdefault\s/m, 'return ');
            content = wrapper[0] + content + wrapper[1];
            return content;
        }));
};

const makeTask = (preprocessContext, minify, metaConfig) => {
    return () => {
        let content = bundle(preprocessContext);
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
            .pipe(rename(options.scriptname + '.meta.js'))
            .pipe(gulp.dest(options.outputPath));
        return merge(meta, content)
            .pipe(concat(options.scriptName + '.user.js'))
            .pipe(gulp.dest(options.outputPath));
    };
};

const makeMetaConfig = (channel) => {
    let url = options['downloadUPDATE_URL' + channel];
    return {
        'DOWNLOAD_URL': url + options.scriptName + '.user.js',
        'UPDATE_URL': url + options.scriptName + '.meta.js',
        'NAME_SUFFIX': channel
    };
}

gulp.task('dev', makeTask({ DEBUG: true }, false, makeMetaConfig('Dev')));

gulp.task('beta', makeTask({}, true, makeMetaConfig('Beta')));

gulp.task('release', makeTask({}, true, makeMetaConfig('Release')));

gulp.task('clean', () => {
    return gulp.src([options.outputPath], {read: false})
        .pipe(clean());
});

gulp.task('testsToGhPages', ['dev', 'clean'], () => {
    return [
        require('fs').writeFile('build/.nojekyll', ''),
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
