const gulp = require('gulp');
const clean = require('gulp-clean');

module.exports = () => {
    return gulp.src([
        options.tscc_path,
        options.tscc_prep_path,
        options.outputPath + '/wrapper.js'
    ], {read: false})
        .pipe(clean());
};
