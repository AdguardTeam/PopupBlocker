const gulp = require('gulp');
const preprocess = require('gulp-preprocess');
const rollup = require('gulp-rollup');
const closureCompiler = require('google-closure-compiler').gulp();
const rename = require('gulp-rename');
const insert = require('gulp-insert');
const insertResource = require('./insert-resource');

const cc = require('./options/cc');

module.exports = () => {
    return gulp.src(['test/**/*.ts', 'src/**/*.ts'])
        .pipe(preprocess({
            context: {
                RECORD: true
            }
        }))
        .pipe(insert.transform(insertResource))
        .pipe(rollup(require('./options/rollup').test))
        .pipe(rename('index.js'))
        .pipe(gulp.dest('./test/build'));
};
