import { posix as path } from 'path';
import * as fs from 'async-file';
import * as fsExtra from 'fs-extra';
import gulp = require('gulp');
import insert = require('gulp-insert');
import rename = require('gulp-rename');
import log = require('fancy-log');

import InlineResource = require('inline-resource-literal');

import PathUtils from "./PathUtils";
import SoyBuilder from "./resc/SoyBuilder";
import { ResourceManager } from "./resc/ResourceManager";
import LocaleUtils from "./resc/LocaleUtils";
import { BuildOption, Channel } from "./BuildOption";
import CssBuilder from "./resc/CssBuilder";
import toPromise from './utils/to_promise';
import Reservoir from './utils/Reservoir';

import Bundler from './bundle/Bundler';
import BundleContext from './bundle/BundleContext';
import MetadataUtils from './MetadataUtils';
import BundleEntry from './bundle/BundleEntry';
import { StringMap } from './utils/types';

export default class Builder {

    private paths:PathUtils;
    private locales:LocaleUtils;
    private soy:SoyBuilder;
    private css:CssBuilder;
    private rescMgr:ResourceManager;

    constructor(
        private options:BuildOption,
    ) {
        this.paths      = new PathUtils(options);

        this.locales    = new LocaleUtils(options, this.paths);
        this.soy        = new SoyBuilder(options);
        this.css        = new CssBuilder(options, this.paths);

        this.rescMgr    = new ResourceManager();

        this.rescMgr.registerProvider(this.locales);
        this.rescMgr.registerProvider(this.soy);
        this.rescMgr.registerProvider(this.css);

        this.build = this.build.bind(this);
    }

    private getBundleContext() {
        const ctxt = new BundleContext();

        const { commonEntry, pageScriptEntry, contentScriptEntry, backgroundScriptEntry, optionsEntry }
            = this.paths;

        if (this.options.isSettingsOnly) {
            return ctxt.addModule(optionsEntry, [], [CssBuilder.renamingMapPath]);
        }

        const settings = new BundleEntry("settings", {}, this.options);

        ctxt.addModule(commonEntry)
            .addModule(pageScriptEntry, [commonEntry])

        if (this.options.isExtension) {
            ctxt.addModule(settings, [commonEntry])
                .addModule(contentScriptEntry, [settings], [CssBuilder.renamingMapPath])
                .addModule(backgroundScriptEntry, [commonEntry])
                .addModule(optionsEntry, [settings]);
        } else {
            ctxt.addModule(contentScriptEntry, [commonEntry], [CssBuilder.renamingMapPath]);
        }

        return ctxt
            .addRollupExternalDeps(
                "goog:popupblockerUI",
                "src/bundler_supplements/rollup_external_modules/popupblockerUI.js"
            )
            .addRollupExternalDeps(
                "goog:popupblockerOptionsUI",
                "src/bundler_supplements/rollup_external_modules/popupblockerOptionsUI.js"
            )
            .addRollupExternalDeps(
                "goog:popupblockerUserscriptOptionsUI",
                "src/bundler_supplements/rollup_external_modules/popupblockerUserscriptOptionsUI.js"
            )
            .addRollupExternalDeps(
                "goog:popupblockerNotificationUI",
                "src/bundler_supplements/rollup_external_modules/popupblockerNotificationUI.js"
            )
            .addRollupExternalDeps(
                "goog:soydata.VERY_UNSAFE",
                "src/bundler_supplements/rollup_external_modules/soydata_VERY_UNSAFE.js"
            )
            .addRollupExternalDeps(
                "goog:soyutils",
                "src/bundler_supplements/rollup_external_modules/soyutils.js"
            );
    }

    static async clean() {
        await fsExtra.remove(PathUtils.outputDir);
    }

    private async ensureDirs() {
        await Promise.all([this.paths.outputPath, PathUtils.tsccPath]
            .map(dir => fsExtra.mkdirp(dir)));
    }

    private async cleanBuildArtifacts() {
        const dirs = [
            PathUtils.tsicklePath,
            PathUtils.tsccPath,
            CssBuilder.cssTempPath,
            SoyBuilder.soyTempPath
        ];
        await Promise.all(dirs.map(dir => fsExtra.remove(dir)));
    }

    private static readonly MAX_BUILD_TIMEOUT = 1000 * 60 * 10; // 10 minutes
    private static onBuildTimeout() {
        log.error("Build Timeout");
        process.exit(1);
    }
    private buildTimer:NodeJS.Timer;

    private wrapPageScript(pageScriptRaw:string):string {
        return `function popupBlocker(window,PARENT_FRAME_KEY,CONTENT_SCRIPT_KEY){${pageScriptRaw}}`;
    }

