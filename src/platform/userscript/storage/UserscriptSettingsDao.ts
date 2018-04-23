import ISettingsDao, { AllOptions, AllOptionsCallback } from "../../../storage/ISettingsDao";
import { isUndef } from "../../../shared/instanceof";
import IUserscriptSettingsDao from "./IUserscriptSettingsDao";
import { DomainOptionEnum } from "../../../storage/storage_data_structure";

export default class UserscriptSettingsDao implements IUserscriptSettingsDao {

    /**
     * The version number of the data scheme that this implemenation uses.
     */
    static readonly CURRENT_VERSION = 2;

    /**
     * A GM_value key, storing a data scheme's version number in a string.
     */
    static readonly DATA_VERSION_KEY = "ver";

    public static migrateDataIfNeeded() {
        const dataVersion = parseFloat(GM_getValue(UserscriptSettingsDao.DATA_VERSION_KEY, '1'));

        if (dataVersion < 2) {
            let whitelist:string[] = [];
            GM_forEach(new Ver1DataMigrator(whitelist));

            GM_setValue(UserscriptSettingsDao.WHITELIST, whitelist.join(','));
            GM_setValue(UserscriptSettingsDao.DATA_VERSION_KEY, String(UserscriptSettingsDao.CURRENT_VERSION));
        }
    }

    setSourceOption(domain:string, option:DomainOptionEnum, cb?:func):void {
        GM_setValue(domain, option);
        if (!isUndef(cb)) { cb(); }
        this.fireListeners();
    }

    getSourceOption(domain:string):DomainOptionEnum {
        return GM_getValue(domain, DomainOptionEnum.NONE);
    }

    /**
     * A GM_value key, storing a comma-separated list of whitelisted domains.
     */
    static readonly WHITELIST = "whitelist";
    private static getWhitelist():string[] {
        let whitelistStringified:string = GM_getValue(UserscriptSettingsDao.WHITELIST)
        if (isUndef(whitelistStringified) || whitelistStringified.length === 0) {
            // Discard zero-length string
            return [];
        }
        return whitelistStringified.split(',');
    }
    setWhitelist(domain:string, whitelisted:boolean|null, cb?:func):void {
        let whitelist = UserscriptSettingsDao.getWhitelist();
        let prevWhitelistInd = whitelist.indexOf(domain);

        if (prevWhitelistInd === -1 && whitelisted !== false) {
            whitelist.push(domain);
        } else if (prevWhitelistInd !== -1 && whitelisted !== true) {
            whitelist.splice(prevWhitelistInd, 1);
        } else {
            if (!isUndef(cb)) { cb(); }
            return;
        }

        GM_setValue(UserscriptSettingsDao.WHITELIST, whitelist.join(','));
        if (!isUndef(cb)) { cb(); }
        this.fireListeners();
    }

    getIsWhitelisted(domain:string):boolean {
        let whitelist = UserscriptSettingsDao.getWhitelist();
        return whitelist.indexOf(domain) !== -1;
    }

    private getEnumeratedOptions():[string[], string[]] {
        let whitelisted = [];
        let silenced = [];

        GM_forEach(new AllOptionsBuilder(whitelisted, silenced));
        return [whitelisted, silenced];
    }

    enumerateOptions(cb:AllOptionsCallback):void {
        cb(this.getEnumeratedOptions());
    }

    private settingsChangeListeners:AllOptionsCallback[] = [];
    private fireListeners() {
        let listeners = this.settingsChangeListeners;
        let options = this.getEnumeratedOptions();
        for (let i = 0, l = listeners.length; i < l; i++) {
            listeners[i](options);
        }
    }
    onSettingsChange(cb:AllOptionsCallback) {
        this.settingsChangeListeners.push(cb);
    }
}

/**************************************************************************************************/

interface GM_Iterator {
    callback:(key:string, value)=>void
}

function GM_forEach(iterator:GM_Iterator) {
    let keys = GM_listValues();
    for (let i = 0, l = keys.length; i < l; i++) {
        let key = keys[i];
        let value = GM_getValue(key);
        iterator.callback(key, value);
    }
}

class Ver1DataMigrator implements GM_Iterator {
    constructor(
        private whitelist:string[]
    ) { }

    private static readonly VER_1_WHITELIST_KEY = 'whitelist'

    callback(key:string, value) {
        if (typeof value === 'string') {
            if (key === Ver1DataMigrator.VER_1_WHITELIST_KEY) {
                Array.prototype.push.apply(this.whitelist, value.split(','));
            } else {
                try {
                    // Domain settings
                    if (JSON.parse(value)['whitelisted'] === true) {
                        if (this.whitelist.indexOf(key) === -1) {
                            this.whitelist.push(key);
                        }
                    }
                } catch (e) { }
            }
        }
        GM_deleteValue(key);
    }
}

class AllOptionsBuilder implements GM_Iterator {
    constructor(
        private whitelisted:string[],
        private silenced:string[]
    ) { }
    callback(key:string, value) {
        if (key === UserscriptSettingsDao.WHITELIST) {
            if (value.length > 0) {
                Array.prototype.push.apply(this.whitelisted, value.split(','));
            }
        } else if (key !== UserscriptSettingsDao.DATA_VERSION_KEY) {
            if ((value & DomainOptionEnum.SILENCED) !== 0) {
                this.silenced.push(key);
            }
        }
    }
}
