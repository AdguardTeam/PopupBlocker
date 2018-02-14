import path = require('path');
import * as fs from 'async-file';
import * as fsExtra from 'fs-extra';
import Reservoir from './tasks/Reservoir';
import toPromise from './tasks/to_promise';
import mergeOpts = require('merge-options');
import log = require('fancy-log');

import gulp = require('gulp');
import append = require('gulp-append');
import insert = require('gulp-insert');
import merge = require('merge-stream');
import concat = require('gulp-concat');
import preprocess = require('gulp-preprocess');
import rename = require('gulp-rename');
import rollup = require('gulp-rollup');
import filter = require('gulp-filter');
import debug = require('gulp-debug');

import postcss = require('gulp-postcss');
import imp = require('postcss-partial-import');
import svg = require('postcss-svg');
import mixins = require('postcss-mixins');
import cssnext = require('postcss-cssnext');
import nesting = require('postcss-nested');

import InlineResource = require('inline-resource-literal');

import typescript = require('@alexlur/rollup-plugin-typescript');
import typescript2 = require('rollup-plugin-typescript2');

import * as closureCompiler from 'google-closure-compiler';

import { main as tsickleMain } from './tasks/tscc/third-party/tsickle/main';
import ManifestSort from './tasks/tscc/ManifestSort';
import * as tsickle from 'tsickle/src/tsickle';

import JarUtils from './tasks/JarUtils';

const ccPlugin = closureCompiler.gulp({});

enum BuildTarget {
    USERSCRIPT  = 'userscript',
    CHROME      = 'chrome',
    FIREFOX     = 'firefox',
    EDGE        = 'edge'
}

enum Channel {
    DEV         = 'dev',
    BETA        = 'beta',
    RELEASE     = 'release'
}

interface IPreprocessContext {
    DEBUG?:boolean,
    RECORD?:boolean,
    NO_PROXY?:boolean,
    NO_EVENT?:boolean
}

class BuildOption {
    constructor(
        public target:BuildTarget,
        public channel:Channel,
        public preprocessContext:IPreprocessContext,
        public overrideShouldMinify?:boolean
    ) { }
    get shouldMinify() {
        if (typeof this.overrideShouldMinify !== 'undefined') {
            return this.overrideShouldMinify;
        }
        // Apply minification for beta and release channel.
        return this.channel !== Channel.DEV;
    }
    clone():BuildOption {
        return new BuildOption(this.target, this.channel, this.preprocessContext, this.overrideShouldMinify);
    }
}


abstract class TextUtils {
    static removeCcExport(content) {
        return content.replace(/"REMOVE_START"[\s\S]*?"REMOVE_END"/, '');
    }
    static removeGlobalAssignment(content) {
        return content.replace(/window.popupBlocker\s*=\s*/, '');
    }
}

class PathUtils {

    public static sourceDir     = 'src';
    public static outputDir     = 'build';

    public static tsickleDir    = 'tsickle';
    public static tsccDir       = 'tscc';

    public static tsicklePath = path.posix.join(PathUtils.outputDir, PathUtils.tsickleDir);
    public static tsccPath = path.posix.join(PathUtils.outputDir, PathUtils.tsccDir);

    public get outputPath() {
        return path.posix.join(PathUtils.outputDir, this.options.target, '');
    }

    private static reModuleExtension = /\.[jt]sx?$/;
    private static normalizeModuleExtension(path:string) {
        return path.replace(PathUtils.reModuleExtension, '.js');
    }
    private static pathToGoogModule(path:string):string {
        const regex = PathUtils.reModuleExtension;
        // Strip file extension
        if (regex.test(path)) {
            path = RegExp['leftContext'];
        }
        return path.replace(/[\/\\]/g, '.');
    }

