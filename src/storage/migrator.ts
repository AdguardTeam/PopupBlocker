import { StorageKey } from './storage-key';
import { OptionItem, OptionList } from './Option';
import { gmWrapper } from './GMWrapper';

const isDomainValueV1 = (
    value: unknown,
): value is DomainValueV1 => typeof value === 'object' && value !== null && 'whitelisted' in value;

interface MigratorInterface {
    migrateDataIfNeeded(): void
    // These are exposed for testing purposes
    migrateFromV1toV2(): void
    migrateFromV2toV3(): void
}

class Migrator implements MigratorInterface {
    private readonly ALLOWED_DOMAINS_STORAGE_KEY_V2 = 'whitelist';

    private readonly OPTION_VALUES_DELIMITER = ',';

    /**
     * Migrate allowed domains to v2 data version
     */
    /**
     * V1:
     * {
     *     "#id": "eOyryuWbTWPoeyiD4zXxmt/JJKSVLOS9",
     *     "ver": "1",
     *     "test.com": {
     *          "whitelisted": true
     *      },
     *      "whitelist": "example.com,domain.org"
     * }
     * =>
     * V2:
     * {
     *     "#id": "eOyryuWbTWPoeyiD4zXxmt/JJKSVLOS9",
     *     "ver": "2",
     *     "whitelist": "test.com,example.com,domain.org",
     * }
     */
    public migrateFromV1toV2() {
        const storageV2 = {} as StorageV2;
        const whitelist: Array<string | string[]> = [];

        gmWrapper.iterateStorage((key: string, value: string | DomainValueV1) => {
            if (value === '') {
                return;
            }

            if (typeof value === 'string') {
                if (key === StorageKey.InstanceId) {
                    // Keep instance id
                    storageV2[key] = value;
                    return;
                }

                if (key === this.ALLOWED_DOMAINS_STORAGE_KEY_V2) {
                    // Collect domains that are already allowed as list
                    whitelist.push(value.split(this.OPTION_VALUES_DELIMITER));
                    return;
                }
            }

            if (isDomainValueV1(value) && whitelist.indexOf(key) === -1) {
                whitelist.push(key);
            }
        });

        storageV2[this.ALLOWED_DOMAINS_STORAGE_KEY_V2] = whitelist.join(this.OPTION_VALUES_DELIMITER);
        storageV2.ver = '2';

        gmWrapper.setStorage(storageV2);
    }

    /**
     * Migrate stored domains to unified 'allowed' and 'silenced' v3 data version
     */
    /**
     * V2:
     * {
     *     "#id": "eOywxeWbTSPleyiD4zXxmt/NRkokUCs3",
     *     "ver": "2",
     *     "whitelist": "example.com,test.com",
     *     "silenced.ru": "1",
     *     "silenced-domain2.org": "1",
     *     "not_silenced.ru": "0"
     * }
     * =>
     * V3:
     * {
     *     "#id": "eOyryuWbTWPoeyiD4zXxmt/JJKSVLOS9",
     *     "ver": "3",
     *     "allowed": "example.com, domain.org",
     *     "silenced": "silenced-domain.org, silenced-domain2.org"
     * }
     */
    public migrateFromV2toV3() {
        const storageV3 = {} as StorageV3;
        const allowed: Array<OptionItem | OptionList> = [];
        const silenced: Array<OptionItem | OptionList> = [];

        gmWrapper.iterateStorage((key: string, value: string | DomainValueV1) => {
            // Version key is to be manually set later
            if (typeof value !== 'string' || key === StorageKey.DataVersion) {
                return;
            }

            if (key === StorageKey.InstanceId) {
                // Keep instance id
                storageV3[key] = value;
                return;
            }

            if (key === this.ALLOWED_DOMAINS_STORAGE_KEY_V2) {
                // Collect domains that are already allowed as list
                allowed.push(value.split(this.OPTION_VALUES_DELIMITER));
                return;
            }

            // At this moment only silenced domains should've left
            // V2 stores them in keys
            if (value === '1') {
                silenced.push(key);
            }
        });

        storageV3[StorageKey.AllowedDomains] = allowed.join(this.OPTION_VALUES_DELIMITER);
        storageV3[StorageKey.SilencedDomains] = silenced.join(this.OPTION_VALUES_DELIMITER);
        storageV3.ver = '3';

        gmWrapper.setStorage(storageV3);
    }

    public migrateDataIfNeeded() {
        let dataVersion = parseFloat(gmWrapper.getValue(StorageKey.DataVersion, '1'));
        // Cover 1.* versions
        if (dataVersion < 2) {
            this.migrateFromV1toV2();
            dataVersion = 2;
        }

        if (dataVersion === 2) {
            this.migrateFromV2toV3();
        }
    }
}

export const migrator = new Migrator();
