import gulp from 'gulp';
import insert from 'insert';

function chromeExtMain(options, contentScriptStream) {

    gulp.src('src/platform/extension/shared/manifest.json')
        .pipe(insert.transform((content) => {
            return 
        }))





}



