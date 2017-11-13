const gulp = require('gulp');
const preprocess = require('gulp-preprocess');

module.exports = () => {
    return gulp.src('src/**/*.ts')
        .pipe(preprocess({ context: options.preprocessContext}))
        .pipe(gulp.dest(options.tscc_prep_path));
};
