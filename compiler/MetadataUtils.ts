import fs = require('async-file');
import * as fsExtra from 'fs-extra';
import mergeOpts = require('merge-options');

import PathUtils from './PathUtils';
import { BuildOption, Channel } from './BuildOption';
import LocaleUtils from './resc/LocaleUtils';


export default class MetadataUtils {

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
        [Channel.BETA]:     'https://cdn.adguard.com/public/Userscripts/Beta/AdguardPopupBlocker/2.5/',
        [Channel.RELEASE]:  'https://cdn.adguard.com/public/Userscripts/AdguardPopupBlocker/2.5/'
    }

    private get downloadUpdateURL() {
        return MetadataUtils.channelDownloadUpdateURLMap[this.options.channel];
    }

    private static resources = [
        './assets/fonts/bold/OpenSans-Bold.woff',
        './assets/fonts/bold/OpenSans-Bold.woff2',
        './assets/fonts/regular/OpenSans-Regular.woff',
        './assets/fonts/regular/OpenSans-Regular.woff2',
        './assets/fonts/semibold/OpenSans-Semibold.woff',
        './assets/fonts/semibold/OpenSans-Semibold.woff2'
    ]

    /**
     * Read version from package.json.
     */
    private static async getVersion() {
        return (await fsExtra.readJSON('package.json'))["version"];
    }

    async getExtensionManifestJSON():Promise<string> {
        const [baseManifest, manifestOverride] = await Promise.all([
            fs.readFile(PathUtils.commonExtensionManifestPath),
            this.paths.manifestPath ?
                fs.readFile(this.paths.manifestPath) :
                Promise.resolve('{}')
        ].map(pr => pr.then(JSON.parse)));

        const manifest = mergeOpts(baseManifest, manifestOverride);

        // Manual tweaks

        // Read version from package.json
        manifest["version"] = await MetadataUtils.getVersion();

        // Apply default exclusions for release channel
        if (this.options.channel === Channel.RELEASE) {
            manifest["content_scripts"][0]["exclude_matches"] = MetadataUtils.exclusions;
        }

        return JSON.stringify(manifest);
    }



    async getUserscriptMetadataBlock() {
        const translation = await LocaleUtils.translation.read();
        const version = await MetadataUtils.getVersion();

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

        insertTranslatableKeys('name', 'userscript_name', this.locales.channelSuffix);
        insertKey('namespace',   'AdGuard');
        insertTranslatableKeys('description', 'extension_description');
        insertKey('version',      version);
        insertKey('license',     `LGPL-3.0; https://github.com/AdguardTeam/PopupBlocker/blob/master/LICENSE`);
        insertKey('downloadURL', `${this.downloadUpdateURL}popupblocker.user.js`);
        insertKey('updateURL',   `${this.downloadUpdateURL}popupblocker.meta.js`);
        insertKey('supportURL',  `https://github.com/AdguardTeam/PopupBlocker/issues`);
        insertKey('homepageURL', `https://github.com/AdguardTeam/PopupBlocker`);
        insertKey('match',       'http://*/*');
        insertKey('match',       'https://*/*');
        insertKey('grant',       'GM_getValue');
        insertKey('grant',       'GM_setValue');
        insertKey('grant',       'GM_listValues');
        insertKey('grant',       'GM_getResourceURL');
        insertKey('grant',       'unsafeWindow');
        insertKey('icon',        './assets/128.png');

        for (let resource of MetadataUtils.resources) {
            // We always set resource name to be identical with its path
            // for interoperability with extensions.
            // This is not optimal and we may change in future.
            insertKey('resource', `${resource} ${resource}`);
        }
        insertKey('run-at',      'document-start');

        if (this.options.channel === Channel.RELEASE) {
            // Apply default whitelists to the release channel only.
            for (let exclusion of MetadataUtils.exclusions) {
                insertKey('exclude', exclusion);
            }
        }

        lines.push(`// ==/UserScript==`);
        lines.push(``);

        return lines.join('\n');
    }

    constructor(
        private options:BuildOption,
        private paths:PathUtils,
        private locales:LocaleUtils
    ) { }

    async getMetadata() {
        return this.options.isExtension ?
            await this.getExtensionManifestJSON() :
            await this.getUserscriptMetadataBlock();
    }

}