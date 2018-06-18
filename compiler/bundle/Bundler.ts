import { posix as path }  from 'path';
import log = require('fancy-log');
import gulp = require('gulp');
import insert = require('gulp-insert');
import preprocess = require('gulp-preprocess');
import rename = require('gulp-rename');
import rollup = require('gulp-rollup');
import hydra = require('gulp-hydra');
import * as closureTools from 'closure-tools-helper';

import { main as tsickleMain } from '../third_party/tsickle/main';

import { BuildOption } from '../BuildOption';
import PathUtils from '../PathUtils';
import { ResourceManager } from '../resc/ResourceManager';
import BundleContext from './BundleContext';
import Reservoir from '../utils/Reservoir';
import toPromise from '../utils/to_promise';
import CssBuilder from '../resc/CssBuilder';
import SoyBuilder from '../resc/SoyBuilder';
import { StringMap } from '../utils/types';


export default class Bundler {
    constructor(
        private options:BuildOption,
        private paths:PathUtils,
        private rescMgr:ResourceManager,
        private ctxt:BundleContext
    ) { }

    async rollup():Promise<StringMap<Reservoir>> {
        const sourceStream = gulp.src([
            'src/**/*.ts',
            'src/bundler_supplements/rollup_external_modules/**/*.js' // Load external modules, to be linked to `goog:...` imports.
        ])
            .pipe(<any>preprocess({ context: this.options.preprocessContext }));

        const bundles = sourceStream
            .pipe(rollup(this.ctxt.getRollupOptions()))
            .pipe(insert.transform(this.rescMgr.inline))
            .pipe(insert.transform(Bundler.removeCcExport))
            .pipe(hydra(this.ctxt.bundleFilter));
        // Create reservoirs
        let out:StringMap<Reservoir> = {};
        for (let bundleName of this.ctxt.bundleNames) {
            out[bundleName] = new Reservoir(
                bundles[bundleName]
                    .pipe(rename(path.join(this.paths.outputPath, bundleName + '.js')))
            );
        }

        return out;
    }

    /**
     * {@link https://github.com/angular/tsickle/issues/481}
     * tsickle uses module's relative path as a module name,
     * and it occasionally breaks source code on Windows by using an absolute path
     * instead of a relative path, especially when using --typed option.
     * We fix it by applying regexes to replace `goog.forwardDeclare(C_.absolute.path.to.module.PopupBlocker.build.tsickle.index)`
     * into `goog.forwardDeclare('build.tsc.index').
     */
    private static reWorkaroundTsickleBug = new RegExp(`(goog.[A-Za-z]*\\(")(?:.*?\\.)?${PathUtils.tsickleDir}\\.`, 'g');
    private static workaroundCallback(_, c1, c2) {
        return `${c1}${PathUtils.outputDir}.${PathUtils.tsccDir}.`;
    }
    private static tsickleWorkaround(content:string):string {
        return content.replace(Bundler.reWorkaroundTsickleBug, Bundler.workaroundCallback);
    }


    private static removeCcExport(content) {
        return content.replace(/"REMOVE_START"[\s\S]*?"REMOVE_END"/, '');
    }

    async tscc():Promise<StringMap<Reservoir>> {
        const options = this.options;
        const bundleCtxt = this.ctxt;

        const preprocessTask = toPromise(
            gulp.src('src/**/*.ts')
                .pipe(<any>preprocess({ context: options.preprocessContext }))
                .pipe(gulp.dest(PathUtils.tsicklePath))
        );
        await preprocessTask;

        log.info("Tsickle start");
        const result:0|1 = tsickleMain(
            `--externs=${PathUtils.tsccPath}/generated-externs.js --typed -- -p compiler/bundle`
                .split(' ')
        );
        log.info("Tsickle end");

        if (result === 1) { throw new Error("Tsickle Error"); }

        // Text transformations to js files emitted form tsickle
        // 1. Apply tsickle workarounds
        // 2. Inline resources
        // 3. etc..
        await toPromise(
            gulp.src(`${PathUtils.tsccPath}/**/*.js`)
                .pipe(insert.transform(Bundler.tsickleWorkaround))
                .pipe(insert.transform((content, file) => {
                    if (file.path.endsWith('externs.js')) {
                        // Do not inline resources to externs file.
                        return content;
                    }
                    return this.rescMgr.inline(content);
                }))
                .pipe(gulp.dest(PathUtils.tsccPath))
        );

        const compilationStream = await closureTools.compiler([
            '--charset',                  'UTF-8',
            '--compilation_level',        'ADVANCED',
            '--language_in',              'ECMASCRIPT6',
            '--language_out',             'ECMASCRIPT5',
            '--assume_function_wrapper',   String(true),
            '--warning_level',            'VERBOSE',
            '--strict_mode_input',         String(false),
            '--externs',                  'src/bundler_supplements/externs/externs.js',
            '--externs',                   this.paths.tsickleExternsPath,
            '--rewrite_polyfills',         String(false),
            '--module_output_path_prefix', this.paths.outputPath + '/'
        ], [
            path.join(PathUtils.tsccPath, '**/*.js'),
            SoyBuilder.soyUtilsUseGoogPath,
            '!' + this.paths.tsickleExternsPath,
            '!' + CssBuilder.renamingMapPath
        ], bundleCtxt.getCcOptions());

        const bundles = compilationStream
            .src()
            .pipe(insert.transform(Bundler.removeCcExport))
            .pipe(hydra(bundleCtxt.bundleFilter));

        let bundleNames = bundleCtxt.bundleNames;
        let out:StringMap<Reservoir> = {};
        for (let bundleName of bundleNames) {
            out[bundleName] = new Reservoir(bundles[bundleName], bundleName);
        }
        return out;
    }

    async bundle() {
        return this.options.shouldMinify ? await this.tscc() : await this.rollup();
    }
}
