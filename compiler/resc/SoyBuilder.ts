import { posix as path } from 'path';
import * as closureTools from 'closure-tools-helper';

import { IResourceProvider, ResourceManager } from './ResourceManager';
import { toPromise } from '../utils/to_promise';
import { BuildOption } from '../BuildOption';
import PathUtils from '../PathUtils';

export default class SoyBuilder implements IResourceProvider {

    private static soyPath = 'src/ui/soy';

    // A Helper class to systematically obtain names of various transpiled soy files
    private static Sauce = class Sauce {
        constructor(public name:string) { }
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
    public static userscript_options = new SoyBuilder.Sauce('userscript_options');
    public static toast = new SoyBuilder.Sauce('toast');

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

        await toPromise(closureTools.templates(args, {
            googGetMsg: `adguard.i18nService.getMsg`,
            header: '',
            inputGlob: SoyBuilder.tempOutGlob.rollup,
            outputPath: SoyBuilder.soyTempPath
        }).src());
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

        const stream = closureTools.templates(args, {
            googGetMsg: `__soyutils_adguard.default.i18nService.getMsg`,
            header:     `var __soyutils_adguard = goog.require('build.tscc.content_script_namespace')`,
            inputGlob:   SoyBuilder.tempOutGlob.goog,
            outputPath:  PathUtils.tsccPath
        }).src();

        await toPromise(stream);
    }

    public async prepareResource(resc:ResourceManager) {
        const options = this.options;
        const sauces = [SoyBuilder.toast];

        if (!options.isSettingsOnly) {
            sauces.push(SoyBuilder.alert);
        }

        if (options.isExtension || options.isSettingsOnly) {
            sauces.push(SoyBuilder.options);
        }

        if (options.isSettingsOnly) {
            sauces.push(SoyBuilder.userscript_options);
        }
        
        if (options.shouldMinify) {
            await SoyBuilder.compileCc(sauces.map(sauce => sauce.soyPath));
        } else {
            await SoyBuilder.compileRollup(sauces.map(sauce => sauce.soyPath));
            // Compiled sources are inlined (mostly to rollup shims module)
            sauces.forEach(sauce => {
                resc.registerInlinedResource(`${sauce.name.toUpperCase()}_TEMPLATE_ROLLUP`, sauce.rollupPath);
            });
            resc.registerInlinedResource("SOYUTILS", SoyBuilder.soyUtilsPath);
        }
    }

    constructor(
        private options:BuildOption
    ) { }

}