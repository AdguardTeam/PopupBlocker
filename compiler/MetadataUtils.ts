import fs = require('async-file');
import url = require('url');
import * as fsExtra from 'fs-extra';
import mergeOpts = require('merge-options');

import PathUtils from './PathUtils';
import { BuildOption, Channel } from './BuildOption';
import LocaleUtils from './resc/LocaleUtils';

export default class MetadataUtils {

    private static userscript_exclusions = [
        'https://www.linkedin.com/*',
        'https://*.facebook.com/*',
        'https://*.google.com/*',
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
        'https://tinder.com/*',
        '*://*.yahoo.com/*',
        '*://chat.chatovod.ru/*',
        '*://vc.ru/*',
        '*://tjournal.ru/*',
        // https://github.com/AdguardTeam/PopupBlocker/issues/94
        '*://amanice.ru/*',
        // https://github.com/AdguardTeam/PopupBlocker/issues/109
        '*://ka-union.ru/*',
        // https://github.com/AdguardTeam/PopupBlocker/issues/144
        '*://*.ssgdfm.com/*',
        // https://github.com/AdguardTeam/CoreLibs/issues/490
        '*://*.brainpop.com/*',
        // https://github.com/AdguardTeam/PopupBlocker/issues/149
        '*://*.taobao.com/*',
        // https://github.com/AdguardTeam/PopupBlocker/issues/151
        '*://*.ksl.com/*',
        // https://github.com/AdguardTeam/PopupBlocker/issues/152
        '*://*.t-online.de/*',
        // https://github.com/AdguardTeam/PopupBlocker/issues/154
        '*://boards.4channel.org/*',
        // https://github.com/AdguardTeam/PopupBlocker/issues/170
        "*://*.washingtonpost.com/*",
        // https://github.com/AdguardTeam/PopupBlocker/issues/157
        "*://*.kakao.com/*",
        // https://github.com/AdguardTeam/PopupBlocker/issues/165
        "*://*.discounttire.com/*",
        // https://github.com/AdguardTeam/PopupBlocker/issues/169
        "*://mail.ukr.net/*",
        "*://*.mail.ukr.net/*",
        // https://github.com/AdguardTeam/PopupBlocker/issues/166
        "*://*.sahadan.com/*",
        // https://github.com/AdguardTeam/PopupBlocker/issues/186
        "*://*.groupon.*/*",
        // https://github.com/AdguardTeam/PopupBlocker/issues/162
        "*://*.amoma.com/*",
        // https://github.com/AdguardTeam/PopupBlocker/issues/183
        "*://*.jccsmart.com/*",
        // https://github.com/AdguardTeam/PopupBlocker/issues/193
        "https://web.skype.com/*"
    ];

