import { posix as path } from 'path';
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
import uglify = require('gulp-uglify');
import debug = require('gulp-debug');
import hydra = require('gulp-hydra');
import run = require('gulp-run');
import file = require('gulp-file');

import postcss = require('gulp-postcss');
import imp = require('postcss-partial-import');
import svg = require('postcss-inline-svg');
import svgo = require('postcss-svgo');
import mixins = require('postcss-mixins');
import cssnext = require('postcss-cssnext');
import nesting = require('postcss-nested');

import xml2js = require('xml2js');

import InlineResource = require('inline-resource-literal');

import typescript = require('@alexlur/rollup-plugin-typescript');
import typescript2 = require('rollup-plugin-typescript2');

import { main as tsickleMain } from './tasks/tscc/third-party/tsickle/main';

import * as closureTools from 'closure-tools-helper';

process.setMaxListeners(0);
const ccPlugin = closureTools.compiler.gulp({});

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

    public static tsccPath = path.join(PathUtils.outputDir, PathUtils.tsccDir);

    public get outputPath() {
        return path.join(PathUtils.outputDir, this.options.target, '');
    }

    private static BundleEntry = class BundleEntry {
        constructor(
            private targetToPathMap: { [key in BuildTarget]?: string },
            private options:BuildOption
        ) { }
        public get rollup() {
            return path.join(
                PathUtils.sourceDir,
                this.targetToPathMap[this.options.target]
            );
        }
        private static reModuleExtension = /\.[jt]sx?$/;
        private static normalizeModuleExtension(path:string) {
            return path.replace(BundleEntry.reModuleExtension, '.js');
        }
        public get cc() {
            return BundleEntry.normalizeModuleExtension(path.join(
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
            return BundleEntry.pathToGoogModule(this.cc);
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
        return path.join(
            PathUtils.tsccPath,
            'generated-externs.js'
        );
    }

    public static i18nRoot               = 'src/locales';
    public static i18nMiscSourceJSONPath = path.join(PathUtils.i18nRoot, 'misc.json');
    public static i18nSourceJSONPath     = path.join(PathUtils.i18nRoot, 'source.json');
    public static i18nJSONPath           = path.join(PathUtils.i18nRoot, 'translations.json');
    public static i18nUserscriptKeysPath = path.join(PathUtils.i18nRoot, 'userscript_keys.json');
    public static i18nExtensionKeysPath  = path.join(PathUtils.i18nRoot, 'extension_keys.json');
    public static i18nSettingsKeysPath   = path.join(PathUtils.i18nRoot, 'userscript_settings_keys.json');

    public static assetsPath            = 'src/assets'

    public static postCssPath           = 'src/ui/pcss/';

    public get assetOutputPath() {
        return path.join(this.outputPath, 'assets', '');
    }

    public static commonExtensionManifestPath = 'src/platform/extension/shared/manifest.json';

    private static targetManifestPathMap = {
        [BuildTarget.USERSCRIPT]:   'src/platform/userscript/meta.js',
        [BuildTarget.EDGE]:         'src/platform/extension/edge/manifest_override.json'
    }
    public get manifestPath() {
        return PathUtils.targetManifestPathMap[this.options.target];
    }

    public static optionsPagePath = 'src/platform/extension/shared/options.html';

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
        log.info('ResourceManager: preparation start ');
        await Promise.all(this.providers.map(provider => provider.prepareResource(this)));
        log.info('ResourceManager: preparation end');
        this.inline = (new InlineResource(this.resourceMap)).inline;
    }
}

/******************************************************************************************************/

interface ICssSource {
    fileName:string,
    srcPath:string,
    resourceMarker?:string
}

class CssBuilder implements IResourceProvider {

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
    private static options = new CssBuilder.Source('options');
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
            .pipe(rename(CssBuilder.bundledCssName));
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
            return await CssBuilder.compileWithClosure(src.srcPath);
        } else {
            return CssBuilder.compilePostCss(src.srcPath);
        }
    }

    public async prepareResource(resc:ResourceManager) {
        const inlineSource = async (src:ICssSource) => {
            resc.registerInlinedResource(src.resourceMarker, {
                data: await toPromise((await this.compileSource(src)).resume(), true),
                path: this.getSourceOutPath(src)
            });
        };
        const moveSource = async (src:ICssSource) => {
            await toPromise(
                (await this.compileSource(src)).resume()
                    .pipe(rename(this.getSourceOutPath(src)))
                    .pipe(gulp.dest('.'))
            );
        };

        // Alert style is moved to /assets/alert.css.
        await inlineSource(CssBuilder.alerts);

        // For extensions, options page style is compiled and moved to /assets/options.css.
        if (this.options.isExtension) {
            await moveSource(CssBuilder.options);
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

    // A Helper class to systematically obtain names of various transpiled soy files
    private static Sauce = class Sauce {
        constructor(private name:string) { }
        public get soy() { return this.name + '.soy' }
        public get soyPath() { return path.join(SoyBuilder.soyPath, this.soy) }
        public get rollup() { return this.name + '.literal.soy.js' }
        public get rollupPath() { return path.join(SoyBuilder.soyTempPath, this.rollup) }
        public get goog() { return this.name + '.goog.soy.js' }
        public get googPath() { return path.join(PathUtils.tsccPath, this.goog) }
        public get xliff() { return this.name + '.xliff' }
        public get xliffPath() { return path.join(PathUtils.outputDir, this.xliff) }
    }

    public static alert = new SoyBuilder.Sauce('alert');
    public static options = new SoyBuilder.Sauce('options');

    public static soyUtilsPath = 'node_modules/closure-tools-helper/third-party/closure-templates/soyutils.js';
    public static soyUtilsUseGoogPath = 'node_modules/closure-tools-helper/third-party/closure-templates/soyutils_usegoog.js';

    private static soyTempDir = 'soy_temp';
    public static soyTempPath = path.join(PathUtils.outputDir, SoyBuilder.soyTempDir, '');

    private static tempOutFormat = new SoyBuilder.Sauce(path.join(SoyBuilder.soyTempPath, `{INPUT_FILE_NAME_NO_EXT}`));
    private static tempOutGlob = new SoyBuilder.Sauce(path.join(SoyBuilder.soyTempPath, '*'));

    private static async compileRollup(srcs:string[]):Promise<void> {
        const args = [
            `--cssHandlingScheme`,  `LITERAL`,
            `--outputPathFormat`,    SoyBuilder.tempOutFormat.rollup,
            `--bidiGlobalDir`,      `1`,
            `--shouldGenerateJsdoc`,
            `--shouldGenerateGoogMsgDefs`
        ];
        for (let src of srcs) {
            args.push(`--srcs`, src);
        }

        await toPromise(closureTools.templates(args).resume());
        await toPromise(
            gulp.src(SoyBuilder.tempOutGlob.rollup)
                .pipe(insert.transform(
                    new closureTools.TemplatesRuntimeI18nTransformer('adguard.i18nService.getMsg').transform
                ))
                .pipe(gulp.dest(SoyBuilder.soyTempPath)) // Replace in-place
        );
    }

    private static async compileCc(srcs:string[]):Promise<void> {
        const args = [
            `--cssHandlingScheme`,  `GOOG`,
            `--codeStyle`,          `CONCAT`,
            `--outputPathFormat`,    SoyBuilder.tempOutFormat.goog,
            `--bidiGlobalDir`,      `1`,
            `--shouldGenerateJsdoc`,
            `--shouldProvideRequireSoyNamespaces`,
            `--shouldGenerateGoogMsgDefs`
        ];
        for (let src of srcs) {
            args.push(`--srcs`, src);
        }

        await toPromise(closureTools.templates(args).resume());
        await toPromise(
            gulp.src(SoyBuilder.tempOutGlob.goog)
                .pipe(insert.transform(
                    new closureTools.TemplatesRuntimeI18nTransformer(
                        `__soyutils_adguard.default.i18nService.getMsg`,
                        `var __soyutils_adguard = goog.require('build.tscc.content_script_namespace')`
                    ).transform
                ))
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
        } else {
            await SoyBuilder.compileRollup(srcs);
            resc.registerInlinedResource("TEMPLATE_ROLLUP", SoyBuilder.alert.rollupPath);
            if (isExtension) {
                resc.registerInlinedResource("OPTIONS_TEMPLATE_ROLLUP", SoyBuilder.options.rollupPath);
            }
            resc.registerInlinedResource("SOYUTILS", SoyBuilder.soyUtilsPath);
        }
    }

    constructor(
        private options:BuildOption
    ) { }

}

/******************************************************************************************************/

async function readJSON(path:string):Promise<any> {
    return JSON.parse(await fs.readFile(path));
}

async function writeJSON(path:string, content:any) {
    return await fs.writeFile(path, JSON.stringify(content));
}

class LocaleUtils implements IResourceProvider {

    private static JSONFile = class JSONFile<T> {
        constructor(private filePath:string) { }
        private cached:T
        public async read() {
            if (!this.cached) {
                this.cached = await readJSON(this.filePath);
            }
            return this.cached;
        }
    }

    public static translation = new LocaleUtils.JSONFile<{[key:string]:{message:string,description?:string}}>(PathUtils.i18nJSONPath);

    private static userscriptKeys = new LocaleUtils.JSONFile<string[]>(PathUtils.i18nUserscriptKeysPath);
    private static extensionKeys = new LocaleUtils.JSONFile<string[]>(PathUtils.i18nExtensionKeysPath);
    private static settingsKeys = new LocaleUtils.JSONFile<string[]>(PathUtils.i18nSettingsKeysPath);

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
        const [json, userscriptKeys] = await Promise.all([LocaleUtils.translation.read(), LocaleUtils.userscriptKeys.read()]);
        for (let locale in json) {
            out[locale] = {};
            for (let key of userscriptKeys) {
                out[locale][key] = json[locale][key].message;
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
        const [json, extensionKeys] = await Promise.all([LocaleUtils.translation.read(), LocaleUtils.extensionKeys.read()]);

        for (let locale in json) {
            out[locale] = {};
            for (let key of extensionKeys) {
                let message = json[locale][key].message;
                // A workaround for chrome webstore bug.
                // It has problems in recognizing i18n'd string in extension name.
                if (key === LocaleUtils.EXTENSION_NAME) {
                    message += this.channelSuffix;
                }
                // Replace dollar signs
                message = message.replace(/\$/g, '$$$');
                out[locale][key] = {
                    message: message
                };
            }
        }
        return <{[locale:string]:{[messageId:string]:{message:string}}}>out;
    }

    private async getSettingsJSON() {
        const out = {};
        const [json, settingsKeys] = await Promise.all([LocaleUtils.translation.read(), LocaleUtils.settingsKeys.read()]);
        for (let locale in json) {
            out[locale] = {};
            for (let key of settingsKeys) {
                out[locale][key] = json[locale][key].message;
            }
        }
        return <{[locale:string]:{[messageId:string]:string}}>out;
    }

    private async moveLocalesToTargetDir() {
        const localePath = path.join(this.paths.outputPath, '_locales');
        const [json] = await Promise.all([this.getExtensionJSON(), fsExtra.mkdirp(localePath)]);
        return Promise.all(Object.keys(json).map(async (locale) => {
            let localeNextPath = path.join(localePath, locale);
            await fsExtra.mkdirp(localeNextPath);
            await fs.writeFile(path.join(localeNextPath, 'messages.json'), JSON.stringify(json[locale]));
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
    }

    constructor(
        private options:BuildOption,
        private paths:PathUtils
    ) { }

}

/******************************************************************************************************/

class Builder {

    private static version = '2.2.3';

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
            bundleNames.push("extension_common", "settings", "background_script", "options");
        }
        return bundleNames;
    }
    private get bundleFilter() {
        let filter = {}, bundleNames = this.bundleNames;
        for (let bundleName of bundleNames) {
            filter[bundleName] = (file) => {
                return (new RegExp(bundleName + '\\.[jt]s$')).test(file.path);
            }
        }
        return filter;
    }

    private wrapPageScript(pageScriptRaw:string):string {
        return `function popupBlocker(window,PARENT_FRAME_KEY,CONTENT_SCRIPT_KEY){${pageScriptRaw}}`;
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
        ];
        this.options.isExtension && input.push(
            this.paths.backgroundScriptEntry.rollup,
            this.paths.optionsEntry.rollup
        );
        return Object.assign({ input }, Builder.rollupOptsBase);
    }

    private async rollup():Promise<StringMap<Reservoir>> {
        const options = this.options;

        const sourceStream = gulp.src('src/**/*.ts')
            .pipe(<any>preprocess({ context: options.preprocessContext }));

        const bundles = sourceStream
            .pipe(rollup(this.rollupOpts))
            .pipe(insert.transform(this.rescMgr.inline))
            .pipe(hydra(this.bundleFilter));

        let bundleNames = this.bundleNames;
        let out:StringMap<Reservoir> = {};
        for (let bundleName of bundleNames) {
            out[bundleName] = new Reservoir(
                bundles[bundleName]
                    .pipe(rename(path.join(this.paths.outputPath, bundleName + '.js')))
            );
        }

        out["common"] = new Reservoir(
            gulp.src('src/bundler_resources/rollup_shims/common.js')
                .pipe(insert.transform(this.rescMgr.inline))
                .pipe(rename(path.join(this.paths.outputPath, 'common.js')))
        );

        out["settings"] = new Reservoir(
            file('settings.js', '', { src: true })
                .pipe(rename(path.join(this.paths.outputPath, 'settings.js')))
        );

        return out;
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

    private ccOptionsFromManifest():string[] {
        let sourceGlob = [
            path.join(PathUtils.tsccPath, '**/*.js'),
            '!' + this.paths.tsickleExternsPath,
            '!' + SoyBuilder.soyUtilsUseGoogPath,
            '!' + CssBuilder.renamingMapPath
        ];

        const soySources = [SoyBuilder.alert.googPath];
        if (this.options.isExtension) {
            soySources.push(SoyBuilder.options.googPath);
        }

        sourceGlob.push(...soySources);

        const entryPoints = [
            this.paths.commonEntry.googModule,
            this.paths.pageScriptEntry.googModule,
            this.paths.contentScriptEntry.googModule
        ];

        if (this.options.isExtension) {
            entryPoints.push(
                this.paths.backgroundScriptEntry.googModule,
                this.paths.optionsEntry.googModule
            );
        }

        const deps = new closureTools.DepsSorter(sourceGlob).getDeps(entryPoints);

        const flags = [
            '--charset',                  'UTF-8',
            '--compilation_level',        'ADVANCED',
            '--language_in',              'ECMASCRIPT6',
            '--language_out',             'ECMASCRIPT5',
            '--assume_function_wrapper',   String(true),
            '--warning_level',            'VERBOSE',
            '--strict_mode_input',         String(false),
            '--externs',                  'src/bundler_resources/externs/externs.js',
            '--externs',                   this.paths.tsickleExternsPath,
            '--rewrite_polyfills',         String(false),
            '--module_output_path_prefix', this.paths.outputPath + '/',

            '--module',                   `common:${deps[0].length}`,
            ...Builder.js(deps[0]),

            '--module',                   `settings:0:common`,

            '--module',                   `page_script:${deps[1].length}:common`,
            ...Builder.js(deps[1]),

            '--module',                   `content_script:${deps[2].length + Builder.soyDeps.length + 2}:settings`,
            // closure templates deps start
            ...Builder.js(Builder.soyDeps),
            '--js',                        SoyBuilder.soyUtilsUseGoogPath,
            '--js',                        CssBuilder.renamingMapPath,
            // closure templates deps end
            ...Builder.js(deps[2]),
        ];

        this.options.isExtension && flags.push(
            '--module',                   `background_script:${deps[3].length}:common`,
            ...Builder.js(deps[3]),

            '--module',                   `options:${deps[4].length}:settings`,
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

    private async tscc():Promise<StringMap<Reservoir>> {
        const options = this.options;

        const preprocessTask = toPromise(
            gulp.src('src/**/*.ts')
                .pipe(<any>preprocess({ context: options.preprocessContext }))
                .pipe(gulp.dest(PathUtils.tsicklePath))
        );
        await preprocessTask;

        log.info("Tsickle start");
        const result:0|1 = tsickleMain(
            `--externs=${PathUtils.tsccPath}/generated-externs.js --typed -- -p tasks/tscc`
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

        const bundles = ccPlugin(this.ccOptionsFromManifest())
            .src()
            .pipe(insert.transform(TextUtils.removeCcExport))
            .pipe(hydra(this.bundleFilter));

        let bundleNames = this.bundleNames;
        let out:StringMap<Reservoir> = {};
        for (let bundleName of bundleNames) {
            out[bundleName] = new Reservoir(bundles[bundleName]);
        }
        return out;
    }

    private async meta() {
        const translation = await LocaleUtils.translation.read();
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
        insertKey('grant',       'GM_getResourceURL');
        insertKey('grant',       'unsafeWindow');
        insertKey('icon',        './assets/128.png');
        insertKey('resource',    'WOFF_OPENSANS_BOLD ./asset/fonts/bold/OpenSans-Bold.woff');
        insertKey('resource',    'WOFF2_OPENSANS_BOLD ./assets/fonts/bold/OpenSans-Bold.woff2');
        insertKey('resource',    'WOFF_OPENSANS_REGULAR ./assets/fonts/regular/OpenSans-Regular.woff');
        insertKey('resource',    'WOFF2_OPENSANS_REGULAR ./assets/fonts/regular/OpenSans-Regular.woff2');
        insertKey('resource',    'WOFF_OPENSANS_SEMIBOLD ./assets/fonts/semibold/OpenSans-SemiBold.woff');
        insertKey('resource',    'WOFF2_OPENSANS_SEMIBOLD ./assets/fonts/semibold/OpenSans-SemiBold.woff2');


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
        const dirs = [
            PathUtils.tsicklePath,
            PathUtils.tsccPath,
            CssBuilder.cssTempPath,
            SoyBuilder.soyTempPath
        ];
        await Promise.all(dirs.map(dir => fsExtra.remove(dir)));
    }

    private static MAX_BUILD_TIMEOUT = 1000 * 60 * 10; // 10 minutes
    private static onBuildTimeout() {
        log.error("Build Timeout");
        process.exit(1);
    }
    private buildTimer:NodeJS.Timer;

    async buildUserscript(bundles:StringMap<Reservoir>, manifest:string) {
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
        await toPromise(
            bundles["content_script"].release()
                .pipe(insert.prepend(commonScriptRaw))
                .pipe(insert.transform(inliner))
                .pipe(insert.prepend(manifest))
                .pipe(rename('popupblocker.user.js'))
                .pipe(gulp.dest(this.paths.outputPath))
        );
    }

    async buildExtension(bundles:StringMap<Reservoir>, manifest:string) {
        // bundles other than content_script and page_script are moved to build directory directly.
        let bundleNames = this.bundleNames;
        let otherBundleTasks = [];
        for (let bundleName of bundleNames) {
            if (bundleName === 'content_script' || bundleName === 'page_script') { continue; }
            otherBundleTasks.push(toPromise(
                    bundles[bundleName].release().pipe(gulp.dest('.'))
            ));
        }
        await otherBundleTasks;

        // Inline page_script to content_script.
        const pageScriptRaw = await toPromise(bundles["page_script"].release(), true);
        const inliner = new InlineResource({
            "PAGE_SCRIPT": {
                path: 'just a stub.js',
                data: this.wrapPageScript(pageScriptRaw)
            }
        }).inline;
        await toPromise(
            bundles["content_script"].release()
                .pipe(insert.transform(inliner))
                .pipe(gulp.dest('.'))
        );
    }

    async build() {
        this.buildTimer = setTimeout(Builder.onBuildTimeout, Builder.MAX_BUILD_TIMEOUT);

        try {
            await this.clean();
            await this.rescMgr.prepare();

            const channel = this.options.channel;
            const target  = this.options.target;

            const bundles = this.options.shouldMinify ? await this.tscc() : await this.rollup();
            const manifest = this.options.isExtension ? await this.manifest() : await this.meta();

            const mainTasks = [];

            if (this.options.isExtension) {
                mainTasks.push(this.buildExtension(bundles, manifest));
                mainTasks.push(fs.writeFile(path.join(this.paths.outputPath, 'manifest.json'), manifest));
                mainTasks.push(fsExtra.copy(PathUtils.optionsPagePath, this.paths.outputPath + '/options.html'));
            } else {
                mainTasks.push(this.buildUserscript(bundles, manifest));
                mainTasks.push(fs.writeFile(path.join(this.paths.outputPath, 'popupblocker.meta.js'), manifest));
            }
            mainTasks.push(fsExtra.copy(PathUtils.assetsPath, this.paths.assetOutputPath));

            log.info("Main task start");
            await Promise.all(mainTasks);
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

type StringMap<T> = {
    [key:string]:T
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

// UglifyJS option for dead code removal and stripping out comments.
const uglifyOptions = {
    warnings: 'verbose',
    mangle: false,
    compress: {
        sequences: false,
        properties: false,
        drop_debugger: true,
        dead_code: true,
        conditionals: false,
        comparisons: false,
        evaluate: false,
        booleans: false,
        typeofs: false,
        loops: false,
        unused: true,
        toplevel: false,
        hoist_funs: false,
        if_return: false,
        inline: false,
        join_vars: false,
        collapse_vars: false,
        reduce_vars: false,
        keep_fargs: true,
        // UglifyJs by default does not remove functions with empty function body.
        // We declare here that certain functions used for logging are side-effect free,
        // so that UglifyJs can remove them.
        pure_funcs: ['print', 'call', 'callEnd', 'closeAllGroup']
    },
    output: {
        beautify: true,
        comments: false,
        indent_level: 2
    }
};

gulp.task('greasyfork-postprocess', () => {
    return gulp.src('build/userscript/popupblocker.user.js')
        .pipe(uglify(uglifyOptions))
        .pipe(insert.prepend(require('fs').readFileSync('build/userscript/popupblocker.meta.js').toString()))
        .pipe(gulp.dest('build/userscript'));
});

/******************************************************************************/


function testBuilderFactory(tsconfigOverride?) {
    const plugin = tsconfigOverride ? (<any>typescript2)({ tsconfigOverride }) : (<any>typescript)();

    return () => {
        return gulp.src(['test/**/*.ts', 'src/**/*.ts'])
            .pipe(<any>preprocess({
                context: {
                    RECORD: true
                }
            }))
            .pipe(rollup({
                entry: 'test/index.ts',
                plugins: [ plugin ],
                format: 'iife',
                strict: false
            }))
            .pipe(rename('index.js'))
            .pipe(gulp.dest('./test/build'));
    }
}

gulp.task('build-test', testBuilderFactory());
gulp.task('build-test-es5', testBuilderFactory({ compilerOptions: { target: "es5" } }))

gulp.task('travis', ['dev-userscript', 'build-test-es5'], () => {
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
        const file = (await fs.readFile(PathUtils.i18nSourceJSONPath)).toString();

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
            fileName: 'en.json' // Do not change this
        }, base);
        let response = await onesky.getFile(option);
        if (response) {
            map[languageCode]= JSON.parse(response);
        }
    }));

    await writeJSON(PathUtils.i18nJSONPath, map);
});

/**
 * Converts xliff files generated by Closure Templates to json recognized by extension and userscripts.
 *
 * Note that we use a custom format that includes original phrase in descriptions.
 */
async function xliffToJson(xliffContent:string) {
    const xmlParser = new xml2js.Parser();

    const json:any = await (new Promise((resolve, reject) => {
        xmlParser.parseString(xliffContent, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        })
    }));

    const error:()=>never = () => {
        throw new Error('Invalid data, check soy sources');
    }

    const map = Object.create(null);
    const transUnit = json.xliff.file[0].body[0]['trans-unit'];

    for (let unit of transUnit) {
        let source = unit.source[0];
        if (typeof source === 'undefined') { error(); }
        if (typeof source === 'object') {
            // source is string for usual messages,
            // but is an object having keys '_' and 'x' in case when it contains
            // placeholders
            source = source._;
        }
        if (typeof source !== 'string') { error(); }
        if (!unit.note) { error(); }
        let message = unit.note[0]._;
        if (typeof message !== 'string') { error(); }

        map[source] = { message };
    }

    return map;
}

gulp.task('i18n-extract', async () => {
    const sauces = [
        SoyBuilder.alert,
        SoyBuilder.options
    ];

    await Promise.all(sauces.map(sauce => {
        return toPromise(closureTools.extractTemplateMsg([
            `--outputFile`, sauce.xliffPath,
            sauce.soyPath
        ]).resume());
    }));
    log.info("Message extraction has been finished.");

    const maps = await Promise.all(sauces.map(async (sauce) => {
        return await fs.readFile(sauce.xliffPath)
            .then(file => file.toString())
            .then(async (content) => xliffToJson(content))
    }));

    // Merge maps and report error when encountered multiple phrases with the same name.
    const merged = Object.create(null);

    for (let map of maps) {
        for (let key in map) {
            if (merged[key]) { // If phrase already exists
                if (merged[key].message !== map[key].message) // and have different translations
                throw new Error(`Phrase name collision for ${key}`);
            } else {
                merged[key] = map[key];
            }
        }
    }

    const writeTasks = [];

    // Write translation
    const misc = await readJSON(PathUtils.i18nMiscSourceJSONPath);
    const translation = Object.assign({}, merged, misc);

    writeTasks.push(writeJSON(PathUtils.i18nSourceJSONPath, translation));

    // Write userscript_keys.json
    // Userscript-keys contain certain keys from misc and
    // keys from alert.soy file.

    const userscriptKeys = [];
    const extensionKeys = [];
    const settingsKeys = [];
    for (let key in misc) {
        if (misc[key].description === 'userscript_only') {
            userscriptKeys.push(key);
        } else if (misc[key].description === 'extension_only') {
            extensionKeys.push(key);
        } else {
            userscriptKeys.push(key);
            extensionKeys.push(key);
        }
    }
    for (let key in maps[0]) { // keys from alert.soy
        userscriptKeys.push(key);
        extensionKeys.push(key);
    }
    for (let key in maps[1]) {
        extensionKeys.push(key);
        settingsKeys.push(key);
    }

    writeTasks.push(writeJSON(PathUtils.i18nUserscriptKeysPath, userscriptKeys));
    writeTasks.push(writeJSON(PathUtils.i18nExtensionKeysPath, extensionKeys));
    writeTasks.push(writeJSON(PathUtils.i18nSettingsKeysPath, settingsKeys));

    await Promise.all(writeTasks);
});

process.on('unhandledRejection', r => log.error(r));
