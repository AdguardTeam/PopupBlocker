const MATCH_META_DIRECTIVE = '// @match';
const VERSION_META_DIRECTIVE = '// @version';

/**
 * Extracts and validates the version and website URLs from TinyShield metadata.
 *
 * @param tinyShieldMetadata The TinyShield metadata text.
 * @returns Version and matched websites extracted from the metadata.
 * @throws Error if the metadata has no version or usable match entries.
 */
export function extractTinyShieldMetadata(tinyShieldMetadata: string) {
    const tinyShieldMetadataLines = tinyShieldMetadata.split('\n');
    let version: string;
    const matchedWebsites: string[] = [];

    tinyShieldMetadataLines.forEach((metadataLine) => {
        if (metadataLine.startsWith(VERSION_META_DIRECTIVE)) {
            version = metadataLine.replace(VERSION_META_DIRECTIVE, '').trim();
        } else if (metadataLine.startsWith(MATCH_META_DIRECTIVE)) {
            matchedWebsites.push(metadataLine.replace(MATCH_META_DIRECTIVE, '').trim());
        }
    });

    if (!version || matchedWebsites.length === 0 || matchedWebsites.some((website) => !website)) {
        throw new Error('TinyShield metadata must include a version and at least one non-empty @match.');
    }

    return {
        version,
        matchedWebsites,
    };
}
