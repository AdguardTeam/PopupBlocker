import * as fsExtra from 'fs-extra';
import * as fs from 'async-file';
import log = require('fancy-log');
import { posix as path } from 'path';

import { IResourceProvider, ResourceManager } from './ResourceManager';
import { BuildOption, Channel } from '../BuildOption';
import PathUtils from '../PathUtils';


interface MessageObject {
    message:string,
    placeholders?: {
        [key:string]:string
    }
}

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
     * Iterates over languages and translated keys; skips if a translation is not provided.
     */
    public static forEachPhrase(translations:object, keys:string[], callback:(lang:string, key:string, messageObject:MessageObject, fallbacked:boolean)=>void) {
        let langs = Object.keys(translations);
        for (let lang of langs) {
            for (let key of keys) {
                try {
                    if (!(key in translations[lang])) {
                        // A required phrase is missing in a lang translation.
                        // If it is missing in 'en' as well, it is an error.
                        if (!(key in translations['en'])) {
                            throw new Error(`Required phrase ${key} is missing in translations.json`);
                        } else {
                            callback(lang, key, translations['en'][key], true);
                        }
                    } else {
                        callback(lang, key, translations[lang][key], false);
                    }
                } catch (e) {
                    log.error(`Error for lang: ${lang}, key: ${key}`);
                    throw e;
                }
            }
        }
    }

    /**
     * We collapse 'message' property in the json object containing translations,
     * in order to have a shorter representation in the userscript source.
     */
    private async getUserscriptInlinableJSON() {
        const out = {};
        const [json, userscriptKeys] = await Promise.all([LocaleUtils.translation.read(), LocaleUtils.userscriptKeys.read()]);

        LocaleUtils.forEachPhrase(json, userscriptKeys, (locale, key, msgObj, fallbacked) => {
            if (fallbacked) { return; }
            if (!out[locale]) { out[locale] = {}; }
            out[locale][key] = msgObj.message;
        });

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

        LocaleUtils.forEachPhrase(json, extensionKeys, (locale, key, msgObj, fallbacked) => {
            if (fallbacked) {
                // Certain translations are required by extension publishers.
                if (key !== LocaleUtils.EXTENSION_NAME) {
                    return;
                }            
            }
            if (!out[locale]) { out[locale] = {}; }
            let message = msgObj.message;
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
            // Extension translations require 'placeholder' key as well
            if (msgObj.placeholders) {
                out[locale][key].placeholders = msgObj.placeholders;
            }
        });

        return <{[locale:string]:{[messageId:string]:{message:string}}}>out;
    }

    private async getUserscriptSettingsJSON() {
        const out = {};
        const [json, settingsKeys] = await Promise.all([LocaleUtils.translation.read(), LocaleUtils.settingsKeys.read()]);

        LocaleUtils.forEachPhrase(json, settingsKeys, (locale, key, msgObj, fallbacked) => {
            if (fallbacked) { return; }
            if (!out[locale]) { out[locale] = {}; }
            out[locale][key] = msgObj.message;
        });

        return <{[locale:string]:{[messageId:string]:string}}>out;
    }

    private async moveLocalesToTargetDir() {
        const localePath = path.join(this.paths.outputPath, '_locales');
        const [json] = await Promise.all([this.getExtensionJSON(), fsExtra.mkdirp(localePath)]);
        return Promise.all(Object.keys(json).map(async (locale) => {
            let localeNextPath = path.join(localePath, locale);
            await fsExtra.mkdirp(localeNextPath);
            await PathUtils.writeJson(path.join(localeNextPath, 'messages.json'), json[locale]);
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