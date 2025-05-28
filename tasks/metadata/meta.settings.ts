import fs from 'fs';
import path from 'path';
import pJson from '../../package.json';
import { exclusions } from '../../exclusions';
import { TINY_SHIELD_EXCLUSIONS_FILE_PATH } from '../updateTinyShieldWebsites';
import type { HeadersDataContainer } from './metadata';
import { resourceEnv } from '../environment';
import { Channel } from '../channels';
import { RESOURCE_PATHS } from '../constants';
import {
    getResourceUrls,
    getHomepageUrl,
    getDownloadUrl,
    getUpdateUrl,
} from '../utils';

type MetaSettingsInterface = {
    headersData: HeadersDataContainer;
} & {
    [env in Channel]?: {
        postfix: string;
    };
};

/**
 * Reads the list of TinyShield website URLs from the exclusions JSON file.
 *
 * @param tinyShieldExclusionsPath The path to the TinyShield exclusions JSON file.
 * @returns Array of TinyShield exclusions or empty array if cannot read or parse the file.
 * @throws Error if the file cannot be read or parsed.
 */
const readTinyShieldWebsiteURLs = (tinyShieldExclusionsPath: string): string[] => {
    try {
        const data = fs.readFileSync(tinyShieldExclusionsPath, 'utf8');
        const fileData = JSON.parse(data);
        return fileData.match;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to read list of TinyShield website URLs from ${tinyShieldExclusionsPath}: ${message}`);
    }
};

const tinyShieldWebsites = readTinyShieldWebsiteURLs(TINY_SHIELD_EXCLUSIONS_FILE_PATH);

/**
 * Reads an image file from path and returns a Base64 data‑URL.
 * @param {string} filePath
 * @returns {string} e.g. "data:image/png;base64,..."
 */
const imageToBase64 = (filePath) => {
    const iconPath = path.join(__dirname, filePath);
    const bufferImage = fs.readFileSync(iconPath);
    const imageBase64 = bufferImage.toString('base64');
    const dataUrlImage = `data:image/png;base64,${imageBase64}`;
    return dataUrlImage;
};

const iconBase64 = imageToBase64('../../src/assets/128.png');

const metaSettings: MetaSettingsInterface = {
    headersData: {
        USERSCRIPT_VERSION: {
            headerName: 'version',
            headerValue: pJson.version,
        },
        USERSCRIPT_NAME: {
            headerName: 'name',
            localeKey: 'userscript_name',
        },
        USERSCRIPT_DESCRIPTION: {
            headerName: 'description',
            localeKey: 'extension_description',
        },
        USERSCRIPT_ICON: {
            headerName: 'icon',
            headerValue: iconBase64,
        },
        USERSCRIPT_RESOURCES: {
            headerName: 'resource',
            headerValue: getResourceUrls(resourceEnv, RESOURCE_PATHS),
        },
        USERSCRIPT_EXCLUSIONS: {
            headerName: 'exclude',
            headerValue: [...exclusions, ...tinyShieldWebsites],
        },
        DOWNLOAD_URL: {
            headerName: 'downloadUrl',
            headerValue: getDownloadUrl(resourceEnv),
        },
        UPDATE_URL: {
            headerName: 'updateUrl',
            headerValue: getUpdateUrl(resourceEnv),
        },
        HOMEPAGE_URL: {
            headerName: 'homepageURL',
            headerValue: getHomepageUrl(resourceEnv),
        },
    },
};

export { metaSettings };