    private async buildExtension(bundles:StringMap<Reservoir>, manifest:string) {
        const tasks:Promise<any>[] = [];

        // bundles other than content_script and page_script are moved to build directory directly.
        let bundleNames = this.getBundleContext().bundleNames;

        let otherBundleTasks = [];
        for (let bundleName of bundleNames) {
            if (bundleName === 'content_script' || bundleName === 'page_script') { continue; }
            let toStringFlag = bundleName === "common" ? true : undefined;
            otherBundleTasks.push(toPromise(
                    bundles[bundleName].release()
                        .pipe(gulp.dest('.')),
                    toStringFlag
            ));
        }
        const [commonScriptRaw] = await Promise.all(otherBundleTasks);

        // Inline page_script to content_script.
        const pageScriptRaw = await toPromise(
            bundles["page_script"].release()
                .pipe(insert.prepend(commonScriptRaw)),
            true
        );
        const inliner = new InlineResource({
            "PAGE_SCRIPT": {
                path: `${this.paths.outputPath}/page_script.js`,
                data: this.wrapPageScript(pageScriptRaw)
            }
        }).inline;

        tasks.push(toPromise(
            bundles["content_script"].release()
                .pipe(insert.transform(inliner))
                .pipe(gulp.dest('.'))
        ));

        tasks.push(fs.writeFile(path.join(this.paths.outputPath, 'manifest.json'), manifest));
        tasks.push(fsExtra.copy(this.paths.optionsPagePath, this.paths.outputPath + '/options.html'));
        tasks.push(fsExtra.copy(PathUtils.assetsPath, this.paths.assetOutputPath));

        await Promise.all(tasks);
    }

    private async buildUserscript(bundles:StringMap<Reservoir>, manifest:string) {
        const tasks:Promise<any>[] = [];

        let commonScriptRaw = await toPromise(bundles["common"].release(), true);
        let pageScriptRaw = await toPromise(
            bundles["page_script"].release()
                .pipe(insert.prepend(commonScriptRaw)),
            true
        );
        const inliner = new InlineResource({
            "PAGE_SCRIPT": {
                path: `${this.paths.outputPath}/page_script.js`,
                data: this.wrapPageScript(pageScriptRaw)
            }
        }).inline;
        tasks.push(toPromise(
            bundles["content_script"].release()
                .pipe(insert.prepend(commonScriptRaw))
                .pipe(insert.transform(inliner))
                .pipe(insert.prepend(manifest))
                .pipe(rename('popupblocker.user.js'))
                .pipe(gulp.dest(this.paths.outputPath))
        ));

        tasks.push(fs.writeFile(path.join(this.paths.outputPath, 'popupblocker.meta.js'), manifest));
        tasks.push(fsExtra.copy(PathUtils.assetsPath, this.paths.assetOutputPath));

        await Promise.all(tasks);
    }

    private async buildUserscriptSettings(bundles:StringMap<Reservoir>) {
        const tasks:Promise<any>[] = [];

        tasks.push(toPromise(
            bundles["options"].release()
                .pipe(gulp.dest('.'))
        ));
        tasks.push(fsExtra.copy(this.paths.optionsPagePath, this.paths.outputPath + '/options.html'));
        tasks.push(fsExtra.copy(PathUtils.assetsPath, this.paths.assetOutputPath));

        await Promise.all(tasks);
    }

    async build() {
        this.buildTimer = setTimeout(Builder.onBuildTimeout, Builder.MAX_BUILD_TIMEOUT);

        try {
            await this.ensureDirs();
            await this.rescMgr.prepare();

            const bundler = new Bundler(
                this.options,
                this.paths,
                this.rescMgr,
                this.getBundleContext()
            );

            const metadataUtils = !this.options.isSettingsOnly ? new MetadataUtils(
                this.options,
                this.paths,
                this.locales
            ) : null;

            const [bundles, manifest] = await Promise.all([bundler.bundle(), metadataUtils && metadataUtils.getMetadata()]);

            log.info("Main task start");

            if (this.options.isExtension) {
                await this.buildExtension(bundles, manifest);
            } else if (this.options.isUserscript) {
                await this.buildUserscript(bundles, manifest);
            } else if (this.options.isSettingsOnly) {
                await this.buildUserscriptSettings(bundles);
            }

            log.info("Main task end");

            await this.cleanBuildArtifacts();
        } catch (e) {
            log.error("Build Error");
            log.error(e);
        } finally {
            clearTimeout(this.buildTimer);
        }
    }

}
