import typescript2 = require('rollup-plugin-typescript2');
import BundleEntry from './BundleEntry';
import { StringMap } from '../utils/types';

/**
 * BundleContext encodes dependency information.
 * Use `addModule` and `addRollupExternalDeps` methods to provide information.
 * Other public methods and properties provide information extracted from it.
 */
export default class BundleContext {
    private modules:{
        entry:BundleEntry,
        deps:BundleEntry[],
        extraSources:string[]
    }[] = [];
    /**
     * It declares a module having an entry point `entry` and depending on `...deps` modules.
     * `extraSources` parameter directly corresponds to `closure-tools-helper`'s 'extraSources' option.
     */
    addModule(entry:BundleEntry, deps:BundleEntry[] = [], extraSources:string[] = []):this {
        this.modules.push({entry, deps, extraSources});
        return this;
    }
    getCcOptions() {
        return this.modules.map(mod => ({
            id: mod.entry.googModule,
            name: mod.entry.outName,
            deps: mod.deps.map(entry => entry.outName),
            extraSources: mod.extraSources
        }));
    }
    private static tsconfigOverride = {
        compilerOptions: {
            target: "es5"
        }
    };
    private rollupExternalDepsMap:StringMap<string> = Object.create(null);
    /**
     * Tells rollup to resolve "import .. from `${moduleId}`" to
     * a file located in `path`.
     * It is used to resolve closure-compiler-specific `goog:...` modules.
     */
    addRollupExternalDeps(moduleId:string, path:string):this {
        this.rollupExternalDepsMap[moduleId] = path;
        return this;
    }
    private static readonly emptyBundleId = "\0empty_bundle_id";
    /**
     * This rollup plugin does 2 things:
     *  1. Resolves external deps known to the context
     *  2. Generates empty bundles for certain entry points
     * {@link https://github.com/rollup/rollup/wiki/Plugins#creating-plugins}
     */
    private get rollupExternalModuleLinker() {
        return {
            resolveId: (importee, importer) => {
                let depsPath = this.rollupExternalDepsMap[importee];
                if (depsPath) {
                    return require('path').resolve(process.cwd(), depsPath);
                    // Using 'posix' does not work well with rollup internals
                }
                if (importee.startsWith(BundleContext.emptyBundleId)) {
                    return importee;
                }
            },
            load: (id:string) => {
                if (id.startsWith(BundleContext.emptyBundleId)) {
                    return Promise.resolve('');
                }
            }
        }
    }
    getRollupOptions() {
        const input = this.modules
            .map(mod => {
                let path = mod.entry.rollup;
                if (path !== null) {
                    return path;
                } else {
                    return require('path').join(BundleContext.emptyBundleId, mod.entry.outName + '.js');
                }
            });
        return {
            input,
            format: 'iife',
            strict: false,
            plugins: [
                (<any>typescript2)({ tsconfigOverride: BundleContext.tsconfigOverride }),
                this.rollupExternalModuleLinker
            ]
        }
    }
    get bundleNames():string[] {
        return this.modules.map(mod => mod.entry.outName);
    }
    // To be used with gulp-hydra plugin
    get bundleFilter() {
        let filter = {}, bundleNames = this.bundleNames;
        for (let bundleName of bundleNames) {
            filter[bundleName] = (file) => {
                return (new RegExp(bundleName + '\\.[jt]s$')).test(file.path);
            }
        }
        return filter;
    }
}
