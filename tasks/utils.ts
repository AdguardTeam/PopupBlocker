import fs from 'fs-extra';
import path from 'path';
import { promisify } from 'util';
import copy from 'copy';
import pJson from '../package.json';
import { Channel, ChannelBaseUrl } from './channels';
import { TMP_PATH } from './paths';
import {
    POPUPBLOCKER_CNAME,
    RESOURCE_VERSION,
    PAGE_SCRIPT_WRAPPER_NAME,
    PageScriptParam,
} from './constants';

export const getHomepageUrl = (
    channel: Channel,
): string => `https://${POPUPBLOCKER_CNAME}/${channel}/${RESOURCE_VERSION}`;

export const getDownloadUrl = (channel: Channel): string => `${ChannelBaseUrl[channel]}popupblocker.user.js`;

export const getUpdateUrl = (channel: Channel): string => `${ChannelBaseUrl[channel]}popupblocker.meta.js`;

export const getResourceUrls = (
    channel: Channel,
    relativePaths: string[],
): string[] => relativePaths.map((relativePath) => {
    const base = ChannelBaseUrl[channel];
    const absolutePath = new URL(relativePath, base).href;
    return `${relativePath} ${absolutePath}`;
});

export const copyFiles = async (buildPath: string, src: string, dest: string) => {
    // output should be flattened (src structure excluded) for non-blob src
    const options = !src.includes('*') ? { flatten: true } : {};
    const destPath = `${buildPath}${dest}`;
    // 'copy' allows to use globs
    await promisify(copy)(src, destPath, options);
};

export const createBuildTxt = async (buildPath: string): Promise<void> => {
    const BUILD_TXT_PATH = path.join(buildPath, 'build.txt');
    const data = `version=${pJson.version}`;
    await fs.ensureDir(buildPath);
    await fs.writeFile(BUILD_TXT_PATH, data, 'utf8');
};

export const makePageScriptBundle = async (rawBundle: string): Promise<void> => {
    /**
     * Wrapper will connect main with userscript's api through the bridge key
     * at build time
     * @param externalContext global context
     * @param externalBridgeKey prop under which to hide script api
     */
    const code = `export function ${PAGE_SCRIPT_WRAPPER_NAME}(
        ${PageScriptParam.Window},
        ${PageScriptParam.BridgeKey},
    ) {
        ${rawBundle}
    }`;

    await fs.ensureDir(TMP_PATH);
    await fs.writeFile('./tmp/page-script-bundle.js', code, 'utf8');
};
