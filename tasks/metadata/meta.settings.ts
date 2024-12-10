import fs from 'fs';
import pJson from '../../package.json';
import { exclusions } from '../../exclusions';
import { TINY_SHIELD_EXCLUSIONS_FILE_PATH } from '../updateTinyShieldWebsites';
import type { HeadersDataContainer } from './metadata';
import { resourceEnv } from '../environment';
import { Channel } from '../channels';
import { RESOURCE_PATHS, USERSCRIPT_ICON_RELATIVE_PATH } from '../constants';
import {
    getResourceUrls,
    getHomepageUrl,
    getDownloadUrl,
    getUpdateUrl,
    getAbsolutePath,
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
 * @returns Array of TinyShield exclusions or empty array if cannot read or parse the file.
 */
const readTinyShieldWebsiteURLs = async (TshieldSitesPath): Promise<string[]> => {
    try {
        const data = fs.readFileSync(TshieldSitesPath, 'utf8');
        const fileData = JSON.parse(data);
        return fileData.match;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error reading TinyShield website URLs from ${TshieldSitesPath}:`, error);
        return [];
    }
};

async function initMetaSettings(): Promise<MetaSettingsInterface> {
    const tinyShieldWebsites = await readTinyShieldWebsiteURLs(TINY_SHIELD_EXCLUSIONS_FILE_PATH);

    return {
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
                headerValue: getAbsolutePath(resourceEnv, USERSCRIPT_ICON_RELATIVE_PATH),
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
}

export { initMetaSettings };
