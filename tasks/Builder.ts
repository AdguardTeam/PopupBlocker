import path from 'path';
import * as fs from 'async-file';
import { promisify } from 'util';

import gulp from 'gulp';
import insert from 'gulp-insert';
import preprocess from 'gulp-preprocess';
import rename from 'gulp-rename';
import rollup from 'gulp-rollup';
import filter from 'gulp-filter';

import merge from 'merge-stream';
import streamToPromise from 'stream-to-promise';
import InlineResource from 'inline-resource-literal';

import typescript from '@alexlur/rollup-plugin-typescript';
import typescript2 from 'rollup-plugin-typescript2';

import closureCompiler from 'google-closure-compiler';
import { main as tsickleMain } from './tscc/third-party/tsickle/main';

/**
 * {@link https://github.com/google/closure-compiler-npm#running-the-compiler-using-nailgun}
 */
closureCompiler.compiler.JAR_PATH = undefined;
closureCompiler.compiler.prototype.javaPath = './node_modules/.bin/closure-gun'
const ccPlugin = closureCompiler.gulp({});

enum BuildTarget {
    USERSCRIPT,
    CHROME_EXT,
    WEBEXT
}

enum Channel {
    DEV,
    BETA,
    RELEASE
}

interface IPreprocessContext {
    DEBUG:boolean,
    RECORD:boolean,
    NO_PROXY:boolean,
    NO_EVENT:boolean
}

interface BuildOption {
    target:BuildTarget,
    channel:Channel,
    preprocessContext:IPreprocessContext,
    whitelists:string[]
}

abstract class TextUtils {
    static removeCcExport(content) {
        return content.replace(/"REMOVE_START"[\s\S]*?"REMOVE_END"/, '');
    }
}

class PathUtils {

    public static sourceDir     = 'src';
    public static outputDir     = 'build';

    public static tsickleDir    = 'tsickle';
    public static tsccDir       = 'tscc';

    public static tsicklePath = path.join(PathUtils.outputDir, PathUtils.tsickleDir);
    public static tsccPath = path.join(PathUtils.outputDir, PathUtils.tsickleDir);

    private static platformDirMap = {
        [BuildTarget.USERSCRIPT]:   'userscript',
        [BuildTarget.CHROME_EXT]:   'chrome',
        [BuildTarget.WEBEXT]:       'webext'
    }
    public get outputPath() {
        return path.join(PathUtils.outputDir, PathUtils.platformDirMap[this.options.target], '');
    }

    private static reModuleExtension = /\.[jt]sx?$/g;
    public static pathToGoogModule(path:string):string {
        const regex = PathUtils.reModuleExtension;
        // Strip file extension
        if (regex.test(path)) {
            path = path.slice(0, regex.lastIndex);
        }
        return path.replace('\\', '.');
    }

    private static targetPageScriptEntryMap = {
        [BuildTarget.USERSCRIPT]:   'platform/userscript/page_script.ts',
        [BuildTarget.CHROME_EXT]:   'platform/extension/shared/page_script.ts',
        [BuildTarget.WEBEXT]:       'platform/extension/shared/page_script.ts'
    }
    public get pageScriptEntry() {
        return path.join(
            PathUtils.sourceDir,
            PathUtils.targetPageScriptEntryMap[this.options.target]
        );
    }
    public get pageScriptEntryCc() {
        return PathUtils.tsccDir
            + '.'
            + PathUtils.pathToGoogModule(PathUtils.targetPageScriptEntryMap[this.options.target]);
    }
    private static targetContentScriptEntryMap = {
        [BuildTarget.USERSCRIPT]:   'platform/userscript/content_script.ts',
        [BuildTarget.CHROME_EXT]:   'platform/extension/chrome/content_script.ts',
        [BuildTarget.WEBEXT]:       'platform/extension/webext/content_script.ts'
    }
    public get contentScriptEntry() {
        return path.join(
            PathUtils.sourceDir,
            PathUtils.targetContentScriptEntryMap[this.options.target]
        );
    }
    public get contentScriptEntryCc() {
        return PathUtils.tsccDir
            + '.'
            + PathUtils.pathToGoogModule(PathUtils.targetContentScriptEntryMap[this.options.target]);
    }

