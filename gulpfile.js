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

const cc = require('./tasks/cc-options');

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

const attachMeta = (content, preprocessContext, metaConfig, minify_option) => {
    return (done) => {
        let meta = gulp.src('meta.js')
            .pipe(insert.transform(replaceMeta(metaConfig)))
            .pipe(rename(options.scriptName + '.meta.js'))
            .pipe(gulp.dest(options.outputPath));
        let wrapper = gulp.src('src/wrapper.js')
            .pipe(preprocess({ context: preprocessContext }))
            .pipe(closureCompiler({ compilation_level: 'ADVANCED', externs: ['externs.js'] }))
            .on('data', (file) => {
                content = content.pipe(insert.transform(wrapModule(file.contents.toString().split('/"CONTENT"/'))));
                if(minify_option) { content = content.pipe(closureCompiler(minify_option)); }
                merge(meta, content)
                    .pipe(concat(options.scriptName + '.user.js'))
                    .pipe(gulp.dest(options.outputPath))
                    .on('end', done);
            });
    };
};

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

gulp.task('rollup', () => {
    let wrapper = fs.readFileSync('src/wrapper.js').toString().split('"CONTENT"');
    let meta = fs.readFileSync(options.outputPath + '/'+ options.metaName);
    let content = gulp.src('src/**/*.ts')
        .pipe(preprocess({ context: options.preprocessContext }))
        .pipe(rollup(options.rollup_options))
        .pipe(insert.transform((content) => {
            return wrapper[0] + content.replace(/^export\sdefault\s/m, 'return ') + wrapper[1];
        }));
    if (options.cc_options) { content = content.pipe(closureCompiler(options.cc_options)); }
    return content
        .pipe(rename(options.name))
        .pipe(gulp.dest(options.outputPath));
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

gulp.task('build-test', function() {
    return gulp.src(['test/**/*.ts', 'src/**/*.ts'])
        .pipe(preprocess({ context: { RECORD: true } }))
        .pipe(rollup(rollup_options_test))
        .pipe(closureCompiler(cc.test))
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


// https://github.com/angular/tsickle/issues/481
const reWorkaroundTsickleBug = new RegExp('(goog.[A-Za-z]*\\(").*?\\.build\\.' + options.tmp_build_dir + '\\.', 'g');
const workaround = (content) => (content.replace(reWorkaroundTsickleBug, (_, c1, c2) => (c1 + 'build.tsc.')));

gulp.task('prep-tscc', ['clean'], () => {
    return gulp.src('src/**/*.ts')
        .pipe(preprocess({ context: {}}))
        .pipe(gulp.dest(options.outputPath + '/' + options.tmp_build_dir));
});

const makeTsccTask = (channel) => {
    return (done) => {
        let content = gulp.src('build/tsc/**/*.js')
            .pipe(insert.transform(workaround))
            .pipe(closureCompiler(cc.ts));
        attachMeta(content, {}, options.metaConfig)(done);
    };
};


gulp.task('meta', () => {
    return gulp.src('meta.js')
        .pipe(insert.transform(replaceMeta(options.metaConfig)))
        .pipe(rename(options.metaName))
        .pipe(gulp.dest(options.outputPath));
});

gulp.task('minify-wrapper', () => {
    return gulp.src('src/wrapper.js')
        .pipe(preprocess({ context: options.preprocessContext }))
        //.pipe(closureCompiler({ compilation_level: 'SIMPLE', warning_level: 'VERBOSE', js_output_file: 'wrapper.js', externs: ['externs.js']}))
        .pipe(gulp.dest(options.outputPath));
});


gulp.task('tscc', () => {
    let wrapper = fs.readFileSync(options.outputPath + '/wrapper.js').toString().split('"CONTENT"');
    let meta = fs.readFileSync(options.outputPath + '/' + options.metaName);
    let content = gulp.src('build/tsc/**/*.js')
        .pipe(insert.transform(workaround))
        .pipe(closureCompiler(options.cc_options))
        .pipe(insert.transform(wrapModule(wrapper)))
        .pipe(insert.transform((content) => { return meta + content; }))
        .pipe(rename(options.name))
        .pipe(gulp.dest(options.outputPath));
    return content;
});

gulp.task('tscc-clean', () => {
    return gulp.src([options.outputPath + '/' + options.tmp_build_dir, options.outputPath + '/tsc', options.outputPath + '/wrapper.js'], {read: false})
        .pipe(clean());
});

gulp.task('tscc-beta', makeTsccTask('Beta'));
gulp.task('tscc-release', makeTsccTask('Release'));

gulp.task('beta', (done) => {
    options.channel = 'Beta';
    options.cc_options = cc.ts;
    runSequence('minify-wrapper', 'meta', 'tscc', 'tscc-clean', done);
});

gulp.task('release', (done) => {
    options.channel = 'Release';
    options.cc_options = cc.ts;
    runSequence('minify-wrapper', 'meta', 'tscc', 'tscc-clean', done);
});