    private static targetPageScriptEntryMap = {
        [BuildTarget.USERSCRIPT]:   'platform/userscript/page_script.ts',
        [BuildTarget.CHROME]:       'platform/extension/shared/page_script.ts',
        [BuildTarget.FIREFOX]:      'platform/extension/shared/page_script.ts',
        [BuildTarget.EDGE]:         'platform/extension/shared/page_script.ts'
    }
    public get pageScriptEntry() {
        return path.posix.join(
            PathUtils.sourceDir,
            PathUtils.targetPageScriptEntryMap[this.options.target]
        );
    }
    public get pageScriptEntryCc() {
        return PathUtils.normalizeModuleExtension(path.posix.join(
            PathUtils.outputDir,
            PathUtils.tsccDir,
            PathUtils.targetPageScriptEntryMap[this.options.target]
        ));
    }
    public get pageScriptEntryGoogModule() {
        return 'goog:' + PathUtils.pathToGoogModule(this.pageScriptEntryCc);
    }
    private static targetContentScriptEntryMap = {
        [BuildTarget.USERSCRIPT]:   'platform/userscript/content_script.ts',
        [BuildTarget.CHROME]:       'platform/extension/shared/content_script.ts',
        [BuildTarget.FIREFOX]:      'platform/extension/shared/content_script.ts',
        [BuildTarget.EDGE]:         'platform/extension/edge/content_script.ts'
    }
    public get contentScriptEntry() {
        return path.posix.join(
            PathUtils.sourceDir,
            PathUtils.targetContentScriptEntryMap[this.options.target]
        );
    }
    public get contentScriptEntryCc() {
        return PathUtils.normalizeModuleExtension(path.posix.join(
            PathUtils.outputDir,
            PathUtils.tsccDir,
            PathUtils.targetContentScriptEntryMap[this.options.target]
        ));
    }
    public get contentScriptEntryGoogModule() {
        return 'goog:' + PathUtils.pathToGoogModule(this.contentScriptEntryCc);
    }
    private static targetCommonScriptMap = {
        [BuildTarget.USERSCRIPT]:   'platform/userscript/common.ts',
        [BuildTarget.CHROME]:       'platform/extension/shared/common.ts',
        [BuildTarget.FIREFOX]:      'platform/extension/shared/common.ts',
        [BuildTarget.EDGE]:         'platform/extension/shared/common.ts'
    }
    public get commonEntryCc() {
        return PathUtils.normalizeModuleExtension(path.posix.join(
            PathUtils.tsccPath,
            PathUtils.targetCommonScriptMap[this.options.target]
        ));
    }
    public get commonEntryGoogModule() {
        return 'goog:' + PathUtils.pathToGoogModule(this.commonEntryCc);
    }

    public get tsickleExternsPath() {
        return path.posix.join(
            PathUtils.tsccPath,
            'generated-externs.js'
        );
    }

    public static alertTemplatePath     = 'src/ui/template.html'
    public static translationJSONPath   = 'src/locales/translations.json'
    public static assetsPath            = 'src/platform/extension/shared/assets'

    public get assetOutputPath() {
        return path.posix.join(this.outputPath, 'assets');
    }

    public static commonExtensionManifestPath = 'src/platform/extension/shared/manifest.json';

    private static targetManifestPathMap = {
        [BuildTarget.USERSCRIPT]:   'src/platform/userscript/meta.js',
        [BuildTarget.EDGE]:         'src/platform/extension/edge/manifest_override.json'
    }
    public get manifestPath() {
        return PathUtils.targetManifestPathMap[this.options.target];
    }

    constructor(
        private options:BuildOption
    ) { }

}


class CssUtils {

    private static postCssDir = 'src/ui/pcss';
    private static postCssGlob = 'src/ui/pcss/**.pcss';
    private static baseSrc = [
        'vars.pcss',
        'mixins.pcss',
        'global.pcss',
        'fonts.pcss'
    ];

    /**
     * For userscripts, we inline css for alerts to the userscript source, and host the
     * options css in a dedicated page.
     */
    private static alertSrc = CssUtils.baseSrc.concat('alerts.pcss', 'pin.pcss');
    private static optionsSrc = CssUtils.baseSrc.concat('settings.pcss');
    private static allSrc = CssUtils.baseSrc.concat('alerts.pcss', 'pin.pcss', 'settings.pcss');