    public static alertTemplatePath = 'src/ui/template.html'

    public static translationJSONPath = 'src/locales/translations.json'

    private static targetManifestPathMap = {
        [BuildTarget.USERSCRIPT]:   'src/platform/userscript/meta.js',
        [BuildTarget.CHROME_EXT]:   'src/platform/extension/shared/manifest.json',
        [BuildTarget.WEBEXT]:       'src/platform/extension/shared/manifest.json'
    }
    public get manifestPath() {
        return PathUtils.targetManifestPathMap[this.options.target];
    }

    constructor(
        private options:BuildOption
    ) { }

}

class LocaleUtils {

    private translationJSONCached:{[locale:string]:{[messageId:string]:{message:string}}}
    public async getTranslationJSON() {
        if (!this.translationJSONCached) {
            this.translationJSONCached = JSON.parse((await fs.readFile(PathUtils.translationJSONPath)).toString());
        }
        return this.translationJSONCached;
    }

    private static extensionOnlyMessages = {
        "extension_name": true,
        "extension_description": true
    }

    public async getUserscriptInlinableJSON() {
        const out = {};
        const json = await this.getTranslationJSON();
        for (let locale in json) {
            out[locale] = {};
            for (let messageId in json[locale]) {
                if (LocaleUtils.extensionOnlyMessages[messageId] === true) { continue; }
                out[locale][messageId] = json[locale][messageId].message;
            }
        }
        return <{[locale:string]:{[messageId:string]:string}}>out;
    }

    public async moveLocalesToTargetDir() {
        const json = await this.getTranslationJSON();
        return Promise.all(Object.keys(json).map(async (locale) => {
            return fs.writeFile(
                path.join(this.paths.outputPath, '_locales', locale),                
                JSON.stringify(json[locale])
            );
        }));
    }

    constructor(
        private options:BuildOption,
        private paths:PathUtils
    ) { }

}

class ResourceUtils {

    private static commonResourceMap = {
        "ALERT_TEMPLATE": PathUtils.alertTemplatePath
    };
    public async getRequiredResourceMap() {
        let resources = ResourceUtils.commonResourceMap;
        if (this.options.target === BuildTarget.USERSCRIPT) {
            resources = Object.assign({}, resources, {
                "USERSCRIPT_TRANSLATIONS": {
                    data: await this.locales.getUserscriptInlinableJSON(),
                    path: 'userscript_translations.json'
                } 
            });
        }
        return resources;
    }

    constructor(
        private options:BuildOption,
        private locales:LocaleUtils
    ) { }

}

class Builder {
    
    private static version = '2.2';

    private static exclusions = [
        'https://www.linkedin.com/*',
        'https://*.facebook.com/*',
        'https://*.google.tld/*',
        'https://*.youtube.com/*',
        '*://disqus.com/embed/*',
        'https://vk.com/*',
        'https://*.vk.com/*',
        'https://vimeo.com/*',
        'https://*.vimeo.com/*',
        '*://*.coub.com/*',
        '*://coub.com/*',
        '*://*.googlesyndication.com/*',
        '*://*.naver.com/*'
    ];

    private get downloadUpdateURL() {
        switch (this.options.channel) {
            case Channel.DEV: 
                return 'https://AdguardTeam.github.io/PopupBlocker/';
            case Channel.BETA: 
                return 'https://cdn.adguard.com/public/Userscripts/Beta/AdguardPopupBlocker/2.1/';
            case Channel.RELEASE:
                return 'https://cdn.adguard.com/public/Userscripts/AdguardPopupBlocker/2.1/';
        }
    }

    private get pageScriptRollupOptions() {
        if (this.options.channel !== Channel.DEV) { Builder.invalidConfError(); }
        return {
            entry: this.paths.pageScriptEntry,
            plugins: [typescript2()],
            format: 'es',
            strict: false
        };
    }
    private get contentScriptRollupOptions() {
        if (this.options.channel !== Channel.DEV) { Builder.invalidConfError(); }
        return {
            entry: this.paths.contentScriptEntry,
            plugins: [typescript2()],
            format: 'es',
            strict: false
        };
    }

