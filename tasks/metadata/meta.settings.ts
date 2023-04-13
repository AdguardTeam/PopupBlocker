import pJson from '../../package.json';
import { exclusions } from '../../exclusions';
import type { HeadersDataContainer } from './metadata';
import { resourceEnv } from '../environment';
import { Channel } from '../channels';
import { RESOURCE_PATHS, USERSCRIPT_ICON_RELATIVE_PATH } from '../constants';
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
            headerValue: getResourceUrls(resourceEnv, [USERSCRIPT_ICON_RELATIVE_PATH]),
        },
        USERSCRIPT_RESOURCES: {
            headerName: 'resource',
            headerValue: getResourceUrls(resourceEnv, RESOURCE_PATHS),
        },
        USERSCRIPT_EXCLUSIONS: {
            headerName: 'exclude',
            headerValue: exclusions,
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

export default metaSettings;