    private static bundledCssName = 'styles.css';
    private static cssTempDir = 'css_temp';

    private static cssTempPath = path.posix.join(PathUtils.outputDir, CssUtils.cssTempDir, CssUtils.bundledCssName);

    private static renamingOutPath = path.posix.join(PathUtils.tsccPath, 'renaming_map.js');

    private static compilePostCss(srcs:string[]):NodeJS.ReadableStream {
        return gulp.src(srcs)
            .pipe(postcss([
                imp(),
                nesting(),
                svg(),
                mixins(),
                cssnext({ browsers: ["IE 10", "> 1%"] }),
            ]))
            .pipe(rename(CssUtils.bundledCssName));
    }

    private static async getUnminifiedCss(srcs:string[]):Promise<string> {
        return await toPromise(CssUtils.compilePostCss(srcs), true);
    }

    private static async getMinifiedCss(srcs:string[]):Promise<string> {
        await toPromise(CssUtils.compilePostCss(srcs));

        return await toPromise(new JarUtils(JarUtils.STYLESHEETS_PATH, [
            `--output-renaming-map-format`, `CLOSURE_COMPILED`,
            `--rename`,                     `CLOSURE`,
            `--output-renaming-map`,         CssUtils.renamingOutPath,
             CssUtils.cssTempPath
        ]), true);
    }

    private async getCss(srcs:string[]):Promise<string> {
        return this.options.shouldMinify ? CssUtils.getMinifiedCss(srcs) : CssUtils.getUnminifiedCss(srcs);
    } 

    public async getAlertCss():Promise<string> {
        return this.getCss(CssUtils.alertSrc);
    }
    public async getOptionsCss():Promise<string> {
        return this.getCss(CssUtils.optionsSrc);
    }
    public async getAllCss():Promise<string> {
        return this.getCss(CssUtils.allSrc);
    }

    constructor(
        private options:BuildOption
    ) { }

}

class SoyUtils {
    
    private static soyGlob = 'src/ui/soy/**.soy';

    private static soyPath = 'src/ui/soy/';

    private static alertTemplateName = 'alert.soy';
    private static optionsTemplateName = 'options.soy';

    public static alertTemplatePath = path.posix.join(SoyUtils.soyPath, SoyUtils.alertTemplateName);
    public static optionsTemplatePath = path.posix.join(SoyUtils.soyPath, SoyUtils.optionsTemplateName);

    private static soyUtilsPath = path.posix.join(SoyUtils.soyPath, 'third_party/soyutils.js');

    public async compileRollup(srcs:string):Promise<string> {
        return toPromise(
            new JarUtils(JarUtils.TEMPLATES_PATH, [
                `--cssHandlingScheme`,  `LITERAL`,
                `--srcs`,                srcs,
                `--outputPathFormat`,   `{INPUT_FILE_NAME_NO_EXT}.literal.soy.js`,
                `--bidiGlobalDir`,      `1`,
                `--shouldGenerateJsdoc`,
            ])
                .pipe(insert.transform(SoyUtils.transformGetMsgRollup))
                .pipe(append(SoyUtils.soyUtilsPath)),
            true
        );
    }

    /**
     * Transforms `goog.getMsg` calls to runtime i18nService call.
     */
    private static transformGetMsgCc(content:string):string {
        const importNamespace = `var __soyUtils__adguard = goog.require('build.tscc.content_script_namespace');`;

        return content.replace(SoyUtils.reGetMsg, '__soyUtils__adguard.i18nService.getMsg\(') + '\n' + importNamespace;
    }

    private static transformGetMsgRollup(content:string):string {
        return content.replace(SoyUtils.reGetMsg, 'adugard.i18nservice.getMsg\(');
    }

