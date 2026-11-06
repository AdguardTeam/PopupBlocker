import fs from 'fs';
import path from 'path';
import { extractTinyShieldMetadata } from './tinyShieldMetadata';

/**
 * Path to the TinyShield exclusions JSON file.
 */
export const TINY_SHIELD_EXCLUSIONS_FILE_PATH = path.resolve(__dirname, 'tinyShieldWebsites.json');

/**
 * URL to fetch TinyShield metadata.
 */
export const TINY_SHIELD_META_URL = 'https://raw.githubusercontent.com/List-KR/tinyShield/refs/heads/main/sources/banner.txt';

/**
 * Generates an error message from an error object.
 *
 * @param context The context of the error.
 * @param error The error object.
 * @returns The formatted error message.
 */
const getErrorMessage = (context: string, error: unknown): string => {
    const message = error instanceof Error ? error.message : String(error);
    return `Failed to ${context}: ${message}`;
};

/**
 * Fetches the metadata for TinyShield from the specified URL.
 *
 * @returns A promise that resolves to the metadata text.
 * @throws Error if the fetch operation fails.
 */
async function fetchTinyShieldMetadata() {
    try {
        const response = await fetch(TINY_SHIELD_META_URL);
        return await response.text();
    } catch (error) {
        throw new Error(getErrorMessage('fetch TinyShield metadata', error));
    }
}

/**
 * Fetches the TinyShield metadata and extracts the version and list of website URLs.
 *
 * @returns A promise that resolves to an object containing the version and matched websites.
 * @throws  Error if the extraction of version or website URLs fails.
 */
async function fetchAndExtractTinyShieldMetadata() {
    try {
        const tinyShieldMetadata = await fetchTinyShieldMetadata();
        return extractTinyShieldMetadata(tinyShieldMetadata);
    } catch (error) {
        throw new Error(getErrorMessage('fetch and extract TinyShield metadata', error));
    }
}

/**
 * Writes the list of TinyShield website URLs to the output JSON file.
 *
 * @param matchedWebsites The list of matched websites.
 * @param tinyShieldVersion The version of TinyShield.
 * @throws  Error if writing the TinyShield website URLs fails.
 */
const writeTinyShieldWebsiteURLs = (
    matchedWebsites: string[],
    tinyShieldVersion: string,
) => {
    try {
        const data = {
            version: tinyShieldVersion,
            updatedDate: new Date().toISOString(),
            match: matchedWebsites,
        };
        fs.writeFileSync(TINY_SHIELD_EXCLUSIONS_FILE_PATH, JSON.stringify(data, null, '\t'));
    } catch (error) {
        throw new Error(getErrorMessage('write TinyShield website URLs', error));
    }
};

/**
 * Updates the TinyShield exclusions file with the latest websites and version from TinyShield meta.
 *
 * @returns A promise that resolves when the update is complete.
 * @throws  Error if updating the TinyShield websites fails.
 */
const updateTinyShieldExclusionsFile = async () => {
    try {
        const { version, matchedWebsites } = await fetchAndExtractTinyShieldMetadata();
        writeTinyShieldWebsiteURLs(matchedWebsites, version);
        // eslint-disable-next-line no-console
        console.log('TinyShield websites updated successfully.');
    } catch (error) {
        throw new Error(getErrorMessage('update TinyShield websites', error));
    }
};

if (require.main === module) {
    updateTinyShieldExclusionsFile();
}
