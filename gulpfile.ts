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
import hydra = require('gulp-hydra');
import run = require('gulp-run')

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
process.setMaxListeners(0); 
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
    get isExtension() {
        return this.target !== BuildTarget.USERSCRIPT;
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

    public static tsickleDir    = 'build_tsickle';
    public static tsccDir       = 'tscc';

    public static tsicklePath = PathUtils.tsickleDir;

    public static tsccPath = path.posix.join(PathUtils.outputDir, PathUtils.tsccDir);

    public get outputPath() {
        return path.posix.join(PathUtils.outputDir, this.options.target, '');
    }

    private static BundleEntry = class BundleEntry {
        constructor(
            private targetToPathMap: { [key in BuildTarget]?: string },
            private options:BuildOption
        ) { }
        public get rollup() {
            return path.posix.join(
                PathUtils.sourceDir,
                this.targetToPathMap[this.options.target]
            );
        }
        private static reModuleExtension = /\.[jt]sx?$/;
        private static normalizeModuleExtension(path:string) {
            return path.replace(BundleEntry.reModuleExtension, '.js');
        }
        public get cc() {
            return BundleEntry.normalizeModuleExtension(path.posix.join(
                PathUtils.outputDir,
                PathUtils.tsccDir,
                this.targetToPathMap[this.options.target]
            ));
        }
        private static pathToGoogModule(path:string):string {
            const regex = BundleEntry.reModuleExtension;
            // Strip file extension
            if (regex.test(path)) {
                path = RegExp['leftContext'];
            }
            return path.replace(/[\/\\]/g, '.');
        }
        public get googModule() {
            return 'goog:' + BundleEntry.pathToGoogModule(this.cc);
        }
    }

    private static targetPageScriptEntryMap = {
        [BuildTarget.USERSCRIPT]:   'platform/userscript/page_script.ts',
        [BuildTarget.CHROME]:       'platform/extension/shared/page_script.ts',
        [BuildTarget.FIREFOX]:      'platform/extension/shared/page_script.ts',
        [BuildTarget.EDGE]:         'platform/extension/shared/page_script.ts'
    }

    public pageScriptEntry = new PathUtils.BundleEntry(PathUtils.targetPageScriptEntryMap, this.options);

    private static targetContentScriptEntryMap = {
        [BuildTarget.USERSCRIPT]:   'platform/userscript/content_script.ts',
        [BuildTarget.CHROME]:       'platform/extension/shared/content_script.ts',
        [BuildTarget.FIREFOX]:      'platform/extension/shared/content_script.ts',
        [BuildTarget.EDGE]:         'platform/extension/edge/content_script.ts'
    }

    public contentScriptEntry = new PathUtils.BundleEntry(PathUtils.targetContentScriptEntryMap, this.options);

    private static targetBackgroundScriptEntryMap = {
        [BuildTarget.CHROME]:       'platform/extension/shared/background_script.ts',
        [BuildTarget.FIREFOX]:      'platform/extension/shared/background_script.ts',
        [BuildTarget.EDGE]:         'platform/extension/shared/background_script.ts',
    }

    public backgroundScriptEntry = new PathUtils.BundleEntry(PathUtils.targetBackgroundScriptEntryMap, this.options);

    private static targetCommonScriptMap = {
        [BuildTarget.USERSCRIPT]:   'platform/userscript/common.ts',
        [BuildTarget.CHROME]:       'platform/extension/shared/common.ts',
        [BuildTarget.FIREFOX]:      'platform/extension/shared/common.ts',
        [BuildTarget.EDGE]:         'platform/extension/shared/common.ts'
    }

    public commonEntry = new PathUtils.BundleEntry(PathUtils.targetCommonScriptMap, this.options);


    private static targetOptionsMap = {
        [BuildTarget.USERSCRIPT]:   'platform/userscript/options.ts',
        [BuildTarget.CHROME]:       'platform/extension/shared/options.ts',
        [BuildTarget.FIREFOX]:      'platform/extension/shared/options.ts',
        [BuildTarget.EDGE]:         'platform/extension/shared/options.ts'
    }

    public optionsEntry = new PathUtils.BundleEntry(PathUtils.targetOptionsMap, this.options);

    public get tsickleExternsPath() {
        return path.posix.join(
            PathUtils.tsccPath,
            'generated-externs.js'
        );
    }

    public static translationJSONPath   = 'src/locales/translations.json'
    public static assetsPath            = 'src/assets'

    public static postCssPath           = 'src/ui/pcss/';

    public get assetOutputPath() {
        return path.posix.join(this.outputPath, 'assets', '');
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

/******************************************************************************************************/

interface IResourceProvider {
    prepareResource(resources:ResourceManager):Promise<void>
}

/**
 * Depending on build configuration, accompanying resources are either:
 *  1. Moved to output directory, or
 *  2. Inlined in JS files.
 * Resource providers register themselves to ResourceManager, and in their `prepareResource` call,
 * they use `registerInlinedResource` in their own discretion.
 * The manager gathers resources to be inlined and exports a single universal inliner that can be
 * used throughout the build process.
 */
class ResourceManager {
    public inline:(content:string)=>string

    private resourceMap = {};
    private providers:IResourceProvider[] = [];

    public registerInlinedResource(marker:string, data:string|{data:string, path:string}) {
        this.resourceMap[marker] = data;
    }
    public registerProvider(provider:IResourceProvider) {
        this.providers.push(provider);
    }

    public async prepare() {
        log('ResourceManager: start preparing all');
        await Promise.all(this.providers.map(provider => provider.prepareResource(this)));
        log('ResourceManager: preparation finished');
        this.inline = (new InlineResource(this.resourceMap)).inline;
    }
}

/******************************************************************************************************/

class CssBuilder implements IResourceProvider {

    /**
     * For userscripts, we inline css for alerts to the userscript source, and host the
     * options css in a dedicated page.
     */
    private static alertEntry = 'alerts.pcss';
    private static optionsEntry = 'options.pcss';
    private static allEntry = 'all.pcss';

    private static makePath(name:string) {
        return path.posix.join(PathUtils.postCssPath, name);
    }

    private static alertSrc = CssBuilder.makePath(CssBuilder.alertEntry);
    private static optionsSrc = CssBuilder.makePath(CssBuilder.optionsEntry);
    private static allSrc = CssBuilder.makePath(CssBuilder.allEntry);

    private static bundledCssName = 'styles.css';
    private static cssTempDir = 'css_temp';

    private static cssTempPath = path.posix.join(PathUtils.outputDir, CssBuilder.cssTempDir);
    private static cssTempPathWithName = path.posix.join(CssBuilder.cssTempPath, CssBuilder.bundledCssName);

    public static renamingOutPath = path.posix.join(PathUtils.tsccPath, 'renaming_map.js');

    private static compilePostCss(srcs:string):NodeJS.ReadableStream {
        return gulp.src(srcs)
            .pipe(postcss([
                imp(),
                nesting(),
                svg(),
                mixins(),
                cssnext({ browsers: ["IE 10", "> 1%"] }),
            ]))
            .pipe(rename(CssBuilder.bundledCssName));
    }

    private static async compileWithClosure(srcs:string):Promise<NodeJS.ReadableStream> {
        await fsExtra.mkdirp(CssBuilder.cssTempPath)
        await toPromise(
            CssBuilder.compilePostCss(srcs)
                /** @todo Make this really 'temp'  */
                .pipe(gulp.dest(CssBuilder.cssTempPath))
        );
        return new JarUtils(JarUtils.STYLESHEETS_PATH, [
            `--output-renaming-map-format`,     `CLOSURE_COMPILED`,
            `--rename`,                         `CLOSURE`,
            `--output-renaming-map`,             CssBuilder.renamingOutPath,
            `--allow-unrecognized-properties`,
            CssBuilder.cssTempPathWithName
        ], CssBuilder.bundledCssName);
    }

    public async prepareResource(resc:ResourceManager) {
        // Alert style is always inlined
        resc.registerInlinedResource("ALERT_STYLE", {
            data: await toPromise(
                this.options.shouldMinify ?
                    (await CssBuilder.compileWithClosure(CssBuilder.alertSrc)).resume() :
                    CssBuilder.compilePostCss(CssBuilder.alertSrc),
                true),
            path: 'alert.css'
        });

        if (this.options.isExtension) {
            await toPromise((this.options.shouldMinify ?
                await CssBuilder.compileWithClosure(CssBuilder.optionsSrc) :
                CssBuilder.compilePostCss(CssBuilder.optionsSrc))
                .pipe(insert.transform(content => {
                    return content
                        .replace('RESOURCE_OPENSANS_REGULAR', '/assets/fonts/regular/OpenSans-Regular.woff')
                        .replace('RESOURCE_OPENSANS_SEMIBOLD', '/assets/fonts/semibold/OpenSans-Semibold.woff')
                        .replace('RESOURCE_OPENSANS_BOLD', '/assets/fonts/bold/OpenSans-Bold.woff')
                }))
                .pipe(gulp.dest(this.paths.assetOutputPath))
            );
        }
    }

    constructor(
        private options:BuildOption,
        private paths:PathUtils
    ) { }

}

/******************************************************************************************************/

class SoyBuilder implements IResourceProvider {

    private static soyPath = 'src/ui/soy';

    // Systematically obtain names of various transpiled soy files.
    private static Sauce = class Sauce {
        constructor(private name:string) { }
        public get soy() { return this.name + '.soy' }
        public get soyPath() { return path.posix.join(SoyBuilder.soyPath, this.soy) }
        public get rollup() { return this.name + '.literal.soy.js' }
        public get rollupPath() { return path.posix.join(SoyBuilder.soyTempPath, this.rollup) }
        public get goog() { return this.name + '.goog.soy.js' }
        public get googPath() { return path.posix.join(PathUtils.tsccPath, this.goog) }
    }

    public static alert = new SoyBuilder.Sauce('alert');
    public static options = new SoyBuilder.Sauce('options');

    public static soyUtilsPath = 'third_party/soyutils.js'
    public static soyUtilsUseGoogPath = 'third_party/soyUtils_usegoog.js';

    private static soyTempDir = 'soy_temp';
    private static soyTempPath = path.posix.join(PathUtils.outputDir, SoyBuilder.soyTempDir, '');

    private static tempOutFormat = new SoyBuilder.Sauce(path.posix.join(SoyBuilder.soyTempPath, `{INPUT_FILE_NAME_NO_EXT}`));
    private static tempOutGlob = new SoyBuilder.Sauce(path.posix.join(SoyBuilder.soyTempPath, '*'));

    /**
     * Transforms `goog.getMsg` calls to runtime i18nService call.
     */
    private static reGetMsg = /goog\.getMsg\(\s*([A-Za-z_\-]+)(?:\{\$[A-Za-z_\-]*\})*\s*(,|\))/g;
    private static transformGetMsgRollup(match, c1, c2) {
        return `__soyUtils_adguard.i18nservice.getMsg\(${c1}${c2}`;
    }
    private static transformGetMsgCc(match, c1, c2) {
        return `__soyUtils_adguard.i18nservice.getMsg\(${c1}${c2}`;
    }
    private static importOurGetMsg = `var __soyUtils__adguard = goog.require('build.tscc.content_script_namespace');`;

    private static async compileRollup(srcs:string[]):Promise<void> {
        const args = [
            `--cssHandlingScheme`,  `LITERAL`,
            `--outputPathFormat`,    SoyBuilder.tempOutFormat.rollup,
            `--bidiGlobalDir`,      `1`,
            `--shouldGenerateJsdoc`,
        ];
        for (let src of srcs) {
            args.push(`--srcs`, src);
        }

        await toPromise(new JarUtils(JarUtils.TEMPLATES_PATH, args).resume());
        await toPromise(
            gulp.src(SoyBuilder.tempOutGlob.rollup)
                .pipe(insert.transform(content => {
                    return content.replace(SoyBuilder.reGetMsg, SoyBuilder.transformGetMsgRollup);
                }))
                .pipe(gulp.dest(SoyBuilder.soyTempPath)) // Replace in-place
        );
    }

    private static async compileCc(srcs:string[]):Promise<void> {
        const args = [
            `--cssHandlingScheme`,  `GOOG`,
            `--outputPathFormat`,    SoyBuilder.tempOutFormat.goog,
            `--bidiGlobalDir`,      `1`,
            `--shouldGenerateJsdoc`,
            `--shouldProvideRequireSoyNamespaces`,
            `--shouldGenerateGoogMsgDefs`
        ];
        for (let src of srcs) {
            args.push(`--srcs`, src);
        }

        await toPromise(new JarUtils(JarUtils.TEMPLATES_PATH, args).resume());
        await toPromise(
            gulp.src(SoyBuilder.tempOutGlob.goog)
                .pipe(insert.transform(content => {
                    return SoyBuilder.importOurGetMsg +
                        content.replace(SoyBuilder.reGetMsg, SoyBuilder.transformGetMsgCc);
                }))
                .pipe(gulp.dest(PathUtils.tsccPath)) // Move to closure compiler directory
        );
    }

    public async prepareResource(resc:ResourceManager) {
        let srcs = [SoyBuilder.alert.soyPath];
        let isExtension = this.options.isExtension;
        if (isExtension) {
            // For extension builds, compile templates for options page as well.
            srcs.push(SoyBuilder.options.soyPath)
        }

        if (this.options.shouldMinify) {
            await SoyBuilder.compileCc(srcs);
            resc.registerInlinedResource("TEMPLATE_ROLLUP", SoyBuilder.alert.rollupPath);
            if (isExtension) {
                resc.registerInlinedResource("SETTINGS_TEMPALTE_ROLLUP", SoyBuilder.options.rollupPath);
            }
        } else {
            await SoyBuilder.compileRollup(srcs);
        }

        log.info("Soy compilation has finished.");
    }

    constructor(
        private options:BuildOption
    ) { }

}

/******************************************************************************************************/

class LocaleUtils implements IResourceProvider {

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
    private async getUserscriptInlinableJSON() {
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

    private async moveLocalesToTargetDir() {
        const localePath = path.posix.join(this.paths.outputPath, '_locales');
        const [json] = await Promise.all([this.getExtensionJSON(), fsExtra.mkdirp(localePath)]);
        return Promise.all(Object.keys(json).map(async (locale) => {
            let localeNextPath = path.posix.join(localePath, locale);
            await fsExtra.mkdirp(localeNextPath);
            await fs.writeFile(path.posix.join(localeNextPath, 'messages.json'), JSON.stringify(json[locale]));
        }));
    }

    public async prepareResource(resc:ResourceManager) {
        if (this.options.isExtension) {
            await this.moveLocalesToTargetDir();
        } else {
            resc.registerInlinedResource("USERSCRIPT_TRANSLATIONS", {
                data: JSON.stringify(await this.getUserscriptInlinableJSON()),
                path: 'userscript_translations.json'
            });
        }
        log.info("I18n preparation has finished.");
    }

    constructor(
        private options:BuildOption,
        private paths:PathUtils
    ) { }

}

/******************************************************************************************************/

class Builder {

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

    private get bundleNames() {
        let bundleNames = ["common", "page_script", "content_script"];
        if (this.options.isExtension) {
            bundleNames.push("extension_common", "settings_dao", "background_script", "options");
        }
        return bundleNames;
    }
    private get bundleFilter() {
        let filter = {}, bundleNames = this.bundleNames;
        for (let bundleName of bundleNames) {
            filter[bundleName] = (file) => {
                return file.path.endsWith(bundleName + '.js');
            }
        }
        return filter;
    }

    private static rollupTsconfigOverride = { compilerOptions: { target: "es5" } };
    private static rollupOptsBase = {
        plugins: [(<any>typescript2)({ tsconfigOverride: Builder.rollupTsconfigOverride })],
        format: 'iife',
        strict: false
    };

    private get rollupOpts() {
        const input = [
            this.paths.pageScriptEntry.rollup,
            this.paths.contentScriptEntry.rollup
        ]
        if (this.options.isExtension) {
            input.push(
                this.paths.backgroundScriptEntry.rollup,
                this.paths.optionsEntry.rollup
            );
        }
        return Object.assign({ input }, Builder.rollupOptsBase);
    }

    private async rollup():Promise<Reservoir> {
        const options = this.options;

        // 1. Preprocess
        const sourceStream = gulp.src('src/**/*.ts')
            .pipe(<any>preprocess({ context: options.preprocessContext }));

        // 2. Rollup
        sourceStream    
            .pipe(rollup(this.rollupOpts))
            .pipe(insert.transform(this.rescMgr.inline))
            .pipe(hydra(this.bundleFilter));

        const contentScriptResv = new Reservoir(sourceStream["content_script"]);

        const bundleTasks = [
            toPromise(sourceStream["page_script"], true),
            toPromise(sourceStream["content_script"])
        ];
        if (options.isExtension) {
            Array.prototype.push.apply(bundleTasks,
                ["background_script", "options"].map(bundleName => toPromise(
                    sourceStream[bundleName]
                        .pipe(gulp.dest(this.paths.outputPath)) // Pipe to output directory directly
                ))
            );
        }

        const [pageScriptRaw] = await Promise.all(bundleTasks);

        // 3. Inline page_script to content_script
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

    /**
     * Built using closurebuilder.py
     * {@link https://developers.google.com/closure/library/docs/closurebuilder}
     * ToDo: make build process generate this deps dynamically
     */
    private static soyDeps = [
        "node_modules/google-closure-library/closure/goog/base.js",
        "node_modules/google-closure-library/closure/goog/string/stringbuffer.js",
        "node_modules/google-closure-library/closure/goog/dom/nodetype.js",
        "node_modules/google-closure-library/closure/goog/debug/error.js",
        "node_modules/google-closure-library/closure/goog/asserts/asserts.js",
        "node_modules/google-closure-library/closure/goog/functions/functions.js",
        "node_modules/google-closure-library/closure/goog/array/array.js",
        "node_modules/google-closure-library/closure/goog/math/math.js",
        "node_modules/google-closure-library/closure/goog/iter/iter.js",
        "node_modules/google-closure-library/closure/goog/structs/map.js",
        "node_modules/google-closure-library/closure/goog/string/string.js",
        "node_modules/google-closure-library/closure/goog/uri/utils.js",
        "node_modules/google-closure-library/closure/goog/object/object.js",
        "node_modules/google-closure-library/closure/goog/structs/structs.js",
        "node_modules/google-closure-library/closure/goog/uri/uri.js",
        "node_modules/google-closure-library/closure/goog/fs/url.js",
        "node_modules/google-closure-library/closure/goog/string/typedstring.js",
        "node_modules/google-closure-library/closure/goog/string/const.js",
        "node_modules/google-closure-library/closure/goog/i18n/bidi.js",
        "node_modules/google-closure-library/closure/goog/html/trustedresourceurl.js",
        "node_modules/google-closure-library/closure/goog/html/safeurl.js",
        "node_modules/google-closure-library/closure/goog/html/safestyle.js",
        "node_modules/google-closure-library/closure/goog/html/safescript.js",
        "node_modules/google-closure-library/closure/goog/html/safestylesheet.js",
        "node_modules/google-closure-library/closure/goog/dom/tags.js",
        "node_modules/google-closure-library/closure/goog/dom/htmlelement.js",
        "node_modules/google-closure-library/closure/goog/dom/tagname.js",
        "node_modules/google-closure-library/closure/goog/labs/useragent/util.js",
        "node_modules/google-closure-library/closure/goog/labs/useragent/browser.js",
        "node_modules/google-closure-library/closure/goog/html/safehtml.js",
        "node_modules/google-closure-library/closure/goog/html/uncheckedconversions.js",
        "node_modules/google-closure-library/closure/goog/soy/data.js",
        "node_modules/google-closure-library/closure/goog/html/legacyconversions.js",
        "node_modules/google-closure-library/closure/goog/labs/useragent/platform.js",
        "node_modules/google-closure-library/closure/goog/reflect/reflect.js",
        "node_modules/google-closure-library/closure/goog/labs/useragent/engine.js",
        "node_modules/google-closure-library/closure/goog/useragent/useragent.js",
        "node_modules/google-closure-library/closure/goog/math/size.js",
        "node_modules/google-closure-library/closure/goog/dom/asserts.js",
        "node_modules/google-closure-library/closure/goog/dom/safe.js",
        "node_modules/google-closure-library/closure/goog/dom/browserfeature.js",
        "node_modules/google-closure-library/closure/goog/math/coordinate.js",
        "node_modules/google-closure-library/closure/goog/dom/dom.js",
        "node_modules/google-closure-library/closure/goog/soy/soy.js",
        "node_modules/google-closure-library/closure/goog/i18n/uchar.js",
        "node_modules/google-closure-library/closure/goog/structs/inversionmap.js",
        "node_modules/google-closure-library/closure/goog/i18n/graphemebreak.js",
        "node_modules/google-closure-library/closure/goog/format/format.js",
        "node_modules/google-closure-library/closure/goog/i18n/bidiformatter.js"
    ]

    private static js(names:string[]) {
        let out = [];
        for (let name of names) {
            out.push('--js', name);
        }
        return out;
    }

    private ccOptionsFromManifest(manifest:tsickle.ModulesManifest):string[] {
        const sorter = new ManifestSort(manifest);

        const entries = [
            this.paths.commonEntry.cc,
            this.paths.pageScriptEntry.cc,
            this.paths.contentScriptEntry.cc,
        ];
        this.options.isExtension && entries.push(
            this.paths.backgroundScriptEntry.cc,
            this.paths.optionsEntry.cc
        );

        const deps = sorter.getDeps(entries);

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
            '--module_output_path_prefix', this.paths.outputPath + '/',
            '--output_module_dependencies', 'modDeps.json',

            
            '--module',                   `common:${deps.num_js[0]}`,
            ...Builder.js(deps[0]),

            '--module',                   `extension_common:0:common` ,
            '--module',                   `settings_dao:0:extension_common`,

            '--module',                   `page_script:${deps.num_js[1]}:common`,
            ...Builder.js(deps[1]),

            '--module',                   `content_script:${deps.num_js[2] + Builder.soyDeps.length + 4}:settings_dao`,
            // closure templates deps start
            ...Builder.js(Builder.soyDeps),
            '--js',                        SoyBuilder.soyUtilsUseGoogPath,
            '--js',                        CssBuilder.renamingOutPath,
            '--js',                        SoyBuilder.alert.googPath,
            '--js',                        SoyBuilder.options.googPath, 
            // closure templates deps end
            ...Builder.js(deps[2]),
        ];

        this.options.isExtension && flags.push(
            // '--entry_point',               this.paths.backgroundScriptEntry.googModule,
            '--module',                   `background_script:${deps.num_js[3]}:extension_common`,
            ...Builder.js(deps[3]),

            // '--entry_point',               this.paths.optionsEntry.googModule,
            '--module',                   `options:${deps.num_js[4]}:settings_dao`,
            ...Builder.js(deps[4])
        );

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

        // 1. Preprocess
        const preprocessTask = toPromise(
            gulp.src('src/**/*.ts')
                .pipe(<any>preprocess({ context: options.preprocessContext }))
                .pipe(gulp.dest(PathUtils.tsicklePath))
        );

        await preprocessTask;

        // 2. Tsickle
        log.info("Tsickle start");
        const result:tsickle.EmitResult|1 = tsickleMain(
            `--externs=${PathUtils.tsccPath}/generated-externs.js --typed -- -p tasks/tscc`
                .split(' ')
        );
        log.info("Tsickle end");

        if (result === 1) { throw new Error("Tsickle Error"); }
       
        // 3. Text transformations to js files emitted form tsickle
        // 3-1. Apply tsickle workarounds
        // 3-2. Inline resources
        // 3-3. etc..
        await toPromise(
            gulp.src(`${PathUtils.tsccPath}/**/*.js`)
                .pipe(insert.transform(Builder.tsickleWorkaround))
                .pipe(insert.transform((content, file) => {
                    if (file.path.endsWith('externs.js')) {
                        // Do not inline resources to externs file.
                        return content;
                    }
                    return this.rescMgr.inline(content);
                }))
                .pipe(gulp.dest(PathUtils.tsccPath))
        );

        // 4. Closure Compiler
        const compiledStream = ccPlugin(this.ccOptionsFromManifest(result.modulesManifest))
            .src()
            .pipe(insert.transform(TextUtils.removeCcExport))
            .pipe(debug({ title: "gulp closure compiler"}))
            .pipe(hydra(this.bundleFilter));

        compiledStream["common"].pipe(gulp.dest('build/temp')); // Temp

        

        for (let bundleName of this.bundleNames.slice(1)) { // Minus "common.js"
            compiledStream[bundleName] = merge(compiledStream["common"], compiledStream[bundleName]);
        }

        const bundleTasks = [
            toPromise(compiledStream["page_script"].pipe(gulp.dest('build/temp')), true),
            ...this.bundleNames.slice(2) // Minus common.js and page.js
                .map(name => toPromise(compiledStream[name].pipe(gulp.dest('build/temp'))))
        ];

        const contentScriptResv = new Reservoir(compiledStream["content_script"]);

        log.info("Closure compiler start");

        const [pageScriptRaw] = await Promise.all(bundleTasks);

        log.info("Closure compiler end");

        // 5. Inline page_script to content_script
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

    private async clean() {
        await fsExtra.remove(PathUtils.outputDir);
        await Promise.all([this.paths.outputPath, PathUtils.tsccPath]
            .map(dir => fsExtra.mkdirp(dir)));
    }
    private async cleanBuildArtifacts() {
        await Promise.all([PathUtils.tsicklePath, PathUtils.tsccPath]
            .map(dir => fsExtra.remove(dir)));
    }

    private static MAX_BUILD_TIMEOUT = 1000 * 60 * 10; // 10 minutes
    private static onBuildTimeout() {
        log.error("Build Timeout");
        process.exit(1);
    }
    private buildTimer:NodeJS.Timer;

    async build() {
        this.buildTimer = setTimeout(Builder.onBuildTimeout, Builder.MAX_BUILD_TIMEOUT);

        try {
            await this.clean();
            await this.rescMgr.prepare();

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
                tasks.push(fsExtra.copy(PathUtils.assetsPath, this.paths.assetOutputPath));
            }

            await Promise.all(tasks);
            // await this.cleanBuildArtifacts();
        } catch (e) {
            log.error("Build Error");
            log.error(e);
        } finally {
            clearTimeout(this.buildTimer);
        }
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

// I18n Tasks

import onesky = require('onesky-utils');
import { spawn } from 'child_process';

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

gulp.task('extract-msg', async () => {
    await toPromise(new JarUtils(JarUtils.MSG_EXTRACTOR_PATH, [
        `--outputPathFormat`, 'build/{INPUT_FILE_NAME_NO_EXT}.msg.xlf',
        `--srcs`, SoyBuilder.alert.soyPath,
        `--srcs`, SoyBuilder.options.soyPath
    ]));
});

process.on('unhandledRejection', r => log.error(r));