    private async loadResources() {
        if (!this.inlineResource) {
            this.inlineResource = (new InlineResource(await this.resources.getRequiredResourceMap())).inline;
        }
    }

    private inlineResource:(file:string)=>string
    private paths:PathUtils;
    private locales:LocaleUtils;
    private resources:ResourceUtils;
    constructor(
        private options:BuildOption,
    ) {
        this.paths = new PathUtils(options);
        this.locales = new LocaleUtils(options, this.paths);
        this.resources = new ResourceUtils(options, this.locales);
    }

    private async rollup() {
        const options = this.options;
        const bundlePageScript = gulp.src('src/**/*.ts')
            .pipe(<any>preprocess({ context: this.options.preprocessContext }))
            .pipe(rollup(this.pageScriptRollupOptions))
            .pipe(insert.transform(this.inlineResource))

        const bundleContentScript = gulp.src('src/**/*.ts')
            .pipe(<any>preprocess({ context: this.options.preprocessContext }))
            .pipe(rollup(this.contentScriptRollupOptions))
            .pipe(insert.transform(this.inlineResource));

        const [pageScriptBuffer] =
            await Promise.all([streamToPromise(bundlePageScript), streamToPromise(bundleContentScript)]);

        const inlinePageScript = (new InlineResource({
            PAGE_SCRIPT: {
                path: `${this.paths.outputPath}page_script.js`,
                data: pageScriptBuffer
            }
        })).inline;

        return bundleContentScript
            .pipe(insert.transform(inlinePageScript));
    }

    private get closureCompilerOptions() {
        return [
            '--compilation_level', 'ADVANCED',
            '--language_in', 'ECMASCRIPT6',
            '--language_out', 'ECMASCRIPT5',
            '--assume_function_wrapper', String(true),
            '--warning_level', 'VERBOSE',
            '--strict_mode_input', String(false),
            '--externs', 'externs.js',
            '--rewrite_polyfills', String(false),
            '--dependency_mode', 'STRICT',

            '--js', `${PathUtils.tsccPath}/**/*.js`,
            '--entry_point', `goog:${this.paths.contentScriptEntryCc}`,
            '--module', 'content_script:auto',
            '--entry_point', `goog:${this.paths.pageScriptEntryCc}`,
            '--module', `page_script:1:content_script`,

            '--module_output_path_prefix', this.paths.outputPath
        ];
    }

    /**
     * {@link https://github.com/angular/tsickle/issues/481}
     * tsickle uses module's relative path as a module name, 
     * and it occasionally breaks source code on Windows by using an absolute path
     * instead of a relative path, especially when using --typed option.
     * We fix it by applying regexes to replace `goog.forwardDeclare(C_.absolute.path.to.module.PopupBlocker.build.tsickle.index)`
     * into `goog.forwardDeclare('build.tsc.index').
     */
    private static reWorkaroundTsickleBug = new RegExp(`(goog.[A-Za-z]*\\(")(?:.*?\\.)?${PathUtils.sourceDir}\\.`, 'g');
    private static workaroundCallback(_, c1, c2) {
        return `${c1}${PathUtils.outputDir}.${PathUtils.tsccDir}.`;
    }
    private static tsickleWorkaround(content:string):string {
        return content.replace(Builder.reWorkaroundTsickleBug, Builder.workaroundCallback);
    }