    private static extension_exclusions = {
        "exclude_matches": [
            'https://www.linkedin.com/*',
            'https://*.facebook.com/*',
            // google start
            'https://*.google.com/*',
            'https://*.google.ad/*',
            'https://*.google.ae/*',
            'https://*.google.com.af/*',
            'https://*.google.com.ag/*',
            'https://*.google.com.ai/*',
            'https://*.google.al/*',
            'https://*.google.am/*',
            'https://*.google.co.ao/*',
            'https://*.google.com.ar/*',
            'https://*.google.as/*',
            'https://*.google.at/*',
            'https://*.google.com.au/*',
            'https://*.google.az/*',
            'https://*.google.ba/*',
            'https://*.google.com.bd/*',
            'https://*.google.be/*',
            'https://*.google.bf/*',
            'https://*.google.bg/*',
            'https://*.google.com.bh/*',
            'https://*.google.bi/*',
            'https://*.google.bj/*',
            'https://*.google.com.bn/*',
            'https://*.google.com.bo/*',
            'https://*.google.com.br/*',
            'https://*.google.bs/*',
            'https://*.google.bt/*',
            'https://*.google.co.bw/*',
            'https://*.google.by/*',
            'https://*.google.com.bz/*',
            'https://*.google.ca/*',
            'https://*.google.cd/*',
            'https://*.google.cf/*',
            'https://*.google.cg/*',
            'https://*.google.ch/*',
            'https://*.google.ci/*',
            'https://*.google.co.ck/*',
            'https://*.google.cl/*',
            'https://*.google.cm/*',
            'https://*.google.cn/*',
            'https://*.google.com.co/*',
            'https://*.google.co.cr/*',
            'https://*.google.com.cu/*',
            'https://*.google.cv/*',
            'https://*.google.com.cy/*',
            'https://*.google.cz/*',
            'https://*.google.de/*',
            'https://*.google.dj/*',
            'https://*.google.dk/*',
            'https://*.google.dm/*',
            'https://*.google.com.do/*',
            'https://*.google.dz/*',
            'https://*.google.com.ec/*',
            'https://*.google.ee/*',
            'https://*.google.com.eg/*',
            'https://*.google.es/*',
            'https://*.google.com.et/*',
            'https://*.google.fi/*',
            'https://*.google.com.fj/*',
            'https://*.google.fm/*',
            'https://*.google.fr/*',
            'https://*.google.ga/*',
            'https://*.google.ge/*',
            'https://*.google.gg/*',
            'https://*.google.com.gh/*',
            'https://*.google.com.gi/*',
            'https://*.google.gl/*',
            'https://*.google.gm/*',
            'https://*.google.gp/*',
            'https://*.google.gr/*',
            'https://*.google.com.gt/*',
            'https://*.google.gy/*',
            'https://*.google.com.hk/*',
            'https://*.google.hn/*',
            'https://*.google.hr/*',
            'https://*.google.ht/*',
            'https://*.google.hu/*',
            'https://*.google.co.id/*',
            'https://*.google.ie/*',
            'https://*.google.co.il/*',
            'https://*.google.im/*',
            'https://*.google.co.in/*',
            'https://*.google.iq/*',
            'https://*.google.is/*',
            'https://*.google.it/*',
            'https://*.google.je/*',
            'https://*.google.com.jm/*',
            'https://*.google.jo/*',
            'https://*.google.co.jp/*',
            'https://*.google.co.ke/*',
            'https://*.google.com.kh/*',
            'https://*.google.ki/*',
            'https://*.google.kg/*',
            'https://*.google.co.kr/*',
            'https://*.google.com.kw/*',
            'https://*.google.kz/*',
            'https://*.google.la/*',
            'https://*.google.com.lb/*',
            'https://*.google.li/*',
            'https://*.google.lk/*',
            'https://*.google.co.ls/*',
            'https://*.google.lt/*',
            'https://*.google.lu/*',
            'https://*.google.lv/*',
            'https://*.google.com.ly/*',
            'https://*.google.co.ma/*',
            'https://*.google.md/*',
            'https://*.google.me/*',
            'https://*.google.mg/*',
            'https://*.google.mk/*',
            'https://*.google.ml/*',
            'https://*.google.com.mm/*',
            'https://*.google.mn/*',
            'https://*.google.ms/*',
            'https://*.google.com.mt/*',
            'https://*.google.mu/*',
            'https://*.google.mv/*',
            'https://*.google.mw/*',
            'https://*.google.com.mx/*',
            'https://*.google.com.my/*',
            'https://*.google.co.mz/*',
            'https://*.google.com.na/*',
            'https://*.google.com.nf/*',
            'https://*.google.com.ng/*',
            'https://*.google.com.ni/*',
            'https://*.google.ne/*',
            'https://*.google.nl/*',
            'https://*.google.no/*',
            'https://*.google.com.np/*',
            'https://*.google.nr/*',
            'https://*.google.nu/*',
            'https://*.google.co.nz/*',
            'https://*.google.com.om/*',
            'https://*.google.com.pa/*',
            'https://*.google.com.pe/*',
            'https://*.google.com.pg/*',
            'https://*.google.com.ph/*',
            'https://*.google.com.pk/*',
            'https://*.google.pl/*',
            'https://*.google.pn/*',
            'https://*.google.com.pr/*',
            'https://*.google.ps/*',
            'https://*.google.pt/*',
            'https://*.google.com.py/*',
            'https://*.google.com.qa/*',
            'https://*.google.ro/*',
            'https://*.google.ru/*',
            'https://*.google.rw/*',
            'https://*.google.com.sa/*',
            'https://*.google.com.sb/*',
            'https://*.google.sc/*',
            'https://*.google.se/*',
            'https://*.google.com.sg/*',
            'https://*.google.sh/*',
            'https://*.google.si/*',
            'https://*.google.sk/*',
            'https://*.google.com.sl/*',
            'https://*.google.sn/*',
            'https://*.google.so/*',
            'https://*.google.sm/*',
            'https://*.google.sr/*',
            'https://*.google.st/*',
            'https://*.google.com.sv/*',
            'https://*.google.td/*',
            'https://*.google.tg/*',
            'https://*.google.co.th/*',
            'https://*.google.com.tj/*',
            'https://*.google.tk/*',
            'https://*.google.tl/*',
            'https://*.google.tm/*',
            'https://*.google.tn/*',
            'https://*.google.to/*',
            'https://*.google.com.tr/*',
            'https://*.google.tt/*',
            'https://*.google.com.tw/*',
            'https://*.google.co.tz/*',
            'https://*.google.com.ua/*',
            'https://*.google.co.ug/*',
            'https://*.google.co.uk/*',
            'https://*.google.com.uy/*',
            'https://*.google.co.uz/*',
            'https://*.google.com.vc/*',
            'https://*.google.co.ve/*',
            'https://*.google.vg/*',
            'https://*.google.co.vi/*',
            'https://*.google.com.vn/*',
            'https://*.google.vu/*',
            'https://*.google.ws/*',
            'https://*.google.rs/*',
            'https://*.google.co.za/*',
            'https://*.google.co.zm/*',
            'https://*.google.co.zw/*',
            'https://*.google.cat/*',
            // google end
            // yandex start
            'https://yandex.ru/*',
            'https://*.yandex.ru/*',
            'https://yandex.ua/*',
            'https://*.yandex.ua/*',
            'https://yandex.by/*',
            'https://*.yandex.by/*',
            'https://yandex.com/*',
            'https://*.yandex.com/*',
            'https://yandex.com.tr/*',
            'https://*.yandex.com.tr/*',
            'https://yandex.kz/*',
            'https://*.yandex.kz/*',
            'https://yandex.fr/*',
            'https://*.yandex.fr/*',
            // yandex end
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
            // yandex start
            '*://*.yandex.by/*',
            '*://*.yandex.com/*',
            '*://*.yandex.com.tr/*',
            '*://*.yandex.fr/*',
            '*://*.yandex.kz/*',
            '*://*.yandex.ru/*',
            '*://*.yandex.ua/*',
            // yandex end
            'https://*.twitch.tv/*',
            'https://tinder.com/*',
            '*://*.yahoo.com/*',
            '*://chat.chatovod.ru/*',
            '*://vc.ru/*',
            '*://tjournal.ru/*',
            // https://github.com/AdguardTeam/PopupBlocker/issues/94
            '*://amanice.ru/*',
            // https://github.com/AdguardTeam/PopupBlocker/issues/109
            '*://ka-union.ru/*',
            // https://github.com/AdguardTeam/PopupBlocker/issues/144
            '*://*.ssgdfm.com/*',
            // https://github.com/AdguardTeam/CoreLibs/issues/490
            '*://*.brainpop.com/*',
            // https://github.com/AdguardTeam/PopupBlocker/issues/149
            '*://*.taobao.com/*',
            // https://github.com/AdguardTeam/PopupBlocker/issues/151
            '*://*.ksl.com/*',
            // https://github.com/AdguardTeam/PopupBlocker/issues/152
            '*://*.t-online.de/*',
            // https://github.com/AdguardTeam/PopupBlocker/issues/154
            '*://boards.4channel.org/*',
            // https://github.com/AdguardTeam/PopupBlocker/issues/170
            "*://*.washingtonpost.com/*",
            // https://github.com/AdguardTeam/PopupBlocker/issues/157
            "*://*.kakao.com/*",
            // https://github.com/AdguardTeam/PopupBlocker/issues/165
            "*://*.discounttire.com/*",
            // https://github.com/AdguardTeam/PopupBlocker/issues/169
            "*://mail.ukr.net/*",
            "*://*.mail.ukr.net/*",
            // https://github.com/AdguardTeam/PopupBlocker/issues/166
            "*://*.sahadan.com/*",
            // https://github.com/AdguardTeam/PopupBlocker/issues/186
            "*://*.groupon.*/*",
            // https://github.com/AdguardTeam/PopupBlocker/issues/162
            "*://*.amoma.com/*",
            // https://github.com/AdguardTeam/PopupBlocker/issues/183
            "*://*.jccsmart.com/*",
        ]
    }

