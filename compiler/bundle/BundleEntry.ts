import { posix as path } from 'path';

import { BuildOption, BuildTarget } from "../BuildOption";
import PathUtils from '../PathUtils';

interface IBundleEntry {
    /**
     * When bundler bundles with this entry, the output file's name will be this.
     */
    outName:string,
    /**
     * path to be fed to rollup.
     */
    rollup:string,
    /**
     * path to be fed to closure compiler.
     */
    cc:string,
    /**
     * module id to identify the module in closure compiler.
     */
    googModule:string
}

/**
 * A bundle entry may not have a prescribed path depending on build target.
 * In such case a corresponding property's value will be `null`.
 */
export default class BundleEntry implements IBundleEntry {
    constructor(
        public outName:string,
        private targetToPathMap: { [key in BuildTarget]?: string },
        private options:BuildOption
    ) { }
    private get path() {
        return this.targetToPathMap[this.options.target];
    }
    public get rollup():string|null {
        if (!this.path) { return null; }
        return path.join(PathUtils.sourceDir, this.path);
    }
    private static reModuleExtension = /\.[jt]sx?$/;
    private static normalizeModuleExtension(path:string) {
        return path.replace(BundleEntry.reModuleExtension, '.js');
    }
    public get cc():string|null {
        if (!this.path) { return null; }
        return BundleEntry.normalizeModuleExtension(path.join(
            PathUtils.outputDir,
            PathUtils.tsccDir,
            this.path
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
    public get googModule():string|null {
        if (!this.path) { return null; }
        return BundleEntry.pathToGoogModule(this.cc);
    }
}
