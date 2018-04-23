import InlineResource = require('inline-resource-literal');
import log = require('fancy-log');

export interface IResourceProvider {
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
export class ResourceManager {
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
        await Promise.all(this.providers.map(provider => {
            return provider.prepareResource(this).then(() => {
                log.info(`Resource preparation for ${provider.constructor.name} has been finished`);
            });
        }));
        log.info('ResourceManager: preparation end');
        this.inline = (new InlineResource(this.resourceMap)).inline;
    }
}