    private static channelDownloadUpdateURLMap = {
        [Channel.DEV]: 'https://AdguardTeam.github.io/PopupBlocker/',
        [Channel.BETA]: 'https://userscripts.adtidy.org/beta/popup-blocker/2.5/',
        [Channel.RELEASE]: 'https://userscripts.adtidy.org/release/popup-blocker/2.5/'
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

    private getResourceUrl(relativeUrl: string) {
        if (this.options.useAdGuardDomainForResources) {
            // e.g.
            // https://cdn.adguard.com/public/Userscripts/AdguardPopupBlocker/assets/2.5/fonts/bold/OpenSans-Bold.woff
            return url.resolve(this.downloadUpdateURL, relativeUrl);
        }
        return relativeUrl;
    }

    /**
     * Read version from package.json.
     */
    private static async getVersion() {
        return (await fsExtra.readJSON('package.json'))["version"];
    }

    async getExtensionManifestJSON(): Promise<string> {
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
            Object.assign(manifest["content_scripts"][0], MetadataUtils.extension_exclusions);
        }

        return JSON.stringify(manifest);
    }

    async getUserscriptMetadataBlock() {
        const translation = await LocaleUtils.translation.read();
        const version = await MetadataUtils.getVersion();

        const lines: string[] = [];
        function insertKey(key: string, value: string) {
            lines.push(`// @${key} ${value}`);
        }
        function insertTranslatableKeys(metaKey: string, messageId: string, additional: string = ''): void {
            insertKey(metaKey, translation['en'][messageId].message + additional); // insert 'en' language at the first line.

            LocaleUtils.forEachPhrase(translation, [messageId], (locale, messageId, msgObj, fallbacked) => {
                if (locale === 'en') return;
                insertKey(metaKey + ':' + locale, msgObj.message + additional);
            });
        }

        lines.push('// ==UserScript==');

        insertTranslatableKeys('name', 'userscript_name', this.locales.channelSuffix);
        insertKey('namespace', 'adguard');
        insertTranslatableKeys('description', 'extension_description');
        insertKey('version', version);
        insertKey('license', `LGPL-3.0; https://github.com/AdguardTeam/PopupBlocker/blob/master/LICENSE`);
        insertKey('downloadURL', `${this.downloadUpdateURL}popupblocker.user.js`);
        insertKey('updateURL', `${this.downloadUpdateURL}popupblocker.meta.js`);
        insertKey('supportURL', `https://github.com/AdguardTeam/PopupBlocker/issues`);
        insertKey('homepageURL', `https://popupblocker.adguard.com/`);
        insertKey('match', 'http://*/*');
        insertKey('match', 'https://*/*');
        insertKey('grant', 'GM_getValue');
        insertKey('grant', 'GM_setValue');
        insertKey('grant', 'GM_deleteValue');
        insertKey('grant', 'GM_listValues');
        insertKey('grant', 'GM_getResourceURL');
        insertKey('grant', 'unsafeWindow');
        insertKey('icon', this.getResourceUrl('./assets/128.png'));

        for (let resource of MetadataUtils.resources) {
            // We always set resource name to be identical with its path
            // for interoperability with extensions.
            // This is not optimal and we may change in future.
            insertKey('resource', `${resource} ${this.getResourceUrl(resource)}`);
        }
        insertKey('run-at', 'document-start');

        if (this.options.channel === Channel.RELEASE || this.options.channel === Channel.BETA) {
            // Apply default whitelists to the release channel only.
            for (let exclusion of MetadataUtils.userscript_exclusions) {
                insertKey('exclude', exclusion);
            }
        }

        lines.push(`// ==/UserScript==`);
        lines.push(``);

        return lines.join('\n');
    }

    constructor(
        private options: BuildOption,
        private paths: PathUtils,
        private locales: LocaleUtils
    ) { }

    async getMetadata() {
        return this.options.isExtension ?
            await this.getExtensionManifestJSON() :
            await this.getUserscriptMetadataBlock();
    }

}