    private async tscc() {
        const options = this.options;
        await streamToPromise(
            gulp.src('src/**/*.ts')
                .pipe(<any>preprocess({ context: options.preprocessContext }))
                .pipe(gulp.dest(PathUtils.tsicklePath))
        );
    
        const exitCode = tsickleMain(
            `--externs=${PathUtils.tsicklePath}/generated-externs.js --typed -- -p tasks/tscc`
                .split(' ')
        );
    
        if (exitCode === 1) { throw 'tsickle error'; }
    
        await streamToPromise(
            gulp.src(`${PathUtils.tsccPath}/**/*.js`)
                .pipe(insert.transform(Builder.tsickleWorkaround))
                .pipe(insert.transform(this.inlineResource))
                .pipe(gulp.dest(PathUtils.tsccPath))
        );
    
        const pageScriptFilter = filter(['*page_script.js'], { passthrough: false, restore: true });
    
        const pageScriptBuffer = await streamToPromise(
            ccPlugin(this.closureCompilerOptions)
                .src()
                .pipe(insert.transform(TextUtils.removeCcExport))
                .pipe(pageScriptFilter)
        );
    
        const inlinePageScript = (new InlineResource({
            PAGE_SCRIPT: {
                path: `${this.paths.outputPath}page_script.min.js`,
                data: pageScriptBuffer 
            }
        })).inline;
    
        return pageScriptFilter.restore
            .pipe(insert.transform(inlinePageScript))
    }

    private async meta() {
        const translation = await this.locales.getTranslationJSON();
        const lines:string[] = [];
        function insertTranslatableKeys (metaKey:string, messageId:string):void {
            for (let locale in translation) {
                if (locale !== 'en') {
                    metaKey += `:${locale}`;
                }
                lines.push(`// @${metaKey} ${translation[locale][messageId].message}`);
            }
        }

        lines.push('// ==Userscript==');
        insertTranslatableKeys('name', 'extension_name');
        insertTranslatableKeys('description', 'extension_description');
        lines.push(`// @version ${Builder.version}`);
        lines.push(`// @license LGPL-3.0; https://github.com/AdguardTeam/PopupBlocker/blob/master/LICENSE`);
        lines.push(`// @downloadURL ${this.downloadUpdateURL}`);
        lines.push(`// @updateURL ${this.downloadUpdateURL}`);
        lines.push(`// @supportURL https://github.com/AdguardTeam/PopupBlocker/issues`);
        lines.push(`// @homepageURL https://github.com/AdguardTeam/PopupBlocker`);
        lines.push(`// @match http://*/*`);
        lines.push(`// @match https://*/*`);

        for (let exclusion of Builder.exclusions) {
            lines.push(`// @exclude ${exclusion}`);
        }

        lines.push(`// @grant GM_getValue`);
        lines.push(`// @grant GM_setValue`);
        lines.push(`// @grant unsafeWindow`);
        lines.push(`// @run-at document-start`);

        lines.push(`// ==/UserScript==`);

        return lines.join('\n');
    }

    private async manifest():Promise<string> {
        const manifest = JSON.parse(await fs.readFile(this.paths.manifestPath));
        switch (this.options.channel) {
            case Channel.DEV:
                manifest["name"] += " Dev";
            case Channel.BETA:
                manifest["name"] += " Beta";
        }
        return JSON.stringify(manifest);
    }

    private static invalidConfError() {
        throw Error('Invalid Configuration.');
    }

    async build() {
        await this.loadResources();

        const channel = this.options.channel;
        const target  = this.options.target;

        const contentScript = channel === Channel.DEV ? await this.rollup() : await this.tscc();
        const manifest = target === BuildTarget.USERSCRIPT ? await this.meta() : await this.manifest();

        const tasks = [];
        if (target === BuildTarget.USERSCRIPT) {
            tasks.push(streamToPromise(
                contentScript
                    .pipe(rename('popupblocker.user.js'))
                    .pipe(insert.prepend(manifest))
                    .pipe(gulp.dest(this.paths.outputPath))
            ));
            tasks.push(fs.writeFile(path.join(this.paths.outputPath, 'popupblocker.meta.js'), manifest))
        } else {
            // extension env
            tasks.push(streamToPromise(
                contentScript
                    .pipe(rename('content_script.js'))
                    .pipe(gulp.dest(this.paths.outputPath))
            ));
            tasks.push(fs.writeFile(path.join(this.paths.outputPath, 'manifest.json'), manifest));
            tasks.push(this.locales.moveLocalesToTargetDir());
        }
        return Promise.all(tasks);
    }

}
