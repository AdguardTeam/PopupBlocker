/**
 * @fileoverview Bundles typescript source files for content script and page scripts
 * into a single js file using rollup.
 * 
 * returns a stream of content script.
 */
import gulp from 'gulp';
import insert from 'gulp-insert';
import preprocess from 'gulp-preprocess';
import rename from 'gulp-rename';
import rollup from 'gulp-rollup';
import streamToPromise from 'stream-to-promise';
import InlineResource from 'inline-resource-literal';

async function contentScriptStreamFactory(options) {
    const inlineResource = (new InlineResource(options.RESOURCES)).inline;

    const bundlePageScript = gulp.src('src/**/*.ts')
            .pipe(preprocess({ context: options.preprocessContext }))
            .pipe(rollup(options.rollupOptionsPageScript))
            .pipe(insert.transform(inlineResource))

    const bundleContentScript = gulp.src('src/**/*.ts')
            .pipe(preprocess({ context: options.preprocessContext }))
            .pipe(rollup(options.rollupOptionsContentScript))
            .pipe(insert.transform(inlineResource));

    const [pageScriptBuffer] =
        await Promise.all(streamToPromise(bundlePageScript), streamToPromise(bundleContentScript));

    const inlinePageScript = (new InlineResource({
        PAGE_SCRIPT: {
            path: `${options.target}_page_script.js`,
            buffer: pageScriptBuffer
    })).inline;

    return buildContentScript
        .pipe(insert.transform(inlinePageScript))
        .pipe(rename('content_script.js'));
}

module.exports = contentScriptStreamFactory;
