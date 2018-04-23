import {posix as path} from 'path'
import * as fs from 'async-file';
import * as fsExtra from 'fs-extra';
import * as closureTools from 'closure-tools-helper';

import gulp = require('gulp');
import rename = require('gulp-rename');

import postcss = require('gulp-postcss');
import imp = require('postcss-partial-import');
import svg = require('postcss-inline-svg');
import svgo = require('postcss-svgo');
import mixins = require('postcss-mixins');
import cssnext = require('postcss-cssnext');
import nesting = require('postcss-nested');

import { BuildOption } from '../BuildOption';
import { IResourceProvider, ResourceManager } from './ResourceManager';
import { toPromise } from '../utils/to_promise';
import PathUtils from '../PathUtils';


interface ICssSource {
    fileName:string,
    srcPath:string,
    resourceMarker?:string
}

export default class CssBuilder implements IResourceProvider {

    private static Source = class Source implements ICssSource {
        constructor(
            public fileName:string,
            public resourceMarker?:string
        ) { }
        get srcPath() {
            return path.join(PathUtils.postCssPath, this.fileName + '.pcss');
        }
    }

    private getSourceOutPath(src:ICssSource) {
        return path.join(this.paths.assetOutputPath, 'css', src.fileName + '.css');
    }

    private static alerts = new CssBuilder.Source('alerts', 'ALERT_CSS');
    private static extension_options = new CssBuilder.Source('extension_options');
    private static userscript_options = new CssBuilder.Source('userscript_options');
    private static toast = new CssBuilder.Source('toast', 'TOAST_CSS');
    private static fontsInline = new CssBuilder.Source('fonts_inline', 'FONT_INLINE_CSS');
    private static all = new CssBuilder.Source('all');

    private static bundledCssName = 'styles.css';
    private static cssTempDir = 'css_temp';

    public static cssTempPath = path.join(PathUtils.outputDir, CssBuilder.cssTempDir);
    private static cssTempPathWithName = path.join(CssBuilder.cssTempPath, CssBuilder.bundledCssName);

    private static counter = 0;

    private static get nextRenamingMapPath() {
        return (CssBuilder.currentRenamingMapPath = path.join(PathUtils.tsccPath, `renaming_map_${CssBuilder.counter++}.js`));
    }

    private static currentRenamingMapPath:string;

    public static get renamingMapPath() {
        return CssBuilder.currentRenamingMapPath;
    }

    private static compilePostCss(srcs:string):NodeJS.ReadableStream {
        return gulp.src(srcs)
            .pipe(postcss([
                imp(),
                nesting(),
                svg({ path: 'src/ui' }),
                svgo(),
                mixins(),
                cssnext({ browsers: ["IE 10", "> 1%"] }),
            ]))
            .pipe(rename(CssBuilder.bundledCssName))
    }

    private static async compileWithClosure(srcs:string) {
        await fsExtra.mkdirp(CssBuilder.cssTempPath)
        await toPromise(
            CssBuilder.compilePostCss(srcs)
                /** @todo Make this really 'temp'  */
                .pipe(gulp.dest(CssBuilder.cssTempPath))
        );

        const prevRenamingMapPath = CssBuilder.currentRenamingMapPath;

        const args = [
            `--output-renaming-map-format`,     `CLOSURE_COMPILED`,
            `--rename`,                         `CLOSURE`,
            `--output-renaming-map`,             CssBuilder.nextRenamingMapPath,
            `--allow-unrecognized-properties`,
            CssBuilder.cssTempPathWithName
        ];

        prevRenamingMapPath && args.push(
            `--input-renaming-map`,              prevRenamingMapPath
        );

        return closureTools.stylesheets(args, CssBuilder.bundledCssName);
    }

    private async compileSource(src:ICssSource) {
        if (this.options.shouldMinify) {
            return (await CssBuilder.compileWithClosure(src.srcPath)).src();
        } else {
            return CssBuilder.compilePostCss(src.srcPath);
        }
    }

    public async prepareResource(resc:ResourceManager) {
        const inlineSource = async (src:ICssSource) => {
            resc.registerInlinedResource(src.resourceMarker, {
                data: await toPromise(await this.compileSource(src), true),
                path: this.getSourceOutPath(src)
            });
        };
        const moveSource = async (src:ICssSource) => {
            await toPromise(
                (await this.compileSource(src))
                    .pipe(rename(this.getSourceOutPath(src)))
                    .pipe(gulp.dest('.'))
            );
        };

        const options = this.options;

        if (options.isExtension || options.isUserscript) {
            // Alert style is moved to /assets/alert.css.
            await inlineSource(CssBuilder.alerts);
        }

        if (!options.isSettingsOnly) {
            await inlineSource(CssBuilder.toast);
            await inlineSource(CssBuilder.fontsInline);
        }

        if (options.isExtension) {
            await moveSource(CssBuilder.extension_options);
        } else if (options.isSettingsOnly) {
            await moveSource(CssBuilder.userscript_options);
        }

    }

    constructor(
        private options:BuildOption,
        private paths:PathUtils
    ) { }

}
