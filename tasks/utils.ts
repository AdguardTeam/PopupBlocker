import fs from 'fs-extra';
import path from 'path';
import copy from 'copy';
import pJson from '../package.json';
import { POPUPBLOCKER_CNAME } from './constants';
import { Channel, ChannelBaseUrl } from './channels';

export const getHomepageUrl = (channel: Channel): string => `https://${POPUPBLOCKER_CNAME}${channel}`;

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

export const createBuildTxt = async (buildPath: string): Promise<void> => {
    const BUILD_TXT_PATH = path.join(buildPath, 'build.txt');
    const data = `version=${pJson.version}`;
    await fs.ensureDir(buildPath);
    await fs.writeFile(BUILD_TXT_PATH, data, 'utf8');
};

export const copyFiles = (buildPath: string, src: string, dest: string) => {
    // output should be flattened (src structure excluded) for non-blob src
    const options = !src.includes('*') ? { flatten: true } : {};
    const destPath = `${buildPath}${dest}`;
    // 'copy' allows to use globs
    copy(src, destPath, options, () => {});
};
