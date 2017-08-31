const gulp = require('gulp');
const runSequence = require('run-sequence');
const path = require('path');

const options = global.options = Object.seal({
    scriptName: 'popupblocker',
    channel: 'Dev',
    get name() { return this.scriptName + '.user.js'; },
    get metaName() { return this.scriptName + '.meta.js'; },
    downloadUPDATE_URLRelease: 'https://cdn.adguard.com/public/Userscripts/AdguardPopupBlocker/2.1/',
    downloadUPDATE_URLBeta: 'https://cdn.adguard.com/public/Userscripts/Beta/AdguardPopupBlocker/2.1/',
    downloadUPDATE_URLDev: 'https://AdguardTeam.github.io/PopupBlocker/',
    get downloadUpdateUrl() { return this['downloadUPDATE_URL' + this.channel]; },
    outputPath: 'build',
    tscc_prep_dir: 'prep',
    tscc_dir: 'tsickle',
    get tscc_prep_path() { return path.join(this.outputPath, this.tscc_prep_dir); },
    get tscc_path() { return path.join(this.outputPath, this.tscc_dir); },
    get metaConfig() {
        let url = this.downloadUpdateUrl;
        return {
            'DOWNLOAD_URL': url + this.name,
            'UPDATE_URL': url + this.metaName,
            'NAME_SUFFIX': this.channel
        };
    },
    locales: ["en", "ru", "de", "tr", "uk", "pl", "pt_BR", "ko", "zh_CN", "sr-Latn", "fr", "sk", "hy", "es_419", "it", "id", "nl", "bg", "vi", "hr", "hu", "ca", "zh_TW"],
    localesDir: 'src/locales',
    sourceFile: 'en.json',
    rollup_options: {},
    cc_options: {},
    preprocessContext: {}
});

const cc_opt = require('./tasks/options/cc');
const rollup_opt = require('./tasks/options/rollup');

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

gulp.task('meta', require('./tasks/meta'));
gulp.task('rollup', require('./tasks/rollup'));

gulp.task('dev', (done) => {
    options.channel = "Dev";
    options.rollup_options = rollup_opt.dev;
    options.preprocessContext = {
        DEBUG: true,
        RECORD: true
    };
    options.cc_options = false;
    runSequence('meta', 'rollup', done);
});

gulp.task('dev-ghpages', (done) => {
    options.channel = "Dev";
    options.rollup_options = rollup_opt.dev;
    options.preprocessContext = {
        DEBUG: true,
        RECORD: true
    };
    options.cc_options = cc_opt.test;
    runSequence('meta', 'rollup', done);
});

gulp.task('dev-noevent', (done) => {
    options.channel = "Dev";
    options.rollup_options = rollup_opt.dev;
    option.preprocessContext = {
        DEBUG: true,
        RECORD: true,
        NO_EVENT: true
    };
    options.cc_options = false;
    runSequence('meta', 'rollup', done);
});

gulp.task('build-test', require('./tasks/test'));
gulp.task('clean', require('./tasks/clean'));

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

gulp.task('watch', require('./tasks/watch'));

gulp.task('prep-tscc', require('./tasks/tscc/prep'));
gulp.task('tsickle', require('./tasks/tscc/tsickle'));
gulp.task('tscc', require('./tasks/tscc/tscc'));
gulp.task('tscc-clean', require('./tasks/tscc/clean'));

gulp.task('beta', (done) => {
    options.channel = 'Beta';
    options.cc_options = cc_opt.ts;
    options.preprocessContext = {
        NO_PROXY: true
    };
    runSequence('clean', 'prep-tscc', 'tsickle', 'meta', 'tscc', 'tscc-clean', done);
});

gulp.task('release', (done) => {
    options.channel = 'Release';
    options.cc_options = cc_opt.ts;
    options.preprocessContext = {
        NO_PROXY: true
    };
    runSequence('clean', 'prep-tscc', 'tsickle', 'meta', 'tscc', 'tscc-clean', done);
});


gulp.task('i18n-up', require('./tasks/i18n/upload'));
gulp.task('i18n-down', require('./tasks/i18n/download'));
