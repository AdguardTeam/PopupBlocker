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

const exportDefaultToReturn = textHelper.exportDefaultToReturn;
const wrapModule = textHelper.wrapModule;

module.exports = (done) => {
    let wrapper = fs.readFileSync('src/wrapper.js').toString().split('"CONTENT"');
    let meta = fs.readFileSync(options.outputPath + '/'+ options.metaName);
    let content = gulp.src('src/**/*.ts')
        .pipe(preprocess({ context: options.preprocessContext }))
        .pipe(rollup(options.rollup_options));
    gulp.src('src/wrapper.js')
        .pipe(preprocess({ context: options.preprocessContext }))
        .on('data', (file) => {
            let wrapper = file.contents.toString().split('"CONTENT"');
            content = content
                .pipe(insert.transform(exportDefaultToReturn))
                .pipe(insert.transform(wrapModule(wrapper)));
            if (options.cc_options) { content = content.pipe(closureCompiler(options.cc_options)); }
            content
                .pipe(insert.transform((content) => {
                    return meta + content;
                }))
                .pipe(rename(options.name))
                .pipe(gulp.dest(options.outputPath))
                .on('end', done);
        });
};