    private static reGetMsg = /goog\.getMsg\(/g;

    public async compileCc(srcs:string):Promise<string> {
        return toPromise(
            new JarUtils(JarUtils.TEMPLATES_PATH, [
                `--cssHandlingScheme`,  `GOOG`,
                `--srcs`,                srcs,
                `--outputPathFormat`,   `{INPUT_FILE_NAME_NO_EXT}.goog.soy.js`,
                `--bidiGlobalDir`,      `1`,
                `--shouldGenerateJsdoc`,
                `--shouldProvideRequireSoyNamespaces`,
                `--shouldGenerateGoogMsgDefs`
            ]).pipe(insert.transform(SoyUtils.transformGetMsgCc)),
            true
        );
    }

}

class LocaleUtils {

    private translationJSONCached:{[locale:string]:{[messageId:string]:{message:string}}}
    public async getTranslationJSON() {
        if (!this.translationJSONCached) {
            this.translationJSONCached = JSON.parse((await fs.readFile(PathUtils.translationJSONPath)).toString());
        }
        return this.translationJSONCached;
    }

    private static EXTENSION_NAME = "extension_name";

    private static extensionOnlyMessages = {
        [LocaleUtils.EXTENSION_NAME]: true,
        "extension_description": true
    }

    public get channelSuffix() {
        switch (this.options.channel) {
            case Channel.DEV:
                return " (Dev)";
            case Channel.BETA:
                return " (Beta)";
        }
        return "";
    }

    /**
     * We collapse 'message' property in the json object containing translations,
     * in order to have a shorter representation in the userscript source.
     */
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

    /**
     * Extensions treats dollar signs as a special character used for substituting
     * placeholders, and treats `$$` as a literal dollar sign. We have not relied
     * on this feature and used our different placeholders, so we escape all the
     * dollar signs.
     */
    private async getExtensionJSON() {
        const out = {};
        const json = await this.getTranslationJSON();
        for (let locale in json) {
            out[locale] = {};
            for (let messageId in json[locale]) {
                let message = json[locale][messageId].message;
                if (messageId === LocaleUtils.EXTENSION_NAME) {
                    message += this.channelSuffix;
                }
                message = message.replace(/\$/g, '$$$');
                out[locale][messageId] = {
                    message: message
                };
            }
        }
        return <{[locale:string]:{[messageId:string]:{message:string}}}>out;
    }

