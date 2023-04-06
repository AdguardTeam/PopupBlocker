import { OptionName } from './Option';

/**
 * Legal storage keys as of v3
 * Moved to a separate file to avoid cyclic deps
 */
export const StorageKey = {
    DataVersion: 'ver',
    InstanceId: '#id',
    AllowedDomains: OptionName.Allowed,
    SilencedDomains: OptionName.Silenced,
} as const;
