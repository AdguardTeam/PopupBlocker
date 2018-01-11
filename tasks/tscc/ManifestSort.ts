import { ModulesManifest } from 'tsickle/src/tsickle';

interface Deps {
    sorted:string[]
    num_js:number[]
}

export default class ManifestSort {

    constructor(
        private manifest:ModulesManifest
    ) { }

    getDeps(entries:string[]):Deps {
        const num_js = [];
        this.visited = new Set();
        let prev = 0;
        for (let fileName of entries) {
            this.visit(fileName);
            let size = this.visited.size;
            num_js.push(size - prev);
            prev = size;
        }
        // Modules that are not reachable from entry nodes can still be
        // needed for type annotations. We append such modules at the
        // beginning of the sorted list. Such modules does not cause
        // changes in load order.
        const sorted = [...this.visited];

        const totalFiles = this.manifest.fileNames;

        let counter = 0;
        for (let l = totalFiles.length - 1; l >= 0; l--) {
            let fileName = totalFiles[l];
            if (!sorted["includes"](fileName)) {
                sorted.unshift(fileName);
                counter++;
            }
        }

        num_js[0] += counter; // increment the number of deps of the
                              // very first module by the amount we
                              // unshift'ed.

        this.visited = null;
        return { sorted, num_js };
    }

    private visited:Set<string>; // Short-lived

    private visit(fileName:string, cb?:(filename:string, parent:string)=>void) {
        if (this.visited.has(fileName)) { return; }
        this.visited.add(fileName);
        const referenced = this.manifest.getReferencedModules(fileName);
        if (typeof referenced === 'undefined') { return; }
        for (let ref of referenced) {
            const refFileName = this.manifest.getFileNameFromModule(ref);
            cb && cb.call(this, refFileName, fileName);
            this.visit(refFileName, cb);
        }
    }

}