    public async moveLocalesToTargetDir() {
        const localePath = path.posix.join(this.paths.outputPath, '_locales');
        const [json] = await Promise.all([this.getExtensionJSON(), fsExtra.mkdirp(localePath)]);
        return Promise.all(Object.keys(json).map(async (locale) => {
            let localeNextPath = path.posix.join(localePath, locale);
            await fsExtra.mkdirp(localeNextPath);
            await fs.writeFile(path.posix.join(localeNextPath, 'messages.json'), JSON.stringify(json[locale]));
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

    public async getInlinedResourceMap() {
        let resources = {
            "ALERT_TEMPLATE": PathUtils.alertTemplatePath
        };

        if (this.options.target === BuildTarget.USERSCRIPT) {
            resources["USERSCRIPT_TRANSLATIONS"] = {
                data: JSON.stringify(await this.locales.getUserscriptInlinableJSON()),
                path: 'userscript_translations.json'
            };
        }

        if (!this.options.shouldMinify) {
            resources["TEMPLATE_ROLLUP"] = {
                data: await this.soy.compileRollup(SoyUtils.alertTemplatePath),
                path: 'alert.soy.js' // Why the fuck do we need this?
            };
        }

        if (this.options.target !== BuildTarget.USERSCRIPT) {
            resources["ALERT_STYLE"] = {
                data: await this.css.getAlertCss(),
                path: 'alert.css'
            };
        }

        return resources;
    }

    public async prepareNotInlinedResources():Promise<void> {
        
    }

    public async getSettingsPageInlinedResourceMap() {
        let resources = {};

        // We inline css for userscript 
        if ()
    }



    public async prepareSettingsPageResources():Promise<void> {




        // options page templates
    }

    constructor(
        private options:BuildOption,
        private locales:LocaleUtils,
        private css:CssUtils,
        private soy:SoyUtils
    ) { }

}

export default class Builder {

    private static version = '2.2.1';

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
        '*://*.naver.com/*',
        '*://*.yandex.tld/*',
        'https://*.twitch.tv/*',
        'https://tinder.com/*'
    ];

    private static channelDownloadUpdateURLMap = {
        [Channel.DEV]:      'https://AdguardTeam.github.io/PopupBlocker/',
        [Channel.BETA]:     'https://cdn.adguard.com/public/Userscripts/Beta/AdguardPopupBlocker/2.1/',
        [Channel.RELEASE]:  'https://cdn.adguard.com/public/Userscripts/AdguardPopupBlocker/2.1/'
    }

    private get downloadUpdateURL() {
        return Builder.channelDownloadUpdateURLMap[this.options.channel];
    }

    private async loadResources() {
        if (!this.inlineResource) {
            this.inlineResource = (new InlineResource(await this.resources.getInlinedResourceMap())).inline;
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
        this.build = this.build.bind(this);
    }

    private static rollupTsconfigOverride = { compilerOptions: { target: "es5" } };
    private get pageScriptRollupOptions() {
        return {
            entry: this.paths.pageScriptEntry,
            plugins: [(<any>typescript2)({ tsconfigOverride: Builder.rollupTsconfigOverride })],
            format: 'es', // In order not to produce unnecessary closure.
            strict: false
        };
    }
    private get contentScriptRollupOptions() {
        return {
            entry: this.paths.contentScriptEntry,
            plugins: [(<any>typescript2)({ tsconfigOverride: Builder.rollupTsconfigOverride })],
            format: 'iife',
            strict: false
        };
    }

    private async rollup():Promise<Reservoir> {
        const options = this.options;
        const bundlePageScript = gulp.src('src/**/*.ts')
            .pipe(<any>preprocess({ context: this.options.preprocessContext }))
            .pipe(rollup(this.pageScriptRollupOptions))
            .pipe(insert.transform(this.inlineResource))

        const bundleContentScript = gulp.src('src/**/*.ts')
            .pipe(<any>preprocess({ context: this.options.preprocessContext }))
            .pipe(rollup(this.contentScriptRollupOptions))
            .pipe(insert.transform(this.inlineResource))

        const contentScriptResv = new Reservoir(bundleContentScript);

        const [pageScriptRaw] =
            await Promise.all([toPromise(bundlePageScript, true), toPromise(bundleContentScript)]);

        const wrappedPageScript = this.options.target === BuildTarget.USERSCRIPT ?
            `function popupBlocker(window,PARENT_FRAME_KEY,CONTENT_SCRIPT_KEY){${pageScriptRaw}}` :
            `function popupBlocker(window,PARENT_FRAME_KEY){${pageScriptRaw}}`;

        const inlinePageScript = (new InlineResource({
            PAGE_SCRIPT: {
                path: `${this.paths.outputPath}page_script.js`,
                data: wrappedPageScript
            }
        })).inline;

        return new Reservoir(
            contentScriptResv
                .release()
                .pipe(insert.transform(TextUtils.removeGlobalAssignment))
                .pipe(insert.transform(inlinePageScript))
        );
    }

    private ccOptionsFromManifest(manifest:tsickle.ModulesManifest):string[] {
        const sorter = new ManifestSort(manifest);
        const deps = sorter.getDeps([this.paths.commonEntryCc, this.paths.pageScriptEntryCc, this.paths.contentScriptEntryCc]);
        const flags = [
            '--charset',                  'UTF-8',
            '--compilation_level',        'ADVANCED',
            '--language_in',              'ECMASCRIPT6',
            '--language_out',             'ECMASCRIPT5',
            '--assume_function_wrapper',   String(true),
            '--warning_level',            'VERBOSE',
            '--strict_mode_input',         String(false),
            '--externs',                  'externs.js',
            '--externs',                   this.paths.tsickleExternsPath,
            '--rewrite_polyfills',         String(false),

            '--entry_point',               this.paths.commonEntryGoogModule,
            '--module',                   `common:auto`,
            '--entry_point',               this.paths.pageScriptEntryGoogModule,
            '--module',                   `page_script:${deps.num_js[1]}:common`,
            '--entry_point',               this.paths.contentScriptEntryGoogModule,
            '--module',                   `content_script:${deps.num_js[2]}:common`,

            '--module_output_path_prefix', this.paths.outputPath + '/'
        ];

        for (let fileName of deps.sorted) {
            flags.push('--js', fileName);
        }
        return flags;
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
        return content.replace(Builder.reWorkaroundTsickleBug, Builder.workaroundCallback);
    }

    private async tscc():Promise<Reservoir> {
        const options = this.options;

        const preprocessTask = toPromise(
            gulp.src('src/**/*.ts')
                .pipe(<any>preprocess({ context: options.preprocessContext }))
                .pipe(gulp.dest(PathUtils.tsicklePath))
        );
        const compileCss = toPromise(
            this.css.prepare()
        );

        await Promise.all([preprocessTask, compileCss]);

        log.info("Tsickle start");
        const result:tsickle.EmitResult|1 = tsickleMain(
            `--externs=${PathUtils.tsccPath}/generated-externs.js --typed -- -p tasks/tscc`
                .split(' ')
        );
        log.info("Tsickle end");

        if (result === 1) { throw new Error("Tsickle Error"); }

        const contentScriptFilter = filter(file => /content_script\.js$/.test(file.path), { passthrough: false, restore: true })
        const pageScriptFilter = filter(file => /page_script\.js$/.test(file.path), { passthrough: false, restore: true });

        await toPromise(
            gulp.src(`${PathUtils.tsccPath}/**/*.js`)
                .pipe(insert.transform(Builder.tsickleWorkaround))
                .pipe(insert.transform((content, file) => {
                    if (file.path.endsWith('externs.js')) {
                        // Do not inline resources to externs file.
                        return content;
                    }
                    return this.inlineResource(content)
                }))
                .pipe(gulp.dest(PathUtils.tsccPath))
        );

        const commonScript = contentScriptFilter.restore;

        const contentScriptResv = new Reservoir(
            merge(commonScript, pageScriptFilter.restore.pipe(contentScriptFilter))
                .pipe(concat('page_script.js', {newLine: ';'}))
        );

        log.info("Closure compiler start");
        const pageScriptRaw = await toPromise(
            merge(commonScript,
                 ccPlugin(this.ccOptionsFromManifest(result.modulesManifest))
                    .src()
                    .pipe(insert.transform(TextUtils.removeCcExport))
                    .pipe(pageScriptFilter))
                .pipe(concat('page_script.js', {newLine: ';'})),
            true
        );
        log.info("Closure compiler end");

        const wrappedPageScript = this.options.target === BuildTarget.USERSCRIPT ?
            `function popupBlocker(window,PARENT_FRAME_KEY,CONTENT_SCRIPT_KEY){${pageScriptRaw}}` :
            `function popupBlocker(window,PARENT_FRAME_KEY){${pageScriptRaw}}`;

        const inlinePageScript = (new InlineResource({
            PAGE_SCRIPT: {
                path: `${this.paths.outputPath}page_script.min.js`,
                data: wrappedPageScript
            }
        })).inline;

        return new Reservoir(
            contentScriptResv
                .release()
                .pipe(insert.transform(TextUtils.removeGlobalAssignment))
                .pipe(insert.transform(inlinePageScript))
        );
    }

    private async meta() {
        const translation = await this.locales.getTranslationJSON();
        const lines:string[] = [];
        function insertKey(key:string, value:string) {
            lines.push(`// @${key} ${value}`);
        }
        function insertTranslatableKeys (metaKey:string, messageId:string, additional:string = ''):void {
            insertKey(metaKey, translation['en'][messageId].message + additional); // insert 'en' language at the first line.
            for (let locale in translation) {
                if (locale === 'en') continue;
                insertKey(metaKey + ':' + locale, translation[locale][messageId].message + additional);
            }
        }

        lines.push('// ==UserScript==');

        insertTranslatableKeys('name', 'extension_name', this.locales.channelSuffix);
        insertKey('namespace',   'AdGuard');
        insertTranslatableKeys('description', 'extension_description');
        insertKey('version',      Builder.version);
        insertKey('license',     `LGPL-3.0; https://github.com/AdguardTeam/PopupBlocker/blob/master/LICENSE`);
        insertKey('downloadURL', `${this.downloadUpdateURL}popupblocker.user.js`);
        insertKey('updateURL',   `${this.downloadUpdateURL}popupblocker.meta.js`);
        insertKey('supportURL',  `https://github.com/AdguardTeam/PopupBlocker/issues`);
        insertKey('homepageURL', `https://github.com/AdguardTeam/PopupBlocker`);
        insertKey('match',       'http://*/*');
        insertKey('match',       'https://*/*');
        insertKey('grant',       'GM_getValue');
        insertKey('grant',       'GM_setValue');
        insertKey('grant',       'unsafeWindow');
        insertKey('run-at',      'document-start');

        if (this.options.channel === Channel.RELEASE) {
            // Apply default whitelists to the release channel only.
            for (let exclusion of Builder.exclusions) {
                insertKey('exclude', exclusion);
            }
        }

        lines.push(`// ==/UserScript==`);
        lines.push(``);

        return lines.join('\n');
    }

    private async manifest():Promise<string> {
        const [baseManifest, manifestOverride] = await Promise.all([
            fs.readFile(PathUtils.commonExtensionManifestPath),
            this.paths.manifestPath ?
                fs.readFile(this.paths.manifestPath) :
                Promise.resolve('{}')
        ].map(pr => pr.then(JSON.parse)));

        const manifest = mergeOpts(baseManifest, manifestOverride);

        // Manual tweaks
        manifest["version"] = Builder.version;

        if (this.options.channel === Channel.RELEASE) {
            manifest["content_scripts"][0]["exclude_matches"] = Builder.exclusions;
        }

        return JSON.stringify(manifest);
    }

    private static invalidConfError() {
        throw Error('Invalid Configuration.');
    }

    private async clean() {
        await fsExtra.remove(PathUtils.outputDir);
        await fsExtra.mkdirp(this.paths.outputPath);
    }
    private async cleanBuildArtifacts() {
        await Promise.all([PathUtils.tsicklePath, PathUtils.tsccPath]
            .map(dir => fsExtra.remove(dir)));
    }

    async build() {
        await Promise.all([this.loadResources(), this.clean()]);

        const channel = this.options.channel;
        const target  = this.options.target;

        const contentScript = this.options.shouldMinify ? await this.tscc() : await this.rollup();
        const manifest = target === BuildTarget.USERSCRIPT ? await this.meta() : await this.manifest();

        const tasks = [];
        if (target === BuildTarget.USERSCRIPT) {
            tasks.push(toPromise(
                contentScript
                    .release()
                    .pipe(rename('popupblocker.user.js'))
                    .pipe(insert.prepend(manifest))
                    .pipe(gulp.dest(this.paths.outputPath))
            ));
            tasks.push(fs.writeFile(path.posix.join(this.paths.outputPath, 'popupblocker.meta.js'), manifest));
        } else {
            // extension env
            tasks.push(toPromise(
                contentScript
                    .release()
                    .pipe(rename('content_script.js'))
                    .pipe(gulp.dest(this.paths.outputPath))
            ));
            tasks.push(fs.writeFile(path.posix.join(this.paths.outputPath, 'manifest.json'), manifest));
            tasks.push(this.locales.moveLocalesToTargetDir());
            tasks.push(fsExtra.copy(PathUtils.assetsPath, this.paths.assetOutputPath));
        }

        await Promise.all(tasks);
        await this.cleanBuildArtifacts();
    }

}

/******************************************************************************/

const preprocessCtxt = {
    NO_PROXY: true
};

const devPreprocessCtxt = {
    DEBUG: true,
    RECORD: true
};

// Define gulp tasks: <target>-<channel>[-[un]minified]
for (let target in BuildTarget) {
    for (let channel in Channel) {
        let taskName = `${Channel[channel]}-${BuildTarget[target]}`;
        
        let option = new BuildOption(
            <BuildTarget>BuildTarget[target],
            <Channel>Channel[channel],
            channel === 'DEV' ? devPreprocessCtxt : preprocessCtxt
        );

        let option_minified = option.clone();
        option_minified.overrideShouldMinify = true;

        let option_unminified = option.clone();
        option_unminified.overrideShouldMinify = false;

        gulp.task(taskName, new Builder(option).build);
        gulp.task(taskName + '-minified', new Builder(option_minified).build);
        gulp.task(taskName + '-unminified', new Builder(option_unminified).build);
    }
}

/******************************************************************************/

gulp.task('build-test', () => {
    return gulp.src(['test/**/*.ts', 'src/**/*.ts'])
        .pipe(<any>preprocess({
            context: {
                RECORD: true
            }
        }))
        .pipe(rollup({
            entry: 'test/index.ts',
            plugins: [(<any>typescript)()],
            format: 'iife',
            strict: false
        }))
        .pipe(rename('index.js'))
        .pipe(gulp.dest('./test/build'));
});

gulp.task('travis', ['dev-userscript'], () => {
    return [
        fs.writeFile('build/.nojekyll', ''),
        gulp.src(PathUtils.outputDir + '/userscript/**.js')
            .pipe(gulp.dest(PathUtils.outputDir)),
        gulp.src(['test/index.html', 'test/**/*.js'])
            .pipe(gulp.dest(PathUtils.outputDir + '/test/')),
        gulp.src('node_modules/mocha/mocha.*')
            .pipe(gulp.dest(PathUtils.outputDir + '/node_modules/mocha/')),
        gulp.src('node_modules/chai/chai.js')
            .pipe(gulp.dest(PathUtils.outputDir + '/node_modules/chai/'))
    ];
});

gulp.task('watch', () => {
    const onerror = (error) => { console.log(error.toString()); };
    const onchange = (event) => { console.log('File ' + event.path + ' was ' + event.type + ', building...'); };
    gulp.watch('src/**/*', <any>['dev-userscript'])
        .on('change', onchange)
        .on('error', onerror);
    gulp.watch('test/**/*.ts', <any>['build-test'])
        .on('change', onchange)
        .on('error', onerror);
});

/******************************************************************************/

import onesky = require('onesky-utils');

gulp.task('i18n-up', async () => {
    try {
        const base = require('./config/.key.js');
        const file = (await fs.readFile('src/locales/en.json')).toString();

        const _options = {
            language: 'en',
            fileName: 'en.json',
            format: 'HIERARCHICAL_JSON',
            content: file,
            keepStrings: false
        };

        Object.assign(_options, base);

        await onesky.postFile(_options);
    } catch (e) {
        log.error(e);
    }
});

gulp.task('i18n-down',  async () => {
    const base = require('./config/.key.js');
    const languages = JSON.parse(await onesky.getLanguages(base)).data;
    const map = {};
    await Promise.all(languages.map(async (lang) => {
        let languageCode = lang.code;
        let option = Object.assign({
            language: languageCode,
            fileName: 'en.json'
        }, base);
        let response = await onesky.getFile(option);
        if (response) {
            map[languageCode]= JSON.parse(response);
        }
    }));

    await fs.writeFile(PathUtils.translationJSONPath, JSON.stringify(map));
});
