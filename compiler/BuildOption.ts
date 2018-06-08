export enum BuildTarget {
    USERSCRIPT          = 'userscript',
    USERSCRIPT_SETTINGS = 'userscript-settings',
    CHROME              = 'chrome',
    FIREFOX             = 'firefox',
    EDGE                = 'edge'
}

export enum Channel {
    DEV         = 'dev',
    BETA        = 'beta',
    RELEASE     = 'release'
}

export interface IPreprocessContext {
    DEBUG?:boolean,
    RECORD?:boolean,
    NO_PROXY?:boolean,
    NO_EVENT?:boolean
}

export class BuildOption {
    constructor(
        public target:BuildTarget,
        public channel:Channel,
        public preprocessContext:IPreprocessContext,
        public overrideShouldMinify?:boolean,
        public useAdGuardDomainForResources?:boolean
    ) { }
    get shouldMinify() {
        if (typeof this.overrideShouldMinify !== 'undefined') {
            return this.overrideShouldMinify;
        }
        // Apply minification for beta and release channel.
        return this.channel !== Channel.DEV;
    }
    get isExtension() {
        let target = this.target;
        return target === BuildTarget.CHROME ||
            target === BuildTarget.FIREFOX ||
            target === BuildTarget.EDGE;
    }
    get isUserscript() {
        return this.target === BuildTarget.USERSCRIPT;
    }

    get isSettingsOnly() {
        return this.target === BuildTarget.USERSCRIPT_SETTINGS;
    }
    clone():BuildOption {
        return new BuildOption(this.target, this.channel, this.preprocessContext, this.overrideShouldMinify);
    }
}
