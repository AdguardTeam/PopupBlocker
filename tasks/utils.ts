import fs from 'fs-extra';
import path from 'path';
import copy from 'copy';
import pJson from '../package.json';
import { env } from './environment';

import { CHANNEL_BASE_URLS } from './constants';

export const getResourceUrl = (relativeUrl: string): string => new URL(relativeUrl, CHANNEL_BASE_URLS[env]).href;

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
