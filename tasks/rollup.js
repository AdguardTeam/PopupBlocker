/**
 * @fileoverview Bundles typescript source files into a userscript,
 * and wraps generated code with wrapper.js.
 */
const gulp = require('gulp');
const insert = require('gulp-insert');
const preprocess = require('gulp-preprocess');
const rename = require('gulp-rename');
const rollup = require('gulp-rollup');
const closureCompiler = require('google-closure-compiler').gulp();
const textHelper = require('./utill/transform-text');
const fs = require('fs');
const minifyHtml = require('html-minifier').minify;
const uglify = require('gulp-uglify');
const insertResource = require('./insert-resource');

const rollup_options_wrapper = require('./options/rollup').wrapper;

const exportDefaultToReturn = textHelper.exportDefaultToReturn;
const wrapModule = textHelper.wrapModule;

module.exports = (done) => {
    let meta = fs.readFileSync(options.outputPath + '/'+ options.metaName);

    let content = gulp.src('src/**/*.ts')
        .pipe(preprocess({ context: options.preprocessContext }))
        .pipe(rollup(options.rollup_options));
    gulp.src('src/**/*.ts')
        .pipe(preprocess({ context: options.preprocessContext }))
        .pipe(insert.transform(insertResource))
        .pipe(rollup(rollup_options_wrapper))
        .on('data', (file) => {
            let wrapper = file.contents.toString().split('"CONTENT"');
            content = content
                .pipe(insert.transform(textHelper.removeCcExport))
                .pipe(insert.transform(exportDefaultToReturn))
                .pipe(insert.transform(wrapModule(wrapper)));
            if (options.cc_options) {
                if (options.cc_options === 'uglifyjs') {
                    content = content.pipe(uglify(require('./options/uglify.js').no_minification))
                } else {
                    content = content.pipe(closureCompiler(options.cc_options));
                }
            }
            content
                .pipe(insert.transform((content) => {
                    return meta + content;
                }))
                .pipe(rename(options.name))
                .pipe(gulp.dest(options.outputPath))
                .on('end', done);
        });
};
