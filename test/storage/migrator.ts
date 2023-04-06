import '../mocks/gm-api';
import {
    gmWrapper,
    migrator,
    settingsDao,
    StorageKey,
    OptionName,
} from '../../src/storage';

import {
    migrationStorageV1V2,
    migrationStorageV2V3,
    migrationStorageV1V3,
} from './storageDataSamples';

const { expect } = chai;

const ALLOWED_DOMAINS_STORAGE_KEY_V2 = 'whitelist';

describe('Settings migration', () => {
    afterEach(window.GM_clearStorage);

    it('settigsDao should migrate data from v1 to v3 version properly', () => {
        gmWrapper.setStorage(migrationStorageV1V3.init as GMStorage);
        settingsDao.migrateDataIfNeeded();
        expect(gmWrapper.getValue(StorageKey.DataVersion)).to.equal('3');

        const expectedToBeAllowed = [
            'test.com',
            'example.com',
            'domain.org',
        ];

        expectedToBeAllowed.forEach((domain) => {
            expect(settingsDao.isMemberOf(OptionName.Allowed, domain)).to.equal(true);
            expect(settingsDao.isMemberOf(OptionName.Silenced, domain)).to.equal(false);
        });
    });

    it('should transform data from v1.* to v2', () => {
        const { init, expected } = migrationStorageV1V2;
        gmWrapper.setStorage(init as GMStorage);

        migrator.migrateFromV1toV2();

        const keys = gmWrapper.listValues();
        expect(keys.length).to.equal(3);
        expect(gmWrapper.getValue(StorageKey.DataVersion)).to.equal('2');
        expect(gmWrapper.getValue(StorageKey.InstanceId)).to.equal(expected[StorageKey.InstanceId]);
        expect(gmWrapper.getValue(ALLOWED_DOMAINS_STORAGE_KEY_V2)).to.equal(expected.whitelist);
    });

    it('should transform data from v2 to v3', () => {
        const { init, expected } = migrationStorageV2V3;

        gmWrapper.setStorage(init as GMStorage);

        migrator.migrateFromV2toV3();

        const keys = gmWrapper.listValues();
        expect(keys.length).to.equal(4);
        expect(gmWrapper.getValue(StorageKey.DataVersion)).to.equal('3');
        expect(gmWrapper.getValue(StorageKey.InstanceId)).to.equal(expected[StorageKey.InstanceId]);
        expect(gmWrapper.getValue(StorageKey.AllowedDomains)).to.equal(expected.allowed);
        expect(gmWrapper.getValue(StorageKey.SilencedDomains)).to.equal(expected.silenced);
    });

    it('should transform data from v1 to v3', () => {
        const { init, expected } = migrationStorageV1V3;

        gmWrapper.setStorage(init as GMStorage);

        migrator.migrateDataIfNeeded();
        const keys = gmWrapper.listValues();
        expect(keys.length).to.equal(4);
        expect(gmWrapper.getValue(StorageKey.DataVersion)).to.equal('3');
        expect(gmWrapper.getValue(StorageKey.InstanceId)).to.equal(expected[StorageKey.InstanceId]);
        expect(gmWrapper.getValue(StorageKey.AllowedDomains)).to.equal(expected.allowed);
        expect(gmWrapper.getValue(StorageKey.SilencedDomains)).to.equal('');
    });
});
