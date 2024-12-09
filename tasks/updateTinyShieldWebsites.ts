import fs from 'fs';
import path from 'path';

/**
 * Path to the TinyShield exclusions JSON file.
 */
export const TINY_SHIELD_EXCLUSIONS_FILE_PATH = path.resolve(__dirname, 'tinyShieldWebsites.json');

/**
 * URL to fetch TinyShield metadata.
 */
export const TINY_SHIELD_META_URL = 'https://raw.githubusercontent.com/List-KR/tinyShield/refs/heads/main/sources/banner.txt';

/**
 * Path to the userscript package.json file.
 */
const USERSCRIPT_PACKAGE_JSON_PATH = path.resolve(__dirname, '../package.json');

/**
 * Directive used to match website URLs in the metadata.
 */
const MATCH_META_DIRECTIVE = '// @match';

/**
 * Fetches the metadata for TinyShield from the specified URL.
 *
 * @param metadataURL - The URL to fetch the TinyShield metadata.
 * @returns A promise that resolves to the metadata text.
 * @throws {Error} If the fetch operation fails.
 */
async function fetchTinyShieldMetadata(metadataURL: string): Promise<string> {
    try {
        const response = await fetch(metadataURL);
        return await response.text();
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to fetch TinyShield metadata: ${message}`);
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
 * @returns A promise that resolves to an array of matched websites.
 * @throws {Error} If the extraction of website URLs fails.
 */
async function extractTinyShieldWebsiteURLs(metadataURL: string): Promise<string[]> {
    try {
        const tinyShieldMetadata = await fetchTinyShieldMetadata(metadataURL);
        return tinyShieldMetadata
            .split('\n')
            .filter((line) => line.startsWith(MATCH_META_DIRECTIVE))
            .map((line) => line.replace(MATCH_META_DIRECTIVE, '').trim());
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to extract TinyShield website URLs: ${message}`);
    }
}

/**
 * Retrieves the version from the userscript package.json file.
 *
 * @param userscriptPackageJsonPath - The path to the userscript package.json file.
 * @returns A promise that resolves to the version string.
 * @throws {Error} If reading the userscript version fails.
 */
const getUserscriptVersion = async (userscriptPackageJsonPath: string): Promise<string> => {
    try {
        const packageJsonData = fs.readFileSync(userscriptPackageJsonPath, 'utf8');
        const parsedPackageJson = JSON.parse(packageJsonData);
        return parsedPackageJson.version;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to read userscript version: ${message}`);
    }
};

/**
 * Writes the list of TinyShield website URLs to the output JSON file.
 *
 * @param outputFilePath - The path to the output JSON file.
 * @param matchedWebsites - The list of matched websites.
 * @throws {Error} If writing the TinyShield website URLs fails.
 */
const writeTinyShieldWebsiteURLs = async (outputFilePath: string, matchedWebsites: string[], userscriptPackageJsonPath) => {
    try {
        const userscriptVersion = await getUserscriptVersion(userscriptPackageJsonPath);
        const data = {
            version: userscriptVersion,
            updatedDate: new Date().toISOString(),
            match: matchedWebsites,
        };
        fs.writeFileSync(outputFilePath, JSON.stringify(data, null, '\t'));
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to write TinyShield website URLs: ${message}`);
    }
};

/**
 * Updates the TinyShield exclusions file with the latest websites from TinyShield meta.
 *
 * @param tinyShieldExclusionsPath - The path to the TinyShield output websites file.
 * @param tinyShieldMetaURL - The URL to fetch the TinyShield metadata.
 * @param userscriptPackageJsonPath - The path to the userscript package.json file.
 * @returns A promise that resolves when the update is complete.
 * @throws {Error} If updating the TinyShield websites fails.
 */
const updateTinyShieldExclusionsFile = async (tinyShieldExclusionsPath: string, tinyShieldMetaURL: string, userscriptPackageJsonPath) => {
    try {
        const websiteURLs = await extractTinyShieldWebsiteURLs(tinyShieldMetaURL);
        await writeTinyShieldWebsiteURLs(tinyShieldExclusionsPath, websiteURLs, userscriptPackageJsonPath);
        // eslint-disable-next-line no-console
        console.log('TinyShield websites updated successfully.');
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to update TinyShield websites: ${message}`);
    }
};

updateTinyShieldExclusionsFile(TINY_SHIELD_EXCLUSIONS_FILE_PATH, TINY_SHIELD_META_URL, USERSCRIPT_PACKAGE_JSON_PATH);
