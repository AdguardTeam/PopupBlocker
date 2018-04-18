import UserscriptSettingsDao from '../../../../src/platform/userscript/storage/UserscriptSettingsDao';
import { DomainOptionEnum } from '../../../../src/storage/storage_data_structure';

const expect = chai.expect;

describe('UserscriptSettingsDao', function() {
    beforeEach(function() {
        // Expose mocked GM_api to the global scope
        const GM_storage = Object.create(null);
        
        function GM_getValue(key:string, defaultValue?) {
            if (key in GM_storage) {
                return GM_storage[key];
            }
            return defaultValue;
        }

        function GM_setValue(key:string, value) {
            GM_storage[key] = value;
        }

        function GM_listValues() {
            return Object.keys(GM_storage);
        }

        function GM_deleteValue(key:string) {
            delete GM_storage[key];
        }

        window['GM_getValue'] = GM_getValue;
        window['GM_setValue'] = GM_setValue;
        window['GM_deleteValue'] = GM_deleteValue;
        window['GM_listValues'] = GM_listValues;
    });

    afterEach(function() {
        // Unexpose GM_api
        delete window['GM_getValue'];
        delete window['GM_setValue'];
        delete window['GM_deleteValue'];
        delete window['GM_listValues'];
    });

    it('It should migrate empty data from 1.* version to an empty data', function() {
        UserscriptSettingsDao.migrateDataIfNeeded();

        let keys = GM_listValues();
        expect(keys.length).to.equal(2);
        expect(GM_getValue(UserscriptSettingsDao.DATA_VERSION_KEY)).to.equal(String(UserscriptSettingsDao.CURRENT_VERSION));
        expect(GM_getValue(UserscriptSettingsDao.WHITELIST)).to.equal('');
    });

    it('It should migrate data from 1.* version properly', function () {
        // Save some ver1-style storage values
        GM_setValue('whitelist', 'domain1.com,domain2.com,sub.domain.com,sub.sub.domain.com');

        GM_setValue('domain1.com', JSON.stringify({ 'whitelisted': true, 'use_strict': false }));
        GM_setValue('domain3.com', JSON.stringify({ 'whitelisted': true, 'use_strict': false }));

        UserscriptSettingsDao.migrateDataIfNeeded();

        expect(GM_getValue(UserscriptSettingsDao.DATA_VERSION_KEY)).to.equal(String(UserscriptSettingsDao.CURRENT_VERSION));

        const settingsDao = new UserscriptSettingsDao();

        let expectedToBeWhitelisted = [
            'domain1.com',
            'domain2.com',
            'sub.domain.com',
            'sub.sub.domain.com',
            'domain3.com'
        ];
        
        expectedToBeWhitelisted.forEach((domain) => {
            expect(settingsDao.getIsWhitelisted(domain)).to.equal(true);
            expect(settingsDao.getSourceOption(domain)).to.equal(DomainOptionEnum.NONE);
        });
    });

});
