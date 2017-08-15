const gulp = require('gulp');
const insert = require('gulp-insert');
const closureCompiler = require('google-closure-compiler').gulp();
const rename = require('gulp-rename');
const preprocess = require('gulp-preprocess');
const fs = require('fs');

const minifyHtml = require('html-minifier').minify;
const insertResource = require('../insert-resource');

const textHelper = require('../utill/transform-text');
const wrapModule = textHelper.wrapModule;
const removeCcExport = textHelper.removeCcExport;

/**
 * https://github.com/angular/tsickle/issues/481
 * tsickle uses module's relative path as a module name, 
 * and it occasionally breaks source code on Windows by using an absolute path
 * instead of a relative path, especially when using --typed option.
 * We fix it by applying regexes to replace `goog.forwardDeclare(C_.absolute.path.to.module.PopupBlocker.build.tsickle.index)`
 * into `goog.forwardDeclare('build.tsc.index').
 */
const reWorkaroundTsickleBug = new RegExp('(goog.[A-Za-z]*\\(").*?\\.build\\.' + options.tscc_prep_dir + '\\.', 'g');
const tsickleWorkaround = (content) => (content.replace(reWorkaroundTsickleBug, (_, c1, c2) => (c1 + `${options.outputPath}.${options.tscc_dir}.`)));

module.exports = (done) => {
    let meta = fs.readFileSync(options.outputPath + '/' + options.metaName);
    
    let wrapper = fs.readFileSync(options.tscc_path + '/wrapper-nocompile.js').toString().split('"CONTENT"');
    
    let content = gulp.src(options.tscc_path + '/**/*.js')
        .pipe(insert.transform(tsickleWorkaround))
        .pipe(closureCompiler(options.cc_options))
        .pipe(insert.transform(removeCcExport))
        .pipe(insert.transform(wrapModule(wrapper)))
        .pipe(rename('wrapper-nocompile.js'))
        .pipe(gulp.dest(options.tscc_path))
        .on('end', () => {
            console.log('First compilation has finished.');
            gulp.src(options.tscc_path + '/**/*.js')
                .pipe(insert.transform(tsickleWorkaround))
                .pipe(insert.transform(insertResource))
                .pipe(closureCompiler(require('../options/cc').ts_wrapper))
                .pipe(insert.transform((content) => {
                    return meta + content;
                }))
                .pipe(rename(options.name))
                .pipe(gulp.dest(options.outputPath))
                .on('end', done);
        });
};
