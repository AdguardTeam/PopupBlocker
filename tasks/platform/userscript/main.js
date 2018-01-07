import gulp from 'gulp';
import insert from 'gulp-insert';
import merge from 'gulp-merge';

function userscriptMain(options, metaStream, contentScriptStream) {
    return merge(metaStream, contentScriptStream)
        .pipe(gulp.dest(options.outputPath))
}

export default userscriptMain;
