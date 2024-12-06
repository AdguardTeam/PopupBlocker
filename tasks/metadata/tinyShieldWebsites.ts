/**
 * TinyShield meta path
 */
const TINY_SHIELD_META_PATH = 'https://raw.githubusercontent.com/List-KR/tinyShield/refs/heads/main/sources/banner.txt';

/**
 * Match meta directive
 */
const MATCH_META_DIRECTIVE = '// @match';

/**
 * Fetches the metadata for TinyShield from the specified path.
 *
 * @returns A promise that resolves to the metadata text.
 */
async function fetchTinyShieldMeta(): Promise<string> {
    const response = await fetch(TINY_SHIELD_META_PATH);
    return response.text();
}

/**
 * Fetches the TinyShield metadata and extracts the list of websites.
 *
 * This function retrieves the TinyShield metadata, parses it, and filters out the lines
 * that specify the websites to be matched. It then returns an array of these websites.
 *
 * @returns {Promise<string[]>} A promise that resolves to an array of website URLs.
 */
async function getTinyShieldWebsites(): Promise<string[]> {
    const tinyShieldMeta = await fetchTinyShieldMeta();
    return tinyShieldMeta
        .split('\n')
        .filter((line) => line.startsWith(MATCH_META_DIRECTIVE))
        .map((line) => line.replace(MATCH_META_DIRECTIVE, '').trim());
}

export { getTinyShieldWebsites };
