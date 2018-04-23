import { posix as path } from 'path';
import { BuildOption, BuildTarget } from './BuildOption';
import BundleEntry from './bundle/BundleEntry';

export default class PathUtils {

    public static sourceDir     = 'src';
    public static outputDir     = 'build';

    public static tsickleDir    = 'build_tsickle';
    public static tsccDir       = 'tscc';

    public static tsicklePath = PathUtils.tsickleDir;

    public static tsccPath = path.join(PathUtils.outputDir, PathUtils.tsccDir);

    public get outputPath() {
        return path.join(PathUtils.outputDir, this.options.target, '');
    }

    private static targetPageScriptEntryMap = {
        [BuildTarget.USERSCRIPT]:   'platform/userscript/page_script.ts',
        [BuildTarget.CHROME]:       'platform/extension/shared/page_script.ts',
        [BuildTarget.FIREFOX]:      'platform/extension/shared/page_script.ts',
        [BuildTarget.EDGE]:         'platform/extension/shared/page_script.ts'
    }

    public pageScriptEntry = new BundleEntry("page_script", PathUtils.targetPageScriptEntryMap, this.options);

    private static targetContentScriptEntryMap = {
        [BuildTarget.USERSCRIPT]:   'platform/userscript/content_script.ts',
        [BuildTarget.CHROME]:       'platform/extension/shared/content_script.ts',
        [BuildTarget.FIREFOX]:      'platform/extension/shared/content_script.ts',
        [BuildTarget.EDGE]:         'platform/extension/edge/content_script.ts'
    }

    public contentScriptEntry = new BundleEntry("content_script", PathUtils.targetContentScriptEntryMap, this.options);

    private static targetBackgroundScriptEntryMap = {
        [BuildTarget.CHROME]:       'platform/extension/shared/background_script.ts',
        [BuildTarget.FIREFOX]:      'platform/extension/shared/background_script.ts',
        [BuildTarget.EDGE]:         'platform/extension/shared/background_script.ts',
    }

    public backgroundScriptEntry = new BundleEntry("background_script", PathUtils.targetBackgroundScriptEntryMap, this.options);

    private static targetCommonScriptMap = {
        [BuildTarget.USERSCRIPT]:   'platform/userscript/common.ts',
        [BuildTarget.CHROME]:       'platform/extension/shared/common.ts',
        [BuildTarget.FIREFOX]:      'platform/extension/shared/common.ts',
        [BuildTarget.EDGE]:         'platform/extension/shared/common.ts'
    }

    public commonEntry = new BundleEntry("common", PathUtils.targetCommonScriptMap, this.options);

    private static targetOptionsMap = {
        [BuildTarget.USERSCRIPT_SETTINGS]: 'platform/userscript/options.ts',
        [BuildTarget.CHROME]:       'platform/extension/shared/options.ts',
        [BuildTarget.FIREFOX]:      'platform/extension/shared/options.ts',
        [BuildTarget.EDGE]:         'platform/extension/shared/options.ts'
    }

    public optionsEntry = new BundleEntry("options", PathUtils.targetOptionsMap, this.options);

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
        [BuildTarget.CHROME]:       'src/platform/extension/chrome/manifest_override.json',
        [BuildTarget.EDGE]:         'src/platform/extension/edge/manifest_override.json'
    }
    public get manifestPath() {
        return PathUtils.targetManifestPathMap[this.options.target];
    }

    private static extensionOptionsPagePath = 'src/platform/extension/shared/options.html';
    private static userscriptOptionsPagePath = 'src/platform/userscript/options.html';

    public get optionsPagePath() {
        if (this.options.isExtension) {
            return PathUtils.extensionOptionsPagePath;
        } else if (this.options.isSettingsOnly) {
            return PathUtils.userscriptOptionsPagePath;
        }
    }

    constructor(
        private options:BuildOption
    ) { }

}
