import * as fsExtra from 'fs-extra';
import * as fs from 'async-file';
import { posix as path } from 'path';

import { IResourceProvider, ResourceManager } from './ResourceManager';
import { BuildOption, Channel } from '../BuildOption';
import PathUtils from '../PathUtils';

export default class LocaleUtils implements IResourceProvider {

    private static JSONFile = class JSONFile<T> {
        constructor(private filePath:string) { }
        private cached:T
        public async read() {
            if (!this.cached) {
                this.cached = await fsExtra.readJSON(this.filePath);
            }
            return this.cached;
        }
    }

    public static translation = new LocaleUtils.JSONFile<{[key:string]:{message:string,description?:string}}>(PathUtils.i18nJSONPath);

    private static userscriptKeys = new LocaleUtils.JSONFile<string[]>(PathUtils.i18nUserscriptKeysPath);
    private static extensionKeys = new LocaleUtils.JSONFile<string[]>(PathUtils.i18nExtensionKeysPath);
    private static settingsKeys = new LocaleUtils.JSONFile<string[]>(PathUtils.i18nSettingsKeysPath);

    private static EXTENSION_NAME = "extension_name";

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
     * placeholders, and treats `$$` as a literal dollar sign.
     * In our use case dollar signs can occur as a part of `goog.getMsg` substitution,
     * i.e. in a form `{$...}`. Therefore we find such patterns and replace it to use
     * double dollar signs.
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
                message = message.replace(/\{\$/g, '\{$$$');
                out[locale][key] = {
                    message: message
                };

                if (json[locale][key].placeholders) {
                    out[locale][key].placeholders = json[locale][key].placeholders;
                }
            }
        }
        return <{[locale:string]:{[messageId:string]:{message:string}}}>out;
    }

    private async getUserscriptSettingsJSON() {
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
            await fsExtra.writeJSON(path.join(localeNextPath, 'messages.json'), json[locale]);
        }));
    }

    public async prepareResource(resc:ResourceManager) {
        if (this.options.isExtension) {
            await this.moveLocalesToTargetDir();
        } else if (this.options.isUserscript) {
            resc.registerInlinedResource("USERSCRIPT_TRANSLATIONS", {
                data: JSON.stringify(await this.getUserscriptInlinableJSON()),
                path: 'userscript_translations.json'
            });
        } else if (this.options.isSettingsOnly) {
            resc.registerInlinedResource("USERSCRIPT_TRANSLATIONS", {
                data: JSON.stringify(await this.getUserscriptSettingsJSON()),
                path: 'userscript_settings_translations.json'
            });
        }
    }

    constructor(
        private options:BuildOption,
        private paths:PathUtils
    ) { }

}