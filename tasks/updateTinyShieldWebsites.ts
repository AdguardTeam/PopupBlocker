import fs from 'fs';
import path from 'path';

/**
 * Path to the TinyShield exclusions JSON file.
 */
export const TINY_SHIELD_EXCLUSIONS_FILE_PATH = path.resolve(__dirname, '../tinyShieldWebsites.json');

/**
 * URL to fetch TinyShield metadata.
 */
// eslint-disable-next-line max-len
export const TINY_SHIELD_META_URL = 'https://raw.githubusercontent.com/List-KR/tinyShield/refs/heads/main/sources/banner.txt';

/**
 * Directive used to match website URLs in the metadata.
 */
const MATCH_META_DIRECTIVE = '// @match';

/**
 * Fetches the metadata for TinyShield from the specified URL.
 *
 * @param metadataURL - The URL to fetch the TinyShield metadata.
 * @returns {Promise<string>} A promise that resolves to the metadata text.
 */
async function fetchTinyShieldMetadata(metadataURL: string): Promise<string> {
    try {
        const response = await fetch(metadataURL);
        return await response.text();
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch TinyShield metadata:', error);
        throw error;
    }
}

/**
 * Fetches the TinyShield metadata and extracts the list of website URLs.
 *
 * This function retrieves the TinyShield metadata, parses it, and filters out the lines
 * that specify the websites to be matched. It then returns an array of these website URLs.
 * Those websites are to be added to the popup blocker exclusions during build.
 *
 * @param metadataURL - The URL to fetch the TinyShield metadata.
 * @returns {Promise<string[]>} A promise that resolves to an array of matched websites.
 */
async function extractTinyShieldWebsiteURLs(metadataURL: string): Promise<string[]> {
    try {
        const tinyShieldMetadata = await fetchTinyShieldMetadata(metadataURL);
        return tinyShieldMetadata
            .split('\n')
            .filter((line) => line.startsWith(MATCH_META_DIRECTIVE))
            .map((line) => line.replace(MATCH_META_DIRECTIVE, '').trim());
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to extract TinyShield website URLs:', error);
        throw error;
    }
}

/**
 * Writes the list of TinyShield website URLs to the specified JSON file.
 *
 * @param outputFilePath - The path to the JSON file.
 * @param matchedWebsites - The list of website URLs to write.
 */
const writeTinyShieldWebsiteURLs = (outputFilePath: string, matchedWebsites: string[]) => {
    try {
        const data = {
            updatedDate: new Date().toISOString(),
            match: matchedWebsites,
        };
        fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 2));
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to write TinyShield website URLs:', error);
        throw error;
    }
};

/**
 * Updates the TinyShield exclusions JSON file with the latest list of website URLs.
 */
/**
 * Updates the TinyShield exclusions file with the latest website URLs.
 *
 * @param tinyShieldExclusionsPath - The path to the TinyShield exclusions file.
 * @param tinyShieldMetaURL - The URL to fetch the TinyShield metadata.
 * @returns A promise that resolves when the update is complete.
 */
const updateTinyShieldExclusionsFile = async (tinyShieldExclusionsPath: string, tinyShieldMetaURL: string) => {
    try {
        const websiteURLs = await extractTinyShieldWebsiteURLs(tinyShieldMetaURL);
        writeTinyShieldWebsiteURLs(tinyShieldExclusionsPath, websiteURLs);
        // eslint-disable-next-line no-console
        console.log('TinyShield websites updated successfully.');
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to update TinyShield websites:', error);
    }
};

updateTinyShieldExclusionsFile(TINY_SHIELD_EXCLUSIONS_FILE_PATH, TINY_SHIELD_META_URL);
