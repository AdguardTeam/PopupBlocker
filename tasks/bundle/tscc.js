import gulp from 'gulp';
import insert from 'gulp-insert';
import preprocess from 'gulp-preprocess';
import rename from 'gulp-rename';
import filter from 'gulp-filter';
import closureCompiler from 'google-closure-compiler';
import fs from 'fs';                                           
import streamToPromise from 'stream-to-promise';
import InlineResource from 'inline-resource-literal';
import { main as tsickleMain } from '../third-party/tsickle/main';

/**
 * {@link https://github.com/google/closure-compiler-npm#running-the-compiler-using-nailgun}
 */
closureCompiler.compiler.JAR_PATH = undefined;
closureCompiler.compiler.prototype.javaPath = './node_modules/.bin/closure-gun'
const ccPlugin = closureCompiler.gulp();

/**
 * Bundles typescript source files for content script and page scripts
 * into a single js file using tsickle and closure compiler.
 * @return a stream of content script.
 */ 
async function contentScriptStreamFactory(options) {
    const inline = (new InlineResource(options.resources)).inline;

    await streamToPromise(
        gulp.src('src/**/*.ts')
            .pipe(preprocess({ context: options.preprocessContext }))
            .pipe(gulp.dest(options.tsicklePath))
    );

    const exitCode = tsickleMain(
        `--externs=${options["TSCC_PATH"]}/generated-externs.js --typed -- -p tasks/tscc`
            .split(' ')
    );

    if (exitCode === 1) { throw 'tsickle error'; }

    /**
     * https://github.com/angular/tsickle/issues/481
     * tsickle uses module's relative path as a module name, 
     * and it occasionally breaks source code on Windows by using an absolute path
     * instead of a relative path, especially when using --typed option.
     * We fix it by applying regexes to replace `goog.forwardDeclare(C_.absolute.path.to.module.PopupBlocker.build.tsickle.index)`
     * into `goog.forwardDeclare('build.tsc.index').
     */
    const reWorkaroundTsickleBug = new RegExp(`(goog.[A-Za-z]*\\(")(?:.*?\\.)?${options.sourcePath}\\.`, 'g');
    const tsickleWorkaround = (content) => {
        return content.replace(reWorkaroundTsickleBug, (_, c1, c2) => {
            return `${c1}${options.outputPath}.${options.tsccDir}.`;
        });
    };

    await streamToPromise(
        gulp.src(`${options.tsccPath}/**/*.js`)
            .pipe(insert.transform(tsickleWorkaround))
            .pipe(insert.transform(inline))
            .pipe(gulp.dest(options.tscc_path))
    );

    const pageScriptFilter = filter(['*page_script.js'], { passthrough: false, restore: true });

    const pageScriptBuffer = await streamToPromise(
        ccPlugin(options.cc_options)
            .src()
            .pipe(insert.transform(removeCcExport))
            .pipe(pageScriptFilter)
    );

    const inlinePageScript = (new InlineResource({
        PAGE_SCRIPT: {
            path: `${options.target}_page_script.min.js`,
            buffer: pageScriptBuffer 
        }
    })).inline;

    return filterPageScript.restore
        .pipe(insert.transform(inlinePageScript))
}

export default contentScriptStreamFactory;
