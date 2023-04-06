import pJson from '../../package.json';
import { getResourceUrl } from '../utils';
import { exclusions } from '../../exclusions';
import type { HeadersDataContainer } from './metadata';
import {
    RESOURCE_PATHS,
    USERSCRIPT_ICON_RELATIVE_URL,
    Channel,
} from '../constants';

type MetaSettingsInterface = {
    [env: string]: {
        postfix?: string;
        headersData: HeadersDataContainer;
    };
};

const metaSettings: MetaSettingsInterface = {
    common: {
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
                headerValue: getResourceUrl(USERSCRIPT_ICON_RELATIVE_URL),
            },
            USERSCRIPT_RESOURCES: {
                headerName: 'resource',
                headerValue: RESOURCE_PATHS.map((path) => `${path} ${getResourceUrl(path)}`),
            },
            USERSCRIPT_EXCLUSIONS: {
                headerName: 'exclude',
                headerValue: exclusions,
            },
        },
    },
    [Channel.Dev]: {
        postfix: '(Dev)',
        headersData: {
            DOWNLOAD_URL: {
                headerName: 'downloadUrl',
                headerValue: 'https://AdguardTeam.github.io/PopupBlocker/popupblocker.user.js',
            },
            UPDATE_URL: {
                headerName: 'updateUrl',
                headerValue: 'https://AdguardTeam.github.io/PopupBlocker/popupblocker.meta.js',
            },
        },
    },
    [Channel.Beta]: {
        postfix: '(Beta)',
        headersData: {
            DOWNLOAD_URL: {
                headerName: 'downloadUrl',
                headerValue: 'https://userscripts.adtidy.org/beta/popup-blocker/2.5/popupblocker.user.js',
            },
            UPDATE_URL: {
                headerName: 'updateUrl',
                headerValue: 'https://userscripts.adtidy.org/beta/popup-blocker/2.5/popupblocker.meta.js',
            },
        },
    },
    [Channel.Release]: {
        postfix: '',
        headersData: {
            DOWNLOAD_URL: {
                headerName: 'downloadUrl',
                headerValue: 'https://userscripts.adtidy.org/release/popup-blocker/2.5/popupblocker.user.js',
            },
            UPDATE_URL: {
                headerName: 'updateUrl',
                headerValue: 'https://userscripts.adtidy.org/release/popup-blocker/2.5/popupblocker.meta.js',
            },
        },
    },
};

export default metaSettings;
