import ISettingsDao, { AllOptions, AllOptionsCallback } from "../../../storage/ISettingsDao";
import { isUndef } from "../../../shared/instanceof";

export default class UserscriptSettingsDao implements ISettingsDao {
    setSourceOption(domain:string, option:DomainOptionEnum, cb?:func):void {
        GM_setValue(domain, option);
        if (!isUndef(cb)) { cb(); }
        this.fireListeners();
    }
    setIsWhitelistedDestination(domain:string, option:boolean, cb?:func):void {
        let whitelistedDestinationsStringified = GM_getValue('whitelist', '');
        let whitelistedDestinations = whitelistedDestinationsStringified.split(',');
        let index = whitelistedDestinations.indexOf(domain);
        let isWhitelisted = index !== -1

        if (option && !isWhitelisted) {
            whitelistedDestinations.push(domain);
        } else if (!option && isWhitelisted) {
            whitelistedDestinations.splice(index, 1);
        } else {
            cb(null);
            return;
        }
        GM_setValue('whitelist', whitelistedDestinations.join(','));
    
        if (!isUndef(cb)) { cb(); }
        this.fireListeners();
    }
    private getEnumeratedOptions():[string[], string[], string[]] {
        let keys = GM_listValues();
        let whitelisted = [];
        let silenced = [];
        let whitelistedDest;
        for (let i = 0, l = keys.length; i < l; i++) {
            let key = keys[i];
            if (key === 'whitelist') {
                whitelistedDest = GM_getValue('whitelist').split(',');
            } else {
                // key is a domain.
                if (GM_getValue(key) === DomainOptionEnum.WHITELISTED) {
                    whitelisted.push(key);
                } else {
                    silenced.push(key);
                }
            }
        }
        whitelisted = whitelisted || [];
        return [whitelisted, silenced, whitelistedDest];
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
